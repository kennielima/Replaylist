"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Playlist } from '@/lib/types'
import { containerVariants, itemVariants } from '@/lib/utils'
import { motion } from 'framer-motion'
import { AlertTriangle, ChevronLeft, ChevronRight, Music } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const PAGE_SIZE = 12;

type SearchTypeProps = {
    searchData: { data: Playlist[] },
    query: string,
}

const SearchResult = ({ searchData, query }: SearchTypeProps) => {
    const playlists = searchData.data;
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(playlists.length / PAGE_SIZE);
    const paginated = playlists.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const getTrackCount = (playlist: Playlist) => playlist.trackCount ?? playlist.tracks?.total ?? 0;
    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
                <div>
                    <h2 className='text-lg'>
                        Showing <b>{playlists.length}</b> {playlists.length === 1 ? 'result' : 'results'} for &apos;<u>{query}</u>&apos;
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        Can&apos;t find it? Try pasting the Spotify playlist link directly.
                    </p>
                </div>
                <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300 shrink-0">
                    <AlertTriangle className="h-3 w-3" />
                    Spotify-owned playlists not supported
                </span>
            </div>
            {/* Playlists Grid */}
            <motion.div
                className={"grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {paginated.map((playlist: Playlist) => (
                    <motion.div
                        key={playlist.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={`/playlists/${playlist.playlistId || playlist.id}`}>
                            <Card className="group h-full cursor-pointer overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <CardContent className="flex h-full flex-col p-0">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <Image
                                            height={300}
                                            width={300}
                                            src={playlist.images?.[0].url || "/icon.png"}
                                            alt={playlist.name}
                                            className="h-52 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />

                                    </div>
                                    <div className="flex flex-1 flex-col p-5">
                                        <div className="space-y-3">
                                            <h3 className="min-h-14 text-lg font-semibold text-white line-clamp-2">
                                                {playlist.name}
                                            </h3>
                                            <p className="min-h-[4.5rem] text-sm leading-6 text-slate-300 line-clamp-3">
                                                {playlist.description?.replace(/<[^>]+>/g, "") || "No description provided."}
                                            </p>
                                        </div>
                                        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                                            <span className="inline-flex items-center gap-2 text-slate-300">
                                                <Music className="h-4 w-4 text-purple-300" />
                                                Playlist
                                            </span>
                                            <span className="rounded-full bg-white/8 px-3 py-1 text-xs font-semibold text-slate-200 shrink-0">
                                                {getTrackCount(playlist)} tracks
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Prev
                    </Button>
                    <span className="text-sm text-slate-400">
                        Page <b className="text-white">{page}</b> of <b className="text-white">{totalPages}</b>
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:opacity-30"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {playlists.length === 0 && (
                <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Music className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No playlists found for &apos;{query}&apos;
                    </h3>
                    <p className="text-sm text-slate-500">
                        Try a different name, or paste a Spotify playlist link for an exact match.
                    </p>
                </motion.div>
            )}
        </div>
    )
}

export default SearchResult
