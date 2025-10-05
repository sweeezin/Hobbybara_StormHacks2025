"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hobby } from "@/lib/types";
import { CheckIcon } from "lucide-react";

export default function LearningPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [selectedLearning, setSelectedLearning] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Creative", "Athletic", "Mind/Body", "Nature", "Social", "Technical", "Relaxation"];

  useEffect(() => {
    const fetchHobbies = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('hobbies')
        .select('*')
        .order('name');
      
      if (data) {
        setHobbies(data);
      }
    };
    fetchHobbies();
  }, []);

  const filteredHobbies = selectedCategory === "All" 
    ? hobbies 
    : hobbies.filter(h => h.category === selectedCategory);

  const toggleHobby = (hobbyId: number) => {
    if (selectedLearning.includes(hobbyId)) {
      setSelectedLearning(selectedLearning.filter(id => id !== hobbyId));
    } else {
      if (selectedLearning.length < 10) {
        setSelectedLearning([...selectedLearning, hobbyId]);
      } else {
        setError("You can select a maximum of 10 hobbies to learn");
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedLearning.length === 0) {
      setError("Please select at least 1 hobby you want to learn");
      return;
    }

    setIsLoading(true);
    
    try {
      localStorage.setItem('onboarding_learning', JSON.stringify(selectedLearning));
      router.push("/onboarding/personality");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl border-primary/30 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold merri-text mb-2">What do you want to learn?</CardTitle>
          <CardDescription className="text-lg merri-text/80">
            Select 1-10 hobbies you want to learn from others
          </CardDescription>
          <div className="text-center mt-2">
            <span className="text-2xl font-bold merri-text">
              {selectedLearning.length} / 10 selected
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category
                    ? 'merri-tab-bg merri-text font-semibold'
                    : 'bg-card/50 border border-primary/30 merri-text/70 hover:border-primary/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Hobbies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
            {filteredHobbies.map((hobby) => (
              <button
                key={hobby.id}
                type="button"
                onClick={() => toggleHobby(hobby.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  selectedLearning.includes(hobby.id)
                    ? 'merri-tab-bg border-primary merri-text font-semibold'
                    : 'bg-card/50 border-primary/30 merri-text/70 hover:border-primary/50'
                }`}
              >
                {selectedLearning.includes(hobby.id) && (
                  <CheckIcon className="absolute top-2 right-2 w-5 h-5" />
                )}
                <span className="text-sm">{hobby.name}</span>
                <span className="block text-xs opacity-60 mt-1">{hobby.category}</span>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 text-center p-3 bg-red-900/20 border border-red-300/30 rounded-lg">
              <p className="text-sm merri-text">{error}</p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
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
              disabled={isLoading || selectedLearning.length === 0}
            >
              {isLoading ? "Saving..." : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
