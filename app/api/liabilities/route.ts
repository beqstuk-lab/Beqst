import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const liabilitySchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["MORTGAGE", "LOAN", "CREDIT_CARD", "STUDENT_LOAN", "TAX", "OTHER"]),
    amount: z.number().optional(),
    creditor: z.string().optional(),
    linkedAssetId: z.string().optional(),
})

// GET /api/liabilities - Get all liabilities for user's estate
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                estates: {
                    include: {
                        liabilities: {
                            orderBy: { createdAt: 'desc' }
                        }
                    }
                }
            }
        })

        if (!user || user.estates.length === 0) {
            return NextResponse.json([])
        }

        return NextResponse.json(user.estates[0].liabilities)
    } catch (error) {
        console.error("Error fetching liabilities:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST /api/liabilities - Create a new liability
export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = liabilitySchema.parse(body)

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { estates: true }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Get or create estate
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

        const liability = await prisma.liability.create({
            data: {
                estateId,
                name: validatedData.name,
                type: validatedData.type,
                amount: validatedData.amount,
                creditor: validatedData.creditor,
                linkedAssetId: validatedData.linkedAssetId,
            }
        })

        return NextResponse.json(liability, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error("Error creating liability:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// DELETE /api/liabilities - Delete a liability
export async function DELETE(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")

        if (!id) {
            return NextResponse.json({ error: "ID required" }, { status: 400 })
        }

        // Verify ownership
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { estates: { include: { liabilities: true } } }
        })

        const ownsLiability = user?.estates.some((e: { liabilities: { id: string }[] }) => e.liabilities.some((l: { id: string }) => l.id === id))
        if (!ownsLiability) {
            return NextResponse.json({ error: "Not found" }, { status: 404 })
        }

        await prisma.liability.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting liability:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
