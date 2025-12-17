import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <Link href="/">
                <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
            </Link>

            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-4xl font-bold tracking-tight">About Beqst</h1>
                <div className="space-y-6 text-lg text-muted-foreground">
                    <p>
                        Beqst is a mission-driven company dedicated to solving the complex challenges of estate planning in the UK.
                    </p>
                    <p>
                        Our founder recognized that while we live our lives digitally, the process of passing on our legacy remains stuck in the past—paper-based, expensive, and confusing.
                    </p>
                    <p>
                        We're building the future of digital inheritance, ensuring that your assets, memories, and wishes are preserved and passed on securely to the people you love.
                    </p>
                </div>
            </div>
        </div>
    );
}
