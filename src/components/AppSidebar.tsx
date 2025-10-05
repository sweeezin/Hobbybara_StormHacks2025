import { useState } from 'react'
import { User, Friend, Message, Conversation } from '../types'
import { ProfileTab } from './ProfileTab'
import { MessagesTab } from './MessagesTab'
import { SettingsTab } from './SettingsTab'
import { FriendsTab } from './FriendsTab'
import { UserCircle, MessageCircle, Users, Settings, LogOut, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface AppSidebarProps {
  currentUser: User;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onUnblockUser: (username: string) => void;
  friends: Friend[];
  messages: Message[];
  conversations: Conversation[];
  onViewFriend: (friend: Friend) => void;
  onRemoveFriend: (username: string) => void;
  onBlockUser: (username: string) => void;
  onSendMessage: (recipientUsername: string, content: string) => void;
  onMarkMessageAsRead: (messageId: string) => void;
}

type Tab = 'none' | 'profile' | 'messages' | 'friends' | 'settings' | 'delete';

export function AppSidebar({
  currentUser,
  isOpen,
  onToggle,
  onLogout,
  onDeleteAccount,
  onUpdateProfile,
  onUnblockUser,
  friends,
  messages,
  conversations,
  onViewFriend,
  onRemoveFriend,
  onBlockUser,
  onSendMessage,
  onMarkMessageAsRead,
}: AppSidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('none');

  const menuItems = [
    { id: 'profile' as Tab, icon: UserCircle, label: 'Profile' },
    { id: 'messages' as Tab, icon: MessageCircle, label: 'Messages' },
    { id: 'friends' as Tab, icon: Users, label: 'Friends' },
    { id: 'settings' as Tab, icon: Settings, label: 'Settings' },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="flex h-full">
      {/* Navigation Bar */}
      <div
        className="w-20 flex flex-col items-center py-6 gap-4"
        style={{
          backgroundColor: '#48573e',
        }}
      >
        <div className="mb-4">
          <img
            src={currentUser.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
            alt={currentUser.nickname}
            className="w-12 h-12 rounded-full border-2"
            style={{ borderColor: '#faf2e6' }}
          />
        </div>

        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(activeTab === item.id ? 'none' : item.id)}
            className="p-3 rounded-xl transition-all relative group"
            style={{
              backgroundColor: activeTab === item.id ? '#b4c7a7' : 'transparent',
              color: '#faf2e6',
            }}
            title={item.label}
          >
            <item.icon size={24} />
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={() => setActiveTab(activeTab === 'delete' ? 'none' : 'delete')}
          className="p-3 rounded-xl transition-all"
          style={{
            backgroundColor: activeTab === 'delete' ? '#d4183d' : 'transparent',
            color: '#faf2e6',
          }}
          title="Delete Account"
        >
          <Trash2 size={24} />
        </button>

        <button
          onClick={onLogout}
          className="p-3 rounded-xl transition-all"
          style={{
            backgroundColor: 'transparent',
            color: '#faf2e6',
          }}
          title="Logout"
        >
          <LogOut size={24} />
        </button>

        <button
          onClick={onToggle}
          className="p-3 rounded-xl transition-all"
          style={{
            backgroundColor: 'transparent',
            color: '#faf2e6',
          }}
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Content Panel */}
      {activeTab !== 'none' && (
        <div
          className="w-96 overflow-y-auto"
          style={{
            backgroundColor: 'rgba(250, 242, 230, 0.98)',
          }}
        >
          {activeTab === 'profile' && (
            <ProfileTab currentUser={currentUser} onUpdateProfile={onUpdateProfile} />
          )}
          {activeTab === 'messages' && (
            <MessagesTab 
              currentUser={currentUser} 
              friends={friends}
              messages={messages}
              conversations={conversations}
              onSendMessage={onSendMessage}
              onMarkMessageAsRead={onMarkMessageAsRead}
            />
          )}
          {activeTab === 'friends' && (
            <FriendsTab
              friends={friends}
              onViewFriend={onViewFriend}
              onRemoveFriend={onRemoveFriend}
              onBlockUser={onBlockUser}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              currentUser={currentUser}
              onUpdateProfile={onUpdateProfile}
              onUnblockUser={onUnblockUser}
            />
          )}
          {activeTab === 'delete' && (
            <div className="p-6 space-y-4">
              <h3 className="text-2xl" style={{ color: '#48573e' }}>
                Delete Account
              </h3>
              <p style={{ color: '#666' }}>
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you absolutely sure? This will permanently delete your account and all data.')) {
                    onDeleteAccount();
                  }
                }}
                className="w-full py-3 rounded-xl"
                style={{
                  backgroundColor: '#d4183d',
                  color: '#fff',
                }}
              >
                Delete Account Permanently
              </button>
              <button
                onClick={() => setActiveTab('none')}
                className="w-full py-3 rounded-xl border-2"
                style={{
                  borderColor: '#48573e',
                  color: '#48573e',
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
