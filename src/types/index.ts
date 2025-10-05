export interface User {
  username: string;
  password: string;
  email: string;
  nickname?: string;
  age?: number;
  pronouns?: string;
  location?: { city: string; country: string };
  hobbies?: string[];
  learningInterests?: string[];
  personality?: 'Extrovert' | 'Introvert';
  lookingFor?: 'Extrovert' | 'Introvert' | 'Both';
  profilePicture?: string;
  blockedUsers?: string[];
}

export interface Friend {
  username: string;
  nickname: string;
  profilePicture: string;
  topHobby: string;
  hobbies: string[];
  age: number;
  pronouns: string;
  location: { city: string; country: string };
  personality: 'Extrovert' | 'Introvert';
  learningInterests: string[];
}

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  username: string;
  nickname: string;
  profilePicture: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}
