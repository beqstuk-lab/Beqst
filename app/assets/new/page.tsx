'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Landmark, TrendingUp, Car, Smartphone, Bitcoin, Package, ArrowLeft } from "lucide-react";

const assetTypes = [
    { id: "BANK_ACCOUNT", label: "Bank Account", icon: Landmark, description: "Current, savings, or ISA accounts" },
    { id: "PROPERTY", label: "Property", icon: Building2, description: "Houses, flats, land" },
    { id: "INVESTMENT", label: "Investment", icon: TrendingUp, description: "Stocks, bonds, funds" },
    { id: "PENSION", label: "Pension", icon: TrendingUp, description: "Workplace or private pensions" },
    { id: "VEHICLE", label: "Vehicle", icon: Car, description: "Cars, motorcycles, boats" },
    { id: "DIGITAL", label: "Digital Asset", icon: Smartphone, description: "Online accounts, domains" },
    { id: "CRYPTOCURRENCY", label: "Cryptocurrency", icon: Bitcoin, description: "Bitcoin, Ethereum, etc." },
    { id: "OTHER", label: "Other", icon: Package, description: "Jewelry, art, collectibles" },
];

type AssetType = typeof assetTypes[number]["id"];

export default function NewAssetPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<AssetType | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        value: "",
        // Type-specific fields
        institution: "",
        accountNumber: "",
        address: "",
        provider: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTypeSelect = (type: AssetType) => {
        setSelectedType(type);
        setStep(2);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!selectedType) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    type: selectedType,
                    value: formData.value ? parseFloat(formData.value) : undefined,
                    metadata: {
                        institution: formData.institution,
                        accountNumber: formData.accountNumber,
                        address: formData.address,
                        provider: formData.provider,
                    },
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create asset");
            }

            router.push("/assets");
        } catch {
            setError("Failed to create asset. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderTypeSpecificFields = () => {
        switch (selectedType) {
            case "BANK_ACCOUNT":
                return (
                    <>
                        <div className="grid gap-2">
                            <label htmlFor="institution" className="text-sm font-medium">Institution</label>
                            <input
                                id="institution"
                                name="institution"
                                type="text"
                                placeholder="e.g., Barclays, HSBC"
                                value={formData.institution}
                                onChange={handleInputChange}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="accountNumber" className="text-sm font-medium">Account Number (last 4 digits)</label>
                            <input
                                id="accountNumber"
                                name="accountNumber"
                                type="text"
                                placeholder="****1234"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </>
                );
            case "PROPERTY":
                return (
                    <div className="grid gap-2">
                        <label htmlFor="address" className="text-sm font-medium">Property Address</label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            placeholder="123 Main Street, London"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                );
            case "INVESTMENT":
            case "PENSION":
                return (
                    <div className="grid gap-2">
                        <label htmlFor="provider" className="text-sm font-medium">Provider</label>
                        <input
                            id="provider"
                            name="provider"
                            type="text"
                            placeholder="e.g., Vanguard, Hargreaves Lansdown"
                            value={formData.provider}
                            onChange={handleInputChange}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                );
            default:
                return null;
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
                    <Link className="text-foreground" href="/assets">Assets</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/beneficiaries">Beneficiaries</Link>
                    <Link className="text-muted-foreground transition-colors hover:text-foreground" href="/executors">Executors</Link>
                </nav>
            </header>

            <main className="flex-1 p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/assets">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Assets
                        </Link>
                    </Button>

                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Add New Asset</CardTitle>
                                <CardDescription>What type of asset would you like to add?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {assetTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => handleTypeSelect(type.id as AssetType)}
                                            className="flex items-start gap-4 rounded-lg border p-4 text-left hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                                <type.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{type.label}</div>
                                                <div className="text-sm text-muted-foreground">{type.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 2 && selectedType && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Asset Details</CardTitle>
                                <CardDescription>
                                    Tell us about this {assetTypes.find(t => t.id === selectedType)?.label.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                        {error}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Asset Name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g., Main Savings Account"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="value" className="text-sm font-medium">Estimated Value (£)</label>
                                    <input
                                        id="value"
                                        name="value"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.value}
                                        onChange={handleInputChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                {renderTypeSpecificFields()}

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name}>
                                        {isSubmitting ? "Saving..." : "Save Asset"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
