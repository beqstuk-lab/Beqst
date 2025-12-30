'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// We don't import limits here to allow the demo to bypass creation limits if we want, 
// or we can strictly enforce them on the "parsing" too. For a sales demo, usually we want to populate data.

export async function parseWillAndCreateEstate() {
    const session = await auth()
    if (!session?.user?.email) return { error: "Not authenticated" }

    // Artificial delay to simulate parsing
    await new Promise(resolve => setTimeout(resolve, 2000));

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

    // Mock Data Extraction
    // In a real app, this would come from the LLM/OCR result
    const mockAssets = [
        { name: "Barclays Current Account", type: "BANK_ACCOUNT", value: 15400.00 },
        { name: "Family Home (London)", type: "PROPERTY", value: 450000.00 },
        { name: "Tesla Model 3", type: "VEHICLE", value: 25000.00 }
    ] as const;

    const mockBeneficiaries = [
        { name: "Sarah McPherson", relationship: "Spouse", type: "RESIDUARY" },
        { name: "James McPherson Jr", relationship: "Child", type: "RESIDUARY" }
    ] as const;

    try {
        // Create Assets
        for (const asset of mockAssets) {
            await prisma.asset.create({
                data: {
                    estateId,
                    name: asset.name,
                    type: asset.type,
                    value: asset.value,
                    metadata: {}
                }
            })
        }

        // Create Beneficiaries
        for (const ben of mockBeneficiaries) {
            await prisma.beneficiary.create({
                data: {
                    estateId,
                    name: ben.name,
                    relationship: ben.relationship,
                    type: ben.type
                }
            })
        }

        revalidatePath("/dashboard")
        return {
            success: true,
            stats: {
                assets: mockAssets.length,
                beneficiaries: mockBeneficiaries.length
            }
        }

    } catch (e) {
        console.error(e)
        return { error: "Failed to process will data" }
    }
}
