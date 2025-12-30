'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BarChart3, FileText, Users, Shield, Plus, ArrowRight, Clock, Sparkles, TrendingDown, Wallet } from "lucide-react"
import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"

type DashboardStats = {
    assets: number
    assetValue: number
    liabilities: number
    liabilityValue: number
    documents: number
    beneficiaries: number
    executors: number
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        assets: 0,
        assetValue: 0,
        liabilities: 0,
        liabilityValue: 0,
        documents: 0,
        beneficiaries: 0,
        executors: 0,
    })
    const [loading, setLoading] = useState(true)
    const [trialDaysLeft] = useState(14)

    useEffect(() => {
        // Fetch all stats
        Promise.all([
            fetch("/api/assets").then(r => r.json()).catch(() => []),
            fetch("/api/beneficiaries").then(r => r.json()).catch(() => []),
            fetch("/api/executors").then(r => r.json()).catch(() => []),
            fetch("/api/liabilities").then(r => r.json()).catch(() => []),
            // Documents count - could add API later
            Promise.resolve([]),
        ]).then(([assets, beneficiaries, executors, liabilities, documents]) => {
            const assetValue = Array.isArray(assets)
                ? assets.reduce((sum: number, a: { value: number | null }) => sum + (Number(a.value) || 0), 0)
                : 0
            const liabilityValue = Array.isArray(liabilities)
                ? liabilities.reduce((sum: number, l: { amount: number | null }) => sum + (Number(l.amount) || 0), 0)
                : 0
            setStats({
                assets: Array.isArray(assets) ? assets.length : 0,
                assetValue,
                liabilities: Array.isArray(liabilities) ? liabilities.length : 0,
                liabilityValue,
                documents: Array.isArray(documents) ? documents.length : 0,
                beneficiaries: Array.isArray(beneficiaries) ? beneficiaries.length : 0,
                executors: Array.isArray(executors) ? executors.length : 0,
            })
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const netWorth = stats.assetValue - stats.liabilityValue
    const completionPercentage = Math.min(
        Math.round(((stats.assets > 0 ? 30 : 0) + (stats.beneficiaries > 0 ? 35 : 0) + (stats.executors > 0 ? 35 : 0))),
        100
    )

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            maximumFractionDigits: 0,
        }).format(value)
    }

    const getNextAction = () => {
        if (stats.assets === 0) return { label: "Add your first asset", href: "/assets/new", icon: Plus }
        if (stats.beneficiaries === 0) return { label: "Add a beneficiary", href: "/beneficiaries/new", icon: Users }
        if (stats.executors === 0) return { label: "Designate an executor", href: "/executors/new", icon: Shield }
        return { label: "View your estate", href: "/assets", icon: ArrowRight }
    }

    const nextAction = getNextAction()

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />

            {/* Trial Banner */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b px-6 py-3">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                            <strong>{trialDaysLeft} days left</strong> in your free trial
                        </span>
                    </div>
                    <Button size="sm" variant="default" asChild>
                        <Link href="/pricing">Upgrade Now</Link>
                    </Button>
                </div>
            </div>

            <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
                {/* Net Worth Hero */}
                <Card className="mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Net Worth</p>
                                <p className={`text-4xl font-bold tracking-tight ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(netWorth)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {formatCurrency(stats.assetValue)} assets − {formatCurrency(stats.liabilityValue)} liabilities
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button asChild variant="outline">
                                    <Link href="/assets/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Asset
                                    </Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/liabilities">
                                        <TrendingDown className="mr-2 h-4 w-4" />
                                        Add Liability
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Section */}
                <Card className="mb-8">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Estate Completion</CardTitle>
                                <CardDescription>Complete your estate to protect your legacy</CardDescription>
                            </div>
                            <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
                            <div
                                className="h-full bg-primary transition-all duration-500"
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-4 text-sm">
                                <span className={stats.assets > 0 ? "text-green-600" : "text-muted-foreground"}>
                                    ✓ Assets
                                </span>
                                <span className={stats.beneficiaries > 0 ? "text-green-600" : "text-muted-foreground"}>
                                    ✓ Beneficiaries
                                </span>
                                <span className={stats.executors > 0 ? "text-green-600" : "text-muted-foreground"}>
                                    ✓ Executors
                                </span>
                            </div>
                            <Button asChild size="sm">
                                <Link href={nextAction.href}>
                                    {nextAction.label}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatCurrency(stats.assetValue)}</div>
                            <p className="text-xs text-muted-foreground">{stats.assets} asset{stats.assets !== 1 ? "s" : ""} tracked</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.liabilityValue)}</div>
                            <p className="text-xs text-muted-foreground">{stats.liabilities} liabilit{stats.liabilities !== 1 ? "ies" : "y"}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Documents</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.documents}</div>
                            <p className="text-xs text-muted-foreground">in your secure vault</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Beneficiaries</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.beneficiaries}</div>
                            <p className="text-xs text-muted-foreground">allocated</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <Card className="col-span-full flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </Card>
                    ) : (
                        <>
                            {stats.assets === 0 && (
                                <Card className="border-primary/50 bg-primary/5">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg">Add Your First Asset</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Start building your estate inventory by adding bank accounts, properties, or investments.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href="/assets/new">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Asset
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {stats.assets > 0 && stats.beneficiaries === 0 && (
                                <Card className="border-primary/50 bg-primary/5">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg">Add Beneficiaries</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Designate who will inherit your assets. You can allocate specific percentages.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href="/beneficiaries/new">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Beneficiary
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {stats.beneficiaries > 0 && stats.executors === 0 && (
                                <Card className="border-primary/50 bg-primary/5">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary" />
                                            <CardTitle className="text-lg">Designate Executor</CardTitle>
                                        </div>
                                        <CardDescription>
                                            Choose someone you trust to manage your estate. They&apos;ll be notified when needed.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button asChild className="w-full">
                                            <Link href="/executors/new">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Executor
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Upload Documents Card */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle className="text-lg">Upload Documents</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Securely store wills, deeds, and other important documents.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/documents">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Go to Documents
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {completionPercentage >= 100 && (
                                <Card className="border-green-500/50 bg-green-50">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-green-700">🎉 Estate Complete!</CardTitle>
                                        <CardDescription>
                                            Your digital estate is set up. Consider generating a legal will.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" className="w-full">
                                            Generate Will (Premium)
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    )
}
