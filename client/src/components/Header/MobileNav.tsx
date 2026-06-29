"use client"
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils'
import { Menu, Search, Headphones, Play } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetClose } from '../ui/sheet'

const MobileNav = ({ user }: { user: User }) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => { setOpen(false) }, [pathname])

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 640px)')
        const handler = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false) }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 100)
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
            <button onClick={() => setOpen(true)} className="text-purple-300 hover:text-purple-400 hover:cursor-pointer transition-colors p-1">
                <Menu className="h-8 w-8" />
            </button>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="top" showCloseButton={false} className="h-auto bg-[#111009] border-none px-6 pb-6 flex flex-col gap-6 data-[state=closed]:duration-300 data-[state=open]:duration-300">
                    {/* Mirror header */}
                    <div className="flex items-center justify-between h-24">
                        <Link href="/" onClick={close} className="flex items-center space-x-3 shrink-0">
                            <div className="relative p-2 bg-purple-600/20 rounded-lg border border-purple-400/30">
                                <Headphones className="h-9 w-9 text-purple-300" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                                    <Play className="w-4 h-4 text-white fill-white" />
                                </div>
                            </div>
                        </Link>
                        <SheetClose className="text-slate-300 hover:text-purple-300 transition-colors p-1 text-4xl hover:cursor-pointer leading-none">
                            ✕
                        </SheetClose>
                    </div>

                    <form onSubmit={onSearch} className="flex items-center gap-2 border-b border-white/10 pb-3">
                        <Search className="h-4 w-4 text-slate-400 shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Explore playlists..."
                            className="flex-1 bg-transparent text-base text-white placeholder:text-slate-500 outline-none"
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
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default MobileNav
