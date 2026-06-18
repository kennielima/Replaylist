"use client"

import { motion } from "framer-motion"
import { Headphones, Play, Camera, TrendingUp, AlertCircle, Search, BarChart2 } from "lucide-react"
import { containerVariants, itemVariants } from "@/lib/utils"
import Link from "next/link"

const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8 },
    },
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#111009]">
            {/* Hero */}
            <motion.div
                className="relative overflow-hidden"
                initial="hidden"
                animate="visible"
                variants={heroVariants}
            >
                <div className="absolute inset-0 border-b border-white/5" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 pt-6 lg:pt-12 pb-16 lg:pb-24">
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative p-4 bg-purple-600/20 rounded-2xl border border-purple-400/30">
                                <Headphones className="h-10 w-10 text-purple-300" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Nostalgia Section */}
                        <motion.section
                            className="border-white/5"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                                {/* <motion.p
                                    className="text-xs uppercase tracking-widest text-purple-400 mb-5"
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    viewport={{ once: true }}
                                >
                                    Why Replaylist?
                                </motion.p> */}
                                <motion.h2
                                    className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    Wonder what you were listening to{" "}
                                    <span className="text-purple-300">the summer of 2020?</span>
                                </motion.h2>
                                <motion.p
                                    className="text-base md:text-lg text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    That song stuck on the tip of your tongue, the one that defined a whole season.
                                    Playlists get reshuffled, updated, deleted. The moment passes and it&apos;s gone.
                                </motion.p>
                                <motion.p
                                    className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    Replaylist saves your playlists exactly as they were, your personal music archive,
                                    so you never have to wonder again.
                                </motion.p>
                                <motion.div
                                    className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    viewport={{ once: true }}
                                >
                                    {[
                                        { emoji: "📸", title: "Snapshot in time", body: "We capture your playlist exactly as it is today, every track, every ranking." },
                                        { emoji: "🔁", title: "Watch it evolve", body: "See what got added, dropped, or climbed the ranks over weeks and months." },
                                        { emoji: "🧠", title: "Never forget again", body: "Your music memory, stored. Go back to any moment and rediscover what you loved." },
                                    ].map(({ emoji, title, body }) => (
                                        <div key={title} className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                                            <div className="text-2xl mb-3">{emoji}</div>
                                            <h3 className="text-white font-semibold mb-2">{title}</h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.section>
                        {/* <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            About{" "}
                            <span className="text-purple-300">Replaylist</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto ">
                            Ever wonder what you were listening to 5 years ago? Replaylist takes snapshots of your Spotify playlists over time, so you can always look back and remember the songs that defined a moment.
                        </p> */}
                    </div>
                </div>
            </motion.div>

            {/* How it works */}
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 py-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white text-center mb-12">
                    How it works
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            step: "1",
                            icon: <Headphones className="h-6 w-6 text-purple-300" />,
                            title: "Connect Spotify or Google",
                            description: "Log in with your Spotify or Google account to get started. Replaylist uses the Spotify API to access your playlists.",
                        },
                        {
                            step: "2",
                            icon: <Search className="h-6 w-6 text-purple-300" />,
                            title: "Find a playlist",
                            description: "Search for any public Spotify playlist by URL or name. Select it to start tracking.",
                        },
                        {
                            step: "3",
                            icon: <Camera className="h-6 w-6 text-purple-300" />,
                            title: "Track & view snapshots",
                            description: "Replaylist takes periodic snapshots of the playlist. Compare them over time to see playlist changes and track rankings shift.",
                        },
                    ].map(({ step, icon, title, description }) => (
                        <motion.div
                            key={step}
                            variants={itemVariants}
                            className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-400/30 flex items-center justify-center text-purple-300 font-bold text-sm">
                                    {step}
                                </div>
                                <div className="p-2 bg-purple-600/20 rounded-lg border border-purple-400/30">
                                    {icon}
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">{description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* What you can see */}
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 pb-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
                >
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="h-6 w-6 text-purple-300" />
                            What you can see
                        </h2>
                        <ul className="space-y-3 text-slate-300 text-sm">
                            {[
                                "New additions and removed songs",
                                "A full history of every snapshot",
                                "Track rank changes between snapshots",
                                "How long a track has been in the playlist",
                            ].map((item) => (
                                <li key={item} className="flex items-start gap-2">
                                    <BarChart2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-40 h-40 rounded-full bg-purple-600/10 border border-purple-400/20 flex items-center justify-center">
                            <TrendingUp className="h-20 w-20 text-purple-300/40" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Limitations */}
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 pb-20"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-amber-500/5 border border-amber-400/20 rounded-xl p-6"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-lg font-semibold text-amber-300 mb-2">Limitations</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-2">
                                <strong className="text-white">• Spotify-owned and curated playlists</strong> (such as <em>Today's Top Hits</em>, <em>RapCaviar</em>, and other editorial playlists) cannot be searched or tracked. Due to the Spotify API restrictions, those playlists are inaccessible to third-party applications.
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed mb-5">
                                Only public playlists created by regular Spotify users or your own account can be tracked.
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed mb-2">
                                <strong className="text-white">• Spotify login access is limited. {' '}</strong>
                                If you&apos;d like to log in with Spotify, reach out {' '}
                                <a href="mailto:kennylima970@gmail.com?subject=Spotify%20Access%20Request&body=Hi%2C%20I'd%20like%20access%20to%20Spotify%20login%20on%20Replaylist.%20My%20email%20is%3A%20" className="underline text-purple-400 hover:text-purple-300 transition-colors">here</a>
                                {' '}to request access.
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                Spotify login unlocks your spotify playlists on your user dashboard. But not to worry, you can still access your spotify playlists by searching for it.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* CTA */}
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-10 lg:px-12 pb-24 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                    <Play className="h-4 w-4 fill-white" />
                    Get started
                </Link>
            </motion.div>
        </div>
    )
}
