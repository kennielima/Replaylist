import { Button } from '@/components/ui/button';
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils';
import { Headphones, Play } from 'lucide-react'
import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const HeaderComponent = ({ user }: { user: User }) => {
    return (
        <header className='sticky top-0 z-10 w-full h-24 shadow-md flex items-center justify-between px-6 md:px-12 lg:px-22 bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900 backdrop-blur-md'>
            {/* logo */}
            <Link href='/' className='flex items-center space-x-3 shrink-0'>
                <div className="relative p-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
                    <Headphones className="h-9 w-9 text-green-400/90" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                </div>
                <span className="text-2xl font-bold text-green-200 hidden sm:inline">Replaylist</span>
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
                    <Button className='bg-purple-800 font-bold cursor-pointer text-lg' size={'lg'}>Login</Button>
                </Link>
            )}
        </header>
    )
}

export default HeaderComponent