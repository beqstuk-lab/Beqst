'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Home, CreditCard, GraduationCap, Receipt } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"

const liabilityTypes = [
    { id: "MORTGAGE", label: "Mortgage", icon: Home, description: "Home or property loans" },
    { id: "LOAN", label: "Personal Loan", icon: Receipt, description: "Bank or personal loans" },
    { id: "CREDIT_CARD", label: "Credit Card", icon: CreditCard, description: "Credit card balances" },
    { id: "STUDENT_LOAN", label: "Student Loan", icon: GraduationCap, description: "Education loans" },
    { id: "TAX", label: "Tax Owed", icon: Receipt, description: "Outstanding tax payments" },
    { id: "OTHER", label: "Other", icon: Receipt, description: "Other debts" },
]

const CREDITORS = {
    MORTGAGE: ["Nationwide", "Halifax", "Barclays", "HSBC", "Lloyds", "NatWest", "Santander", "Other"],
    LOAN: ["Barclays", "HSBC", "Lloyds", "NatWest", "Santander", "Zopa", "Other"],
    CREDIT_CARD: ["Amex", "Barclaycard", "HSBC", "Lloyds", "NatWest", "Capital One", "Other"],
    STUDENT_LOAN: ["Student Loans Company"],
    TAX: ["HMRC"],
    OTHER: [],
}

type LiabilityType = keyof typeof CREDITORS

interface NewLiabilityFormProps {
    assets: Array<{ id: string; name: string; type: string }>
}

export function NewLiabilityForm({ assets }: NewLiabilityFormProps) {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedType, setSelectedType] = useState<LiabilityType | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        amount: "",
        creditor: "",
        creditorOther: "",
        linkedAssetId: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleTypeSelect = (type: LiabilityType) => {
        setSelectedType(type)
        setStep(2)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async () => {
        if (!selectedType) return

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch("/api/liabilities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    type: selectedType,
                    amount: formData.amount ? parseFloat(formData.amount) : undefined,
                    creditor: formData.creditor === "Other" ? formData.creditorOther : formData.creditor,
                    linkedAssetId: formData.linkedAssetId || undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to create liability")
            }

            router.push("/liabilities")
            router.refresh()
        } catch (err: any) {
            setError(err.message || "Failed to create liability. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const creditors = selectedType ? CREDITORS[selectedType] : []

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />

            <main className="flex-1 p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/liabilities">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Liabilities
                        </Link>
                    </Button>

                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Add Liability</CardTitle>
                                <CardDescription>Select the type of liability you want to add</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {liabilityTypes.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => handleTypeSelect(type.id as LiabilityType)}
                                            className="flex items-start gap-4 rounded-lg border p-4 text-left hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="rounded-lg bg-red-100 p-2 text-red-600">
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
                                <CardTitle>Liability Details</CardTitle>
                                <CardDescription>
                                    Tell us about this {liabilityTypes.find(t => t.id === selectedType)?.label.toLowerCase()}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                        {error}
                                    </div>
                                )}

                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Liability Name *</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="e.g., Home Mortgage"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                {creditors.length > 0 && (
                                    <>
                                        <div className="grid gap-2">
                                            <label htmlFor="creditor" className="text-sm font-medium">Creditor</label>
                                            <select
                                                id="creditor"
                                                name="creditor"
                                                value={formData.creditor}
                                                onChange={handleInputChange}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                            >
                                                <option value="">Select creditor...</option>
                                                {creditors.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {formData.creditor === "Other" && (
                                            <div className="grid gap-2">
                                                <label htmlFor="creditorOther" className="text-sm font-medium">Creditor Name</label>
                                                <input
                                                    id="creditorOther"
                                                    name="creditorOther"
                                                    type="text"
                                                    placeholder="Enter creditor name"
                                                    value={formData.creditorOther}
                                                    onChange={handleInputChange}
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                />
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="grid gap-2">
                                    <label htmlFor="amount" className="text-sm font-medium">Outstanding Amount (£)</label>
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label htmlFor="linkedAssetId" className="text-sm font-medium">Link to Asset (Optional)</label>
                                    <select
                                        id="linkedAssetId"
                                        name="linkedAssetId"
                                        value={formData.linkedAssetId}
                                        onChange={handleInputChange}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                    >
                                        <option value="">None</option>
                                        {assets.map(asset => (
                                            <option key={asset.id} value={asset.id}>
                                                {asset.name} ({asset.type.replace(/_/g, " ").toLowerCase()})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-muted-foreground">
                                        Link this liability to an asset (e.g., mortgage to a property).
                                    </p>
                                </div>


                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={() => setStep(1)}>
                                        Back
                                    </Button>
                                    <Button onClick={handleSubmit} disabled={isSubmitting || !formData.name}>
                                        {isSubmitting ? "Saving..." : "Save Liability"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    )
}
