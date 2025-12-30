import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.email) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                    Update your personal information.
                </p>
            </div>
            <div className="border-t pt-6">
                {/* Pass serialized user object to client component */}
                <ProfileForm
                    initialData={{
                        name: user.name || "",
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        email: user.email || ""
                    }}
                />
            </div>
        </div>
    );
}
