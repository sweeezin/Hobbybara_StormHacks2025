"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PRONOUN_OPTIONS } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    preferred_nickname: "",
    age: "",
    pronouns: "",
    customPronouns: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
      } else {
        setUserId(user.id);
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const age = parseInt(formData.age);
      
      // Age validation with fun messages
      if (age < 15) {
        setError("🥚 Oops! You're too young. Let us put you back in the egg!");
        setTimeout(() => {
          setFormData({ ...formData, age: "" });
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }
      
      if (age > 116) {
        setError("🦖 Okay dinosaur, we don't know how you survived that asteroid, but we're sending you back!");
        setTimeout(() => {
          setFormData({ ...formData, age: "" });
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      
      // Store data in localStorage for now
      const onboardingData = {
        preferred_nickname: formData.preferred_nickname,
        age: age,
        pronouns: formData.pronouns === 'other' ? formData.customPronouns : formData.pronouns,
        city: formData.city,
        country: formData.country,
      };
      
      localStorage.setItem('onboarding_profile', JSON.stringify(onboardingData));
      
      // Move to next page
      router.push("/onboarding/hobbies");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-primary/30 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold merri-text mb-2">Create Your Profile</CardTitle>
          <CardDescription className="text-lg merri-text/80">
            Tell us about yourself
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="nickname" className="merri-text font-semibold">
                Preferred Nickname <span className="text-red-300">*</span>
              </Label>
              <Input
                id="nickname"
                type="text"
                placeholder="What should we call you?"
                required
                value={formData.preferred_nickname}
                onChange={(e) => setFormData({ ...formData, preferred_nickname: e.target.value })}
                className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="age" className="merri-text font-semibold">
                Age <span className="text-red-300">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                required
                min="15"
                max="116"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
              />
            </div>

            <div className="grid gap-2">
              <Label className="merri-text font-semibold">
                Pronouns <span className="text-red-300">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {PRONOUN_OPTIONS.map((pronoun) => (
                  <button
                    key={pronoun}
                    type="button"
                    onClick={() => setFormData({ ...formData, pronouns: pronoun })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.pronouns === pronoun
                        ? 'merri-tab-bg border-primary merri-text'
                        : 'bg-card/50 border-primary/30 merri-text/70 hover:border-primary/50'
                    }`}
                  >
                    {pronoun}
                  </button>
                ))}
              </div>
              {formData.pronouns === 'other' && (
                <Input
                  type="text"
                  placeholder="Please specify your pronouns"
                  required
                  value={formData.customPronouns}
                  onChange={(e) => setFormData({ ...formData, customPronouns: e.target.value })}
                  className="mt-2 bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city" className="merri-text font-semibold">
                  City <span className="text-red-300">*</span>
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Your city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="country" className="merri-text font-semibold">
                  Country <span className="text-red-300">*</span>
                </Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Your country"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                />
              </div>
            </div>

            {error && (
              <div className="text-center p-4 bg-red-900/20 border border-red-300/30 rounded-lg">
                <p className="text-lg merri-text">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full merri-tab-bg hover:bg-primary/90 merri-text font-semibold text-lg py-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
              disabled={isLoading || !formData.pronouns}
            >
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
