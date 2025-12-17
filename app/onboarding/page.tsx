'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

type AssessmentAnswers = {
    estateValue: number;
    properties: number;
    business: number;
    international: number;
    beneficiaries: number;
};

type ExtractedData = {
    executors: string[];
    beneficiaries: string[];
    assets: string[];
};

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [assessment, setAssessment] = useState<AssessmentAnswers>({
        estateValue: 0,
        properties: 0,
        business: 0,
        international: 0,
        beneficiaries: 0,
    });
    const [willFile, setWillFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
    const [personalInfo, setPersonalInfo] = useState({ name: "", dob: "" });
    const [isCreatingEstate, setIsCreatingEstate] = useState(false);

    const calculateScore = () => {
        return Object.values(assessment).reduce((sum, val) => sum + val, 0);
    };

    const getRecommendedTier = () => {
        const score = calculateScore();
        if (score >= 11) return { name: "Premium", price: "£39/month", features: ["Unlimited assets", "Priority support", "Legal review"] };
        if (score >= 6) return { name: "Complete", price: "£19/month", features: ["Up to 50 assets", "Email support", "Will generation"] };
        return { name: "Essential", price: "£9/month", features: ["Up to 10 assets", "Basic support", "Digital vault"] };
    };

    const handleFileUpload = useCallback(async (file: File) => {
        setWillFile(file);
        setIsUploading(true);

        // Simulate AI parsing (mock for now)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock extracted data
        setExtractedData({
            executors: ["Sarah Jones", "Michael Smith"],
            beneficiaries: ["Emma Wilson (Daughter)", "James Wilson (Son)", "Cancer Research UK (Charity)"],
            assets: ["123 Main Street, London (Property)", "Barclays Savings Account", "Vanguard ISA", "2019 BMW 3 Series"],
        });

        setIsUploading(false);
        setStep(4); // Move to review step
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type === "application/pdf") {
            handleFileUpload(file);
        }
    }, [handleFileUpload]);

    const handleCreateEstate = async () => {
        setIsCreatingEstate(true);
        try {
            // Create estate via API
            const res = await fetch("/api/estates", { method: "GET" });
            if (res.ok) {
                // Save assessment score
                const score = calculateScore();
                const tier = getRecommendedTier();
                localStorage.setItem("beqst_assessment", JSON.stringify({ score, tier: tier.name }));

                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Failed to create estate:", error);
        } finally {
            setIsCreatingEstate(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Card className="w-full max-w-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                                <Sparkles className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">Welcome to Beqst</CardTitle>
                            <CardDescription>
                                Let&apos;s protect your legacy in just 10 minutes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span>Organize all your assets in one secure place</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span>Designate beneficiaries with clear allocations</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span>Keep your executors informed and prepared</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={() => setStep(2)}>
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                );

            case 2:
                return (
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>Tell us about your estate</CardTitle>
                            <CardDescription>This helps us recommend the right plan for you</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Approximate estate value?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: "Under £100k", value: 1 },
                                        { label: "£100k - £500k", value: 2 },
                                        { label: "£500k - £1M", value: 3 },
                                        { label: "Over £1M", value: 4 },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setAssessment({ ...assessment, estateValue: opt.value })}
                                            className={`rounded-lg border p-3 text-sm transition-colors ${assessment.estateValue === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Property ownership?</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: "None", value: 0 },
                                        { label: "1 property", value: 2 },
                                        { label: "2+ properties", value: 4 },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setAssessment({ ...assessment, properties: opt.value })}
                                            className={`rounded-lg border p-3 text-sm transition-colors ${assessment.properties === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Business ownership?</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: "No", value: 0 },
                                        { label: "Sole trader", value: 2 },
                                        { label: "Ltd company", value: 4 },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setAssessment({ ...assessment, business: opt.value })}
                                            className={`rounded-lg border p-3 text-sm transition-colors ${assessment.business === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Assets outside the UK?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { label: "No", value: 0 },
                                        { label: "Yes", value: 3 },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setAssessment({ ...assessment, international: opt.value })}
                                            className={`rounded-lg border p-3 text-sm transition-colors ${assessment.international === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-sm font-medium">Number of beneficiaries?</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { label: "1-2", value: 1 },
                                        { label: "3-5", value: 2 },
                                        { label: "6+", value: 3 },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setAssessment({ ...assessment, beneficiaries: opt.value })}
                                            className={`rounded-lg border p-3 text-sm transition-colors ${assessment.beneficiaries === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => setStep(3)}>
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                );

            case 3:
                return (
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>Do you have an existing will?</CardTitle>
                            <CardDescription>
                                Upload it and we&apos;ll extract your executors, beneficiaries, and assets automatically
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => document.getElementById("will-upload")?.click()}
                            >
                                {isUploading ? (
                                    <div className="space-y-3">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                                        <p className="text-sm text-muted-foreground">Analyzing your will...</p>
                                    </div>
                                ) : willFile ? (
                                    <div className="space-y-2">
                                        <FileText className="h-10 w-10 text-primary mx-auto" />
                                        <p className="font-medium">{willFile.name}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <Upload className="h-10 w-10 text-muted-foreground mx-auto" />
                                        <div>
                                            <p className="font-medium">Drop your will PDF here</p>
                                            <p className="text-sm text-muted-foreground">or click to browse</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    id="will-upload"
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-3">
                            <Button variant="outline" className="flex-1" onClick={() => setStep(5)}>
                                Skip for now
                            </Button>
                            {willFile && !isUploading && (
                                <Button className="flex-1" onClick={() => setStep(4)}>
                                    Review Extracted Data
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                );

            case 4:
                return (
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>We found the following in your will</CardTitle>
                            <CardDescription>
                                Review and confirm what to add to your estate
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {extractedData && (
                                <>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">EXECUTORS</h4>
                                        <div className="space-y-2">
                                            {extractedData.executors.map((name, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                                    <span>{name}</span>
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">BENEFICIARIES</h4>
                                        <div className="space-y-2">
                                            {extractedData.beneficiaries.map((name, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                                    <span>{name}</span>
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm text-muted-foreground">ASSETS MENTIONED</h4>
                                        <div className="space-y-2">
                                            {extractedData.assets.map((name, i) => (
                                                <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                                                    <span>{name}</span>
                                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={() => setStep(5)}>
                                Add All to My Estate
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                );

            case 5:
                const tier = getRecommendedTier();
                return (
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>Your recommended plan</CardTitle>
                            <CardDescription>Based on your estate complexity</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="rounded-lg border-2 border-primary p-6 text-center">
                                <div className="text-sm font-medium text-primary mb-1">RECOMMENDED</div>
                                <h3 className="text-2xl font-bold">{tier.name}</h3>
                                <div className="text-3xl font-bold mt-2">{tier.price}</div>
                                <div className="mt-4 space-y-2">
                                    {tier.features.map((feature, i) => (
                                        <div key={i} className="flex items-center justify-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4 text-center">
                                <p className="text-sm font-medium">Start your 14-day free trial</p>
                                <p className="text-xs text-muted-foreground mt-1">No credit card required</p>
                            </div>

                            <div className="space-y-3">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">Your full name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={personalInfo.name}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                        placeholder="John Smith"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="dob" className="text-sm font-medium">Date of birth</label>
                                    <input
                                        id="dob"
                                        type="date"
                                        value={personalInfo.dob}
                                        onChange={(e) => setPersonalInfo({ ...personalInfo, dob: e.target.value })}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handleCreateEstate}
                                disabled={isCreatingEstate || !personalInfo.name}
                            >
                                {isCreatingEstate ? "Creating your estate..." : "Start Free Trial"}
                            </Button>
                        </CardFooter>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-8">
            {/* Progress indicator */}
            <div className="w-full max-w-lg mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS - 1}</span>
                    <span className="text-sm text-muted-foreground">{Math.round((step / (TOTAL_STEPS - 1)) * 100)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(step / (TOTAL_STEPS - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {renderStep()}
        </div>
    );
}
