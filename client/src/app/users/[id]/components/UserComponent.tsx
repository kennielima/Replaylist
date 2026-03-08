"use client"
import SearchByFilter from '@/components/SearchByFilter'
import SkeletonComponent from '@/components/SkeletonComponent'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Playlist, User } from '@/lib/types'
import { containerVariants, getInitials, itemVariants } from '@/lib/utils'
import logout from '@/services/logout'
import { motion } from 'framer-motion'
import { Music, Grid3X3, List, Play, User as User2 } from 'lucide-react'
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
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [currView, setCurrView] = useState<"playlists" | "snapshots">(isOwner ? "playlists" : "snapshots");
    const [searchKeyword, setSearchKeyword] = useState<string>("");

    const playlists = playlistData?.data;
    const filteredPlaylists = playlists?.filter(playlist =>
        playlist?.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const playlistsToShow = currView === "playlists" ? filteredPlaylists : trackedPlaylists;

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
                                        <Link
                                            href={`${process.env.NEXT_PUBLIC_USER_URL}/${user?.spotifyId}`}
                                            className="transition-all text-base text-slate-400 font-semibold hover:text-slate-300 pl-[-4px]"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {user?.name}
                                        </Link>
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
                        {isOwner && (
                            <motion.div
                                variants={itemVariants}
                                onClick={() => setCurrView("playlists")}
                            >
                                <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-2">
                                    <CardContent className="p-4 text-center">
                                        <Music className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                                        <div className="text-2xl font-bold text-white">
                                            {playlists?.length}
                                        </div>
                                        <div className="text-sm text-slate-300">
                                            Playlists
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                        <motion.div
                            variants={itemVariants}
                            onClick={() => setCurrView("snapshots")}
                        >
                            <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer hover:border-2">
                                <CardContent className="p-4 text-center">
                                    <Music className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                                    <div className="text-2xl font-bold text-white">
                                        {trackedPlaylists ? trackedPlaylists.length : 0}
                                    </div>
                                    <div className="text-sm text-slate-300">
                                        Tracked Playlists
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <SearchByFilter
                            placeholder="Search your playlists..."
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
                                    <Card className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                                        <CardContent className="p-0">
                                            {viewMode === "grid" ? (
                                                <div>
                                                    <div className="relative overflow-hidden rounded-t-lg">
                                                        <Image
                                                            height={300}
                                                            width={300}
                                                            src={playlist?.image || "/placeholder.svg"}
                                                            alt={playlist.name}
                                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                            <Button
                                                                size="icon"
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-600 hover:bg-purple-500 text-white shadow-lg"
                                                            >
                                                                <Play className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="p-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h3 className="font-semibold text-white truncate">
                                                                {playlist.name}
                                                            </h3>
                                                        </div>
                                                        <div className=''>
                                                            {currView === "playlists" ? (
                                                                <p className="text-sm text-slate-300 h-10 mb-3 line-clamp-2">
                                                                    {playlist.description || playlist.name}
                                                                </p>
                                                            ) : (
                                                                <p
                                                                    className="text-sm text-slate-300 h-10 mb-4 line-clamp-2"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: (playlist?.description || playlist.name).replace(/<a[^>]*>(.*?)<\/a>/g, '$1')
                                                                    }}
                                                                />
                                                            )}

                                                            <div className="flex items-center space-x-4 text-xs text-slate-400">
                                                                {playlist.userId !== null ? (
                                                                    <span className="flex items-center">
                                                                        <User2 className="h-3 w-3 mr-1" />
                                                                        User Playlist
                                                                    </span>
                                                                ) : (
                                                                    <span className="flex items-center">
                                                                        <Music className="h-3 w-3 mr-1" />
                                                                        Tracked Playlist
                                                                    </span>
                                                                )}
                                                            </div>
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
                                                            {playlist.description}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                                                            {playlist.userId !== null && (
                                                                <div className="flex items-center space-x-4 text-xs text-slate-400">
                                                                    <span className="flex items-center">
                                                                        <User2 className="h-3 w-3 mr-1" />
                                                                        User Playlist
                                                                    </span>
                                                                </div>
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

                    {playlists && playlists.length === 0 && (
                        <motion.div
                            className="text-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Music className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">
                                No playlists found
                            </h3>
                        </motion.div>
                    )}
                </div>
            </div>
            {/* )} */}
        </Fragment>
    )
}

export default UserComponent