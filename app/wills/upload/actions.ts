'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Schema for the review/import step
const importSchema = z.object({
    assets: z.array(z.object({
        name: z.string(),
        type: z.enum(["BANK_ACCOUNT", "PROPERTY", "INVESTMENT", "PENSION", "VEHICLE", "DIGITAL", "CRYPTOCURRENCY", "OTHER"]),
        value: z.number().nullable().optional(),
        selected: z.boolean().optional() // UI field, but good to validate structure
    })),
    beneficiaries: z.array(z.object({
        name: z.string(),
        relationship: z.string(),
        type: z.enum(["RESIDUARY", "SPECIFIC", "CONTINGENT"]),
        selected: z.boolean().optional()
    }))
})

// 1. Simulate Analysis (Read-only)
export async function parseWill(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Not authenticated" }

    // Artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock Extraction Result
    const detectedAssets = [
        { id: "1", name: "Barclays Current Account", type: "BANK_ACCOUNT", value: 15400.00, selected: true },
        { id: "2", name: "Family Home (London)", type: "PROPERTY", value: 450000.00, selected: true },
        { id: "3", name: "Tesla Model 3", type: "VEHICLE", value: 25000.00, selected: true }
    ];

    const detectedBeneficiaries = [
        { id: "1", name: "Sarah McPherson", relationship: "Spouse", type: "RESIDUARY", selected: true },
        { id: "2", name: "James McPherson Jr", relationship: "Child", type: "RESIDUARY", selected: true }
    ];

    return {
        success: true,
        data: {
            assets: detectedAssets,
            beneficiaries: detectedBeneficiaries
        }
    }
}

// 2. Import Confirmed Data (Write)
export async function importEstateData(data: any) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Not authenticated" }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { estates: true }
    })

    if (!user) return { error: "User not found" }

    let estateId = user.estates[0]?.id
    if (!estateId) {
        const estate = await prisma.estate.create({
            data: {
                ownerId: user.id,
                name: `${user.name || user.email}'s Estate`
            }
        })
        estateId = estate.id
    }

    try {
        // Validate and allow partial failure? or nice clean types.
        // We filter for only 'selected' items if passed from UI, 
        // but here we assume the passed data IS what needs to be imported.

        const assets = data.assets || []
        const beneficiaries = data.beneficiaries || []

        let stats = { assets: 0, beneficiaries: 0 }

        for (const asset of assets) {
            // Mapping UI type string back to Enum if needed, 
            // but we kept them consistent.
            await prisma.asset.create({
                data: {
                    estateId,
                    name: asset.name,
                    type: asset.type,
                    value: asset.value,
                }
            })
            stats.assets++
        }

        for (const ben of beneficiaries) {
            await prisma.beneficiary.create({
                data: {
                    estateId,
                    name: ben.name,
                    relationship: ben.relationship,
                    type: ben.type
                }
            })
            stats.beneficiaries++
        }

        if (data.saveToDocuments) {
            // Create a Document record for the Will
            // We assume 'data.fileName' or similar is passed, or we default
            const docName = data.fileName || "Uploaded Will.pdf"
            const docUrl = `/uploads/wills/${Math.random().toString(36).substring(7)}.pdf` // Mock

            const doc = await prisma.document.create({
                data: {
                    estateId,
                    name: docName,
                    fileUrl: docUrl,
                    fileType: "application/pdf"
                }
            })

            await prisma.documentAccessLog.create({
                data: {
                    documentId: doc.id,
                    accessedBy: session.user.email,
                    action: "UPLOAD_WILL"
                }
            })
        }

        revalidatePath("/dashboard")
        revalidatePath("/documents")
        return { success: true, stats }
    } catch (e) {
        console.error(e)
        return { error: "Failed to import data" }
    }
}
