import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ProfileSetupPage } from './components/ProfileSetupPage';
import { HobbiesPage } from './components/HobbiesPage';
import { LearningInterestsPage } from './components/LearningInterestsPage';
import { PersonalityPage } from './components/PersonalityPage';
import { WelcomePage } from './components/WelcomePage';
import { MainPage } from './components/MainPage';
import { User, Friend, Message, Conversation } from './types';
import logoImage from 'figma:asset/8db2754dce63c68a63a57cfc11f0e5cc090f2cc9.png';

export type Page = 
  | 'login' 
  | 'signup' 
  | 'profileSetup' 
  | 'hobbies' 
  | 'learningInterests' 
  | 'personality' 
  | 'welcome' 
  | 'main';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tempUser, setTempUser] = useState<Partial<User>>({});
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem('merrimates_users');
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      }
      
      const storedCurrentUser = localStorage.getItem('merrimates_current_user');
      if (storedCurrentUser) {
        setCurrentUser(JSON.parse(storedCurrentUser));
        setCurrentPage('main');
      }
      
      const storedFriends = localStorage.getItem('merrimates_friends');
      if (storedFriends) {
        setFriends(JSON.parse(storedFriends));
      }

      const storedMessages = localStorage.getItem('merrimates_messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }

      const storedConversations = localStorage.getItem('merrimates_conversations');
      if (storedConversations) {
        setConversations(JSON.parse(storedConversations));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save data to localStorage - consolidated to prevent too many re-renders
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem('merrimates_users', JSON.stringify(users));
        localStorage.setItem('merrimates_friends', JSON.stringify(friends));
        localStorage.setItem('merrimates_messages', JSON.stringify(messages));
        localStorage.setItem('merrimates_conversations', JSON.stringify(conversations));
        
        if (currentUser) {
          localStorage.setItem('merrimates_current_user', JSON.stringify(currentUser));
        } else {
          localStorage.removeItem('merrimates_current_user');
        }
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [users, friends, messages, conversations, currentUser, isLoading]);

  const handleLogin = (username: string, password: string) => {
    const user = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      setCurrentPage('main');
      return true;
    }
    return false;
  };

  const handleSignup = (username: string, password: string, email: string) => {
    // Check if username exists (case insensitive)
    const existingUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase()
    );
    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    const newUser: User = { username, password, email };
    setTempUser(newUser);
    setCurrentPage('profileSetup');
    return { success: true };
  };

  const handleProfileSetup = (profile: {
    nickname: string;
    age: number;
    pronouns: string;
    location: { city: string; country: string };
    profilePicture?: string;
  }) => {
    setTempUser(prev => ({ ...prev, ...profile }));
    setCurrentPage('hobbies');
  };

  const handleHobbies = (hobbies: string[]) => {
    setTempUser(prev => ({ ...prev, hobbies }));
    setCurrentPage('learningInterests');
  };

  const handleLearningInterests = (learningInterests: string[]) => {
    setTempUser(prev => ({ ...prev, learningInterests }));
    setCurrentPage('personality');
  };

  const handlePersonality = (personality: 'Extrovert' | 'Introvert', lookingFor: 'Extrovert' | 'Introvert' | 'Both') => {
    const completeUser = {
      ...tempUser,
      personality,
      lookingFor,
      blockedUsers: [],
      profilePicture: tempUser.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${tempUser.username}`,
    } as User;
    
    setUsers(prev => [...prev, completeUser]);
    setCurrentUser(completeUser);
    setTempUser({});
    setCurrentPage('welcome');
    
    // Transition to main page after 3 seconds
    setTimeout(() => {
      setCurrentPage('main');
    }, 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleDeleteAccount = () => {
    if (currentUser) {
      setUsers(prev => prev.filter(u => u.username !== currentUser.username));
      setCurrentUser(null);
      setCurrentPage('login');
    }
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      setUsers(prev =>
        prev.map(u => (u.username === currentUser.username ? updatedUser : u))
      );
    }
  };

  const handleAddFriend = (friend: Friend) => {
    setFriends(prev => {
      // Check if already friends
      if (prev.some(f => f.username === friend.username)) {
        return prev;
      }
      return [...prev, friend];
    });
  };

  const handleRemoveFriend = (username: string) => {
    setFriends(prev => prev.filter(f => f.username !== username));
  };

  const handleBlockUser = (username: string) => {
    if (currentUser) {
      const blockedUsers = currentUser.blockedUsers || [];
      handleUpdateProfile({
        blockedUsers: [...blockedUsers, username],
      });
      handleRemoveFriend(username);
    }
  };

  const handleUnblockUser = (username: string) => {
    if (currentUser) {
      const blockedUsers = currentUser.blockedUsers || [];
      handleUpdateProfile({
        blockedUsers: blockedUsers.filter(u => u !== username),
      });
    }
  };

  const handleSendMessage = (recipientUsername: string, content: string) => {
    if (!currentUser) return;

    const messageId = Date.now().toString();
    const newMessage: Message = {
      id: messageId,
      sender: currentUser.username,
      recipient: recipientUsername,
      content,
      timestamp: new Date(),
      read: false,
    };

    setMessages(prev => [...prev, newMessage]);

    // Update or create conversation
    const conversationId = [currentUser.username, recipientUsername].sort().join('-');
    setConversations(prev => {
      const existingConv = prev.find(c => c.id === conversationId);
      if (existingConv) {
        return prev.map(c => 
          c.id === conversationId 
            ? { ...c, lastMessage: newMessage, updatedAt: new Date() }
            : c
        );
      } else {
        const newConversation: Conversation = {
          id: conversationId,
          participants: [currentUser.username, recipientUsername],
          lastMessage: newMessage,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return [...prev, newConversation];
      }
    });
  };

  const handleMarkMessageAsRead = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };

  if (isLoading) {
    return (
      <div 
        className="size-full flex flex-col items-center justify-center gap-6"
        style={{
          background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
        }}
      >
        <img 
          src={logoImage}
          alt="MerriMates Logo"
          className="w-full max-w-md px-8"
          style={{
            filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.2))',
          }}
        />
        <div className="text-xl" style={{ color: '#faf2e6' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onSignup={() => setCurrentPage('signup')}
          users={users}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage
          onSignup={handleSignup}
          onBack={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'profileSetup' && (
        <ProfileSetupPage onComplete={handleProfileSetup} />
      )}
      {currentPage === 'hobbies' && (
        <HobbiesPage onComplete={handleHobbies} />
      )}
      {currentPage === 'learningInterests' && (
        <LearningInterestsPage onComplete={handleLearningInterests} />
      )}
      {currentPage === 'personality' && (
        <PersonalityPage onComplete={handlePersonality} />
      )}
      {currentPage === 'welcome' && currentUser && (
        <WelcomePage nickname={currentUser.nickname || currentUser.username} />
      )}
      {currentPage === 'main' && currentUser && (
        <MainPage
          currentUser={currentUser}
          friends={friends}
          users={users}
          messages={messages}
          conversations={conversations}
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
          onUpdateProfile={handleUpdateProfile}
          onAddFriend={handleAddFriend}
          onRemoveFriend={handleRemoveFriend}
          onBlockUser={handleBlockUser}
          onUnblockUser={handleUnblockUser}
          onSendMessage={handleSendMessage}
          onMarkMessageAsRead={handleMarkMessageAsRead}
        />
      )}
    </div>
  );
}
