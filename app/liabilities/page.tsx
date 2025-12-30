import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, CreditCard, Home, GraduationCap, Receipt, Trash2 } from "lucide-react"
import { LiabilityDeleteButton } from "./delete-button"

const LIABILITY_TYPE_CONFIG: Record<string, { label: string; icon: typeof CreditCard }> = {
    MORTGAGE: { label: "Mortgage", icon: Home },
    LOAN: { label: "Loan", icon: Receipt },
    CREDIT_CARD: { label: "Credit Card", icon: CreditCard },
    STUDENT_LOAN: { label: "Student Loan", icon: GraduationCap },
    TAX: { label: "Tax", icon: Receipt },
    OTHER: { label: "Other", icon: Receipt },
}

export default async function LiabilitiesPage() {
    const session = await auth()
    if (!session?.user?.email) {
        return <div className="p-8 text-center text-muted-foreground">Please sign in to view liabilities.</div>
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { estates: { include: { liabilities: true } } }
    })

    if (!user || user.estates.length === 0) {
        return <div className="p-8 text-center">No Estate Found</div>
    }

    const liabilities = user.estates[0].liabilities || []
    const totalDebt = liabilities.reduce((sum: number, l: { amount: number | null }) => sum + (Number(l.amount) || 0), 0)

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-GB", {
            style: "currency",
            currency: "GBP",
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardHeader />
            <main className="flex-1 p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Liabilities</h1>
                        <p className="text-muted-foreground">Track mortgages, loans, and other debts.</p>
                    </div>
                    <Button asChild>
                        <Link href="/liabilities/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Liability
                        </Link>
                    </Button>
                </div>

                {/* Total Debt Card */}
                <Card className="bg-gradient-to-r from-red-500/10 to-transparent border-red-500/20">
                    <CardContent className="pt-6">
                        <p className="text-sm font-medium text-muted-foreground">Total Liabilities</p>
                        <p className="text-3xl font-bold text-red-600">{formatCurrency(totalDebt)}</p>
                        <p className="text-sm text-muted-foreground">{liabilities.length} liabilit{liabilities.length !== 1 ? "ies" : "y"} tracked</p>
                    </CardContent>
                </Card>

                {/* Liabilities List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Liabilities</CardTitle>
                        <CardDescription>Debts and obligations that reduce your net worth</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {liabilities.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No liabilities added yet</p>
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/liabilities/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Your First Liability
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {liabilities.map((liability: { id: string; name: string; type: string; amount: unknown; creditor: string | null }) => {
                                    const config = LIABILITY_TYPE_CONFIG[liability.type] || LIABILITY_TYPE_CONFIG.OTHER
                                    const Icon = config.icon

                                    return (
                                        <div
                                            key={liability.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-red-100 p-2 rounded-lg">
                                                    <Icon className="h-5 w-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{liability.name}</div>
                                                    <div className="text-sm text-muted-foreground flex gap-2">
                                                        <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-xs">
                                                            {config.label}
                                                        </span>
                                                        {liability.creditor && <span>• {liability.creditor}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold text-red-600">
                                                    {formatCurrency(Number(liability.amount) || 0)}
                                                </span>
                                                <LiabilityDeleteButton id={liability.id} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
