-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_username TEXT NOT NULL,
  phone TEXT,
  preferred_nickname TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 15 AND age <= 116),
  pronouns TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  personality_type TEXT NOT NULL CHECK (personality_type IN ('extrovert', 'introvert')),
  looking_for_type TEXT NOT NULL CHECK (looking_for_type IN ('extrovert', 'introvert')),
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on lowercase username for case-insensitive uniqueness
CREATE UNIQUE INDEX profiles_username_lower_idx ON profiles (LOWER(username));

-- Create hobbies table
CREATE TABLE hobbies (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Creative', 'Athletic', 'Mind/Body', 'Nature', 'Social', 'Technical', 'Relaxation'))
);

-- Create user_hobbies table (skills they have)
CREATE TABLE user_hobbies (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hobby_id INTEGER NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, hobby_id)
);

CREATE INDEX user_hobbies_user_id_idx ON user_hobbies(user_id);

-- Create user_learning_goals table (skills they want to learn)
CREATE TABLE user_learning_goals (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hobby_id INTEGER NOT NULL REFERENCES hobbies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, hobby_id)
);

CREATE INDEX user_learning_goals_user_id_idx ON user_learning_goals(user_id);

-- Create friendships table
CREATE TABLE friendships (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('active', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

CREATE INDEX friendships_user_id_idx ON friendships(user_id);
CREATE INDEX friendships_friend_id_idx ON friendships(friend_id);

-- Create messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX messages_sender_id_idx ON messages(sender_id);
CREATE INDEX messages_receiver_id_idx ON messages(receiver_id);

-- Create password_reset_codes table
CREATE TABLE password_reset_codes (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  code TEXT NOT NULL,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_hobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User hobbies policies
CREATE POLICY "User hobbies are viewable by everyone" ON user_hobbies FOR SELECT USING (true);
CREATE POLICY "Users can insert their own hobbies" ON user_hobbies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own hobbies" ON user_hobbies FOR DELETE USING (auth.uid() = user_id);

-- User learning goals policies
CREATE POLICY "User learning goals are viewable by everyone" ON user_learning_goals FOR SELECT USING (true);
CREATE POLICY "Users can insert their own learning goals" ON user_learning_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own learning goals" ON user_learning_goals FOR DELETE USING (auth.uid() = user_id);

-- Friendships policies
CREATE POLICY "Users can view their own friendships" ON friendships FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can insert their own friendships" ON friendships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own friendships" ON friendships FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own friendships" ON friendships FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view their own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert messages they send" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they receive" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- Insert all hobbies
INSERT INTO hobbies (name, category) VALUES
('3D printing','Creative'),
('Acting','Creative'),
('Archery','Athletic'),
('Astrology','Mind/Body'),
('Astronomy','Mind/Body'),
('Backpacking','Athletic'),
('Baking','Creative'),
('Barbecuing','Creative'),
('Bartending','Creative'),
('Baseball','Athletic'),
('Basketball','Athletic'),
('Beekeeping','Nature'),
('Biking','Athletic'),
('Bird watching','Nature'),
('Blacksmithing','Creative'),
('Blogging','Creative'),
('Board games','Social'),
('Book club','Social'),
('Bowling','Athletic'),
('Boxing','Athletic'),
('Bread making','Creative'),
('Brewing beer','Creative'),
('Building computers','Technical'),
('Calligraphy','Creative'),
('Camping','Nature'),
('Candle making','Creative'),
('Canning','Creative'),
('Card games','Social'),
('Carpentry','Creative'),
('Ceramics','Creative'),
('Cheesemaking','Creative'),
('Chess','Mind/Body'),
('Climbing','Athletic'),
('Collecting (coins, stamps, etc.)','Mind/Body'),
('Coloring','Creative'),
('Composting','Nature'),
('Cooking','Creative'),
('Cosplaying','Creative'),
('Crocheting','Creative'),
('CrossFit','Athletic'),
('Crossword puzzles','Mind/Body'),
('Cycling','Athletic'),
('Dancing','Athletic'),
('Debating','Mind/Body'),
('Decorating','Creative'),
('Digital art','Creative'),
('DIY projects','Creative'),
('Drawing','Creative'),
('Embroidery','Creative'),
('Exercising','Athletic'),
('Fencing','Athletic'),
('Film making','Creative'),
('Fishing','Nature'),
('Flower arranging','Creative'),
('Foraging','Nature'),
('Gardening','Nature'),
('Genealogy','Mind/Body'),
('Geocaching','Athletic'),
('Glass blowing','Creative'),
('Golf','Athletic'),
('Graphic design','Creative'),
('Hiking','Athletic'),
('Home brewing','Creative'),
('Home improvement','Creative'),
('Hunting','Nature'),
('Ice skating','Athletic'),
('Interior design','Creative'),
('Jewelry making','Creative'),
('Journaling','Mind/Body'),
('Juggling','Athletic'),
('Karate','Athletic'),
('Karaoke','Social'),
('Knitting','Creative'),
('Lacrosse','Athletic'),
('Landscaping','Creative'),
('Language learning','Mind/Body'),
('Leatherworking','Creative'),
('Listening to music','Relaxation'),
('Magic tricks','Creative'),
('Makeup artistry','Creative'),
('Martial arts','Athletic'),
('Meditation','Mind/Body'),
('Metalworking','Creative'),
('Mixology','Creative'),
('Model building','Creative'),
('Mountain biking','Athletic'),
('Movies','Relaxation'),
('Music production','Creative'),
('Nail art','Creative'),
('Origami','Creative'),
('Painting','Creative'),
('Paper crafts','Creative'),
('Performing','Creative'),
('Pet training','Social'),
('Photography','Creative'),
('Pilates','Athletic'),
('Playing instruments','Creative'),
('Podcasting','Creative'),
('Poetry writing','Creative'),
('Pottery','Creative'),
('Programming','Technical'),
('Puzzles','Mind/Body'),
('Quilting','Creative'),
('Rapping','Creative'),
('Reading','Relaxation'),
('Robotics','Technical'),
('Rock climbing','Athletic'),
('Roller skating','Athletic'),
('Rowing','Athletic'),
('Rugby','Athletic'),
('Running','Athletic'),
('Sailing','Athletic'),
('Salsa dancing','Athletic'),
('Sculpting','Creative'),
('Sewing','Creative'),
('Singing','Creative'),
('Skateboarding','Athletic'),
('Skiing','Athletic'),
('Skydiving','Athletic'),
('Snowboarding','Athletic'),
('Soccer','Athletic'),
('Soap making','Creative'),
('Songwriting','Creative'),
('Stand-up comedy','Creative'),
('Stargazing','Mind/Body'),
('Surfing','Athletic'),
('Swimming','Athletic'),
('Table tennis','Athletic'),
('Tai chi','Mind/Body'),
('Tattoos','Creative'),
('Team sports','Athletic'),
('Tennis','Athletic'),
('Thrifting','Social'),
('Traveling','Social'),
('Ultimate frisbee','Athletic'),
('Upcycling','Creative'),
('Videography','Creative'),
('Video games','Social'),
('Virtual reality','Technical'),
('Volunteering','Social'),
('Walking','Athletic'),
('Watchmaking','Creative'),
('Weightlifting','Athletic'),
('Whittling','Creative'),
('Wine tasting','Social'),
('Wood carving','Creative'),
('Woodworking','Creative'),
('Writing','Creative'),
('Yoga','Mind/Body'),
('Zumba','Athletic');
