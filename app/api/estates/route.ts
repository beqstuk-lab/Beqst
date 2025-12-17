import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

// GET /api/estates - Get user's estates or create one if none exist
export async function GET() {
    try {
        const session = await auth()

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { estates: true }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // If user has no estates, create one
        if (user.estates.length === 0) {
            const estate = await prisma.estate.create({
                data: {
                    ownerId: user.id,
                    name: `${user.name || user.email}'s Estate`
                }
            })
            return NextResponse.json([estate])
        }

        return NextResponse.json(user.estates)
    } catch (error) {
        console.error("Error fetching estates:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
