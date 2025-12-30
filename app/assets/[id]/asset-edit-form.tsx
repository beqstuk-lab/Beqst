'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { updateAsset } from "../actions"

interface AssetEditFormProps {
    asset: any // Prisma type would be better but keeping simple for now
}

export function AssetEditForm({ asset }: AssetEditFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initial state from DB
    const [formData, setFormData] = useState({
        name: asset.name,
        value: asset.value ? asset.value.toString() : "",
        // Metadata fields
        institution: asset.metadata?.institution || "",
        accountNumber: asset.metadata?.accountNumber || "",
        address: asset.metadata?.address || "",
        provider: asset.metadata?.provider || ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const form = new FormData()
            form.append("name", formData.name)
            form.append("value", formData.value)
            form.append("type", asset.type)

            // Add metadata fields
            if (formData.institution) form.append("institution", formData.institution)
            if (formData.accountNumber) form.append("accountNumber", formData.accountNumber)
            if (formData.address) form.append("address", formData.address)
            if (formData.provider) form.append("provider", formData.provider)

            // We call the action directly. The signature is (assetId, prevState, formData)
            const result = await updateAsset(asset.id, null, form)

            if (result.error) {
                setError(result.error)
            } else {
                router.push("/assets")
                router.refresh()
            }
        } catch (err) {
            setError("Failed to update asset")
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderTypeSpecificFields = () => {
        switch (asset.type) {
            case "BANK_ACCOUNT":
                return (
                    <>
                        <div className="grid gap-2">
                            <label htmlFor="institution" className="text-sm font-medium">Institution</label>
                            <input
                                id="institution"
                                name="institution"
                                type="text"
                                value={formData.institution}
                                onChange={handleInputChange}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="accountNumber" className="text-sm font-medium">Account Number</label>
                            <input
                                id="accountNumber"
                                name="accountNumber"
                                type="text"
                                value={formData.accountNumber}
                                onChange={handleInputChange}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>
                    </>
                )
            case "PROPERTY":
                return (
                    <div className="grid gap-2">
                        <label htmlFor="address" className="text-sm font-medium">Property Address</label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                )
            case "INVESTMENT":
            case "PENSION":
                return (
                    <div className="grid gap-2">
                        <label htmlFor="provider" className="text-sm font-medium">Provider</label>
                        <input
                            id="provider"
                            name="provider"
                            type="text"
                            value={formData.provider}
                            onChange={handleInputChange}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <>
            <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/assets">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assets
                </Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Asset Details</CardTitle>
                    <CardDescription>Update information for {asset.name} ({asset.type.replace("_", " ").toLowerCase()})</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor="value" className="text-sm font-medium">Estimated Value (£)</label>
                            <input
                                id="value"
                                name="value"
                                type="number"
                                value={formData.value}
                                onChange={handleInputChange}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            />
                        </div>

                        {renderTypeSpecificFields()}

                        <div className="flex gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSubmitting ? "Updating..." : "Update Asset"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}
