'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { authenticator } from "otplib"

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
})

export async function updateProfile(formData: { firstName: string; lastName: string }) {
    const session = await auth()
    if (!session?.user?.email) return { error: "Not authenticated" }

    const validated = profileSchema.safeParse(formData)
    if (!validated.success) {
        return { error: "Invalid data" }
    }

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                firstName: validated.data.firstName,
                lastName: validated.data.lastName,
                name: `${validated.data.firstName} ${validated.data.lastName}`.trim()
            }
        })
        revalidatePath("/settings/profile")
        return { success: "Profile updated successfully" }
    } catch (error) {
        return { error: "Failed to update profile" }
    }
}

// 2FA Actions
// Note: These require 'otplib' and 'qrcode' packages


export async function generateTwoFactorSecret() {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const secret = authenticator.generateSecret();
    const user = session.user.email;
    const service = "Beqst";

    const otpauth = authenticator.keyuri(user, service, secret);

    // Save the secret but don't enable it yet
    await prisma.user.update({
        where: { email: session.user.email },
        data: { twoFactorSecret: secret },
    });

    return { secret, otpauth };
}

export async function verifyAndEnableTwoFactor(token: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { twoFactorSecret: true },
    });

    if (!user?.twoFactorSecret) return { error: "2FA setup not initiated" };

    const isValid = authenticator.verify({
        token,
        secret: user.twoFactorSecret,
    });

    if (isValid) {
        await prisma.user.update({
            where: { email: session.user.email },
            data: { twoFactorEnabled: true },
        });
        revalidatePath("/settings/security");
        return { success: true };
    } else {
        return { error: "Invalid token" };
    }
}

export async function disableTwoFactor() {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    await prisma.user.update({
        where: { email: session.user.email },
        data: {
            twoFactorEnabled: false,
            twoFactorSecret: null
        },
    });
    revalidatePath("/settings/security");
    return { success: true };
}
