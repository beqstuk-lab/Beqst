'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles, Check } from "lucide-react"
import Link from "next/link"

interface UpgradeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    resourceName: string
}

export function UpgradeModal({ open, onOpenChange, resourceName }: UpgradeModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4 w-fit">
                        <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Upgrade to Beqst Premium</DialogTitle>
                    <DialogDescription className="text-center">
                        You&apos;ve reached the limit for {resourceName} on the Free plan.
                        Upgrade to unlock unlimited access and premium features.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1 rounded-full"><Check className="h-3 w-3 text-green-600" /></div>
                        <span className="text-sm">Unlimited Assets & Beneficiaries</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1 rounded-full"><Check className="h-3 w-3 text-green-600" /></div>
                        <span className="text-sm">Legal Will Generation</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1 rounded-full"><Check className="h-3 w-3 text-green-600" /></div>
                        <span className="text-sm">Priority Support</span>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Button className="w-full" asChild>
                        <Link href="/pricing">View Plans</Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                        Maybe Later
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
