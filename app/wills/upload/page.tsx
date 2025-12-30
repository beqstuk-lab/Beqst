"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Check, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { parseWill, importEstateData } from "./actions";
import { DashboardHeader } from "@/components/dashboard-header";
import { useRouter } from "next/navigation";

export default function UploadWillPage() {
    const [step, setStep] = useState<"UPLOAD" | "REVIEW" | "SUCCESS">("UPLOAD");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, startAnalyzing] = useTransition();
    const [isImporting, startImporting] = useTransition();

    // Extracted Data State
    const [detectedData, setDetectedData] = useState<{ assets: any[], beneficiaries: any[] }>({ assets: [], beneficiaries: [] });
    const [resultStats, setResultStats] = useState<any>(null);

    const router = useRouter();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleAnalyze = () => {
        if (!file) return;

        startAnalyzing(async () => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await parseWill(formData);
            if (res.success && res.data) {
                setDetectedData(res.data);
                setStep("REVIEW");
            } else {
                alert("Analysis failed. Please try again.");
            }
        });
    };

    const handleImport = () => {
        startImporting(async () => {
            // Filter only selected items
            const dataToImport = {
                assets: detectedData.assets.filter(a => a.selected),
                beneficiaries: detectedData.beneficiaries.filter(b => b.selected),
                saveToDocuments: true,
                fileName: file?.name
            };

            const res = await importEstateData(dataToImport);
            if (res.success) {
                setResultStats(res.stats);
                setStep("SUCCESS");
            } else {
                alert("Import failed.");
            }
        });
    };

    // Helper to toggle selection
    const toggleAsset = (idx: number) => {
        const newAssets = [...detectedData.assets];
        newAssets[idx].selected = !newAssets[idx].selected;
        setDetectedData({ ...detectedData, assets: newAssets });
    };

    const toggleBen = (idx: number) => {
        const newBens = [...detectedData.beneficiaries];
        newBens[idx].selected = !newBens[idx].selected;
        setDetectedData({ ...detectedData, beneficiaries: newBens });
    };

    // Helper to update value (simple edit)
    const updateAssetValue = (idx: number, val: string) => {
        const newAssets = [...detectedData.assets];
        newAssets[idx].value = parseFloat(val);
        setDetectedData({ ...detectedData, assets: newAssets });
    };

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />

            <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Upload Your Will</h1>
                        <p className="text-muted-foreground">
                            Upload your existing PDF will. Our AI will analyze it and automatically populate your estate.
                        </p>
                    </div>

                    {step === "UPLOAD" && (
                        <Card className="border-2 border-dashed">
                            <CardContent className="pt-6">
                                <div
                                    className={`flex flex-col items-center justify-center p-12 text-center transition-colors ${isDragging ? "bg-primary/5" : ""
                                        }`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        {file ? file.name : "Drag and drop your PDF here"}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        or click to browse from your computer
                                    </p>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        id="file-upload"
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
                                            Select File
                                        </Button>
                                        {file && (
                                            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                                                {isAnalyzing ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Analyzing...
                                                    </>
                                                ) : (
                                                    "Upload & Analyze"
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === "REVIEW" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Review Detected Data</CardTitle>
                                <CardDescription>
                                    We found the following items. Please review and uncheck any you don&apos;t want to import.
                                    You can also edit values directly.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Assets Review */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        Assets Found ({detectedData.assets.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {detectedData.assets.map((asset, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/20">
                                                <input
                                                    type="checkbox"
                                                    checked={asset.selected}
                                                    onChange={() => toggleAsset(i)}
                                                    className="h-4 w-4"
                                                />
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <div className="font-medium">{asset.name}</div>
                                                    <input
                                                        type="number"
                                                        className="border rounded px-2 py-1 h-8 text-sm"
                                                        value={asset.value}
                                                        onChange={(e) => updateAssetValue(i, e.target.value)}
                                                    />
                                                </div>
                                                <div className="text-xs px-2 py-1 bg-muted rounded">
                                                    {asset.type.replace("_", " ")}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Beneficiaries Review */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        Beneficiaries Found ({detectedData.beneficiaries.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {detectedData.beneficiaries.map((ben, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/20">
                                                <input
                                                    type="checkbox"
                                                    checked={ben.selected}
                                                    onChange={() => toggleBen(i)}
                                                    className="h-4 w-4"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium">{ben.name}</div>
                                                    <div className="text-sm text-muted-foreground">{ben.relationship}</div>
                                                </div>
                                                <div className="text-xs px-2 py-1 bg-muted rounded">
                                                    {ben.type}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full" onClick={handleImport} disabled={isImporting}>
                                    {isImporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm & Import Selected"}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {step === "SUCCESS" && (
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-green-700">
                                    <Check className="h-6 w-6" />
                                    <CardTitle>Import Complete!</CardTitle>
                                </div>
                                <CardDescription className="text-green-600">
                                    Successfully added items to your estate.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="text-sm text-muted-foreground">Assets Imported</div>
                                        <div className="text-2xl font-bold">{resultStats?.assets}</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <div className="text-sm text-muted-foreground">Beneficiaries Imported</div>
                                        <div className="text-2xl font-bold">{resultStats?.beneficiaries}</div>
                                    </div>
                                </div>
                                <Button className="w-full" size="lg" onClick={() => router.push("/dashboard")}>
                                    View My Estate
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
