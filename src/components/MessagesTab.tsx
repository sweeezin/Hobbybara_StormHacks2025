import { useState } from 'react';
import { User, Friend } from '../types';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Send } from 'lucide-react';

interface MessagesTabProps {
  currentUser: User;
  friends: Friend[];
}

export function MessagesTab({ currentUser, friends }: MessagesTabProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<{ [key: string]: { text: string; from: string; timestamp: Date }[] }>({});

  const handleSendMessage = () => {
    if (!selectedFriend || !message.trim()) return;

    const newMessage = {
      text: message,
      from: currentUser.username,
      timestamp: new Date(),
    };

    setConversations(prev => ({
      ...prev,
      [selectedFriend.username]: [
        ...(prev[selectedFriend.username] || []),
        newMessage,
      ],
    }));

    setMessage('');
  };

  return (
    <div className="h-full flex flex-col">
      {!selectedFriend ? (
        <div className="p-6">
          <h3 className="text-2xl mb-4" style={{ color: '#48573e' }}>
            Messages
          </h3>
          
          {friends.length === 0 ? (
            <p style={{ color: '#666' }}>
              No friends yet. Add some friends to start messaging!
            </p>
          ) : (
            <div className="space-y-2">
              {friends.map(friend => (
                <div
                  key={friend.username}
                  className="p-3 rounded-xl cursor-pointer hover:shadow-md transition-all"
                  style={{ backgroundColor: '#fff', border: '2px solid #809671' }}
                  onClick={() => setSelectedFriend(friend)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={friend.profilePicture}
                      alt={friend.nickname}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <h4 style={{ color: '#48573e' }}>{friend.nickname}</h4>
                      <p className="text-sm opacity-60" style={{ color: '#48573e' }}>
                        @{friend.username}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div 
            className="p-4 border-b-2 flex items-center gap-3"
            style={{ borderColor: '#809671' }}
          >
            <button
              onClick={() => setSelectedFriend(null)}
              className="text-sm underline"
              style={{ color: '#48573e' }}
            >
              ← Back
            </button>
            <img
              src={selectedFriend.profilePicture}
              alt={selectedFriend.nickname}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h4 style={{ color: '#48573e' }}>{selectedFriend.nickname}</h4>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {!conversations[selectedFriend.username] || conversations[selectedFriend.username].length === 0 ? (
              <p className="text-center opacity-60" style={{ color: '#48573e' }}>
                No messages yet. Start the conversation!
              </p>
            ) : (
              <div className="space-y-3">
                {conversations[selectedFriend.username].map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === currentUser.username ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className="max-w-xs p-3 rounded-xl"
                      style={{
                        backgroundColor: msg.from === currentUser.username ? '#48573e' : '#b4c7a7',
                        color: msg.from === currentUser.username ? '#faf2e6' : '#48573e',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t-2 flex gap-2" style={{ borderColor: '#809671' }}>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="rounded-xl"
              style={{ borderColor: '#809671' }}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className="rounded-xl"
              style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
