"use client"
import { Fragment, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Play,
    Music,
} from "lucide-react"
import { Playlist, Snapshot, SnapshotTrack, Track, User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { startTracker, stopTracker } from "@/services/startStopTracker"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSnapshots, getSnapshotById } from "@/services/getSnapshots"
import Sidebar from "./Sidebar"
import PlaylistHeader from "./Header"
import SearchByFilter from "../../../../components/SearchByFilter"
import Link from "next/link"
import SkeletonComponent from "@/components/SkeletonComponent"


interface PlaylistDetailPageProps {
    playlistData: {
        data: Playlist;
        tracks: Track[]
    }
    playlistsData: Playlist[]
    currUser: User,
    trackerUser: User | null,
}

export default function PlaylistPage({ playlistData, playlistsData, currUser, trackerUser }: PlaylistDetailPageProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const playlist = playlistData?.data;
    const tracks = playlistData?.tracks;

    const isUserPlaylist = playlist?.userId !== null;
    const playlistId = playlist?.playlistId || playlist?.id;

    const [isTracking, setIsTracking] = useState(playlist?.isTracked);
    const [isTrackedBy, setIsTrackedBy] = useState(playlist?.isTrackedBy);
    const [showTrackingDialog, setShowTrackingDialog] = useState(false);

    //fetch snapshots if tracking
    const { data: allSnapshotsData, isLoading: snapshotsLoading } = useQuery({
        queryKey: ['snapshots', playlistId],
        queryFn: () => getSnapshots(playlistId),
        enabled: !!playlistId,
    })

    // set initial snapdata snd date if tracking
    const formattedFirstSnapDate = allSnapshotsData?.data?.[0]?.createdAt ? formatDate(allSnapshotsData.data[0].createdAt) : '';
    const formattedFirstSnapData = allSnapshotsData?.data?.[0] ? allSnapshotsData?.data?.[0] : null;

    const [snapshotDate, setSnapshotDate] = useState<string>(formattedFirstSnapDate);
    const [snapshotData, setSnapshotData] = useState(formattedFirstSnapData);
    const [snapshotTracks, setSnapshotTracks] = useState<SnapshotTrack[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    // render initial snapdata and date if tracking
    useEffect(() => {
        if (formattedFirstSnapDate && snapshotDate === '') {
            setSnapshotDate(formattedFirstSnapDate);
        }
    }, [formattedFirstSnapDate, snapshotDate]);

    useEffect(() => {
        if (formattedFirstSnapData && (snapshotData === undefined || snapshotData === null)) {
            setSnapshotData(formattedFirstSnapData);
        }
    }, [formattedFirstSnapData, snapshotData]);

    const { data: snapshotDetails, isLoading: snapshotIsLoading } = useQuery({
        queryKey: ['snapshot', playlistId, snapshotData?.id],
        queryFn: () => getSnapshotById(playlistId, snapshotData?.id),
        enabled: !!snapshotData,
        refetchOnMount: true,
        // staleTime: 0
    })

    useEffect(() => {
        if (snapshotDetails?.data?.tracks) {
            setSnapshotTracks(snapshotDetails.data.tracks);
        }
    }, [snapshotDetails]);

    const startTrackerMutation = useMutation({
        mutationFn: (playlistId: string) => startTracker(playlistId),
        onSuccess: (data) => {
            setIsTracking(true);
            setShowTrackingDialog(false);

            if (data?.snapshot) {
                setSnapshotData(data.snapshot);
                setSnapshotDate(formatDate(data.snapshot.createdAt));
setIsTrackedBy(data.isTrackedBy);
            }
            // Invalidate queries to refetch snapshots list
            queryClient.invalidateQueries({ queryKey: ['snapshots', playlistId] });
        },
    });

    const stopTrackerMutation = useMutation({
        mutationFn: (playlistId: string) => stopTracker(playlistId),
        onSuccess: () => {
            setIsTracking(false);
            queryClient.invalidateQueries({ queryKey: ['snapshots', playlistId] });
        },
    });

    const handleTracker = () => {
        if (playlist?.isFeatured) {
            return;
        }
        if (!currUser) {
            router.push('/login');
            return;
        }
        if (!isTracking) {
            startTrackerMutation.mutate(playlistId);
        } else {
            stopTrackerMutation.mutate(playlistId);
        }
    }

    const handleChangeSnapshot = (snapshotId: string) => {
        const selectedSnapshot = allSnapshotsData?.data.find((s: Snapshot) => s.id === snapshotId);
        if (selectedSnapshot) {
            setSnapshotDate(formatDate(selectedSnapshot.createdAt));
            setSnapshotData(selectedSnapshot);
            queryClient.invalidateQueries({ queryKey: ['snapshot', playlistId, selectedSnapshot.id] });
        }
    }

    const filteredSnapTracks = tracks?.filter(track =>
        track.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        track.artists.some(artist => artist.toLowerCase().includes(searchKeyword.toLowerCase()))
    );

    const filteredSnapshotTracks = snapshotTracks.filter(st =>
        st.track.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        st.track.artists.some(artist => artist.toLowerCase().includes(searchKeyword.toLowerCase()))
    );

    return (
        <Fragment>
            {snapshotsLoading || snapshotIsLoading ? (
                <SkeletonComponent />
            ) : (
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
                    <PlaylistHeader
                        playlist={playlist}
                        playlistId={playlistId}
                        isUserPlaylist={isUserPlaylist}
                        isTracking={isTracking}
                        currUser={currUser}
                        isTrackedBy={isTrackedBy}
                        showTrackingDialog={showTrackingDialog}
                        setShowTrackingDialog={setShowTrackingDialog}
                        tracks={tracks}
                        handleTracker={handleTracker}
                        startIsPending={startTrackerMutation.isPending}
                        stopIsPending={stopTrackerMutation.isPending}
                        snapshotsCount={allSnapshotsData?.data?.length ?? 0}
                    />

                    {/* Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div className={`flex items-center space-x-5 justify-between w-full ${(!isTracking && !allSnapshotsData) && "flex-row-reverse gap-4"}`}>
                                {((isTracking || snapshotData) && (currUser?.id === isTrackedBy) || playlist?.isFeatured) && (
                                    <Select
                                        value={snapshotData?.id || ""}
                                        onValueChange={(snapshotId) => handleChangeSnapshot(snapshotId)}
                                    >
                                        <SelectTrigger className="w-36 h-12 bg-white/5 border-white/10 text-white">
                                            <SelectValue placeholder={snapshotData ? formatDate(snapshotData.createdAt) : ""} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-slate-800 border-white/10">
                                            {allSnapshotsData?.data?.map((snapshot: Snapshot) => (
                                                <SelectItem
                                                    key={snapshot.id}
                                                    value={snapshot.id}>
                                                    {formatDate(snapshot.createdAt)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <SearchByFilter
                                    placeholder="Search for track or artist..."
                                    searchKeyword={searchKeyword}
                                    setSearchKeyword={setSearchKeyword}
                                />
                            </div>
                            <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-8">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center">
                                        <Music className="h-5 w-5 mr-2" />
                                        Tracks
                                    </CardTitle>

                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {!isTracking &&
                                        (filteredSnapTracks?.map((track: Track) => (
                                            <Link
                                                key={track.rank}
                                                href={`${process.env.NEXT_PUBLIC_SPOTIFY_URL}/track/${track.trackId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-purple-600/20 rounded flex items-center justify-center text-purple-300 text-sm font-medium">
                                                            {track.rank}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{track.name}</p>
                                                            <p className="text-sm text-slate-400">
                                                                {track?.artists?.map((artist: string, index: number) =>
                                                                    <span key={index}>
                                                                        {artist}
                                                                        {(track.artists.length > 1 && index < track.artists.length - 1) && ', '}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Play aria-label="Play on Spotify" className="h-5 w-5 hover:scale-120 transition-transform duration-300 text-slate-400 hover:text-white" />
                                                </div>
                                            </Link>
                                        )))
                                    }
                                    {isTracking &&
                                        (filteredSnapshotTracks?.map((track: SnapshotTrack) => (
                                            <Link
                                                key={track.rank}
                                                href={`${process.env.NEXT_PUBLIC_SPOTIFY_URL}/track/${track.trackId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-purple-600/20 rounded flex items-center justify-center text-purple-300 text-sm font-medium">
                                                            {track.rank}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{track?.track?.name}</p>
                                                            <p className="text-sm text-slate-400">
                                                                {track?.track?.artists?.map((artist: string, index: number) =>
                                                                    <span key={index}>
                                                                        {artist}
                                                                        {(track?.track?.artists.length > 1 && index < track?.track?.artists.length - 1) && ', '}
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Play aria-label="Play on Spotify" className="h-5 w-5 hover:scale-120 transition-transform duration-300 text-slate-400 hover:text-white" />
                                                </div>
                                            </Link>
                                        )))}
                                </CardContent>
                            </Card>
                        </div>

                        <Sidebar
                            playlistsData={playlistsData}
                            playlistData={playlistData}
                            tracks={tracks}
                            allSnapshotsData={allSnapshotsData}
                            userId={currUser?.id}
                            trackerUser={trackerUser}
                        />
                    </div>
                </div>
            )
            }
        </Fragment >
    )
}
