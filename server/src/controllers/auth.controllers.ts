import { Request, Response } from "express";
import { generateRandomString } from "../lib/utils";
import queryString from "query-string";
import prisma from "../lib/prisma";
import jwt from 'jsonwebtoken';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_AUTH_URI, TOKEN_API, SPOTIFY_CLIENT_SECRET, SPOTIFY_URL, JWT_SECRET, BASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "../lib/config";
import logger from "../lib/logger";

async function login(req: Request, res: Response) {
    let state = generateRandomString(16);
    let scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-follow-read user-read-recently-played';

    const params = queryString.stringify({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID!,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI!,
        state: state
    })
    res.redirect(`${SPOTIFY_AUTH_URI}?${params}`);
};

async function callback(req: Request, res: Response) {
    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        return res.status(500).json({ error: 'state_mismatch' })
    }
    if (!code) {
        return res.status(500).json({ error: 'no_code' })
    }

    try {
        const tokenResponse = await fetch(`${TOKEN_API}`, {
            method: 'POST',
            body: queryString.stringify({
                code: code as string,
                redirect_uri: SPOTIFY_REDIRECT_URI!,
                grant_type: 'authorization_code'
            }),
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')
            }
        })

        const tokenRawText = await tokenResponse.text();
        if (!tokenResponse.ok) {
            logger.error(`Token exchange failed [${tokenResponse.status}]:`, tokenRawText);
            return res.status(400).json({ error: 'token_exchange_failed', details: tokenRawText });
        }
        let tokenData: any;
        try {
            tokenData = JSON.parse(tokenRawText);
        } catch (e) {
            logger.error(`Token response not JSON [${tokenResponse.status}]:`, tokenRawText);
            return res.status(500).json({ error: 'invalid_token_response' });
        }

        const userResponse = await fetch(`${SPOTIFY_URL}/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        })
        if (!userResponse.ok) {
            const userError = await userResponse.text();
            logger.error(`Spotify /me failed [${userResponse.status}]: ${userError}`);
            return res.status(400).json({ error: 'spotify_user_fetch_failed', status: userResponse.status });
        }
        const userData = await userResponse.json();
        const tokenExpiryMs = Math.floor(Date.now() / 1000) + tokenData.expires_in;
        let user = await prisma.user.upsert({
            where: {
                spotifyId: userData.id
            },
            update: {
                spotifyaccessToken: tokenData.access_token,
                spotifyrefreshToken: tokenData.refresh_token,
                tokenExpiry: tokenExpiryMs,
                userImage: userData.images?.[0]?.url ?? null,
            },
            create: {
                spotifyId: userData.id,
                name: userData.display_name,
                email: userData.email,
                userImage: userData.images?.[0]?.url ?? null,
                spotifyaccessToken: tokenData.access_token,
                spotifyrefreshToken: tokenData.refresh_token,
                tokenExpiry: tokenExpiryMs
            }
        })
        const token = jwt.sign({
            id: user?.id,
        },
            JWT_SECRET!,
            { expiresIn: '1d' }
        )
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.redirect(`${BASE_URL}/spotify/callback`);
    } catch (error) {
        logger.error("Error fetching Spotify token:", error);
        return res.status(500).json({ error: "Internal server error while fetching Spotify token" });
    }
};

async function logout(req: Request, res: Response) {
    try {
        res.cookie("token", '', {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'lax'
        })
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: 'Logout error: ' + error })
    }
}

async function googleLogin(req: Request, res: Response) {
    const state = generateRandomString(16);
    const params = queryString.stringify({
        response_type: 'code',
        client_id: GOOGLE_CLIENT_ID!,
        redirect_uri: GOOGLE_REDIRECT_URI!,
        scope: 'email profile',
        state,
        access_type: 'online',
        prompt: 'select_account',
    });
    res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

async function googleCallback(req: Request, res: Response) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    if (state === null) return res.status(500).json({ error: 'state_mismatch' });
    if (!code) return res.status(500).json({ error: 'no_code' });

    try {
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: queryString.stringify({
                code: code as string,
                client_id: GOOGLE_CLIENT_ID!,
                client_secret: GOOGLE_CLIENT_SECRET!,
                redirect_uri: GOOGLE_REDIRECT_URI!,
                grant_type: 'authorization_code',
            }),
        });
        const tokenRawText = await tokenResponse.text();
        if (!tokenResponse.ok) {
            logger.error(`Google token exchange failed [${tokenResponse.status}]:`, tokenRawText);
            return res.status(400).json({ error: 'google_token_exchange_failed', details: tokenRawText });
        }
        let tokenData: any;
        try { tokenData = JSON.parse(tokenRawText); }
        catch (e) { return res.status(500).json({ error: 'invalid_google_token_response' }); }

        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        });
        if (!userInfoRes.ok) {
            const err = await userInfoRes.text();
            logger.error(`Google userinfo failed [${userInfoRes.status}]: ${err}`);
            return res.status(400).json({ error: 'google_userinfo_fetch_failed' });
        }
        const googleUser = await userInfoRes.json();

        let user = await prisma.user.findUnique({ where: { email: googleUser.email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: googleUser.email,
                    name: googleUser.name ?? null,
                    userImage: googleUser.picture ?? null,
                }
            });
        } else if (!user.userImage || !user.name) {
            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    userImage: user.userImage ?? googleUser.picture ?? null,
                    name: user.name ?? googleUser.name ?? null,
                }
            });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET!, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect(`${BASE_URL}/spotify/callback`);
    } catch (error) {
        logger.error("Error during Google OAuth callback:", error);
        return res.status(500).json({ error: "Internal server error during Google OAuth" });
    }
}

export { login, callback, logout, googleLogin, googleCallback }