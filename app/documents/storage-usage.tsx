'use client'

import { HardDrive, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface StorageUsageProps {
    usedBytes: number
    limitBytes: number  // e.g., 50MB for free tier
    documentCount: number
    documentLimit: number
}

export function StorageUsage({ usedBytes, limitBytes, documentCount, documentLimit }: StorageUsageProps) {
    const usedPercentage = Math.min((usedBytes / limitBytes) * 100, 100)
    const isNearLimit = usedPercentage > 80
    const isAtLimit = documentCount >= documentLimit

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    return (
        <div className={`rounded-lg border p-4 ${isNearLimit ? 'bg-amber-50 border-amber-200' : 'bg-muted/30'}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <HardDrive className={`h-4 w-4 ${isNearLimit ? 'text-amber-600' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">Storage Usage</span>
                </div>
                <span className="text-xs text-muted-foreground">
                    {documentCount} / {documentLimit} documents
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <div
                    className={`h-full transition-all ${isNearLimit ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${usedPercentage}%` }}
                />
            </div>

            <div className="flex items-center justify-between text-xs">
                <span className={isNearLimit ? 'text-amber-600 font-medium' : 'text-muted-foreground'}>
                    {formatSize(usedBytes)} of {formatSize(limitBytes)} used
                </span>
                <span className="text-muted-foreground">
                    {(100 - usedPercentage).toFixed(0)}% remaining
                </span>
            </div>

            {(isNearLimit || isAtLimit) && (
                <div className="mt-3 pt-3 border-t border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700 text-sm mb-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>{isAtLimit ? 'Document limit reached' : 'Approaching storage limit'}</span>
                    </div>
                    <Button size="sm" variant="default" className="w-full" asChild>
                        <Link href="/pricing">Upgrade for More Storage</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
