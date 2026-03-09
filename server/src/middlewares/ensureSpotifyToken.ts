import { Request, Response, NextFunction } from "express";
import { getRefreshToken, getSpotifyToken } from "../services/SpotifyAuth";
import prisma from "../lib/prisma";
import logger from "../lib/logger";

export interface TokenRequest extends Request {
    access_token?: string;
    refresh_token?: string;
    token_expiresIn?: number;
}

const ensureSpotifyToken = async (req: TokenRequest, res: Response, next: NextFunction) => {
    let now = Math.floor(Date.now() / 1000);

    try {
        const user = req.user;
        let tokenExpiryDate;
        let accessToken;
        let refreshToken;

        if (user?.spotifyrefreshToken) {
            const { spotifyaccessToken, tokenExpiry, spotifyrefreshToken } = user;
            if (!spotifyaccessToken || !tokenExpiry || now >= tokenExpiry) {
                const { access_token, refresh_token, expires_in } = await getRefreshToken(spotifyrefreshToken!);
                accessToken = access_token;
                refreshToken = refresh_token || spotifyrefreshToken;
                tokenExpiryDate = now + expires_in;
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        spotifyaccessToken: access_token,
                        tokenExpiry: tokenExpiryDate,
                        spotifyrefreshToken: refresh_token || spotifyrefreshToken
                    }
                })
            } else {
                accessToken = spotifyaccessToken;
                refreshToken = spotifyrefreshToken;
                tokenExpiryDate = tokenExpiry;
            }
        } else {
            const token = await getSpotifyToken();
            accessToken = token.access_token;
            tokenExpiryDate = now + token.expires_in;
        }

        req.access_token = accessToken;
        req.refresh_token = refreshToken || null;
        req.token_expiresIn = tokenExpiryDate;

        next();

    } catch (error) {
        logger.error("Error fetching Spotify token:", error);
        return res.status(500).json({ error: "Internal server error while fetching Spotify token" });
    }
};


export default ensureSpotifyToken;