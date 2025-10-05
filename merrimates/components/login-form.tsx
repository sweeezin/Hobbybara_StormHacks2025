"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/username-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Redirect based on profile completion status
      router.push(data.redirectTo);
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-primary/30 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold merri-text mb-2">MerriMates</CardTitle>
          <CardDescription className="text-lg merri-text/80">
            Login to connect with friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username" className="merri-text font-semibold">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                  maxLength={20}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="merri-text font-semibold">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm merri-text/80 hover:merri-text underline-offset-4 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                  minLength={8}
                  maxLength={20}
                />
              </div>
              {error && <p className="text-sm text-red-300 bg-red-900/20 p-3 rounded-lg">{error}</p>}
              <Button 
                type="submit" 
                className="w-full merri-tab-bg hover:bg-primary/90 merri-text font-semibold text-lg py-6 rounded-xl transition-all shadow-lg hover:shadow-xl" 
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm merri-text/80">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="merri-text font-semibold underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
