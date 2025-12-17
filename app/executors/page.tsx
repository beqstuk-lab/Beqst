'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, Shield, Users, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

type Executor = {
    id: string;
    name: string;
    email: string | null;
    role: string;
    status: string;
};

const roleIcons: Record<string, React.ReactNode> = {
    PRIMARY: <Shield className="h-5 w-5" />,
    CO_EXECUTOR: <Users className="h-5 w-5" />,
    ALTERNATE: <UserCheck className="h-5 w-5" />,
};

const roleLabels: Record<string, string> = {
    PRIMARY: "Primary Executor",
    CO_EXECUTOR: "Co-Executor",
    ALTERNATE: "Alternate",
};

const statusLabels: Record<string, { label: string; color: string }> = {
    NOT_INVITED: { label: "Not Invited", color: "bg-gray-100 text-gray-700" },
    INVITED: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    ACCEPTED: { label: "Accepted", color: "bg-green-100 text-green-700" },
    DECLINED: { label: "Declined", color: "bg-red-100 text-red-700" },
};

export default function ExecutorsPage() {
    const [executors, setExecutors] = useState<Executor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/executors")
            .then((res) => res.json())
            .then((data) => {
                setExecutors(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
                <Link className="flex items-center gap-2 font-bold text-lg text-primary" href="/dashboard">
                    Beqst
                </Link>
                <nav className="flex gap-6 text-sm font-medium">
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/dashboard">Overview</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/assets">Assets</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/beneficiaries">Beneficiaries</Link>
                    <Link className="text-foreground" href="/executors">Executors</Link>
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
                        <h1 className="text-2xl font-bold">Executors</h1>
                        <p className="text-muted-foreground">People who will manage your estate</p>
                    </div>
                    <Button asChild>
                        <Link href="/executors/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Executor
                        </Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : executors.length === 0 ? (
                    <Card className="border-dashed">
                        <CardHeader className="text-center">
                            <CardTitle>No executors yet</CardTitle>
                            <CardDescription>
                                Add someone you trust to manage your estate after you&apos;re gone.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Button asChild>
                                <Link href="/executors/new">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Executor
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {executors.map((executor) => (
                            <Card key={executor.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className={`rounded-full p-3 ${executor.role === "PRIMARY" ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                                        {roleIcons[executor.role] || roleIcons.PRIMARY}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{executor.name}</CardTitle>
                                        <CardDescription>{roleLabels[executor.role]}</CardDescription>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${statusLabels[executor.status]?.color || statusLabels.NOT_INVITED.color}`}>
                                        {statusLabels[executor.status]?.label || "Unknown"}
                                    </span>
                                </CardHeader>
                                {executor.email && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{executor.email}</p>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
