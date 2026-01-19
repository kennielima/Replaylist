import { Button } from '@/components/ui/button';
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils';
import { Headphones, Play } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const HeaderComponent = ({ user }: { user: User }) => {
    return (
        <div className='sticky top-0 z-10 w-full h-24 shadow-md flex items-center justify-between px-6 md:px-12 lg:px-24 bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900'>
            {/* logo */}
            <Link href='/' className='flex items-center space-x-2 shrink-0'>
                {/* <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-purple-500/30"> */}
                <div className="relative p-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
                    <Headphones className="h-7 w-7 text-green-400/90" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <Play className="w-3 h-3 text-white fill-white" />
                    </div>
                </div>
                <span className="text-xl font-bold text-green-200 hidden sm:inline">Replaylist</span>
                {/* <div className='flex gap-1 items-center justify-between'>
                    <div className='bg-green-400 p-3 w-fit rounded-full'>
                        <Headphones className='w-6 h-6' />
                    </div>
                    <span className='font-semibold font-serif gap-0 text-sm'>Playlist <br /> Capsule</span>
                </div> */}
            </Link>
            {user &&
                <Link href='/users/me'>
                    <Avatar className="h-12 w-12 bg-purple-500">
                        <AvatarImage src={user.userImage} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                </Link>
            }
            {!user && (
                <Link href='/login'>
                    <Button className='bg-purple-800 font-bold cursor-pointer'>Login</Button>
                </Link>
            )}
        </div>
    )
}

export default HeaderComponent