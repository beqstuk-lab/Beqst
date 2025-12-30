import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { DocumentUpload } from "./document-upload"
import { DocumentList } from "./document-list"
import { LinkageStatus } from "./linkage-status"
import { StorageUsage } from "./storage-usage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LIMITS } from "@/lib/limits"

export default async function DocumentsPage() {
    const session = await auth()
    if (!session?.user?.email) {
        return <div className="p-8 text-center text-muted-foreground">Please sign in to view documents.</div>
    }
    const email = session.user.email as string

    const user = await prisma.user.findUnique({
        where: { email },
        include: { estates: { include: { assets: true, beneficiaries: true, executors: true } } }
    })

    if (!user || user.estates.length === 0) return <div className="p-8 text-center">No Estate Found</div>

    const estate = user.estates[0]

    // Fetch documents with all related data
    const documents = await prisma.document.findMany({
        where: { estateId: estate.id },
        include: {
            asset: true,
            beneficiary: true,
            executor: true,
            accessLogs: {
                orderBy: { timestamp: 'desc' },
                take: 5
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    // Calculate storage usage
    const totalStorageUsed = documents.reduce((sum, doc) => sum + (doc.fileSize || 0), 0)
    const storageLimitBytes = 50 * 1024 * 1024 // 50MB for free tier

    // Get document IDs linked to each type of item
    const assetDocIds = new Set(documents.filter(d => d.assetId).map(d => d.assetId))
    const beneficiaryDocIds = new Set(documents.filter(d => d.beneficiaryId).map(d => d.beneficiaryId))
    const executorDocIds = new Set(documents.filter(d => d.executorId).map(d => d.executorId))

    // Prep data for linkage status
    const linkageData = {
        assets: estate.assets.map((a: { id: string; name: string }) => ({
            id: a.id,
            name: a.name,
            hasDocument: assetDocIds.has(a.id)
        })),
        beneficiaries: estate.beneficiaries.map((b: { id: string; name: string }) => ({
            id: b.id,
            name: b.name,
            hasDocument: beneficiaryDocIds.has(b.id)
        })),
        executors: estate.executors.map((e: { id: string; name: string }) => ({
            id: e.id,
            name: e.name,
            hasDocument: executorDocIds.has(e.id)
        }))
    }

    // Prep data for select dropdowns
    const linkableItems = {
        assets: estate.assets.map((a: { id: string; name: string }) => ({ id: a.id, name: a.name })),
        beneficiaries: estate.beneficiaries.map((b: { id: string; name: string }) => ({ id: b.id, name: b.name })),
        executors: estate.executors.map((e: { id: string; name: string }) => ({ id: e.id, name: e.name }))
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />
            <main className="flex-1 p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                        <p className="text-muted-foreground">Securely store and link legal documents to your estate.</p>
                    </div>
                    <DocumentUpload items={linkableItems} />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content - Document List */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Secure Vault</CardTitle>
                                <CardDescription>
                                    {documents.length} document{documents.length === 1 ? '' : 's'} stored
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <DocumentList documents={documents} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Status Cards */}
                    <div className="space-y-4">
                        <StorageUsage
                            usedBytes={totalStorageUsed}
                            limitBytes={storageLimitBytes}
                            documentCount={documents.length}
                            documentLimit={LIMITS.FREE.DOCUMENTS}
                        />
                        <LinkageStatus
                            assets={linkageData.assets}
                            beneficiaries={linkageData.beneficiaries}
                            executors={linkageData.executors}
                        />
                    </div>
                </div>
            </main>
        </div>
    )
}

