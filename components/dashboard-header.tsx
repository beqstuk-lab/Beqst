'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
    const pathname = usePathname()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const links = [
        { href: "/dashboard", label: "Overview" },
        { href: "/assets", label: "Assets" },
        { href: "/liabilities", label: "Liabilities" },
        { href: "/beneficiaries", label: "Beneficiaries" },
        { href: "/executors", label: "Executors" },
        { href: "/documents", label: "Documents" },
    ]

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
            <Link className="flex items-center gap-2 font-bold text-lg text-primary mr-6" href="/dashboard">
                Beqst
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 text-sm font-medium">
                {links.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`transition-colors hover:text-foreground ${pathname === link.href ? "text-foreground" : "text-muted-foreground"}`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="ml-auto flex items-center gap-2">
                {/* Settings Link */}
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/settings">
                        <Settings className="h-5 w-5" />
                    </Link>
                </Button>

                <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
                    <Link href="/">Sign Out</Link>
                </Button>

                {/* Mobile Menu Toggle */}
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="absolute top-14 left-0 w-full bg-background border-b md:hidden shadow-lg slide-in-from-top-2 animate-in fade-in z-40">
                    <nav className="flex flex-col p-4 space-y-4">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium ${pathname === link.href ? "text-foreground" : "text-muted-foreground"}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/" className="text-sm font-medium text-destructive">Sign Out</Link>
                    </nav>
                </div>
            )}
        </header>
    )
}
