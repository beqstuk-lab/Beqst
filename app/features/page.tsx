import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Shield, FileText, Users, Lock, Zap, Smartphone } from "lucide-react";

export default function FeaturesPage() {
    const features = [
        {
            icon: <Shield className="h-10 w-10 text-primary" />,
            title: "Bank-Grade Security",
            description: "AES-256 encryption for all data at rest. Your sensitive information is only accessible by you and your designated executors."
        },
        {
            icon: <FileText className="h-10 w-10 text-primary" />,
            title: "Smart Will Generation",
            description: "Create a legally valid will in minutes. Our wizard guides you through every step, ensuring nothing is missed."
        },
        {
            icon: <Users className="h-10 w-10 text-primary" />,
            title: "Executor Management",
            description: "Appoint and manage executors. Provide them with the specific instructions and access they need."
        },
        {
            icon: <Lock className="h-10 w-10 text-primary" />,
            title: "Digital Vault",
            description: "Securely store important documents like insurance policies, deeds, and pension statements in one place."
        },
        {
            icon: <Zap className="h-10 w-10 text-primary" />,
            title: "Asset Discovery",
            description: "Link your bank accounts (via Open Banking) to automatically keep your asset register up to date."
        },
        {
            icon: <Smartphone className="h-10 w-10 text-primary" />,
            title: "Mobile First",
            description: "Manage your estate on the go. Beqst is fully optimized for all devices."
        }
    ];

    return (
        <div className="container mx-auto py-16 px-4">
            <Link href="/">
                <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
            </Link>

            <div className="mb-16 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Features</h1>
                <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                    Everything you need to organize, protect, and pass on your legacy.
                </p>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <div key={index} className="flex flex-col items-start">
                        <div className="mb-4 rounded-lg bg-primary/10 p-3">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                ))}
            </div>

            <div className="mt-20 text-center">
                <Link href="/signup">
                    <Button size="lg" className="h-11 px-8">
                        Get Started for Free
                    </Button>
                </Link>
            </div>
        </div>
    );
}
