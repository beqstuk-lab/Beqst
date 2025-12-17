'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const relationships = [
    "Spouse",
    "Partner",
    "Child",
    "Parent",
    "Sibling",
    "Grandchild",
    "Friend",
    "Charity",
    "Other"
];

const beneficiaryTypes = [
    { id: "RESIDUARY", label: "Residuary", description: "Receives share of remaining estate" },
    { id: "SPECIFIC", label: "Specific", description: "Receives specific assets only" },
    { id: "CONTINGENT", label: "Contingent", description: "Inherits if primary beneficiary cannot" },
];

export default function NewBeneficiaryPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        relationship: "",
        email: "",
        phone: "",
        type: "RESIDUARY",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/beneficiaries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                throw new Error("Failed to create beneficiary");
            }

            router.push("/beneficiaries");
        } catch {
            setError("Failed to create beneficiary. Please try again.");
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
                    <Link className="text-foreground" href="/beneficiaries">Beneficiaries</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/executors">Executors</Link>
                </nav>
            </header>

            <main className="flex-1 p-6 md:p-8">
                <div className="max-w-xl mx-auto">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/beneficiaries">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Beneficiaries
                        </Link>
                    </Button>

                    <Card>
                        <CardHeader>
                            <CardTitle>Add Beneficiary</CardTitle>
                            <CardDescription>Add someone who will inherit from your estate</CardDescription>
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
                                        placeholder="e.g., John Smith"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="relationship" className="text-sm font-medium">Relationship *</label>
                                    <select
                                        id="relationship"
                                        name="relationship"
                                        value={formData.relationship}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    >
                                        <option value="">Select relationship</option>
                                        {relationships.map((rel) => (
                                            <option key={rel} value={rel}>{rel}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email (optional)</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="phone" className="text-sm font-medium">Phone (optional)</label>
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
                                    <label className="text-sm font-medium">Inheritance Type</label>
                                    <div className="space-y-2">
                                        {beneficiaryTypes.map((type) => (
                                            <label
                                                key={type.id}
                                                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${formData.type === type.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={type.id}
                                                    checked={formData.type === type.id}
                                                    onChange={handleInputChange}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <div className="font-medium">{type.label}</div>
                                                    <div className="text-sm text-muted-foreground">{type.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="button" variant="outline" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting || !formData.name || !formData.relationship}>
                                        {isSubmitting ? "Saving..." : "Add Beneficiary"}
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
