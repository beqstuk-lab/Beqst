'use client'

import { logDocumentAccess, deleteDocument } from "./actions"
import { Button } from "@/components/ui/button"
import { Eye, FileText, Link as LinkIcon, Clock, Trash2, FileCheck, Home, Shield, CreditCard, User, Award, ClipboardList } from "lucide-react"
import { useState } from "react"

// Quick date formatter
const formatDateStr = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-GB", {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}

// Format file size for display
const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return null
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

// Document type config with icons and labels
const DOCUMENT_TYPE_CONFIG: Record<string, { label: string; icon: typeof FileText; color: string }> = {
    WILL: { label: "Will", icon: FileCheck, color: "bg-purple-100 text-purple-700" },
    DEED: { label: "Deed", icon: Home, color: "bg-blue-100 text-blue-700" },
    POLICY: { label: "Policy", icon: Shield, color: "bg-green-100 text-green-700" },
    INSURANCE: { label: "Insurance", icon: Shield, color: "bg-teal-100 text-teal-700" },
    ID: { label: "ID", icon: User, color: "bg-amber-100 text-amber-700" },
    CERTIFICATE: { label: "Certificate", icon: Award, color: "bg-pink-100 text-pink-700" },
    STATEMENT: { label: "Statement", icon: CreditCard, color: "bg-indigo-100 text-indigo-700" },
    OTHER: { label: "Other", icon: ClipboardList, color: "bg-gray-100 text-gray-700" },
}

// Define the type fully to avoid errors
interface DocumentWithRelations {
    id: string
    name: string
    fileUrl: string
    fileType: string
    documentType?: string
    fileSize?: number | null
    createdAt: Date
    asset?: { name: string } | null
    beneficiary?: { name: string } | null
    executor?: { name: string } | null
    accessLogs: {
        id: string
        accessedBy: string
        action: string
        timestamp: Date
    }[]
}

export function DocumentList({ documents }: { documents: DocumentWithRelations[] }) {
    const [isDeleting, setIsDeleting] = useState<string | null>(null)
    const [filterType, setFilterType] = useState<string>("ALL")

    const handleView = async (doc: DocumentWithRelations) => {
        // Log access
        await logDocumentAccess(doc.id)
        // Open mock url
        alert(`Opening ${doc.name} (Simulated View)\nURL: ${doc.fileUrl}`)
    }

    const handleDelete = async (docId: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return
        setIsDeleting(docId)
        await deleteDocument(docId)
        setIsDeleting(null)
    }

    // Filter documents by type
    const filteredDocs = filterType === "ALL"
        ? documents
        : documents.filter(d => d.documentType === filterType)

    if (documents.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No documents uploaded yet</div>
    }

    return (
        <div className="space-y-4">
            {/* Filter Dropdown */}
            <div className="flex items-center gap-2">
                <label htmlFor="filterType" className="text-sm font-medium text-muted-foreground">Filter by type:</label>
                <select
                    id="filterType"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="flex h-8 rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                    <option value="ALL">All Types</option>
                    {Object.entries(DOCUMENT_TYPE_CONFIG).map(([key, config]) => (
                        <option key={key} value={key}>{config.label}</option>
                    ))}
                </select>
                {filterType !== "ALL" && (
                    <span className="text-xs text-muted-foreground">
                        ({filteredDocs.length} of {documents.length})
                    </span>
                )}
            </div>

            {filteredDocs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No documents match this filter</div>
            ) : (
                filteredDocs.map((doc) => {
                    const typeConfig = DOCUMENT_TYPE_CONFIG[doc.documentType || "OTHER"] || DOCUMENT_TYPE_CONFIG.OTHER
                    const TypeIcon = typeConfig.icon

                    return (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-4">
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg mt-1 ${typeConfig.color}`}>
                                    <TypeIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-semibold flex items-center gap-2">
                                        {doc.name}
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${typeConfig.color}`}>
                                            {typeConfig.label}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                                        <span>Uploaded {formatDateStr(doc.createdAt)}</span>
                                        {doc.fileSize && (
                                            <span className="font-medium">{formatFileSize(doc.fileSize)}</span>
                                        )}
                                        {doc.asset && (
                                            <span className="flex items-center gap-1 bg-secondary px-1.5 rounded">
                                                <LinkIcon className="h-3 w-3" /> {doc.asset.name}
                                            </span>
                                        )}
                                        {doc.beneficiary && (
                                            <span className="flex items-center gap-1 bg-secondary px-1.5 rounded">
                                                <LinkIcon className="h-3 w-3" /> {doc.beneficiary.name}
                                            </span>
                                        )}
                                        {doc.executor && (
                                            <span className="flex items-center gap-1 bg-secondary px-1.5 rounded">
                                                <LinkIcon className="h-3 w-3" /> {doc.executor.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                                <div className="text-xs text-right mr-2 hidden md:block text-muted-foreground">
                                    <div className="flex items-center gap-1 justify-end">
                                        <Clock className="h-3 w-3" />
                                        {doc.accessLogs.length} views
                                    </div>
                                    {doc.accessLogs.length > 0 && (
                                        <div title={`Last view: ${doc.accessLogs[0].accessedBy}`}>
                                            Last: {formatDateStr(doc.accessLogs[0].timestamp)}
                                        </div>
                                    )}
                                </div>

                                <Button variant="outline" size="sm" onClick={() => handleView(doc)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(doc.id)}
                                    disabled={isDeleting === doc.id}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}
