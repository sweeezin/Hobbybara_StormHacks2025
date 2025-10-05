"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Profile, Friendship } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  SearchIcon, 
  UserIcon, 
  MessageSquareIcon, 
  UsersIcon, 
  SettingsIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Get friends
      const { data: friendsData } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:friend_id (
            id,
            display_username,
            preferred_nickname,
            profile_picture_url
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (friendsData) {
        setFriends(friendsData as any);
      }

      setIsLoading(false);
    };

    loadData();
  }, [router]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl merri-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Navigation */}
      <div
        className={`${
          menuOpen ? "w-64" : "w-16"
        } merri-tab-bg transition-all duration-300 flex flex-col border-r border-primary/30`}
      >
        <div className="p-4 flex items-center justify-between">
          {menuOpen && <h2 className="text-2xl font-bold merri-text">MerriMates</h2>}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
          >
            {menuOpen ? <XIcon className="w-6 h-6 merri-text" /> : <MenuIcon className="w-6 h-6 merri-text" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => router.push("/profile")}
            className="w-full flex items-center gap-3 p-3 hover:bg-primary/20 rounded-lg transition-colors merri-text"
          >
            <UserIcon className="w-6 h-6" />
            {menuOpen && <span>Profile</span>}
          </button>

          <button
            onClick={() => router.push("/messages")}
            className="w-full flex items-center gap-3 p-3 hover:bg-primary/20 rounded-lg transition-colors merri-text"
          >
            <MessageSquareIcon className="w-6 h-6" />
            {menuOpen && <span>Messages</span>}
          </button>

          <button
            onClick={() => router.push("/friends")}
            className="w-full flex items-center gap-3 p-3 hover:bg-primary/20 rounded-lg transition-colors merri-text"
          >
            <UsersIcon className="w-6 h-6" />
            {menuOpen && <span>Friends</span>}
          </button>

          <button
            onClick={() => router.push("/settings")}
            className="w-full flex items-center gap-3 p-3 hover:bg-primary/20 rounded-lg transition-colors merri-text"
          >
            <SettingsIcon className="w-6 h-6" />
            {menuOpen && <span>Settings</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-primary/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 hover:bg-red-900/20 rounded-lg transition-colors merri-text"
          >
            <LogOutIcon className="w-6 h-6" />
            {menuOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Message */}
          <div>
            <h1 className="text-4xl font-bold merri-text mb-2">
              Welcome back, {profile?.preferred_nickname}!
            </h1>
            <p className="text-lg merri-text/70">Find new friends and learn new hobbies</p>
          </div>

          {/* Search Bar */}
          <Card className="border-primary/30">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Let's find some new friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-card/50 border-primary/30 merri-text placeholder:text-foreground/40"
                />
                <Button
                  onClick={handleSearch}
                  className="merri-tab-bg hover:bg-primary/90 merri-text px-6"
                >
                  <SearchIcon className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Friends List */}
          <Card className="border-primary/30">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold merri-text mb-4">Your Friends</h2>
              
              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <UsersIcon className="w-16 h-16 mx-auto merri-text/40 mb-4" />
                  <p className="text-lg merri-text/60">Let's find some new friends!</p>
                  <Button
                    onClick={() => router.push("/search")}
                    className="mt-4 merri-tab-bg hover:bg-primary/90 merri-text"
                  >
                    Start Searching
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friendship) => (
                    <button
                      key={friendship.id}
                      onClick={() => router.push(`/profile/${friendship.friend_id}`)}
                      className="flex items-center gap-4 p-4 bg-card/50 border border-primary/30 rounded-xl hover:border-primary/50 transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-full merri-tab-bg flex items-center justify-center">
                        <UserIcon className="w-6 h-6 merri-text" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold merri-text">
                          {(friendship.friend as any)?.display_username}
                        </h3>
                        <p className="text-sm merri-text/70">
                          {(friendship.friend as any)?.preferred_nickname}
                        </p>
                      </div>
                      <MessageSquareIcon className="w-5 h-5 merri-text/40" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
