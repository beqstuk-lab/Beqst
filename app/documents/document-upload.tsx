'use client'

import { useState } from "react"
import { uploadDocument } from "./actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Loader2, FileText } from "lucide-react"
import { UpgradeModal } from "@/components/upgrade-modal"

interface LinkableItem {
    id: string
    name: string
}

interface DocumentUploadProps {
    items: {
        assets: LinkableItem[]
        beneficiaries: LinkableItem[]
        executors: LinkableItem[]
    }
}

export function DocumentUpload({ items }: DocumentUploadProps) {
    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [linkType, setLinkType] = useState<string>("NONE")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Limits State
    const [showUpgrade, setShowUpgrade] = useState(false)

    // Format file size for display
    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setSelectedFile(file)
    }

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsUploading(true)

        try {
            const formData = new FormData(e.currentTarget)
            const result = await uploadDocument(null, formData)

            if (result.error) {
                if (result.code === 'LIMIT_REACHED') {
                    setOpen(false)
                    setShowUpgrade(true)
                } else {
                    alert(result.error)
                }
            } else {
                setOpen(false)
                setSelectedFile(null)
            }
        } catch (err) {
            console.error(err)
            alert("Upload failed")
        } finally {
            setIsUploading(false)
        }
    }

    const DOCUMENT_TYPES = [
        { value: "WILL", label: "Will" },
        { value: "DEED", label: "Deed / Title" },
        { value: "POLICY", label: "Insurance Policy" },
        { value: "INSURANCE", label: "Insurance Certificate" },
        { value: "ID", label: "ID / Passport" },
        { value: "CERTIFICATE", label: "Certificate" },
        { value: "STATEMENT", label: "Bank Statement" },
        { value: "OTHER", label: "Other" },
    ]

    return (
        <>
            <UpgradeModal
                open={showUpgrade}
                onOpenChange={setShowUpgrade}
                resourceName="Documents"
            />

            <Dialog open={open} onOpenChange={(isOpen: boolean) => { setOpen(isOpen); if (!isOpen) setSelectedFile(null) }}>
                <DialogTrigger asChild>
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleUpload}>
                        <DialogHeader>
                            <DialogTitle>Upload Document</DialogTitle>
                            <DialogDescription>
                                Upload a PDF or image to your secure vault. You can optionally link it to a specific estate item.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium">Document Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="e.g. House Deed"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="documentType" className="text-sm font-medium">Document Type</label>
                                <select
                                    id="documentType"
                                    name="documentType"
                                    defaultValue="OTHER"
                                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    {DOCUMENT_TYPES.map(dt => (
                                        <option key={dt.value} value={dt.value}>{dt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="file" className="text-sm font-medium">File</label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    required
                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                {selectedFile && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <FileText className="h-3 w-3" />
                                        <span>{selectedFile.name}</span>
                                        <span className="ml-auto font-medium">{formatFileSize(selectedFile.size)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <label htmlFor="linkType" className="text-sm font-medium">Link to Item (Optional)</label>
                                <select
                                    id="linkType"
                                    name="linkType"
                                    value={linkType}
                                    onChange={(e) => setLinkType(e.target.value)}
                                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="NONE">No Link</option>
                                    <option value="ASSET">Asset</option>
                                    <option value="BENEFICIARY">Beneficiary</option>
                                    <option value="EXECUTOR">Executor</option>
                                </select>
                            </div>

                            {linkType !== "NONE" && (
                                <div className="grid gap-2">
                                    <label htmlFor="linkId" className="text-sm font-medium">Select Item</label>
                                    <select
                                        id="linkId"
                                        name="linkId"
                                        required
                                        className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="">Select...</option>
                                        {linkType === "ASSET" && items.assets.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                        {linkType === "BENEFICIARY" && items.beneficiaries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                        {linkType === "EXECUTOR" && items.executors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isUploading}>
                                {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Upload
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
