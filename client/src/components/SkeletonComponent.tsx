import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from './ui/card'

const SkeletonComponent = () => {
    return (
        <div className="flex flex-col gap-8 p-12 md:p-20">
            <div className="flex md:flex-row flex-col gap-12">
                <Card className="bg-white/5 backdrop-blur-md border border-white/10 w-full md:w-1/2 lg:w-1/3">
                    <CardContent className="p-0">
                        <Skeleton className="w-full h-64 rounded-t-lg" />
                        <div className="p-6">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </CardContent>
                </Card>
                <div className="flex flex-col justify-center">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <div className="py-6">
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-4/5 mb-4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="bg-white/5 backdrop-blur-md border border-white/10">
                        <CardContent className="p-0">
                            <Skeleton className="w-full h-64 rounded-t-lg" />
                            <div className="p-6">
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default SkeletonComponent