# MerriMates Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd merrimates
npm install
```

### Step 2: Create Supabase Project
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Wait for project to finish setting up (~2 minutes)

### Step 3: Get Your Supabase Keys
1. In your Supabase project, go to **Project Settings** (gear icon)
2. Click on **API** in the left sidebar
3. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 4: Create Environment File
Create a file named `.env.local` in the `merrimates` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Set Up Database
1. In Supabase dashboard, click **SQL Editor** (in left sidebar)
2. Open the file `merrimates/supabase/migrations/001_initial_schema.sql`
3. Copy ALL the content
4. Paste into Supabase SQL Editor
5. Click **RUN** button
6. Wait for "Success. No rows returned"

### Step 6: Configure Authentication
1. In Supabase, go to **Authentication** > **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000`
3. Add **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/onboarding/profile`

### Step 7: Run the App
```bash
npm run dev
```

Open http://localhost:3000 in your browser!

## ✅ What Should Work Now

- ✅ Sign up with username, email, password
- ✅ Login with username and password  
- ✅ 4-step onboarding process
- ✅ Dashboard with navigation
- ✅ Responsive design with custom colors

## 🔧 Troubleshooting

### "Failed to connect to database"
- Check your `.env.local` file has correct Supabase credentials
- Make sure there are no extra spaces in the values

### "No rows returned" after running SQL
- This is SUCCESS! It means the database was set up correctly

### TypeScript errors in VS Code
- These are type definition issues with React 19
- They don't affect functionality
- To fix: Run `npm install --save-dev @types/react@latest`

### Login not working
- Make sure you ran the database migration
- Check that the username exists in the profiles table
- Verify redirect URLs are set in Supabase Auth settings

### Page redirects to login immediately
- Clear your browser cache and cookies
- Check browser console for errors
- Verify Supabase Auth is properly configured

## 📝 Test the App

1. **Sign Up**: Create an account with username "testuser"
2. **Onboarding**: 
   - Enter nickname, age (between 15-116), pronouns, location
   - Select 1-10 hobbies you have
   - Select 1-10 hobbies you want to learn
   - Choose personality type
3. **Dashboard**: See your empty friends list
4. **Logout**: Click logout in sidebar

## 🎨 Customizing

- **Colors**: Edit `app/globals.css`
- **Font**: Change Google Fonts import in `globals.css`
- **Hobbies**: Edit the INSERT statements in the SQL migration

## 📱 What's Been Built

### ✅ Completed
- Authentication system (username-based)
- Sign up with validation
- 4-page onboarding flow
- Dashboard with collapsible navigation
- Database schema with all tables
- Custom MerriMates theme
- Responsive design

### 🚧 To Be Built (Outlined in requirements)
- Search page with filters
- User profile viewing
- Friend management (add/block/remove)
- Messaging system
- Settings page
- Account deletion

## 🔐 Security Notes

- All database tables have Row Level Security (RLS) enabled
- Users can only access their own data
- Passwords are hashed by Supabase Auth
- API routes validate authentication

## 📚 Next Steps

See the main README.md for:
- Detailed project structure
- Database schema documentation  
- Deployment instructions
- Contributing guidelines

---

Need help? Check the main README.md or create an issue on GitHub!
