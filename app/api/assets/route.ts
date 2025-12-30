import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const assetSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.enum(["CASH_SAVINGS", "PROPERTY", "INVESTMENTS", "PENSION", "INSURANCE", "DIGITAL", "OTHER"]),
    subType: z.enum([
        "CURRENT_ACCOUNT", "SAVINGS_ACCOUNT", "ISA", "GIA", "PREMIUM_BONDS",
        "UK_PROPERTY", "OVERSEAS_PROPERTY",
        "STOCKS", "BONDS", "FUNDS", "ETFS",
        "WORKPLACE_PENSION", "PRIVATE_PENSION", "SIPP",
        "LIFE_INSURANCE", "CRITICAL_ILLNESS",
        "CRYPTOCURRENCY", "ONLINE_ACCOUNTS", "DOMAIN",
        "VEHICLE", "VALUABLES", "OTHER"
    ]),
    value: z.number().optional(),
    metadata: z.any().optional()
})

// GET /api/assets - Get all assets for user's estate
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
                        assets: {
                            include: {
                                allocations: {
                                    include: { beneficiary: true }
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

        return NextResponse.json(user.estates[0].assets)
    } catch (error) {
        console.error("Error fetching assets:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST /api/assets - Create a new asset
export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = assetSchema.parse(body)

        // Check Limits
        const { checkLimit } = await import("@/lib/limits")
        const limitCheck = await checkLimit('ASSETS')
        if (!limitCheck.allowed) {
            return NextResponse.json(
                { error: limitCheck.error, code: limitCheck.code },
                { status: 403 }
            )
        }

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

        const asset = await prisma.asset.create({
            data: {
                estateId,
                name: validatedData.name,
                category: validatedData.category,
                subType: validatedData.subType,
                value: validatedData.value,
                metadata: validatedData.metadata
            }
        })

        return NextResponse.json(asset, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error("Error creating asset:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
