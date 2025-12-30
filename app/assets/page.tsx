'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Building2, Landmark, TrendingUp, Car, Smartphone, Bitcoin, Package, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";

type Asset = {
    id: string;
    name: string;
    type: string;
    value: number | null;
    allocations: { beneficiary: { name: string }; percentage: number }[];
};

const assetTypeIcons: Record<string, React.ReactNode> = {
    BANK_ACCOUNT: <Landmark className="h-5 w-5" />,
    PROPERTY: <Building2 className="h-5 w-5" />,
    INVESTMENT: <TrendingUp className="h-5 w-5" />,
    PENSION: <TrendingUp className="h-5 w-5" />,
    VEHICLE: <Car className="h-5 w-5" />,
    DIGITAL: <Smartphone className="h-5 w-5" />,
    CRYPTOCURRENCY: <Bitcoin className="h-5 w-5" />,
    OTHER: <Package className="h-5 w-5" />,
};

const assetTypeLabels: Record<string, string> = {
    BANK_ACCOUNT: "Bank Account",
    PROPERTY: "Property",
    INVESTMENT: "Investment",
    PENSION: "Pension",
    VEHICLE: "Vehicle",
    DIGITAL: "Digital Asset",
    CRYPTOCURRENCY: "Cryptocurrency",
    OTHER: "Other",
};

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        fetch("/api/assets")
            .then((res) => res.json())
            .then((data) => {
                setAssets(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const formatCurrency = (value: number | null) => {
        if (value === null) return "—";
        if (!isRevealed) return "••••••";

        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
        }).format(value);
    };

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />

            <main className="flex-1 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Assets</h1>
                        <p className="text-muted-foreground">Manage your estate assets</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsRevealed(!isRevealed)}>
                            {isRevealed ? (
                                <>
                                    <EyeOff className="mr-2 h-4 w-4" />
                                    Hide Values
                                </>
                            ) : (
                                <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Show Values
                                </>
                            )}
                        </Button>
                        <Button asChild>
                            <Link href="/assets/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Asset
                            </Link>
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : assets.length === 0 ? (
                    <Card className="border-dashed">
                        <CardHeader className="text-center">
                            <CardTitle>No assets yet</CardTitle>
                            <CardDescription>
                                Add your first asset to start building your estate inventory.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button asChild>
                                <Link href="/assets/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Asset
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {assets.map((asset) => (
                            <Card key={asset.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                        {assetTypeIcons[asset.type] || assetTypeIcons.OTHER}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{asset.name}</CardTitle>
                                        <CardDescription>{assetTypeLabels[asset.type]}</CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold flex items-center gap-2">
                                        {formatCurrency(asset.value)}
                                    </div>
                                    {asset.allocations.length > 0 && (
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Allocated to {asset.allocations.length} beneficiar{asset.allocations.length === 1 ? "y" : "ies"}
                                        </p>
                                    )}
                                    <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                                        <Link href={`/assets/${asset.id}`}>Edit Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
