import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Shield, FileText, Users, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block text-xl text-primary">Beqst</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
              <Link href="/pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
              <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">About</Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Add search or other controls here */}
            </div>
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <Link
              href="https://twitter.com"
              className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
              target="_blank"
            >
              Follow along on Twitter
            </Link>
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
              Your Digital Legacy, <span className="text-primary">Secured.</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Beqst is the comprehensive digital estate planning platform for the UK. Organize your assets, create your will, and protect your family's future in one secure location.
            </p>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg" className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start for Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="h-11 px-8">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 rounded-3xl">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Everything you need
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Manage your entire estate from a single, secure dashboard.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Bank-Grade Security</CardTitle>
                <CardDescription>
                  Your data is encrypted with AES-256 and stored securely in the UK.
                </CardDescription>
              </CardHeader>
              <CardContent>
                We prioritize your privacy and security above all else.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Smart Will Creation</CardTitle>
                <CardDescription>
                  Create a legally valid will in minutes with our guided wizard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Compliant with the Wills Act 1837 and updated for modern assets.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Executor Tools</CardTitle>
                <CardDescription>
                  Give your executors the roadmap they need to manage your estate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                Reduce probate time and stress for your loved ones.
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="open-source" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Ready to take control?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Beqst is free to start. Organize up to 5 assets and create your digital vault today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-11 px-8 bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Shield className="h-6 w-6 text-primary" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by Beqst Ltd. The source code is available on <a href="#" className="font-medium underline underline-offset-4">GitHub</a>.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
