import { Request, Response } from "express"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import prisma from "../lib/prisma";
import { redis } from "../lib/redis"
import { SPOTIFY_URL } from "../lib/config";
import logger from "../lib/logger";
import { fetchUserPublicPlaylists } from "../services/playlists";

type PlaylistWithSnapshotCount = Record<string, unknown> & {
    _count?: {
        Snapshot?: number;
    };
    Snapshot?: Array<{
        _count?: {
            tracks?: number;
        };
    }>;
};

function formatTrackedPlaylist(playlist: PlaylistWithSnapshotCount) {
    const { _count, Snapshot, ...rest } = playlist;

    return {
        ...rest,
        snapshotCount: _count?.Snapshot ?? 0,
        trackCount: Snapshot?.[0]?._count?.tracks ?? 0,
    };
}

async function getMe(req: Request, res: Response) {
    const user = req.user;
    try {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        logger.error("Error fetching user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function fetchCurrentUserPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const tokenExpiry = req.token_expiresIn;
    const user = req.user;

    const cacheKey = `userplaylists:${user?.id}`;
    const cached = await redis.get(cacheKey);

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }

        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const response = await fetch(`${SPOTIFY_URL}/me/playlists`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken },
        })
        const playlistData = await response.json();

        let fetchedPlaylists = [];
        for (let playlist of playlistData.items) {
            const newPlaylist = await prisma.playlist.upsert({
                where: {
                    playlistId: playlist.id
                },
                update: {},
                create: {
                    name: playlist.name,
                    description: playlist.description,
                    // tracks: playlist.tracks,
                    image: playlist.images?.[0]?.url ?? null,
                    url: playlist.external_urls.spotify,
                    userId: user ? user.id : null,
                    snapshotId: playlist.snapshot_id,
                    playlistId: playlist.id,
                }
            })
            fetchedPlaylists.push({
                ...newPlaylist,
                trackCount: playlist.tracks?.total ?? 0,
            })
        }
        await redis.set(cacheKey, JSON.stringify({ data: fetchedPlaylists }), "EX", 86400);

        return res.status(200).json({ data: fetchedPlaylists });

    } catch (error) {
        logger.error("Error fetching user playlist:", error);
        return res.status(500).json({ error: "Internal server error while fetching user playlist" });
    }
}
async function fetchUserSnapshots(req: TokenRequest, res: Response) {
    const user = req.user;
    const cacheKey = `usersnapshots:${user?.id}`;
    const cached = await redis.get(cacheKey);

    try {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const playlists = await prisma.playlist.findMany({
            where: {
                isTracked: true,
                isTrackedBy: user.id
            },
            include: {
                _count: {
                    select: {
                        Snapshot: true,
                    }
                },
                Snapshot: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    select: {
                        _count: {
                            select: {
                                tracks: true
                            }
                        }
                    }
                }
            }
        });

        const response = {
            playlists: playlists.map((playlist: PlaylistWithSnapshotCount) => formatTrackedPlaylist(playlist))
        };

        await redis.set(cacheKey, JSON.stringify(response), "EX", 86400);
        return res.status(200).json(response);
    } catch (error) {
        logger.error("Error fetching user snapshot:", error);
        return res.status(500).json({ error: "Internal server error while fetching user snapshots" });
    }
}

async function getUserById(req: TokenRequest, res: Response) {
    const { id } = req.params;
    const cacheKey = `user:${id}`;
    const cached = await redis.get(cacheKey);

    try {
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                userImage: true,
                spotifyId: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const trackedPlaylists = await prisma.playlist.findMany({
            where: { isTracked: true, isTrackedBy: user.id },
            include: {
                _count: {
                    select: {
                        Snapshot: true,
                    }
                },
                Snapshot: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1,
                    select: {
                        _count: {
                            select: {
                                tracks: true
                            }
                        }
                    }
                }
            }
        });

        const publicPlaylists = user.spotifyId
            ? await fetchUserPublicPlaylists(user.spotifyId, req.access_token!).catch(e => {
                logger.error('Failed to fetch public playlists for user:', e);
                return [];
            })
            : [];

        const response = {
            user,
            publicPlaylists,
            trackedPlaylists: trackedPlaylists.map((playlist: PlaylistWithSnapshotCount) => formatTrackedPlaylist(playlist))
        };
        await redis.set(cacheKey, JSON.stringify(response), "EX", 3600);
        return res.status(200).json(response);
    } catch (error) {
        logger.error("Error fetching user by id:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { getMe, fetchCurrentUserPlaylists, fetchUserSnapshots, getUserById }
