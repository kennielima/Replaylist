import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Playlist, Snapshot, Track, User } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Music, User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface SidebarProps {
    playlistData: {
        data: Playlist;
        tracks: Track[]
    },
    tracks: Track[],
    allSnapshotsData: { data: Snapshot[] },
    userId: string | null,
    trackerUser: User | null,
}
interface SimilarProps {
    playlistData: {
        data: Playlist;
        tracks: Track[]
    },
    playlistsData: Playlist[]
}

export const Stats = ({ playlistData, tracks, allSnapshotsData, userId, trackerUser }: SidebarProps) => {
    const currPlaylist = playlistData.data;
    return (
        <div>
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-6">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Playlist Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Total Tracks</span>
                        <span className="text-white font-medium">{tracks?.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Updated</span>
                        <span className="text-white font-medium">Weekly</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-400">Snapshots</span>
                        <span className="text-white font-medium">{(currPlaylist?.isTrackedBy === userId || currPlaylist?.isFeatured) ? allSnapshotsData?.data?.length : 0}</span>
                    </div>
                    {currPlaylist?.isTracked && (currPlaylist?.isTrackedBy === userId || currPlaylist?.isFeatured) && (
                        <div className="flex justify-between">
                            <span className="text-slate-400">Tracking Start Date</span>
                            <span className="text-white font-medium">{currPlaylist?.trackingStartDate && formatDate(currPlaylist?.trackingStartDate)}</span>
                        </div>
                    )}
                    {trackerUser && playlistData?.data?.isTracked && (
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400">Tracked by</span>
                            <Link href={`/users/${trackerUser.id}`} className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors">
                                <UserIcon className="h-3 w-3" />
                                {trackerUser.email === process.env.NEXT_PUBLIC_SYS_ADMIN_EMAIL ? 'Admin' : trackerUser.name}
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export const Similar = ({ playlistsData, playlistData }: SimilarProps) => {
    const currPlaylist = playlistData.data;

    return (
        <div>
            {/* Similar Playlists */}
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-8">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Featured Playlists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {playlistsData.map((playlist: Playlist, index: number) => (
                        playlist?.playlistId !== currPlaylist?.playlistId && (
                            <Link key={index} href={`/playlists/${playlist?.playlistId}`}>
                                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                        <Music className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{playlist?.name}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
