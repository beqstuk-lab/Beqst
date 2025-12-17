import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const beneficiarySchema = z.object({
    name: z.string().min(1, "Name is required"),
    relationship: z.string().min(1, "Relationship is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    type: z.enum(["RESIDUARY", "SPECIFIC", "CONTINGENT"]).default("RESIDUARY")
})

// GET /api/beneficiaries - Get all beneficiaries for user's estate
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
                        beneficiaries: {
                            include: {
                                allocations: {
                                    include: { asset: true }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!user || user.estates.length === 0) {
            return NextResponse.json([])
        }

        return NextResponse.json(user.estates[0].beneficiaries)
    } catch (error) {
        console.error("Error fetching beneficiaries:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST /api/beneficiaries - Create a new beneficiary
export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = beneficiarySchema.parse(body)

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

        const beneficiary = await prisma.beneficiary.create({
            data: {
                estateId,
                name: validatedData.name,
                relationship: validatedData.relationship,
                email: validatedData.email || null,
                phone: validatedData.phone || null,
                type: validatedData.type
            }
        })

        return NextResponse.json(beneficiary, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error("Error creating beneficiary:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
