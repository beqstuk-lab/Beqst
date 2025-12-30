'use server'

import { auth } from "@/auth"
import { z } from "zod"
import { checkLimit } from "@/lib/limits"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"

const uploadSchema = z.object({
    name: z.string().min(1, "Name is required"),
    fileType: z.string(),
    documentType: z.enum(["WILL", "DEED", "POLICY", "INSURANCE", "ID", "CERTIFICATE", "STATEMENT", "OTHER"]).default("OTHER"),
    linkType: z.enum(["NONE", "ASSET", "BENEFICIARY", "EXECUTOR"]).default("NONE"),
    linkId: z.string().optional()
})

// Mocks a file upload and creates a Document record
export async function uploadDocument(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Unauthorized" }
    const email = session.user.email

    // Check Limits
    const limitCheck = await checkLimit('DOCUMENTS')
    if (!limitCheck.allowed) {
        return { error: limitCheck.error, code: limitCheck.code }
    }

    const user = await prisma.user.findUnique({
        where: { email },
        include: { estates: true }
    })

    if (!user || !user.estates[0]) return { error: "Estate not found" }
    const estateId = user.estates[0].id

    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const documentType = (formData.get("documentType") as string) || "OTHER"
    const linkType = formData.get("linkType") as string
    const linkId = formData.get("linkId") as string

    if (!file) return { error: "No file provided" }

    // Get file size in bytes
    const fileSize = file.size

    // Mock File Upload: In real app, upload to S3 here
    const mockFileUrl = `/uploads/${Math.random().toString(36).substring(7)}/${file.name}`

    try {
        const data: any = {
            estateId,
            name: name || file.name,
            fileUrl: mockFileUrl,
            fileType: file.type || "application/pdf",
            documentType,
            fileSize
        }

        if (linkType === "ASSET" && linkId) data.assetId = linkId
        if (linkType === "BENEFICIARY" && linkId) data.beneficiaryId = linkId
        if (linkType === "EXECUTOR" && linkId) data.executorId = linkId

        const doc = await prisma.document.create({
            data
        })

        // Log the "UPLOAD" action
        await prisma.documentAccessLog.create({
            data: {
                documentId: doc.id,
                accessedBy: session.user.email!,
                action: "UPLOAD"
            }
        })

        revalidatePath("/documents")
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to upload document" }
    }
}

export async function deleteDocument(documentId: string) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Unauthorized" }

    const doc = await prisma.document.findUnique({
        where: { id: documentId },
        include: { estate: { include: { owner: true } } }
    })

    if (!doc || doc.estate.owner.email !== session.user.email) {
        return { error: "Unauthorized or not found" }
    }

    try {
        await prisma.document.delete({ where: { id: documentId } })
        revalidatePath("/documents")
        return { success: true }
    } catch (e) {
        return { error: "Failed to delete" }
    }
}

export async function logDocumentAccess(documentId: string) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Unauthorized" }

    await prisma.documentAccessLog.create({
        data: {
            documentId,
            accessedBy: session.user.email,
            action: "VIEW"
        }
    })
    // No revalidate needed for access logs usually unless showing them real-time
}
