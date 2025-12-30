import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const LIMITS = {
    FREE: {
        ASSETS: 3,
        BENEFICIARIES: 3,
        EXECUTORS: 1,
        DOCUMENTS: 3,
    },
};

export type LimitType = 'ASSETS' | 'BENEFICIARIES' | 'EXECUTORS' | 'DOCUMENTS';

export async function checkLimit(type: LimitType) {
    const session = await auth();
    if (!session?.user?.email) return { allowed: false, error: "Unauthorized" };

    const limitCheckUserEmail = session.user.email;

    // In a real app, we would check the user's subscription tier here.
    // For now, we assume everyone is on the "FREE" tier unless they have a specific flag.
    // extending the user model with 'tier' would be better, but we'll default to FREE checks.

    const user = await prisma.user.findUnique({
        where: { email: limitCheckUserEmail },
        include: {
            estates: {
                include: {
                    _count: {
                        select: { assets: true, beneficiaries: true, executors: true, documents: true }
                    }
                }
            }
        }
    });

    if (!user || user.estates.length === 0) return { allowed: true }; // Should probably handle no estate better

    const estate = user.estates[0];
    const counts = estate._count;

    let limit = 0;
    let current = 0;

    switch (type) {
        case 'ASSETS':
            limit = LIMITS.FREE.ASSETS;
            current = counts.assets;
            break;
        case 'BENEFICIARIES':
            limit = LIMITS.FREE.BENEFICIARIES;
            current = counts.beneficiaries;
            break;
        case 'EXECUTORS':
            limit = LIMITS.FREE.EXECUTORS;
            current = counts.executors;
            break;
        case 'DOCUMENTS':
            limit = LIMITS.FREE.DOCUMENTS;
            // documents count might not be in _count type yet if Prisma client wasn't regenerated, 
            // but we added the relation so it should be there. 
            // We might need to select it in the query above.
            // Let's assume the earlier query *did* select it.
            // Wait, looking at the view_file of limits.ts, it selects: 
            // select: { assets: true, beneficiaries: true, executors: true }
            // I need to update the query too.
            current = (counts as any).documents || 0;
            break;
    }

    if (current >= limit) {
        return {
            allowed: false,
            error: `Free Allowed limit reached (${limit}). Upgrade to Premium for unlimited access.` as const,
            code: 'LIMIT_REACHED'
        };
    }

    return { allowed: true };
}
