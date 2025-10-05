"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user has completed profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferred_nickname')
          .eq('id', user.id)
          .single();

        if (profile?.preferred_nickname) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding/profile');
        }
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl border-primary/30 shadow-2xl">
        <CardHeader className="text-center space-y-6 pt-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold merri-text">MerriMates</h1>
            <p className="text-2xl merri-text/80 font-light">
              Connect & Learn Through Hobbies
            </p>
          </div>
        </CardHeader>
        <CardContent className="pb-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <p className="text-lg text-center merri-text/70">
              Form meaningful connections by teaching each other hobbies. 
              Connect with someone who wants to learn guitar while you want to learn fishing, 
              and exchange skills!
            </p>

            <div className="grid md:grid-cols-3 gap-6 my-12">
              <div className="text-center space-y-2">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="font-semibold merri-text">160+ Hobbies</h3>
                <p className="text-sm merri-text/60">From creative arts to athletics</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl mb-2">🤝</div>
                <h3 className="font-semibold merri-text">Skill Exchange</h3>
                <p className="text-sm merri-text/60">Teach what you know, learn what you want</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl mb-2">💬</div>
                <h3 className="font-semibold merri-text">Connect & Chat</h3>
                <p className="text-sm merri-text/60">Message and meet up with friends</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/sign-up" className="flex-1 sm:flex-initial">
                <Button 
                  className="w-full merri-tab-bg hover:bg-primary/90 merri-text font-semibold text-lg py-6 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login" className="flex-1 sm:flex-initial">
                <Button 
                  variant="outline"
                  className="w-full border-2 border-primary/30 merri-text hover:bg-primary/10 font-semibold text-lg py-6 px-8 rounded-xl"
                >
                  Login
                </Button>
              </Link>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm merri-text/60 italic">
                "Because fuck Skillshare, our project makes people happy!" 🦛🐊
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
