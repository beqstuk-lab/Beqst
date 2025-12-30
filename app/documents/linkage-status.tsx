'use client'

import { Building2, Users, UserCheck, FileWarning, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface LinkableItem {
    id: string
    name: string
    hasDocument: boolean
}

interface LinkageStatusProps {
    assets: LinkableItem[]
    beneficiaries: LinkableItem[]
    executors: LinkableItem[]
}

export function LinkageStatus({ assets, beneficiaries, executors }: LinkageStatusProps) {
    const unlinkedAssets = assets.filter(a => !a.hasDocument)
    const unlinkedBeneficiaries = beneficiaries.filter(b => !b.hasDocument)
    const unlinkedExecutors = executors.filter(e => !e.hasDocument)

    const totalUnlinked = unlinkedAssets.length + unlinkedBeneficiaries.length + unlinkedExecutors.length

    if (totalUnlinked === 0) {
        return (
            <div className="rounded-lg border bg-green-50 border-green-200 p-4">
                <div className="flex items-center gap-2 text-green-700">
                    <UserCheck className="h-5 w-5" />
                    <span className="font-medium">All items have documentation!</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                    Every asset, beneficiary, and executor has at least one linked document.
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border bg-amber-50 border-amber-200 p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-700">
                <FileWarning className="h-5 w-5" />
                <span className="font-medium">{totalUnlinked} items need documentation</span>
            </div>

            {unlinkedAssets.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-1">
                        <Building2 className="h-4 w-4" />
                        {unlinkedAssets.length} Asset{unlinkedAssets.length !== 1 ? 's' : ''} without documents
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {unlinkedAssets.slice(0, 3).map(asset => (
                            <span key={asset.id} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                {asset.name}
                            </span>
                        ))}
                        {unlinkedAssets.length > 3 && (
                            <span className="text-xs text-amber-600">+{unlinkedAssets.length - 3} more</span>
                        )}
                    </div>
                </div>
            )}

            {unlinkedBeneficiaries.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-1">
                        <Users className="h-4 w-4" />
                        {unlinkedBeneficiaries.length} Beneficiar{unlinkedBeneficiaries.length !== 1 ? 'ies' : 'y'} without ID docs
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {unlinkedBeneficiaries.slice(0, 3).map(b => (
                            <span key={b.id} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                {b.name}
                            </span>
                        ))}
                        {unlinkedBeneficiaries.length > 3 && (
                            <span className="text-xs text-amber-600">+{unlinkedBeneficiaries.length - 3} more</span>
                        )}
                    </div>
                </div>
            )}

            {unlinkedExecutors.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-1">
                        <UserCheck className="h-4 w-4" />
                        {unlinkedExecutors.length} Executor{unlinkedExecutors.length !== 1 ? 's' : ''} without documents
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {unlinkedExecutors.slice(0, 3).map(e => (
                            <span key={e.id} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                {e.name}
                            </span>
                        ))}
                        {unlinkedExecutors.length > 3 && (
                            <span className="text-xs text-amber-600">+{unlinkedExecutors.length - 3} more</span>
                        )}
                    </div>
                </div>
            )}

            <Button size="sm" variant="outline" className="mt-2" asChild>
                <Link href="/documents">
                    <Plus className="h-4 w-4 mr-1" />
                    Upload Documents
                </Link>
            </Button>
        </div>
    )
}
