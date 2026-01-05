import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("Starting verification...")

    // 1. Setup: Create User
    const email = `test-liability-${Date.now()}@example.com`
    console.log(`Creating test user: ${email}`)

    const user = await prisma.user.create({
        data: {
            email,
            name: "Test User",
        }
    })

    // 2. Setup: Create Estate
    console.log("Creating estate...")
    const estate = await prisma.estate.create({
        data: {
            ownerId: user.id,
            name: "Test Estate"
        }
    })

    // 3. Setup: Create Asset
    console.log("Creating asset...")
    const asset = await prisma.asset.create({
        data: {
            estateId: estate.id,
            name: "Test House",
            type: "PROPERTY",
            value: 500000
        }
    })

    // 4. Test: Create Liability Linked to Asset
    console.log("Creating liability linked to asset...")
    const liability = await prisma.liability.create({
        data: {
            estateId: estate.id,
            name: "Test Mortgage",
            type: "MORTGAGE",
            amount: 200000,
            creditor: "Test Bank",
            linkedAssetId: asset.id
        }
    })

    // 5. Verify: Check Linkage
    console.log("Verifying linkage...")
    const fetchedLiability = await prisma.liability.findUnique({
        where: { id: liability.id },
        include: { estate: true }
    })

    if (!fetchedLiability) {
        throw new Error("Liability not found")
    }

    if (fetchedLiability.linkedAssetId !== asset.id) {
        throw new Error(`Linkage mismatch: Expected ${asset.id}, got ${fetchedLiability.linkedAssetId}`)
    }

    console.log("✅ Liability successfully linked to asset.")

    // 6. Cleanup
    console.log("Cleaning up...")
    await prisma.user.delete({ where: { id: user.id } })
    console.log("✅ Verification passed.")
}

main()
    .catch((e) => {
        console.error("❌ Verification failed:", e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
