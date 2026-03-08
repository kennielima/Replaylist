import { Request, Response } from "express";
import prisma from "../lib/prisma"
import { TokenRequest } from "../middlewares/ensureSpotifyToken";
import { fetchPlaylistById, fetchTracks } from "../services/playlists";
import { featuredPlaylists } from "../lib/seededPlaylists";
import { redis } from "../lib/redis"
import logger from "../lib/logger";
import { updatePlaylistCache } from "../services/cache";
import { saveSnapshot } from "../services/snapshot";
import { getSysAdmin } from "../services/sysAdmin";

async function getFeaturedPlaylists(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const cacheKey = `featured-playlists`;
    const cached = await redis.get(cacheKey);

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }
        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }
        const sysAdmin = await getSysAdmin();

        if (!sysAdmin) {
            res.redirect('/login')
        }

        let systemTrackingQuery = {
            isTracked: true,
            trackingStartDate: new Date(),
            isTrackedBy: sysAdmin?.id,
            userId: sysAdmin?.id,
            isFeatured: true
        }

        let playlists = [];
        for (let seed of featuredPlaylists) {
            const validated = await fetchPlaylistById(seed.id, accessToken);
            if (validated && validated.valid) {
                const data = validated.data;
                const featuredPlaylistRecord = await prisma.playlist.upsert({
                    where: {
                        playlistId: data.id,
                    },
                    update: sysAdmin ? systemTrackingQuery : {},
                    create: {
                        playlistId: data.id,
                        name: data.name,
                        description: data.description,
                        image: data.images?.[0]?.url ?? null,
                        url: data.external_urls.spotify,
                        snapshotId: data.snapshot_id,
                        ...(sysAdmin ? systemTrackingQuery : {})
                    },
                    include: {
                        _count: {
                            select: {
                                Snapshot: true
                            }
                        }
                    }
                })
                const { _count, ...playlistFields } = featuredPlaylistRecord as typeof featuredPlaylistRecord & {
                    _count?: {
                        Snapshot?: number;
                    }
                };
                const featuredPlaylist = {
                    ...playlistFields,
                    snapshotCount: _count?.Snapshot ?? 0,
                    trackCount: data.tracks?.total ?? 0,
                };
                playlists.push(featuredPlaylist);

                //track featured playlists automatically
                if (sysAdmin) {
                    const sevendaysago = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    const initialSnapshotExists = await prisma.snapshot.findFirst({
                        where: {
                            playlistId: data.id,
                            userId: sysAdmin.id,
                            createdAt: {
                                gte: sevendaysago
                            }
                        }
                    })
                    await saveSnapshot(data.id, sysAdmin.id, accessToken, initialSnapshotExists || null)

                    await updatePlaylistCache(data.id, {
                        isTracked: true,
                        isTrackedBy: sysAdmin.id,
                        trackingStartDate: systemTrackingQuery.trackingStartDate,
                        isFeatured: true
                    })
                }
            } else {
                logger.error("Error fetching playlist:", validated);
            }
        }

        await redis.set(cacheKey, JSON.stringify({ data: playlists }), "EX", 86400);

        return res.status(200).json({ data: playlists });

    } catch (error) {
        logger.error("Error fetching featured playlists:", error);
        return res.status(500).json({ error: "Internal server error while fetching featured playlists" });
    }
}

async function getPlaylist(req: TokenRequest, res: Response) {
    const accessToken = req.access_token;
    const id = req.params.id as string;
    const cacheKey = `playlist:${id}`;
    const cached = await redis.get(cacheKey);

    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Spotify access token is not available" });
        }

        if (cached) {
            return res.status(200).json(JSON.parse(cached));
        }

        let playlist;
        const fetchFromDb = await prisma.playlist.findUnique({
            where: {
                playlistId: id,
            }
        })
        if (!fetchFromDb) {
            const fetchFromSpotify = await fetchPlaylistById(id, accessToken);

            if (fetchFromSpotify && fetchFromSpotify.valid) {
                playlist = fetchFromSpotify.data;
            } else {
                return res.status(500).json({ error: "Error fetching playlist from Spotify" });
            }
        } else {
            playlist = fetchFromDb;
        };

        const tracks = await fetchTracks(id, accessToken);

        let trackdata: any[] = [];
        for (let i = 0; i < tracks.items.length; i++) {
            const item = tracks.items[i];
            const track = item?.track;
            if (!track) continue;
            const artists = track?.artists;

            let artistArr: any = [];

            for (let artist of artists) {
                if (!artists) continue;
                artistArr.push(artist.name)
            }

            trackdata.push({
                imageUrl: track.album.images?.[0]?.url ?? null,
                trackId: track.id,
                name: track.name,
                artists: artistArr,
                playlistId: id,
                playlist: playlist.name,
                rank: i + 1,
                album: track.album.name
            })
        }

        const response = { data: playlist, tracks: trackdata };

        await redis.set(cacheKey, JSON.stringify(response), "EX", 86400);
        return res.status(200).json(response);

    } catch (error) {
        logger.error("Error fetching playlist:", error);
        return res.status(500).json({ error: "Internal server error while fetching playlist:" + error });
    }
}

export {
    getFeaturedPlaylists,
    getPlaylist
}
