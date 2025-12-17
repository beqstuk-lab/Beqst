'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
// We import signIn from next-auth/react client-side
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, Suspense } from "react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            // Use standard NextAuth signIn
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password");
            } else {
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mx-auto w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                {registered && (
                    <div className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        Account created! Please log in.
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        {error && (
                            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <Button type="button" variant="outline" className="w-full">
                            Login with Google
                        </Button>
                    </div>
                </form>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
