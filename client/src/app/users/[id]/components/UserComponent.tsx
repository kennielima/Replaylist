"use client"
import SearchByFilter from '@/components/SearchByFilter'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Playlist, User } from '@/lib/types'
import { containerVariants, getInitials, itemVariants } from '@/lib/utils'
import logout from '@/services/logout'
import { motion } from 'framer-motion'
import { Compass, Grid3X3, List, Music, Play, Search, User as User2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'

type UserTypeProps = {
    user: User
    playlistData: { data: Playlist[] } | null,
    trackedPlaylists: Playlist[],
    isOwner?: boolean,
}
const UserComponent = ({ user, playlistData, trackedPlaylists, isOwner = false }: UserTypeProps) => {
    const hasSpotifyProfile = Boolean(user?.spotifyId);
    const canShowPersonalPlaylists = isOwner && hasSpotifyProfile;
    const hasPublicPlaylists = Boolean(playlistData?.data?.length);
    const showPlaylistsTab = canShowPersonalPlaylists || hasPublicPlaylists;
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [currView, setCurrView] = useState<"playlists" | "snapshots">(showPlaylistsTab ? "playlists" : "snapshots");
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const playlists = playlistData?.data;
    const filteredPlaylists = playlists?.filter(playlist =>
        playlist?.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );
    const filteredTrackedPlaylists = trackedPlaylists?.filter(playlist =>
        playlist?.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const playlistsToShow = currView === "playlists" ? filteredPlaylists : filteredTrackedPlaylists;
    const totalItemsInView = currView === "playlists" ? (playlists?.length ?? 0) : (trackedPlaylists?.length ?? 0);
    const hasSearchKeyword = searchKeyword.trim().length > 0;
    const hasResults = (playlistsToShow?.length ?? 0) > 0;
    const showEmptyState = !hasResults;
    const getDescription = (playlist: Playlist) =>
        (playlist?.description || playlist.name).replace(/<a[^>]*>(.*?)<\/a>/g, "$1").replace(/<[^>]+>/g, "");
    const getTrackCount = (playlist: Playlist) => playlist.trackCount ?? playlist.tracks?.total ?? 0;
    const getSnapshotCount = (playlist: Playlist) => playlist.snapshotCount ?? playlist.snapshots?.length ?? 0;
    const statsCards = [
        ...(showPlaylistsTab ? [{
            key: "playlists",
            label: "Playlists",
            count: playlists?.length ?? 0,
            icon: <Music className="h-6 w-6 text-purple-300" />,


            active: currView === "playlists",
            onClick: () => setCurrView("playlists" as const),
        }] : []),
        {
            key: "tracked-playlists",
            label: "Tracked Playlists",
            count: trackedPlaylists?.length ?? 0,
            icon: <Play className="h-6 w-6 text-purple-300" />,
            active: currView === "snapshots",
            onClick: () => setCurrView("snapshots"),
        }
    ];

    return (
        <Fragment>
            {/* {isOwner && !playlists ? (
                <SkeletonComponent />
            ) : ( */}
            <div className="">
                {/* Header */}
                <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12 bg-purple-500">
                                    <AvatarImage src={user?.userImage || "/placeholder.svg"} alt={user?.name} />
                                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col justify-center'>
                                    <h1 className="text-xl font-bold text-white">
                                        {user?.name}
                                    </h1>
                                    <div className='flex items-center space-x-1 mt-1'>
                                        <span className='text-slate-200'>Link to </span>
                                        <Image
                                            height={300}
                                            width={300}
                                            src={"/iconn.svg"}
                                            alt={'icon'}
                                            className="w-6 h-6 rounded-lg object-cover mx-0"
                                        />
                                        <span className='text-slate-200 pl-[-4px]'>: @</span>
                                        {hasSpotifyProfile ? (
                                            <Link
                                                href={`${process.env.NEXT_PUBLIC_USER_URL}/${user?.spotifyId}`}
                                                className="transition-all text-base text-slate-400 font-semibold hover:text-slate-300 pl-[-4px]"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {user?.name}
                                            </Link>
                                        ) : (
                                            <span className="pl-[-4px] text-base font-semibold text-slate-500">
                                                N/A
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {isOwner && (
                                <Button
                                    size="lg"
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 cursor-pointer"
                                    onClick={logout}
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Stats Cards */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {statsCards.map((card) => (
                            <motion.div
                                key={card.key}
                                variants={itemVariants}
                                onClick={card.onClick}
                            >
                                <Card className={`h-full cursor-pointer border shadow-xl transition-all duration-200 hover:scale-[1.02] ${card.active
                                    ? "border-purple-400/60 bg-white/10"
                                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                                    }`}>
                                    <CardContent className="flex min-h-[160px] flex-col items-center justify-between p-5 text-center">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 ring-1 ring-purple-400/20">
                                            {card.icon}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-3xl font-bold text-white tabular-nums">
                                                {card.count}
                                            </div>
                                            <div className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                                {card.label}
                                            </div>
                                        </div>
                                        {/* <div className={`text-xs ${card.active ? "text-purple-200" : "text-slate-400"}`}>
                                            {card.active ? "Current view" : "Open view"}
                                        </div> */}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <SearchByFilter
                            placeholder={currView === "playlists" ? "Search your playlists..." : "Search tracked playlists..."}
                            searchKeyword={searchKeyword}
                            setSearchKeyword={setSearchKeyword}
                        />
                        {/* Search and Controls */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    aria-label="Grid view"
                                    className={`cursor-pointer ${viewMode === "grid" ? "bg-white/90 text-black" : "bg-black/90 border-black text-white"}`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    aria-label="List view"
                                    className={`cursor-pointer ${viewMode === "grid" ? "bg-black/90 border-black text-white" : "bg-white/90 text-black"}`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                    <p className='text-xl font-semibold mt-10 mb-4'>
                        {currView === "playlists"
                            ? "Your Personal Playlists"
                            : isOwner ? "Your Tracked Playlists" : `${user?.name}'s Tracked Playlists`}
                    </p>
                    {/* Playlists Grid */}
                    <motion.div
                        className={`grid gap-6 ${viewMode === "grid"
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1"
                            }`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {playlistsToShow?.map((playlist: Playlist, index: number) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Link href={`/playlists/${playlist?.playlistId}`}>
                                    <Card className="group h-full cursor-pointer overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                                        <CardContent className="p-0">
                                            {viewMode === "grid" ? (
                                                <div className="flex h-full flex-col">
                                                    <div className="relative overflow-hidden rounded-t-lg">
                                                        <Image
                                                            height={300}
                                                            width={300}
                                                            src={playlist?.image || "/placeholder.svg"}
                                                            alt={playlist.name}
                                                            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                            <Button
                                                                size="icon"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-600 hover:bg-purple-500 text-white shadow-lg h-11 w-11"
                                                            >
                                                                <Play className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-1 flex-col p-5">
                                                        <div className="space-y-3">
                                                            <h3 className="min-h-14 text-lg font-semibold text-white line-clamp-2">
                                                                {playlist.name}
                                                            </h3>
                                                            <p className="min-h-[4.5rem] text-sm leading-6 text-slate-300 line-clamp-3">
                                                                {getDescription(playlist)}
                                                            </p>
                                                        </div>
                                                        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-200">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1">
                                                                {playlist.userId !== null ? (
                                                                    <>
                                                                        <User2 className="h-3.5 w-3.5 text-purple-300" />
                                                                        User Playlist
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Music className="h-3.5 w-3.5 text-purple-300" />
                                                                        Tracked Playlist
                                                                    </>
                                                                )}
                                                            </span>
                                                            {getTrackCount(playlist) > 0 && (
                                                                <span className="rounded-full bg-white/8 px-3 py-1">
                                                                    {getTrackCount(playlist)} tracks
                                                                </span>
                                                            )}
                                                            {currView === "snapshots" && (
                                                                <span className="rounded-full bg-white/8 px-3 py-1">
                                                                    {getSnapshotCount(playlist)} snapshots
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center p-4 space-x-4">
                                                    <div className="relative">
                                                        <Image
                                                            height={300}
                                                            width={300}
                                                            src={playlist.image || "/placeholder.svg"}
                                                            alt={playlist.name}
                                                            className="w-16 h-16 rounded-lg object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-white truncate">
                                                            {playlist.name}
                                                        </h3>
                                                        <p className="text-sm text-slate-300 truncate">
                                                            {getDescription(playlist)}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1">
                                                                {playlist.userId !== null ? (
                                                                    <>
                                                                        <User2 className="h-3 w-3 text-purple-300" />
                                                                        User Playlist
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Music className="h-3 w-3 text-purple-300" />
                                                                        Tracked Playlist
                                                                    </>
                                                                )}
                                                            </span>
                                                            {getTrackCount(playlist) > 0 && (
                                                                <span className="rounded-full bg-white/8 px-2.5 py-1">
                                                                    {getTrackCount(playlist)} tracks
                                                                </span>
                                                            )}
                                                            {currView === "snapshots" && (
                                                                <span className="rounded-full bg-white/8 px-2.5 py-1">
                                                                    {getSnapshotCount(playlist)} snapshots
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View playlist">
                                                            <Play className="h-4 w-4 group-hover:scale-110 transition-transform duration-300 hover:text-white" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Link>

                            </motion.div>
                        ))}
                    </motion.div>

                    {showEmptyState && (
                        <motion.div
                            className="py-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Card className="overflow-hidden border-white/10 bg-white/5 shadow-xl">
                                <CardContent className="px-6 py-10 sm:px-10">
                                    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
                                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500/15 ring-1 ring-purple-400/20">
                                            {hasSearchKeyword || totalItemsInView > 0 ? (
                                                <Search className="h-8 w-8 text-purple-300" />
                                            ) : currView === "snapshots" ? (
                                                <Play className="h-8 w-8 text-purple-300" />
                                            ) : (
                                                <Music className="h-8 w-8 text-purple-300" />
                                            )}
                                        </div>

                                        <h3 className="mb-2 text-2xl font-semibold text-white">
                                            {hasSearchKeyword || totalItemsInView > 0
                                                ? `No ${currView === "playlists" ? "playlists" : "tracked playlists"} match "${searchKeyword}"`
                                                : currView === "snapshots"
                                                    ? isOwner
                                                        ? "You are not tracking any playlists yet"
                                                        : `${user?.name} is not tracking any playlists yet`
                                                    : "No personal playlists available"}
                                        </h3>

                                        <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                                            {hasSearchKeyword || totalItemsInView > 0
                                                ? "Try a different search term or clear the filter to see the full list again."
                                                : currView === "snapshots"
                                                    ? isOwner
                                                        ? "Open any playlist and start tracking it to save weekly snapshots and watch changes over time."
                                                        : "Tracked playlists will show up here once they start saving snapshots."
                                                    : "Your Spotify playlists will appear here after they are available in your account."}
                                        </p>

                                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                            {hasSearchKeyword ? (
                                                <Button
                                                    type="button"
                                                    onClick={() => setSearchKeyword("")}
                                                    className="cursor-pointer bg-white text-black hover:bg-slate-200"
                                                >
                                                    Clear search
                                                </Button>
                                            ) : currView === "snapshots" && isOwner ? (
                                                <>
                                                    <Link href="/">
                                                        <Button className="cursor-pointer bg-purple-600 text-white hover:bg-purple-500">
                                                            <Compass className="h-4 w-4" />
                                                            Explore playlists
                                                        </Button>
                                                    </Link>
                                                    {canShowPersonalPlaylists && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="cursor-pointer border-white/15 bg-white/5 text-white hover:bg-white/10"
                                                            onClick={() => setCurrView("playlists")}
                                                        >
                                                            <Music className="h-4 w-4" />
                                                            View my playlists
                                                        </Button>
                                                    )}
                                                </>
                                            ) : (
                                                <Link href="/">
                                                    <Button className="cursor-pointer bg-purple-600 text-white hover:bg-purple-500">
                                                        <Compass className="h-4 w-4" />
                                                        Browse charts
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
            {/* )} */}
        </Fragment>
    )
}

export default UserComponent
