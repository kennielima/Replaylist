"use client"
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils'
import { Menu, X, Search } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

const MobileNav = ({ user }: { user: User }) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    const close = () => setOpen(false)

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        setQuery("")
        close()
    }

    return (
        <div className="sm:hidden">
            <button onClick={() => setOpen(v => !v)} className="text-slate-300 hover:text-purple-300 transition-colors p-1">
                {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {open && (
                <div className="absolute top-full left-0 w-full bg-[#111009]/95 backdrop-blur-md border-b border-white/10 px-6 py-5 flex flex-col gap-5 z-50">
                    <form onSubmit={onSearch} className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-slate-400 shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Explore playlists..."
                            className="flex-1 bg-transparent text-base text-white placeholder:text-slate-500 outline-none border-b border-white/10 pb-1"
                        />
                    </form>

                    <Link href="/about" onClick={close} className="text-slate-300 hover:text-purple-300 text-sm font-medium transition-colors">
                        About
                    </Link>

                    {user ? (
                        <Link href="/users/me" onClick={close} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 bg-purple-400">
                                <AvatarImage src={user.userImage} alt={user.name} />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-slate-300">{user.name}</span>
                        </Link>
                    ) : (
                        <Link href="/login" onClick={close}>
                            <Button className="w-full bg-purple-400 hover:bg-purple-300 text-black font-bold cursor-pointer" size="sm">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

export default MobileNav
