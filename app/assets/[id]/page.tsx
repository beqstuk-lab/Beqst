import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { AssetEditForm } from "./asset-edit-form"
import { DashboardHeader } from "@/components/dashboard-header"

export default async function AssetEditPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth()
    if (!session?.user?.email) redirect("/login")

    const resolvedParams = await params
    const asset = await prisma.asset.findUnique({
        where: { id: resolvedParams.id },
        include: { estate: { include: { owner: true } } }
    })

    if (!asset || asset.estate.owner.email !== session.user.email) {
        notFound()
    }

    // Convert Decimal to number for Client Component
    const safeAsset = {
        ...asset,
        value: asset.value ? Number(asset.value) : null
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />
            <main className="flex-1 p-6 md:p-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Edit Asset</h1>
                    <AssetEditForm asset={safeAsset} />
                </div>
            </main>
        </div>
    )
}
