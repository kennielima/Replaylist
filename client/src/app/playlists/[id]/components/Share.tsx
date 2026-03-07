"use client"
import React, { useState } from 'react'
import { Copy, Share2 } from 'lucide-react';
import { Twitter, Whatsapp, Facebook, MailIcon } from '@/lib/icons'
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Share = ({ id }: { id: string }) => {
    const [copied, setCopied] = useState(false);
    const link = `www.replaylist.co/playlists/${id}`;
    const [showTrackingDialog, setShowTrackingDialog] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="lg"
                        className="text-white hover:text-white border-white/20 hover:bg-white/10 px-8 cursor-pointer"
                    >
                        Share {" "} <Share2 className="h-5 w-5" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-700 border-white/10">
                    <DialogHeader>
                        <DialogTitle className="text-white">Copy or share link</DialogTitle>
                    </DialogHeader>
                    <div className='flex items-center justify-center gap-3 md:gap-5 my-2'>
                        <div
                            className='flex flex-col justify-center items-center gap-1 cursor-pointer text-white/80'
                            onClick={copyToClipboard}
                        >
                            <Copy className='size-8' />
                            <span className='text-sm'>{copied ? 'Link copied!' : 'Copy link'}</span>
                        </div>
                        <Link
                            className='flex flex-col justify-center items-center gap-1 cursor-pointer'
                            href={`https://wa.me/?text=${'Check out this playlist'}%20${link}`}
                            target='_blank'
                        >
                            <Whatsapp />
                            <span className='text-sm'>Whatsapp</span>
                        </Link>
                        {/* <Link
                        className='flex flex-col justify-center items-center gap-1 cursor-pointer'
                        href=''
                        target='_blank'
                    >
                        <Instagram />
                        <span className='text-sm'> Instagram</span>
                    </Link> */}
                        <Link
                            className='flex flex-col justify-center items-center gap-1 cursor-pointer'
                            href={`https://twitter.com/intent/tweet?url=${link}&text=${'Check out this playlist'}`}
                            target='_blank'
                        >
                            <Twitter />
                            <span className='text-sm'> Twitter</span>
                        </Link>
                        <Link
                            className='flex flex-col justify-center items-center gap-1 cursor-pointer'
                            href={`https://www.facebook.com/share.php?u=${link}&title=${'Check out this playlist'}`}
                            target='_blank'
                        >
                            <Facebook />
                            <span className='text-sm'>Facebook</span>
                        </Link>
                        <Link
                            className='flex flex-col justify-center items-center gap-1 cursor-pointer'
                            href={`mailto:?subject=${'Check out this playlist'}&body=Check out this playlist: ${link}`}
                            target='_blank'
                        >
                            <MailIcon />
                            <span className='text-sm'>Mail</span>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Share