import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SecurityView } from "./security-view";
import { redirect } from "next/navigation";

export default async function SecurityPage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { twoFactorEnabled: true },
    });

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account security settings.
                </p>
            </div>
            <div className="border-t pt-6">
                <SecurityView isEnabled={user.twoFactorEnabled} />
            </div>
        </div>
    );
}
