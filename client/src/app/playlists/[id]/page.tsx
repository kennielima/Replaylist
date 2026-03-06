import fetchAPlaylist from '@/services/getAPlaylist';
import React from 'react'
import PlaylistComponent from './components/PlaylistComponent';
import fetchCurrentUser from '@/services/getMe';
import fetchSpotifyPlaylist from '@/services/getSpotifyPlaylist';
import fetchUserById from '@/services/getUserById';

type Params = Promise<{
    id: string
}>

const page = async ({ params }: { params: Params }) => {
    const { id } = await params;

    const playlistData = await fetchAPlaylist(id);
    const playlistsData = await fetchSpotifyPlaylist();
    const currUser = await fetchCurrentUser();

    if (!playlistData) {
        return <div>No playlist found</div>;
    }

    const isTrackedBy = playlistData?.data?.isTrackedBy;
    const trackerUser = isTrackedBy ? await fetchUserById(isTrackedBy) : null;

    return (
        <PlaylistComponent
            playlistData={playlistData}
            playlistsData={playlistsData}
            currUser={currUser}
            trackerUser={trackerUser?.user ?? null}
        />
    )
}

export default page