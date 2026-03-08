"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Music,
    Play,
    TrendingUp,
    Star,
    ChevronRight,
    Headphones
} from "lucide-react"
import { Playlist, User } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import SearchByQuery from "./SearchByQuery"
import { containerVariants, itemVariants } from "@/lib/utils"

interface HomepageProps {
    playlistData?: Playlist[]
    user?: User
}

const Homepage = ({ playlistData, user }: HomepageProps) => {
    const [hoveredPlaylist, setHoveredPlaylist] = useState<string | null>(null)

    const playlists = playlistData || [];
    const getSnapshotCount = (playlist: Playlist) => playlist.snapshotCount ?? playlist.snapshots?.length ?? 0;
    const getTrackCount = (playlist: Playlist) => playlist.trackCount ?? playlist.tracks?.total ?? 0;
    const getDescription = (playlist: Playlist) =>
        (playlist.description || playlist.name).replace(/<a[^>]*>(.*?)<\/a>/g, "$1").replace(/<[^>]+>/g, "");

    const heroVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                // ease: "easeOut",
            },
        },
    }

    return (
        <div className="">
            {/* Hero Section */}
            <motion.div className="relative overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={heroVariants}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-purple-600/20 px-6 sm:px-10 lg:px-16" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 py-12 lg:py-20">
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative p-4 bg-white/10 backdrop-blur-md rounded-full">
                                <Headphones className="h-12 w-12 text-green-400/90" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                    <Play className="w-3 h-3 text-white fill-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* <motion.p
                            className="text-sm text-slate-400 uppercase tracking-widest mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                        >
                            A music archive that tracks playlists listening history over time
                        </motion.p> */}

                        <motion.h1
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Playlists change. Your
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                {" "}
                                memories{" "}
                            </span>
                            shouldn&apos;t.
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Track your favourite Spotify playlists, see how they evolve and rediscover the songs you loved, exactly as they were.
                        </motion.p>
                        <SearchByQuery category={'playlist'} user={user} />
                    </div>
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.section
                className="py-16 bg-black/20 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">5+</div>
                            <div className="text-slate-300">Popular Charts</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">10+</div>
                            <div className="text-slate-300">Playlists Tracked</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">5+</div>
                            <div className="text-slate-300">Active Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-slate-300">Live Updates</div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Popular Charts Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center justify-center mb-4">
                            <TrendingUp className="h-8 w-8 text-purple-400 mr-3" />
                            <h2 className="text-3xl md:text-4xl font-bold text-white">Popular Charts</h2>
                        </div>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Explore the most trending playlists and their evolution in time.
                        </p>
                    </motion.div>

                    {!playlistData ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="bg-white/5 backdrop-blur-md border border-white/10">
                                    <CardContent className="p-0">
                                        <Skeleton className="w-full h-64 rounded-t-lg" />
                                        <div className="p-6">
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-full mb-4" />
                                            <Skeleton className="h-4 w-1/2" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {playlists?.map((playlist: Playlist) => (
                                <motion.div
                                    key={playlist.playlistId}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onHoverStart={() => setHoveredPlaylist(playlist.playlistId)}
                                    onHoverEnd={() => setHoveredPlaylist(null)}
                                >
                                    <Link href={`/playlists/${playlist?.playlistId}`}>
                                        <Card className="group h-full cursor-pointer overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-xl transition-all duration-300 hover:bg-white/10 hover:shadow-2xl">
                                            <CardContent className="flex h-full flex-col p-0">
                                                <div className="relative overflow-hidden">
                                                    <Image
                                                        height={300}
                                                        width={300}
                                                        src={playlist.image}
                                                        alt={playlist.name}
                                                        className="h-64 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{
                                                                scale: hoveredPlaylist === playlist.playlistId ? 1 : 0,
                                                                opacity: hoveredPlaylist === playlist.playlistId ? 1 : 0,
                                                            }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <Button
                                                                size="icon"
                                                                className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg h-14 w-14"
                                                            >
                                                                <Play className="h-6 w-6" />
                                                            </Button>
                                                        </motion.div>
                                                    </div>
                                                    <div className="absolute top-4 right-4">
                                                        <Badge className="bg-black/50 text-white border-0">
                                                            <Star className="h-3 w-3 mr-1" />
                                                            Popular
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="flex flex-1 flex-col p-6">
                                                    <div className="space-y-3">
                                                        <h3 className="min-h-14 text-lg font-bold text-white transition-colors line-clamp-2 group-hover:text-purple-300">
                                                            {playlist.name}
                                                        </h3>
                                                        <p className="min-h-[4.5rem] text-sm leading-6 text-slate-300 line-clamp-3">
                                                            {getDescription(playlist)}
                                                        </p>
                                                    </div>
                                                    <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-200">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1">
                                                            <Music className="h-3.5 w-3.5 text-purple-300" />
                                                            {getTrackCount(playlist)} tracks
                                                        </span>
                                                        <span className="rounded-full bg-white/8 px-3 py-1">
                                                            {getSnapshotCount(playlist)} snapshots
                                                        </span>
                                                        <span className="ml-auto text-slate-400">Featured chart</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                    {playlists && playlists.length > 6 && (
                        <motion.div
                            className="text-center mt-12"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                            >
                                View All Charts
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                className="py-20 bg-gradient-to-r from-purple-600/20 to-purple-600/20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-white mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Ready to Start Tracking Your Music?
                    </motion.h2>
                    <motion.p
                        className="text-xl text-slate-300 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        Join other music lovers tracking their favorite playlists and discovering new trends
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Link href={!user ? '/login' : '/users/me'}>
                            <Button size="lg" className="cursor-pointer bg-purple-600 hover:bg-purple-500 text-white px-8 py-3">
                                <Music className="mr-2 h-5 w-5" />
                                Start Tracking Now
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    )
}

export default Homepage
