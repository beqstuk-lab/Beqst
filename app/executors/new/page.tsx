'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Shield, Users, UserCheck } from "lucide-react";

const roles = [
    { id: "PRIMARY", label: "Primary Executor", icon: Shield, description: "Main person responsible for your estate" },
    { id: "CO_EXECUTOR", label: "Co-Executor", icon: Users, description: "Shares responsibility with primary" },
    { id: "ALTERNATE", label: "Alternate", icon: UserCheck, description: "Steps in if primary cannot serve" },
];

export default function NewExecutorPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "PRIMARY",
        instructions: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role: string) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/executors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to create executor");
            }

            router.push("/executors");
        } catch {
            setError("Failed to create executor. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
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
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/beneficiaries">Beneficiaries</Link>
                    <Link className="text-foreground" href="/executors">Executors</Link>
                </nav>
            </header>

            <main className="flex-1 p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/executors">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Executors
                        </Link>
                    </Button>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add Executor</CardTitle>
                            <CardDescription>Add someone you trust to manage your estate</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                        {error}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g., Sarah Jones"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email (for notifications)</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="sarah@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+44 7700 900000"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <div className="space-y-2">
                                        {roles.map((role) => (
                                            <label
                                                key={role.id}
                                                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${formData.role === role.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="roleRadio"
                                                    checked={formData.role === role.id}
                                                    onChange={() => handleRoleChange(role.id)}
                                                    className="mt-1"
                                                />
                                                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                                    <role.icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium">{role.label}</div>
                                                    <div className="text-sm text-muted-foreground">{role.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="instructions" className="text-sm font-medium">Special Instructions (optional)</label>
                                    <textarea
                                        id="instructions"
                                        name="instructions"
                                        placeholder="Any specific instructions for this executor..."
                                        value={formData.instructions}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting || !formData.name}>
                                        {isSubmitting ? "Saving..." : "Add Executor"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
