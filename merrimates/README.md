# MerriMates - Connect & Learn Through Hobbies

MerriMates is a social platform that helps people form connections by teaching each other hobbies. Connect with someone who wants to learn guitar while you want to learn fishing, and exchange skills!

## Features

- **User Authentication**: Username-based login with email verification
- **Profile Creation**: Multi-step onboarding with personality matching
- **Hobby Matching**: Select from 160+ hobbies across 7 categories
- **Friend System**: Add, block, and manage connections
- **Messaging**: Real-time chat with friends
- **Search & Filters**: Find users by hobby, location, age, and personality type
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Realtime + Auth + Storage)
- **Hosting**: Vercel
- **Font**: Merriweather from Google Fonts

## Color Palette

- Background Gradient: `#809671` to `#b4c7a7`
- Tabs/Buttons: `#48573e`
- Font Color: `#faf2e6`

## Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/merrimates.git
cd merrimates
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your keys
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up the Database

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run it in the SQL Editor

This will create:
- All necessary tables (profiles, hobbies, friendships, messages, etc.)
- Row Level Security (RLS) policies
- Indexes for performance
- All 160 hobbies pre-populated

### 5. Configure Supabase Auth

1. Go to Authentication > URL Configuration
2. Add your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/onboarding/profile`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
merrimates/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Login page
│   │   ├── sign-up/            # Sign up page
│   │   └── forgot-password/    # Password reset
│   ├── onboarding/             # Multi-step profile creation
│   │   ├── profile/            # Basic info (name, age, location)
│   │   ├── hobbies/            # Select your hobbies
│   │   ├── learning/           # Select learning goals
│   │   └── personality/        # Personality type matching
│   ├── dashboard/              # Main dashboard
│   ├── search/                 # Search for users
│   ├── profile/                # View/edit profiles
│   ├── friends/                # Friends management
│   ├── messages/               # Messaging system
│   ├── settings/               # User settings
│   └── globals.css            # Global styles with custom colors
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── login-form.tsx         # Login form component
│   └── sign-up-form.tsx       # Sign up form component
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── utils.ts               # Utility functions
│   └── supabase/              # Supabase client configuration
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
└── DATABASE_SCHEMA.md         # Database documentation
```

## User Flow

1. **Sign Up**: User creates account with username, email, and password
2. **Onboarding Step 1**: Enter nickname, age, pronouns, and location
3. **Onboarding Step 2**: Select 1-10 hobbies they have
4. **Onboarding Step 3**: Select 1-10 hobbies they want to learn
5. **Onboarding Step 4**: Choose personality type (extrovert/introvert) and preference
6. **Dashboard**: View friends, search for new connections
7. **Search**: Find users with matching hobbies and interests
8. **Connect**: Add friends and start messaging

## Key Features Explained

### Age Validation

- Users must be 15-116 years old
- Fun error messages for invalid ages:
  - Too young: "🥚 Oops! You're too young. Let us put you back in the egg!"
  - Too old: "🦖 Okay dinosaur, we don't know how you survived that asteroid!"

### Hobby Categories

- **Creative**: Art, music, crafts, etc.
- **Athletic**: Sports and physical activities
- **Mind/Body**: Mental wellness and mindfulness
- **Nature**: Outdoor and nature-based activities
- **Social**: Group activities and entertainment
- **Technical**: Technology and programming
- **Relaxation**: Leisure activities

### Username System

- Case-insensitive (stored lowercase)
- Max 20 characters
- Unique across platform
- Display version preserves original case

### Matching Algorithm

Users can find friends who:
- Have hobbies they want to learn
- Want to learn hobbies they have
- Match their personality type preferences
- Are in their location or region

## Database Schema

See `DATABASE_SCHEMA.md` for detailed information about:
- Table structures
- Relationships
- Indexes
- Row Level Security policies

## API Routes

- `POST /api/auth/username-login`: Login with username instead of email

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### Update Supabase Auth URLs

After deployment, update your Supabase Auth URLs with your production domain.

## Environment Variables

Required variables for `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Development Notes

### Testing

- Create multiple test accounts to test friend features
- Use different hobby combinations to test matching
- Test on both mobile and desktop viewports

### Common Issues

1. **TypeScript Errors**: These are type definition issues and don't affect functionality
2. **Database Connection**: Ensure your Supabase credentials are correct
3. **Auth Redirect**: Make sure redirect URLs are configured in Supabase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or building your own version!

## Support

For issues or questions:
- Open an issue on GitHub
- Check the DATABASE_SCHEMA.md for database questions
- Review Supabase documentation for auth issues

## Future Enhancements

- [ ] Video chat integration (WebRTC)
- [ ] Mobile app (React Native)
- [ ] Advanced matching algorithms
- [ ] Event planning features
- [ ] Skill verification system
- [ ] Achievement badges
- [ ] Profile customization
- [ ] Hobby recommendations based on AI

---

Made with ❤️ by the MerriMates team

"Because fuck Skillshare, our project makes people happy!" 🦛🐊
