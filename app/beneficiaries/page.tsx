'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, User, Heart, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";

type Beneficiary = {
    id: string;
    name: string;
    relationship: string;
    email: string | null;
    type: string;
    allocations: { asset: { name: string; value: number | null }; percentage: number }[];
};

const relationshipIcons: Record<string, React.ReactNode> = {
    spouse: <Heart className="h-5 w-5" />,
    partner: <Heart className="h-5 w-5" />,
    child: <User className="h-5 w-5" />,
    parent: <User className="h-5 w-5" />,
    sibling: <UsersIcon className="h-5 w-5" />,
    other: <User className="h-5 w-5" />,
};

const typeLabels: Record<string, string> = {
    RESIDUARY: "Residuary",
    SPECIFIC: "Specific",
    CONTINGENT: "Contingent",
};

export default function BeneficiariesPage() {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/beneficiaries")
            .then((res) => res.json())
            .then((data) => {
                setBeneficiaries(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const calculateInheritance = (allocations: Beneficiary["allocations"]) => {
        return allocations.reduce((total, alloc) => {
            const assetValue = alloc.asset.value || 0;
            return total + (Number(assetValue) * Number(alloc.percentage)) / 100;
        }, 0);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
        }).format(value);
    };

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
                <Link className="flex items-center gap-2 font-bold text-lg text-primary" href="/dashboard">
                    Beqst
                </Link>
                <nav className="flex gap-6 text-sm font-medium">
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/dashboard">Overview</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/assets">Assets</Link>
                    <Link className="text-foreground" href="/beneficiaries">Beneficiaries</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/executors">Executors</Link>
                </nav>
                <div className="ml-auto">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">Sign Out</Link>
                    </Button>
                </div>
            </header>

            <main className="flex-1 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Beneficiaries</h1>
                        <p className="text-muted-foreground">People who will inherit from your estate</p>
                    </div>
                    <Button asChild>
                        <Link href="/beneficiaries/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Beneficiary
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : beneficiaries.length === 0 ? (
                    <Card className="border-dashed">
                        <CardHeader className="text-center">
                            <CardTitle>No beneficiaries yet</CardTitle>
                            <CardDescription>
                                Add the people who will inherit from your estate.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button asChild>
                                <Link href="/beneficiaries/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Beneficiary
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {beneficiaries.map((beneficiary) => (
                            <Card key={beneficiary.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="rounded-full bg-primary/10 p-3 text-primary">
                                        {relationshipIcons[beneficiary.relationship.toLowerCase()] || relationshipIcons.other}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{beneficiary.name}</CardTitle>
                                        <CardDescription className="capitalize">{beneficiary.relationship}</CardDescription>
                                    </div>
                                    <span className="text-xs bg-muted px-2 py-1 rounded">
                                        {typeLabels[beneficiary.type]}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {formatCurrency(calculateInheritance(beneficiary.allocations))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {beneficiary.allocations.length === 0
                                            ? "No allocations yet"
                                            : `${beneficiary.allocations.length} asset${beneficiary.allocations.length === 1 ? "" : "s"} allocated`}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
