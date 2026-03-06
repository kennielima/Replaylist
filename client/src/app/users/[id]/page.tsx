import React from 'react'
import UserComponent from './components/UserComponent'
import fetchCurrentUser from '@/services/getMe'
import fetchMyPlaylists from '@/services/getMyPlaylists'
import { redirect } from 'next/navigation'
import fetchMySnapshots from '@/services/getMySnapshots'
import fetchUserById from '@/services/getUserById'

type Params = Promise<{
    id: string
}>

const page = async ({ params }: { params: Params }) => {
    const { id } = await params;

    if (id === 'me') {
        const user = await fetchCurrentUser();
        if (!user) redirect('/login');

        const playlistData = await fetchMyPlaylists();
        const snapshots = await fetchMySnapshots();

        return (
            <UserComponent
                user={user}
                playlistData={playlistData}
                trackedPlaylists={snapshots?.playlists}
                isOwner={true}
            />
        )
    }

    const data = await fetchUserById(id);
    if (!data) redirect('/');

    return (
        <UserComponent
            user={data.user}
            playlistData={null}
            trackedPlaylists={data.trackedPlaylists}
            isOwner={false}
        />
    )
}

export default page
