'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BarChart3, FileText, Users, Shield, Plus, ArrowRight, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type DashboardStats = {
    assets: number;
    assetValue: number;
    beneficiaries: number;
    executors: number;
};

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        assets: 0,
        assetValue: 0,
        beneficiaries: 0,
        executors: 0,
    });
    const [loading, setLoading] = useState(true);
    const [trialDaysLeft] = useState(14);
    const [tier, setTier] = useState<string>("Essential");

    useEffect(() => {
        // Load assessment data
        const assessmentData = localStorage.getItem("beqst_assessment");
        if (assessmentData) {
            const { tier: savedTier } = JSON.parse(assessmentData);
            setTier(savedTier);
        }

        // Fetch stats
        Promise.all([
            fetch("/api/assets").then(r => r.json()),
            fetch("/api/beneficiaries").then(r => r.json()),
            fetch("/api/executors").then(r => r.json()),
        ]).then(([assets, beneficiaries, executors]) => {
            const assetValue = Array.isArray(assets)
                ? assets.reduce((sum: number, a: { value: number | null }) => sum + (Number(a.value) || 0), 0)
                : 0;
            setStats({
                assets: Array.isArray(assets) ? assets.length : 0,
                assetValue,
                beneficiaries: Array.isArray(beneficiaries) ? beneficiaries.length : 0,
                executors: Array.isArray(executors) ? executors.length : 0,
            });
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const completionPercentage = Math.min(
        Math.round(((stats.assets > 0 ? 30 : 0) + (stats.beneficiaries > 0 ? 35 : 0) + (stats.executors > 0 ? 35 : 0))),
        100
    );

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getNextAction = () => {
        if (stats.assets === 0) return { label: "Add your first asset", href: "/assets/new", icon: Plus };
        if (stats.beneficiaries === 0) return { label: "Add a beneficiary", href: "/beneficiaries/new", icon: Users };
        if (stats.executors === 0) return { label: "Designate an executor", href: "/executors/new", icon: Shield };
        return { label: "View your estate", href: "/assets", icon: ArrowRight };
    };

    const nextAction = getNextAction();

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
                <Link className="flex items-center gap-2 font-bold text-lg text-primary" href="/dashboard">
                    Beqst
                </Link>
                <nav className="flex gap-6 text-sm font-medium">
                    <Link className="text-foreground" href="/dashboard">Overview</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/assets">Assets</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/beneficiaries">Beneficiaries</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/executors">Executors</Link>
                </nav>
                <div className="ml-auto flex items-center gap-4">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{tier} Plan</span>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">Sign Out</Link>
                    </Button>
                </div>
            </header>

            {/* Trial Banner */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b px-6 py-3">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                            <strong>{trialDaysLeft} days left</strong> in your free trial
                        </span>
                    </div>
                    <Button size="sm" variant="default">
                        Upgrade Now
                    </Button>
                </div>
            </div>

            <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
                {/* Progress Section */}
                <Card className="mb-8 bg-gradient-to-r from-primary/5 to-transparent">
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
                            <div className="text-2xl font-bold">{formatCurrency(stats.assetValue)}</div>
                            <p className="text-xs text-muted-foreground">{stats.assets} asset{stats.assets !== 1 ? "s" : ""} tracked</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Documents</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground">in your secure vault</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Executors</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.executors}</div>
                            <p className="text-xs text-muted-foreground">designated</p>
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
    );
}
