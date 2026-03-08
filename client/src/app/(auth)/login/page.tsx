import { Card } from "@/components/ui/card"
import { Headphones, Play } from "lucide-react"
import { Google } from "@/lib/icons"
import React from 'react'

const page = () => {
    return (
        <div className='flex flex-col gap-6 my-16 items-center'>
            <div className="flex flex-col items-center gap-4 text-center w-2/4">
                <div className="flex items-center justify-center space-x-2">
                    <div className="relative p-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
                        <Headphones className="h-7 w-7 text-green-400/90" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-green-200">Replaylist</h3>
                </div>
                <h3 className="text-4xl font-semibold text-white">Your Spotify Journey Visualized</h3>
                <h3 className="text-slate-300">Connect your Spotify account and track your favourite playlists, see the evolution of popular music charts.</h3>
            </div>
            <Card className="w-full max-w-sm bg-white/10 backdrop-blur-xl mt-2 shadow-2xl p-8">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-slate-300">Sign in to get started</p>
                    </div>
                    {/* Google Login Button */}
                    <a href={`/api/auth/google/login`} className="group relative flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
                        <Google />
                        <span>Continue with Google</span>
                    </a>
                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-white/20"></div>
                        <span className="text-slate-400 text-sm">or</span>
                        <div className="flex-1 h-px bg-white/20"></div>
                    </div>
                    {/* Spotify Login Button */}
                    <a
                        href={`/api/auth/spotify/login`}
                        className="group relative flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/25"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.297.539-1.02.718-1.559.42z" />
                        </svg>
                        <span>Continue with Spotify</span>
                    </a>
                    <hr className="mt-4 text-slate-300" />
                    <div className="text-slate-400 text-xs mt-4 text-center space-y-1">
                        <p>Google sign-in accesses public playlists. Connect with Spotify for personal playlists.</p>
                    </div>
                </div>
            </Card>
            <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-300">Secure OAuth Authentication</span>
                </div>
            </div>
        </div>
    )
}

export default page