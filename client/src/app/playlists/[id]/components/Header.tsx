import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Playlist, Track, User } from '@/lib/types'
import { motion } from 'framer-motion'
import { Camera, EyeOff, Loader, Music, Play } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Share from './Share'

export interface HeaderProps {
    playlist: Playlist;
    isUserPlaylist: boolean;
    isTracking: boolean;
    currUser: User
    isTrackedBy: string | null;
    showTrackingDialog: boolean;
    setShowTrackingDialog: React.Dispatch<React.SetStateAction<boolean>>;
    tracks: Track[];
    handleTracker: () => void;
    startIsPending: boolean;
    stopIsPending: boolean;
    playlistId: string,
    snapshotsCount: number,
}
const PlaylistHeader = ({
    playlist,
    isUserPlaylist,
    isTracking,
    currUser,
    isTrackedBy,
    showTrackingDialog,
    setShowTrackingDialog,
    tracks,
    handleTracker,
    startIsPending,
    stopIsPending,
    playlistId,
    snapshotsCount,
}: HeaderProps) => {
    return (
        <motion.div
            className="flex flex-col lg:flex-row gap-8 mb-8 items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex-shrink-0">
                <Image
                    height={600}
                    width={600}
                    src={playlist?.image || "/icon.png"}
                    alt={playlist?.name || 'playlistimg'}
                    className="w-80 h-80 object-cover rounded-lg shadow-2xl"
                />
            </div>
            <div className="flex-1 space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                            {(isUserPlaylist && !playlist?.isFeatured) && "User Playlist"}
                            {!isUserPlaylist && !playlist?.isFeatured && "Playlist"}
                            {playlist?.isFeatured && "Chart"}
                        </Badge>
                        {isTracking && (
                            <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                                <Camera className="h-3 w-3 mr-1" />
                                Tracking
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{playlist?.name}</h1>

                    <p
                        className="text-lg text-slate-300 leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{
                            __html: playlist?.description.replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
                        }}
                    />

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                        <div className="flex items-center">
                            <Music className="h-4 w-4 mr-2" />
                            {tracks?.length} tracks
                        </div>
                        {snapshotsCount > 0 && (
                            <div className="flex items-center">
                                <Camera className="h-4 w-4 mr-2" />
                                {snapshotsCount} snapshots
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Button
                            size="lg"
                            className="bg-purple-600 hover:bg-purple-500 text-white px-8 cursor-pointer"
                            onClick={() => window.open(playlist?.url || `https://open.spotify.com/playlist/${playlist?.id}`, "_blank")}
                        >
                            <Play className="h-5 w-5" />
                            Play on Spotify
                        </Button>

                        {(!isTracking ||
                            (!playlist?.isFeatured && !currUser) ||
                            (currUser && isTrackedBy !== currUser.id && !playlist?.isFeatured)) && (
                                <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="bg-green-600/20 text-green-400 border-green-400/20 cursor-pointer"
                                        >
                                            <Camera className="h-5 w-5" />
                                            Start Tracking
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-slate-800 border-white/10">
                                        <DialogHeader>
                                            <DialogTitle className="text-white">Start Tracking Playlist</DialogTitle>
                                            <DialogDescription className="text-slate-300">
                                                Track changes to this playlist over time. We&apos;ll take weekly snapshots and show you how it
                                                evolves.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <Alert className="border-purple-500/20 bg-purple-500/10">
                                                <Camera className="h-4 w-4 text-purple-400" />
                                                <AlertDescription className="text-purple-300">
                                                    We&apos;ll automatically take snapshots every week and notify you of changes.
                                                </AlertDescription>
                                            </Alert>
                                            <div className="text-sm text-slate-400">
                                                <p>• Weekly snapshots of track changes</p>
                                                {/* <p>• Notifications for major updates</p> */}
                                                <p>• Historical trends and data</p>
                                                <p>• Export tracking data anytime</p>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setShowTrackingDialog(false)} className='cursor-pointer'>
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleTracker}
                                                disabled={startIsPending}
                                                className={`${playlist?.isFeatured && "hover:cursor-not-allowed"} bg-purple-600 hover:bg-purple-500 cursor-pointer`}
                                            >
                                                {startIsPending ? (
                                                    <p className="flex items-center gap-1">
                                                        <Loader className='animate-spin' />
                                                        <span>Starting...</span>
                                                    </p>
                                                ) :
                                                    "Start Tracking"
                                                }
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            )}
                        {(isTracking && (isTrackedBy === currUser?.id || playlist?.isFeatured)) && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={handleTracker}
                                disabled={stopIsPending || !!playlist?.isFeatured}
                                className={`${!playlist?.isFeatured && "hover:bg-red-500/30"} flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer transition-all duration-200 bg-red-500/20 text-red-400 border border-red-500/30`}
                            >
                                {stopIsPending ? (
                                    <p className="flex items-center gap-1">
                                        <Loader className='animate-spin' />
                                        <span>Stopping...</span>
                                    </p>
                                ) : (
                                    <p className="flex items-center gap-1">
                                        <EyeOff className="w-5 h-5" />
                                        <span>Stop Tracking</span>
                                    </p>
                                )}
                            </Button>
                        )}
                        <Share id={playlistId} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default PlaylistHeader