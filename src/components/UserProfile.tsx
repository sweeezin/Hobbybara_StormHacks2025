import { useState } from 'react';
import { Friend, User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowLeft, UserPlus, MessageCircle, UserMinus, Ban, UserCheck, Send } from 'lucide-react';
import { MapPin } from 'lucide-react';

interface UserProfileProps {
  user: Friend;
  currentUser: User;
  isFriend: boolean;
  isBlocked: boolean;
  onBack: () => void;
  onAddFriend: (friend: Friend) => void;
  onRemoveFriend: (username: string) => void;
  onBlockUser: (username: string) => void;
  onUnblockUser: (username: string) => void;
  onSendMessage: (recipientUsername: string, content: string) => void;
}

export function UserProfile({
  user,
  currentUser,
  isFriend,
  isBlocked,
  onBack,
  onAddFriend,
  onRemoveFriend,
  onBlockUser,
  onUnblockUser,
  onSendMessage,
}: UserProfileProps) {
  const [messageText, setMessageText] = useState('');
  const [showMessageBox, setShowMessageBox] = useState(false);

  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(user.username, messageText);
      setMessageText('');
      setShowMessageBox(false);
      // Could show a success toast here
    }
  };
  return (
    <div 
      className="size-full p-6 overflow-auto"
      style={{
        background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
      }}
    >
      <div 
        className="max-w-3xl mx-auto rounded-3xl p-8 shadow-2xl"
        style={{
          backgroundColor: 'rgba(250, 242, 230, 0.95)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="rounded-xl"
            style={{ borderColor: '#48573e', color: '#48573e' }}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <img
            src={user.profilePicture}
            alt={user.nickname}
            className="w-32 h-32 rounded-full border-4 mx-auto md:mx-0"
            style={{ borderColor: '#48573e' }}
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl mb-2" style={{ color: '#48573e' }}>
              {user.nickname}
            </h1>
            <p className="text-xl opacity-60 mb-2" style={{ color: '#48573e' }}>
              @{user.username}
            </p>
            <p style={{ color: '#666' }}>
              {user.age} • {user.pronouns} • {user.personality}
            </p>
            <div className="flex items-center justify-center md:justify-start gap-1 mt-2" style={{ color: '#666' }}>
              <MapPin size={16} />
              <span>{user.location.city}, {user.location.country}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          {isBlocked ? (
            <Button
              onClick={() => onUnblockUser(user.username)}
              className="flex-1 rounded-xl"
              style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
            >
              <UserCheck size={20} className="mr-2" />
              Unblock User
            </Button>
          ) : (
            <>
              {!isFriend ? (
                <Button
                  onClick={() => onAddFriend(user)}
                  className="flex-1 rounded-xl"
                  style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                >
                  <UserPlus size={20} className="mr-2" />
                  Add Friend
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => setShowMessageBox(!showMessageBox)}
                    className="flex-1 rounded-xl"
                    style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Message
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm(`Remove ${user.nickname} from friends?`)) {
                        onRemoveFriend(user.username);
                        onBack();
                      }
                    }}
                    variant="outline"
                    className="flex-1 rounded-xl"
                    style={{ borderColor: '#48573e', color: '#48573e' }}
                  >
                    <UserMinus size={20} className="mr-2" />
                    Unfriend
                  </Button>
                </>
              )}
              <Button
                onClick={() => {
                  if (confirm(`Block ${user.nickname}?`)) {
                    onBlockUser(user.username);
                    onBack();
                  }
                }}
                variant="outline"
                className="rounded-xl"
                style={{ borderColor: '#d4183d', color: '#d4183d' }}
              >
                <Ban size={20} className="mr-2" />
                Block
              </Button>
            </>
          )}
        </div>

        {/* Message Box */}
        {showMessageBox && isFriend && !isBlocked && (
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(180, 199, 167, 0.2)' }}>
            <h4 className="mb-3" style={{ color: '#48573e' }}>
              Send a message to {user.nickname}
            </h4>
            <div className="flex gap-2">
              <Input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl"
                style={{ borderColor: '#809671' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="rounded-xl"
                style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        )}

        {/* Hobbies */}
        <div className="mb-6">
          <h3 className="text-xl mb-3" style={{ color: '#48573e' }}>
            Hobbies
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.hobbies.map(hobby => (
              <span
                key={hobby}
                className="px-3 py-2 rounded-xl"
                style={{ backgroundColor: '#b4c7a7', color: '#48573e' }}
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>

        {/* Learning Interests */}
        <div>
          <h3 className="text-xl mb-3" style={{ color: '#48573e' }}>
            Wants to Learn
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.learningInterests.map(interest => (
              <span
                key={interest}
                className="px-3 py-2 rounded-xl"
                style={{ backgroundColor: '#809671', color: '#faf2e6' }}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Matching Hobbies */}
        {currentUser.hobbies && currentUser.hobbies.length > 0 && (
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'rgba(180, 199, 167, 0.3)' }}>
            <h4 style={{ color: '#48573e' }}>
              Shared Interests
            </h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.hobbies
                .filter(h => currentUser.hobbies?.includes(h))
                .map(hobby => (
                  <span
                    key={hobby}
                    className="px-2 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                  >
                    {hobby}
                  </span>
                ))}
              {user.hobbies.filter(h => currentUser.hobbies?.includes(h)).length === 0 && (
                <p className="text-sm" style={{ color: '#666' }}>
                  No shared hobbies yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
