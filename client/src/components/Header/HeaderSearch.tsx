"use client"
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const HeaderSearch = () => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    useEffect(() => {
        if (open) inputRef.current?.focus()
    }, [open])

    const close = () => {
        setOpen(false)
        setQuery("")
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        router.push(`/search?q=${encodeURIComponent(query.trim())}`)
        close()
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") close()
    }

    return (
        <div className="flex items-center">
            {open ? (
                <form onSubmit={onSubmit} className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={onKeyDown}
                        onBlur={e => { if (!e.currentTarget.form?.contains(e.relatedTarget)) close() }}
                        placeholder="Explore playlists..."
                        className="h-8 w-48 rounded-md bg-white/10 border border-white/15 px-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-purple-400/60 transition-all"
                    />
                    <button type="button" onClick={close} className="text-slate-400 hover:text-slate-200 transition-colors">
                        <X className="h-4 w-4" />
                    </button>
                </form>
            ) : (
                <button onClick={() => setOpen(true)} className="text-slate-400 hover:text-purple-300 transition-colors">
                    <Search className="h-4.5 w-4.5" />
                </button>
            )}
        </div>
    )
}

export default HeaderSearch
