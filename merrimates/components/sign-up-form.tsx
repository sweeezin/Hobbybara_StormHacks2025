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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateUsername = (value: string): boolean => {
    if (value.length > 20) return false;
    return /^[a-zA-Z0-9_]+$/.test(value);
  };

  const validatePassword = (value: string): boolean => {
    if (value.length < 8 || value.length > 20) return false;
    return /\d/.test(value); // Must contain at least one number
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate username
      if (!validateUsername(username)) {
        throw new Error("Username must be 1-20 characters and contain only letters, numbers, and underscores");
      }

      // Validate password
      if (!validatePassword(password)) {
        throw new Error("Password must be 8-20 characters and include at least one number");
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const supabase = createClient();

      // Check if username already exists (case-insensitive)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', username)
        .single();

      if (existingProfile) {
        throw new Error("Username already taken");
      }

      // Sign up with email and password
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (signUpError) throw signUpError;

      if (!authData.user) {
        throw new Error("Failed to create account");
      }

      // Create profile with username
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          username: username.toLowerCase(),
          display_username: username,
          phone: phone || null,
          // These will be filled in during onboarding
          preferred_nickname: '',
          age: 0,
          pronouns: '',
          city: '',
          country: '',
          personality_type: 'extrovert',
          looking_for_type: 'extrovert',
        });

      if (profileError) throw profileError;

      // Redirect to onboarding
      router.push("/onboarding/profile");
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
          <CardTitle className="text-4xl font-bold merri-text mb-2">Create Account</CardTitle>
          <CardDescription className="text-lg merri-text/80">
            Join MerriMates to find new friends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username" className="merri-text font-semibold">
                  Username <span className="text-red-300">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                  maxLength={20}
                />
                <p className="text-xs merri-text/60">Max 20 characters, not case-sensitive</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="merri-text font-semibold">
                  Email <span className="text-red-300">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone" className="merri-text font-semibold">
                  Phone (Optional)
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="merri-text font-semibold">
                  Password <span className="text-red-300">*</span>
                </Label>
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
                <p className="text-xs merri-text/60">8-20 characters, must include one number</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="merri-text font-semibold">
                  Confirm Password <span className="text-red-300">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm merri-text/80">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="merri-text font-semibold underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
