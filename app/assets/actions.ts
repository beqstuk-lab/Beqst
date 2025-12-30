'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const assetSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["BANK_ACCOUNT", "PROPERTY", "INVESTMENT", "PENSION", "VEHICLE", "DIGITAL", "CRYPTOCURRENCY", "OTHER"]),
    value: z.number().optional().nullable(), // Allow null
    metadata: z.record(z.any()).optional()
})

export async function updateAsset(assetId: string, prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Unauthorized" }

    // Verify ownership
    const asset = await prisma.asset.findUnique({
        where: { id: assetId },
        include: { estate: { include: { owner: true } } }
    })

    if (!asset || asset.estate.owner.email !== session.user.email) {
        return { error: "Asset not found or unauthorized" }
    }

    const name = formData.get("name") as string
    const valueRaw = formData.get("value") as string
    const type = formData.get("type") as any

    // Extract metadata fields based on type
    const metadata: any = {}
    if (type === "BANK_ACCOUNT") {
        metadata.institution = formData.get("institution")
        metadata.accountNumber = formData.get("accountNumber")
    } else if (type === "PROPERTY") {
        metadata.address = formData.get("address")
    } else if (["INVESTMENT", "PENSION"].includes(type)) {
        metadata.provider = formData.get("provider")
    }

    try {
        const validated = assetSchema.parse({
            name,
            type,
            value: valueRaw ? parseFloat(valueRaw) : null,
            metadata
        })

        await prisma.asset.update({
            where: { id: assetId },
            data: {
                name: validated.name,
                value: validated.value,
                metadata: validated.metadata // This merges/replaces json 
            }
        })

        revalidatePath("/assets")
        revalidatePath(`/assets/${assetId}`) // Revalidate specific page too
        return { success: true }
    } catch (e: any) {
        if (e instanceof z.ZodError || e.errors) {
            return { error: e.errors ? e.errors[0].message : "Validation failed" }
        }
        return { error: "Failed to update asset" }
    }
}
