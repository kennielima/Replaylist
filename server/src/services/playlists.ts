import { SPOTIFY_URL } from "../lib/config";

async function fetchPlaylistById(id: string, accessToken: string) {
    const responseData = await fetch(`${SPOTIFY_URL}/playlists/${id}`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken },
    });

    if (!responseData.ok) {
        const errorBody = await responseData.text();
        return { valid: false, error: errorBody };
    }

    const fetchedPlaylist = await responseData.json();

    return { valid: true, data: fetchedPlaylist };
}

async function fetchTracks(id: string, accessToken: string) {
    const responseData = await fetch(`${SPOTIFY_URL}/playlists/${id}/tracks?offset=0&locale=*`, {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken },
    });
    if (!responseData.ok) {
        const errorBody = await responseData.text();
        return errorBody;
    }

    const data = await responseData.json();
    return data;
}

async function fetchUserPublicPlaylists(spotifyUserId: string, accessToken: string) {
    const res = await fetch(`${SPOTIFY_URL}/users/${spotifyUserId}/playlists?limit=50`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.items ?? [])
        .filter((p: any) => p !== null)
        .map((p: any) => ({
            playlistId: p.id,
            name: p.name,
            description: p.description ?? '',
            image: p.images?.[0]?.url ?? null,
            url: p.external_urls?.spotify ?? '',
            trackCount: p.tracks?.total ?? 0,
            isTracked: false,
            isTrackedBy: null,
            isFeatured: false,
            userId: null,
        }));
}

export { fetchPlaylistById, fetchTracks, fetchUserPublicPlaylists };