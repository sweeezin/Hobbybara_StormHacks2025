import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user ID from profiles table using case-insensitive username match
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', username)
      .single();

    if (profileError || !profileData) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Get email from auth.users via RPC function (needs to be created in Supabase)
    // For now, we'll fetch it differently
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    const user = users?.find(u => u.id === profileData.id);
    
    if (!user?.email) {
      return NextResponse.json(
        { error: "User account configuration error" },
        { status: 500 }
      );
    }

    // Attempt to sign in with email and password
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Check if profile is complete
    const { data: profile } = await supabase
      .from('profiles')
      .select('preferred_nickname')
      .eq('id', profileData.id)
      .single();

    return NextResponse.json({
      success: true,
      profileComplete: !!profile?.preferred_nickname,
      redirectTo: profile?.preferred_nickname ? '/dashboard' : '/onboarding/profile'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
