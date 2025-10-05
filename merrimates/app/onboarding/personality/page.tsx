"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersIcon, UserIcon } from "lucide-react";

export default function PersonalityPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  
  const [formData, setFormData] = useState({
    personalityType: "",
    lookingForType: "",
  });

  const handleSubmit = async () => {
    if (!formData.personalityType || !formData.lookingForType) {
      setError("Please select both options");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Get all onboarding data from localStorage
      const profileData = JSON.parse(localStorage.getItem('onboarding_profile') || '{}');
      const hobbiesData = JSON.parse(localStorage.getItem('onboarding_hobbies') || '[]');
      const learningData = JSON.parse(localStorage.getItem('onboarding_learning') || '[]');

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          preferred_nickname: profileData.preferred_nickname,
          age: profileData.age,
          pronouns: profileData.pronouns,
          city: profileData.city,
          country: profileData.country,
          personality_type: formData.personalityType,
          looking_for_type: formData.lookingForType,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Insert user hobbies
      const hobbyInserts = hobbiesData.map((hobbyId: number) => ({
        user_id: user.id,
        hobby_id: hobbyId,
      }));

      if (hobbyInserts.length > 0) {
        const { error: hobbiesError } = await supabase
          .from('user_hobbies')
          .insert(hobbyInserts);

        if (hobbiesError) throw hobbiesError;
      }

      // Insert learning goals
      const learningInserts = learningData.map((hobbyId: number) => ({
        user_id: user.id,
        hobby_id: hobbyId,
      }));

      if (learningInserts.length > 0) {
        const { error: learningError } = await supabase
          .from('user_learning_goals')
          .insert(learningInserts);

        if (learningError) throw learningError;
      }

      // Clear localStorage
      localStorage.removeItem('onboarding_profile');
      localStorage.removeItem('onboarding_hobbies');
      localStorage.removeItem('onboarding_learning');

      // Show welcome message
      setShowWelcome(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl border-primary/30 shadow-2xl animate-fade-in">
          <CardContent className="text-center py-16">
            <h1 className="text-5xl font-bold merri-text mb-4">Welcome to MerriMates! 🎉</h1>
            <p className="text-2xl merri-text/80">Let's find some new friends...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-primary/30 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold merri-text mb-2">One Last Thing!</CardTitle>
          <CardDescription className="text-lg merri-text/80">
            Tell us about your social style
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold merri-text mb-4">I am an...</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, personalityType: 'extrovert' })}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.personalityType === 'extrovert'
                    ? 'merri-tab-bg border-primary merri-text'
                    : 'bg-card/50 border-primary/30 merri-text/70 hover:border-primary/50'
                }`}
              >
                <UsersIcon className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-xl font-semibold">Extrovert</h4>
                <p className="text-sm opacity-75 mt-2">I love being around people!</p>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, personalityType: 'introvert' })}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.personalityType === 'introvert'
                    ? 'merri-tab-bg border-primary merri-text'
                    : 'bg-card/50 border-primary/30 merri-text/70 hover:border-primary/50'
                }`}
              >
                <UserIcon className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-xl font-semibold">Introvert</h4>
                <p className="text-sm opacity-75 mt-2">I prefer smaller groups</p>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold merri-text mb-4">I'm looking for...</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, lookingForType: 'extrovert' })}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.lookingForType === 'extrovert'
                    ? 'merri-tab-bg border-primary merri-text'
                    : 'bg-card/50 border-primary/30 merri-text/70 hover:border-primary/50'
                }`}
              >
                <UsersIcon className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-xl font-semibold">Extroverts</h4>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, lookingForType: 'introvert' })}
                className={`p-6 rounded-xl border-2 transition-all ${
                  formData.lookingForType === 'introvert'
                    ? 'merri-tab-bg border-primary merri-text'
                    : 'bg-card/50 border-primary/30 merri-text/70 hover:border-primary/50'
                }`}
              >
                <UserIcon className="w-12 h-12 mx-auto mb-3" />
                <h4 className="text-xl font-semibold">Introverts</h4>
              </button>
            </div>
          </div>

          {error && (
            <div className="text-center p-3 bg-red-900/20 border border-red-300/30 rounded-lg">
              <p className="text-sm merri-text">{error}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 border-primary/30 merri-text hover:bg-primary/10"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="flex-1 merri-tab-bg hover:bg-primary/90 merri-text font-semibold text-lg py-6 rounded-xl transition-all shadow-lg hover:shadow-xl"
              disabled={isLoading || !formData.personalityType || !formData.lookingForType}
            >
              {isLoading ? "Finishing Up..." : "Complete Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
