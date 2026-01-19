import React from 'react'
import UserComponent from './components/UserComponent'
import fetchCurrentUser from '@/services/getMe'
import fetchMyPlaylists from '@/services/getMyPlaylists'
import { redirect } from 'next/navigation'
import fetchMySnapshots from '@/services/getMySnapshots'

type Params = Promise<{
    id: string
}>

const page = async ({ params }: { params: Params }) => {
    const { id } = await params;
    const user = id === 'me' && await fetchCurrentUser();
    const playlistData = await fetchMyPlaylists();
    const trackedPlaylists = id === 'me' && await fetchMySnapshots();

    if (id === "me" && !user)
        redirect('/login');

    return (
        <UserComponent user={user} playlistData={playlistData} trackedPlaylists={trackedPlaylists.playlists} />
    )
}

export default page