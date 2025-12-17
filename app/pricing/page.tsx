import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Check, ArrowLeft } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <Link href="/">
                <Button variant="ghost" className="mb-8 pl-0 hover:bg-transparent hover:text-primary">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                </Button>
            </Link>

            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Start for free, upgrade when you need more.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Free</CardTitle>
                        <CardDescription>For getting started</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-3xl font-bold mb-6">£0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 1 Estate</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Up to 5 Assets</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 100MB Storage</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href="/signup" className="w-full">
                            <Button className="w-full" variant="outline">Get Started</Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col border-primary shadow-lg relative">
                    <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">
                        Most Popular
                    </div>
                    <CardHeader>
                        <CardTitle>Basic</CardTitle>
                        <CardDescription>For complete peace of mind</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-3xl font-bold mb-6">£9.99<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Unlimited Assets</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Valid Will Generation</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 2GB Secure Storage</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> OCR Document Processing</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href="/signup" className="w-full">
                            <Button className="w-full">Start Free Trial</Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Premium</CardTitle>
                        <CardDescription>For simple & complex estates</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-3xl font-bold mb-6">£24.99<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Everything in Basic</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> AI Document Analysis</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> Priority Support</li>
                            <li className="flex items-center"><Check className="mr-2 h-4 w-4 text-primary" /> 10GB Secure Storage</li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Link href="/signup" className="w-full">
                            <Button className="w-full" variant="outline">Contact Sales</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
