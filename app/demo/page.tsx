import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DemoPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Demo</h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                The interactive demo is coming soon. Please sign up to be notified when it's ready.
            </p>
            <div className="flex gap-4">
                <Link href="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button>Sign Up</Button>
                </Link>
            </div>
        </div>
    );
}
