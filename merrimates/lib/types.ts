export interface Profile {
  id: string;
  username: string;
  display_username: string;
  phone?: string;
  preferred_nickname: string;
  age: number;
  pronouns: string;
  city: string;
  country: string;
  personality_type: 'extrovert' | 'introvert';
  looking_for_type: 'extrovert' | 'introvert';
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Hobby {
  id: number;
  name: string;
  category: 'Creative' | 'Athletic' | 'Mind/Body' | 'Nature' | 'Social' | 'Technical' | 'Relaxation';
}

export interface UserHobby {
  id: number;
  user_id: string;
  hobby_id: number;
  created_at: string;
  hobby?: Hobby;
}

export interface UserLearningGoal {
  id: number;
  user_id: string;
  hobby_id: number;
  created_at: string;
  hobby?: Hobby;
}

export interface Friendship {
  id: number;
  user_id: string;
  friend_id: string;
  status: 'active' | 'blocked';
  created_at: string;
  friend?: Profile;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface PasswordResetCode {
  id: number;
  username: string;
  code: string;
  email: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface OnboardingData {
  preferred_nickname: string;
  age: number;
  pronouns: string;
  city: string;
  country: string;
  hobbies: number[];
  learning_goals: number[];
  personality_type: 'extrovert' | 'introvert';
  looking_for_type: 'extrovert' | 'introvert';
}

export const HOBBY_CATEGORIES = [
  'Creative',
  'Athletic',
  'Mind/Body',
  'Nature',
  'Social',
  'Technical',
  'Relaxation'
] as const;

export const PRONOUN_OPTIONS = [
  'she/her',
  'he/him',
  'they/them',
  'other'
] as const;
