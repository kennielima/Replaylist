"use client"
import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Play,
    Music,
    History,
    ChevronRight,
} from "lucide-react"
import { Playlist, Snapshot, SnapshotTrack, Track, User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { startTracker, stopTracker } from "@/services/startStopTracker"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSnapshots, getSnapshotById } from "@/services/getSnapshots"
import { Similar, Stats } from "./Sidebar"
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
    const [trackingStartDate, setTrackingStartDate] = useState<string | null>(playlist?.trackingStartDate ?? null);
    const [showTrackingDialog, setShowTrackingDialog] = useState(false);
    const [isChangingSnapshot, setIsChangingSnapshot] = useState(false);

    const effectiveTrackerUser = playlist?.isFeatured
        ? trackerUser
        : isTrackedBy === currUser?.id
            ? currUser
            : trackerUser;
    const canViewSnapshots = Boolean(playlist?.isFeatured || (currUser?.id && isTrackedBy === currUser.id));

    const { data: allSnapshotsData, isLoading: snapshotsLoading } = useQuery({
        queryKey: ['snapshots', playlistId],
        queryFn: () => getSnapshots(playlistId),
        enabled: !!playlistId,
    })

    const mySnapshots: Snapshot[] = playlist?.isFeatured
        ? allSnapshotsData?.data ?? []
        : allSnapshotsData?.data?.filter((s: Snapshot) => s.userId === currUser?.id) ?? [];

    const formattedFirstSnapDate = mySnapshots?.[0]?.createdAt ? formatDate(mySnapshots[0].createdAt) : '';
    const formattedFirstSnapData = mySnapshots?.[0] ?? null;

    const [snapshotDate, setSnapshotDate] = useState<string>(formattedFirstSnapDate);
    const [snapshotData, setSnapshotData] = useState(formattedFirstSnapData);
    const [snapshotTracks, setSnapshotTracks] = useState<SnapshotTrack[]>([]);
    const [searchKeyword, setSearchKeyword] = useState<string>("");

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
    })

    useEffect(() => {
        if (snapshotDetails?.data?.tracks) {
            setSnapshotTracks(snapshotDetails.data.tracks);
            setIsChangingSnapshot(false);
        }
    }, [snapshotDetails]);

    const startTrackerMutation = useMutation({
        mutationFn: (playlistId: string) => startTracker(playlistId),
        onSuccess: (data) => {
            setIsTracking(true);
            setShowTrackingDialog(false);
            setIsTrackedBy(data.isTrackedBy);
            if (data?.updatedPlaylist?.trackingStartDate) {
                setTrackingStartDate(data.updatedPlaylist.trackingStartDate);
            }
            if (data?.snapshot) {
                setSnapshotData(data.snapshot);
                setSnapshotDate(formatDate(data.snapshot.createdAt));
            }
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
        if (playlist?.isFeatured) return;
        if (!currUser) { router.push('/login'); return; }
        const isCurrentUserTracking = isTracking && isTrackedBy === currUser?.id;
        if (!isCurrentUserTracking) {
            startTrackerMutation.mutate(playlistId);
        } else {
            stopTrackerMutation.mutate(playlistId);
        }
    }

    const handleChangeSnapshot = (snapshotId: string) => {
        const selectedSnapshot = mySnapshots.find((s: Snapshot) => s.id === snapshotId);
        if (selectedSnapshot) {
            setIsChangingSnapshot(true);
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
    const showSnapshotTracks = canViewSnapshots && Boolean(snapshotData);

    const currentSnapshotIndex = mySnapshots.findIndex((s: Snapshot) => s.id === snapshotData?.id);
    const previousSnapshot = currentSnapshotIndex >= 0 ? mySnapshots[currentSnapshotIndex + 1] ?? null : null;
    const isOldestSnapshot = previousSnapshot === null && mySnapshots.length > 1;

    const { data: prevSnapshotDetails } = useQuery({
        queryKey: ['snapshot', playlistId, previousSnapshot?.id],
        queryFn: () => getSnapshotById(playlistId, previousSnapshot?.id || ""),
        enabled: !!previousSnapshot,
    });

    const prevRankMap = useMemo(() => {
        const map = new Map<string, number>();
        prevSnapshotDetails?.data?.tracks?.forEach((st: SnapshotTrack) => {
            map.set(st.trackId, st.rank);
        });
        return map;
    }, [prevSnapshotDetails]);

    const changeSummary = useMemo(() => {
        if (!previousSnapshot || prevRankMap.size === 0) return null;
        let newCount = 0, upCount = 0, downCount = 0;
        snapshotTracks.forEach((st) => {
            const prev = prevRankMap.get(st.trackId);
            if (prev === undefined) { newCount++; return; }
            if (prev - st.rank > 0) upCount++;
            else if (prev - st.rank < 0) downCount++;
        });
        return { newCount, upCount, downCount };
    }, [snapshotTracks, prevRankMap, previousSnapshot]);

    const showOverflowHint = mySnapshots.length > 5;
    const snapshotScrollRef = useRef<HTMLDivElement>(null);

    return (
        <Fragment>
            {snapshotsLoading ? (
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
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="grid lg:hidden">
                            <Stats
                                playlistData={playlistData}
                                tracks={tracks}
                                userId={currUser?.id}
                                trackerUser={effectiveTrackerUser}
                                isTracking={isTracking}
                                isTrackedBy={isTrackedBy}
                                trackingStartDate={trackingStartDate}
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-8">
                            {canViewSnapshots && mySnapshots.length > 0 && (
                                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                                    {/* Header row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                        <div className="flex items-center justify-between sm:justify-start gap-2">
                                            <div className="flex items-center gap-2">
                                                <History className="h-4 w-4 text-purple-400 shrink-0" />
                                                <span className="text-sm font-semibold text-white">Snapshot History</span>
                                            </div>
                                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-medium sm:ml-1">{mySnapshots.length} saved</span>
                                        </div>
                                        {changeSummary && (
                                            <div className="flex items-center gap-3 text-xs">
                                                {changeSummary.newCount > 0 && <span className="text-purple-300 font-medium">{changeSummary.newCount} new</span>}
                                                {changeSummary.upCount > 0 && <span className="text-emerald-400 font-medium">↑ {changeSummary.upCount}</span>}
                                                {changeSummary.downCount > 0 && <span className="text-rose-400 font-medium">↓ {changeSummary.downCount}</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <div ref={snapshotScrollRef} className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                                            {mySnapshots.map((snapshot: Snapshot) => (
                                                <button
                                                    key={snapshot.id}
                                                    onClick={() => handleChangeSnapshot(snapshot.id)}
                                                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${snapshotData?.id === snapshot.id
                                                        ? 'bg-purple-400 text-black shadow-lg shadow-purple-500/20'
                                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                                                        }`}
                                                >
                                                    {formatDate(snapshot.createdAt)}
                                                </button>
                                            ))}
                                        </div>
                                        {showOverflowHint && (
                                            <button
                                                onClick={() => snapshotScrollRef.current?.scrollBy({ left: 120, behavior: 'smooth' })}
                                                className="absolute right-0 top-0 bottom-1 w-10 bg-gradient-to-l from-[#070f1e] to-transparent flex items-center justify-end cursor-pointer"
                                            >
                                                <ChevronRight className="h-4 w-4 text-slate-500" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-8">
                                <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                                    <CardTitle className="text-white flex items-center shrink-0">
                                        <Music className="h-5 w-5 mr-2" />
                                        Tracks
                                    </CardTitle>
                                    <SearchByFilter
                                        placeholder="Search track or artist..."
                                        searchKeyword={searchKeyword}
                                        setSearchKeyword={setSearchKeyword}
                                    />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isOldestSnapshot && showSnapshotTracks && (
                                        <p className="text-xs text-slate-500 pb-2 border-b border-white/5">
                                            Earliest snapshot — no prior data to compare.
                                        </p>
                                    )}
                                    {isChangingSnapshot || snapshotIsLoading ? (
                                        <div className="space-y-3">
                                            {[...Array(8)].map((_, i) => (
                                                <div key={i} className="flex items-center space-x-3 p-3 animate-pulse">
                                                    <div className="w-8 h-8 bg-white/10 rounded" />
                                                    <div className="flex-1 space-y-2">
                                                        <div className="h-4 bg-white/10 rounded w-2/5" />
                                                        <div className="h-3 bg-white/10 rounded w-1/4" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            {!showSnapshotTracks &&
                                                filteredSnapTracks?.map((track: Track) => (
                                                    <Link
                                                        key={track.rank}
                                                        href={`https://open.spotify.com/track/${track.trackId}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                                            <div className="flex items-start space-x-3">
                                                                <div className="w-8 h-8 shrink-0 bg-purple-600/20 rounded flex items-center justify-center text-purple-300 text-sm font-medium mt-0.5">
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
                                                            <Play aria-label="Play on Spotify" className="h-5 w-5 shrink-0 hover:scale-120 transition-transform duration-300 text-slate-400 hover:text-white" />
                                                        </div>
                                                    </Link>
                                                ))
                                            }
                                            {showSnapshotTracks &&
                                                filteredSnapshotTracks?.map((track: SnapshotTrack) => {
                                                    const prevRank = prevRankMap.get(track.trackId);
                                                    const isNew = previousSnapshot !== null && prevRank === undefined;
                                                    const rankDiff = prevRank !== undefined ? prevRank - track.rank : null;
                                                    return (
                                                        <Link
                                                            key={track.rank}
                                                            href={`https://open.spotify.com/track/${track.trackId}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors space-x-2">
                                                                <div className="flex items-start space-x-3">
                                                                    <div className="w-8 h-8 shrink-0 bg-purple-600/20 rounded flex items-center justify-center text-purple-300 text-sm font-medium mt-0.5">
                                                                        {track.rank}
                                                                    </div>
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <p className="text-white font-medium">{track?.track?.name}</p>
                                                                            {isNew && (
                                                                                <span className="text-xs px-1.5 py-0.5 font-semibold rounded-full bg-purple-500/20 text-purple-300 tracking-wide">NEW</span>
                                                                            )}
                                                                            {rankDiff !== null && rankDiff > 0 && (
                                                                                <span className="text-xs font-semibold text-emerald-400">↑{rankDiff}</span>
                                                                            )}
                                                                            {rankDiff !== null && rankDiff < 0 && (
                                                                                <span className="text-xs font-semibold text-rose-400">↓{Math.abs(rankDiff)}</span>
                                                                            )}
                                                                        </div>
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
                                                                <Play aria-label="Play on Spotify" className="h-5 w-5 shrink-0 hover:scale-120 transition-transform duration-300 text-slate-400 hover:text-white" />
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="space-y-6">
                            <div className="hidden lg:grid">
                                <Stats
                                    playlistData={playlistData}
                                    tracks={tracks}
                                    userId={currUser?.id}
                                    trackerUser={effectiveTrackerUser}
                                    isTracking={isTracking}
                                    isTrackedBy={isTrackedBy}
                                    trackingStartDate={trackingStartDate}
                                />
                            </div>
                            <Similar
                                playlistsData={playlistsData}
                                playlistData={playlistData}
                            />
                        </div>
                    </div>
                </div>
            )}
        </Fragment>
    )
}
