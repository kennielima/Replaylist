"use client"
import SearchByQuery from '@/components/SearchByQuery'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Playlist, User } from '@/lib/types'
import { containerVariants, itemVariants } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Music, Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type SearchTypeProps = {
    searchData: { data: Playlist[] },
    query: string,
    user?: User
}

const SearchResult = ({ searchData, query, user }: SearchTypeProps) => {
    const playlists = searchData.data;

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='flex items-center justify-center mb-6'>
                <SearchByQuery category="playlist" user={user} />
            </div>
            <h2 className='my-8 text-lg'>Showing <b>{playlists.length}</b> results for &apos;<u>{query}</u>&apos;</h2>
            {/* Playlists Grid */}
            <motion.div
                className={"grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {playlists.map((playlist: Playlist) => (
                    <motion.div
                        key={playlist.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Link href={`/playlists/${playlist.id}`}>
                            <Card className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <CardContent className="p-0">
                                    <div className="relative overflow-hidden rounded-t-lg">
                                        <Image
                                            height={300}
                                            width={300}
                                            src={playlist.images?.[0].url || "/placeholder.svg"}
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
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-white truncate">
                                                {playlist.name}
                                            </h3>
                                            <span className='text-xs text-slate-400'>{playlist?.tracks?.total} tracks</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                                            {playlist.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>

            {/* Empty State */}
            {playlists.length === 0 && (
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
    )
}

export default SearchResult