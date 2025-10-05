# MerriMates Database Schema

## Tables

### 1. users (extends Supabase auth.users)
- `id` (uuid, primary key) - from Supabase auth
- `email` (text, unique) - from Supabase auth
- `created_at` (timestamp) - from Supabase auth

### 2. profiles
- `id` (uuid, primary key, references auth.users.id)
- `username` (text, unique, not null, max 20 chars, case-insensitive)
- `display_username` (text, not null) - stores original case
- `phone` (text, nullable)
- `preferred_nickname` (text, not null)
- `age` (integer, not null, check: age >= 15 AND age <= 116)
- `pronouns` (text, not null) - 'she/her', 'he/him', 'they/them', or custom
- `city` (text, not null)
- `country` (text, not null)
- `personality_type` (text, not null) - 'extrovert' or 'introvert'
- `looking_for_type` (text, not null) - 'extrovert' or 'introvert'
- `profile_picture_url` (text, nullable)
- `created_at` (timestamp, default now())
- `updated_at` (timestamp, default now())

### 3. hobbies
- `id` (serial, primary key)
- `name` (text, unique, not null)
- `category` (text, not null) - 'Creative', 'Athletic', 'Mind/Body', 'Nature', 'Social', 'Technical', 'Relaxation'

### 4. user_hobbies (user's existing skills)
- `id` (serial, primary key)
- `user_id` (uuid, references profiles.id, not null)
- `hobby_id` (integer, references hobbies.id, not null)
- `created_at` (timestamp, default now())
- Unique constraint on (user_id, hobby_id)

### 5. user_learning_goals (what user wants to learn)
- `id` (serial, primary key)
- `user_id` (uuid, references profiles.id, not null)
- `hobby_id` (integer, references hobbies.id, not null)
- `created_at` (timestamp, default now())
- Unique constraint on (user_id, hobby_id)

### 6. friendships
- `id` (serial, primary key)
- `user_id` (uuid, references profiles.id, not null)
- `friend_id` (uuid, references profiles.id, not null)
- `status` (text, not null) - 'active', 'blocked'
- `created_at` (timestamp, default now())
- Unique constraint on (user_id, friend_id)

### 7. messages
- `id` (serial, primary key)
- `sender_id` (uuid, references profiles.id, not null)
- `receiver_id` (uuid, references profiles.id, not null)
- `content` (text, not null)
- `read` (boolean, default false)
- `created_at` (timestamp, default now())

### 8. password_reset_codes
- `id` (serial, primary key)
- `username` (text, not null)
- `code` (text, not null)
- `email` (text, not null)
- `expires_at` (timestamp, not null)
- `used` (boolean, default false)
- `created_at` (timestamp, default now())

## Indexes
- `profiles.username` (unique, case-insensitive using LOWER)
- `user_hobbies.user_id`
- `user_learning_goals.user_id`
- `friendships.user_id`
- `friendships.friend_id`
- `messages.sender_id`
- `messages.receiver_id`

## Row Level Security (RLS) Policies

### profiles
- Users can read all profiles
- Users can only update their own profile
- Users can only insert their own profile

### user_hobbies & user_learning_goals
- Users can read all
- Users can only insert/update/delete their own

### friendships
- Users can read their own friendships
- Users can insert/update/delete their own friendships

### messages
- Users can read messages where they are sender or receiver
- Users can insert messages where they are the sender
- Users can update their own received messages (for marking as read)

## Initial Data
All 160 hobbies with their categories should be pre-populated in the hobbies table.
