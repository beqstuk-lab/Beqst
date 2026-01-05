import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NewLiabilityForm } from "./form"
import { redirect } from "next/navigation"

export default async function NewLiabilityPage() {
    const session = await auth()
    if (!session?.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { estates: { include: { assets: true } } }
    })

    if (!user || user.estates.length === 0) {
        // Handle edge case: no estate created yet.
        // Usually created on signup/onboarding.
        // For now, pass empty assets or handle gracefully.
        return <div className="p-8">No estate found. Please contact support.</div>
    }

    const assets = user.estates[0].assets.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type
    }))

    return <NewLiabilityForm assets={assets} />
}
