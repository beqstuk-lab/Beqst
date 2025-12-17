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
        <section className="space-y-6 pb-12 pt-16 md:pb-24 md:pt-32 lg:py-32">
          <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr] lg:gap-16 items-center">
            <div className="flex flex-col items-start gap-10 text-left">
              <Link
                href="https://twitter.com"
                className="rounded-full bg-primary/10 px-6 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                target="_blank"
              >
                Follow along on Twitter
              </Link>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-left leading-[1.1]">
                Your Digital Legacy, <br className="hidden md:block" /> <span className="text-primary">Secured.</span>
              </h1>
              <p className="max-w-[38rem] leading-relaxed text-muted-foreground sm:text-lg sm:leading-8 text-left text-lg">
                Beqst is the comprehensive digital estate planning platform for the UK. Organize your assets, create your will, and protect your family's future in one secure location.
              </p>

              <div className="flex flex-col gap-6 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="h-14 w-full sm:w-auto px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-xl shadow-primary/25 rounded-xl font-semibold">
                      Secure My Legacy <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/demo">
                    <Button variant="outline" size="lg" className="h-14 w-full sm:w-auto px-8 border-2 border-primary/20 text-primary hover:bg-primary/5 text-lg rounded-xl font-semibold cursor-pointer">
                      Explore Solutions
                    </Button>
                  </Link>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground/70 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-green-600 fill-green-600/20" /> Bank-Level Security
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center text-[10px]">L</div> Set Up in Minutes
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" /> UK-Focused
                  </div>
                </div>
              </div>

            </div>
            {/* Right Column: Key Visual / Dashboard Mockup */}
            <div className="flex items-center justify-center md:justify-end relative">
              <div className="relative aspect-[4/3] w-full max-w-[500px] lg:max-w-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-primary/10">
                <img
                  src="/hero-human.png"
                  alt="Planning your digital legacy"
                  className="w-full h-full object-cover"
                />
                {/* Floating 'Powered by AI' Badge */}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-semibold text-primary">AI Guidance</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-12 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">
              Everything you need
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Manage your entire estate from a single, secure dashboard.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Bank-Grade Security</CardTitle>
                <CardDescription className="text-base">
                  Your data is encrypted with AES-256 and stored securely in the UK.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">We prioritize your privacy and security above all else.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Will Creation</CardTitle>
                <CardDescription className="text-base">
                  Create a legally valid will in minutes with our guided wizard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Compliant with the Wills Act 1837 and updated for modern assets.</p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-xl transition-all duration-300 border-none bg-white">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Executor Tools</CardTitle>
                <CardDescription className="text-base">
                  Give your executors the roadmap they need to manage your estate.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Reduce probate time and stress for your loved ones.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="cta" className="bg-primary/5 py-16 md:py-24">
          <div className="container flex max-w-[58rem] flex-col items-center justify-center gap-6 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold text-foreground">
              Ready to take control?
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 mb-4">
              Beqst is free to start. Organize up to 5 assets and create your digital vault today.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-lg shadow-xl shadow-primary/20 rounded-lg">
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
