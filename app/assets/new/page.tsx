'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Landmark, Building2, TrendingUp, Shield, Smartphone, Package, ArrowLeft } from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"
import { DashboardHeader } from "@/components/dashboard-header"

// Asset category configuration
const assetCategories = [
    { id: "CASH_SAVINGS", label: "Cash & Savings", icon: Landmark, description: "Current accounts, savings, ISAs" },
    { id: "PROPERTY", label: "Property", icon: Building2, description: "UK or overseas property" },
    { id: "INVESTMENTS", label: "Investments", icon: TrendingUp, description: "Stocks, bonds, funds" },
    { id: "PENSION", label: "Pension", icon: TrendingUp, description: "Workplace or private pensions" },
    { id: "INSURANCE", label: "Insurance", icon: Shield, description: "Life insurance, critical illness" },
    { id: "DIGITAL", label: "Digital Assets", icon: Smartphone, description: "Crypto, online accounts" },
    { id: "OTHER", label: "Other", icon: Package, description: "Vehicles, valuables, collectibles" },
]

// Sub-types by category
const subTypesByCategory: Record<string, { id: string; label: string }[]> = {
    CASH_SAVINGS: [
        { id: "CURRENT_ACCOUNT", label: "Current Account" },
        { id: "SAVINGS_ACCOUNT", label: "Savings Account" },
        { id: "ISA", label: "ISA (Individual Savings Account)" },
        { id: "GIA", label: "GIA (General Investment Account)" },
        { id: "PREMIUM_BONDS", label: "Premium Bonds" },
    ],
    PROPERTY: [
        { id: "UK_PROPERTY", label: "UK Property" },
        { id: "OVERSEAS_PROPERTY", label: "Overseas Property" },
    ],
    INVESTMENTS: [
        { id: "STOCKS", label: "Stocks & Shares" },
        { id: "BONDS", label: "Bonds" },
        { id: "FUNDS", label: "Investment Funds" },
        { id: "ETFS", label: "ETFs" },
    ],
    PENSION: [
        { id: "WORKPLACE_PENSION", label: "Workplace Pension" },
        { id: "PRIVATE_PENSION", label: "Private Pension" },
        { id: "SIPP", label: "SIPP (Self-Invested Personal Pension)" },
    ],
    INSURANCE: [
        { id: "LIFE_INSURANCE", label: "Life Insurance" },
        { id: "CRITICAL_ILLNESS", label: "Critical Illness Cover" },
    ],
    DIGITAL: [
        { id: "CRYPTOCURRENCY", label: "Cryptocurrency" },
        { id: "ONLINE_ACCOUNTS", label: "Online Accounts" },
        { id: "DOMAIN", label: "Domain Names" },
    ],
    OTHER: [
        { id: "VEHICLE", label: "Vehicle" },
        { id: "VALUABLES", label: "Valuables (Jewelry, Art)" },
        { id: "OTHER", label: "Other" },
    ],
}

// Common providers by category
const providersByCategory: Record<string, string[]> = {
    CASH_SAVINGS: ["Barclays", "HSBC", "Lloyds", "NatWest", "Santander", "Nationwide", "Monzo", "Starling", "Other"],
    INVESTMENTS: ["Vanguard", "Hargreaves Lansdown", "AJ Bell", "Fidelity", "Interactive Investor", "Other"],
    PENSION: ["Aviva", "Legal & General", "Scottish Widows", "Standard Life", "PensionBee", "Other"],
    INSURANCE: ["Aviva", "Legal & General", "AIG", "Vitality", "Zurich", "Other"],
}

type AssetCategory = keyof typeof subTypesByCategory

export default function NewAssetPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState<AssetCategory | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        subType: "",
        value: "",
        provider: "",
        providerOther: "",
        accountNumber: "",
        address: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    const handleCategorySelect = (category: AssetCategory) => {
        setSelectedCategory(category)
        setFormData(prev => ({ ...prev, subType: subTypesByCategory[category]?.[0]?.id || "" }))
        setStep(2)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        if (!selectedCategory) return

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch("/api/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    category: selectedCategory,
                    subType: formData.subType,
                    value: formData.value ? parseFloat(formData.value) : undefined,
                    metadata: {
                        provider: formData.provider === "Other" ? formData.providerOther : formData.provider,
                        accountNumber: formData.accountNumber,
                        address: formData.address,
                    },
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                if (data.code === 'LIMIT_REACHED') {
                    setShowUpgradeModal(true)
                    return
                }
                throw new Error(data.error || "Failed to create asset")
            }

            router.push("/assets")
        } catch (err: any) {
            setError(err.message || "Failed to create asset. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const providers = selectedCategory ? providersByCategory[selectedCategory] : null
    const subTypes = selectedCategory ? subTypesByCategory[selectedCategory] : []

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />

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
                                <CardDescription>Select the category of asset you want to add</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {assetCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat.id as AssetCategory)}
                                            className="flex items-start gap-4 rounded-lg border p-4 text-left hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                                <cat.icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{cat.label}</div>
                                                <div className="text-sm text-muted-foreground">{cat.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 2 && selectedCategory && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Asset Details</CardTitle>
                                <CardDescription>
                                    Tell us about this {assetCategories.find(c => c.id === selectedCategory)?.label.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                        {error}
                                    </div>
                                )}

                                {/* Sub-type Dropdown */}
                                <div className="grid gap-2">
                                    <label htmlFor="subType" className="text-sm font-medium">Account Type *</label>
                                    <select
                                        id="subType"
                                        name="subType"
                                        value={formData.subType}
                                        onChange={handleInputChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    >
                                        {subTypes.map(st => (
                                            <option key={st.id} value={st.id}>{st.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Asset Name */}
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Asset Name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g., Barclays Current Account"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                {/* Provider Dropdown (if available) */}
                                {providers && (
                                    <>
                                        <div className="grid gap-2">
                                            <label htmlFor="provider" className="text-sm font-medium">Provider</label>
                                            <select
                                                id="provider"
                                                name="provider"
                                                value={formData.provider}
                                                onChange={handleInputChange}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                            >
                                                <option value="">Select provider...</option>
                                                {providers.map(p => (
                                                    <option key={p} value={p}>{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.provider === "Other" && (
                                            <div className="grid gap-2">
                                                <label htmlFor="providerOther" className="text-sm font-medium">Provider Name</label>
                                                <input
                                                    id="providerOther"
                                                    name="providerOther"
                                                    type="text"
                                                    placeholder="Enter provider name"
                                                    value={formData.providerOther}
                                                    onChange={handleInputChange}
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Account Number (for bank accounts) */}
                                {selectedCategory === "CASH_SAVINGS" && (
                                    <div className="grid gap-2">
                                        <label htmlFor="accountNumber" className="text-sm font-medium">
                                            Account Number (last 4 digits)
                                        </label>
                                        <input
                                            id="accountNumber"
                                            name="accountNumber"
                                            type="text"
                                            placeholder="****1234"
                                            maxLength={4}
                                            value={formData.accountNumber}
                                            onChange={handleInputChange}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        />
                                        <p className="text-xs text-muted-foreground">We only store the last 4 digits for security</p>
                                    </div>
                                )}

                                {/* Address (for property) */}
                                {selectedCategory === "PROPERTY" && (
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
                                )}

                                {/* Estimated Value */}
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
            <UpgradeModal
                open={showUpgradeModal}
                onOpenChange={setShowUpgradeModal}
                resourceName="Assets"
            />
        </div>
    )
}
