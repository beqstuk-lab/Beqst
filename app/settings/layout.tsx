import Link from "next/link";
import { User, Shield, CreditCard, Settings } from "lucide-react";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
            <aside className="w-full md:w-64 bg-background border-r min-h-[calc(100vh-4rem)]">
                <div className="p-6">
                    <h2 className="text-lg font-semibold tracking-tight mb-4">Settings</h2>
                    <nav className="space-y-2">
                        <Link
                            href="/settings/profile"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <User className="h-4 w-4" />
                            Profile
                        </Link>
                        <Link
                            href="/settings/security"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <Shield className="h-4 w-4" />
                            Security
                        </Link>
                    </nav>
                </div>
            </aside>
            <main className="flex-1 p-6 md:p-10">
                <div className="mx-auto max-w-4xl space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
