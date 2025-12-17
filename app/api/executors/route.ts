import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const executorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    role: z.enum(["PRIMARY", "CO_EXECUTOR", "ALTERNATE"]).default("PRIMARY"),
    instructions: z.string().optional()
})

// GET /api/executors - Get all executors for user's estate
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
                        executors: true
                    }
                }
            }
        })

        if (!user || user.estates.length === 0) {
            return NextResponse.json([])
        }

        return NextResponse.json(user.estates[0].executors)
    } catch (error) {
        console.error("Error fetching executors:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// POST /api/executors - Create a new executor
export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const validatedData = executorSchema.parse(body)

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

        const executor = await prisma.executor.create({
            data: {
                estateId,
                name: validatedData.name,
                email: validatedData.email || null,
                phone: validatedData.phone || null,
                role: validatedData.role,
                instructions: validatedData.instructions || null
            }
        })

        return NextResponse.json(executor, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 })
        }
        console.error("Error creating executor:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
