import { Friend } from '../types';
import { Button } from './ui/button';
import { UserMinus, Ban } from 'lucide-react';

interface FriendsTabProps {
  friends: Friend[];
  onViewFriend: (friend: Friend) => void;
  onRemoveFriend: (username: string) => void;
  onBlockUser: (username: string) => void;
}

export function FriendsTab({ friends, onViewFriend, onRemoveFriend, onBlockUser }: FriendsTabProps) {
  return (
    <div className="p-6">
      <h3 className="text-2xl mb-4" style={{ color: '#48573e' }}>
        Friends
      </h3>
      
      {friends.length === 0 ? (
        <p style={{ color: '#666' }}>
          No friends yet. Search for people to connect with!
        </p>
      ) : (
        <div className="space-y-3">
          {friends.map(friend => (
            <div
              key={friend.username}
              className="p-3 rounded-xl border-2"
              style={{ borderColor: '#809671', backgroundColor: '#fff' }}
            >
              <div 
                className="flex items-center gap-3 cursor-pointer mb-2"
                onClick={() => onViewFriend(friend)}
              >
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
                  <span
                    className="text-xs px-2 py-0.5 rounded-full inline-block mt-1"
                    style={{ backgroundColor: '#b4c7a7', color: '#48573e' }}
                  >
                    {friend.topHobby}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (confirm(`Remove ${friend.nickname} from friends?`)) {
                      onRemoveFriend(friend.username);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  style={{ borderColor: '#48573e', color: '#48573e' }}
                >
                  <UserMinus size={16} className="mr-1" />
                  Unfriend
                </Button>
                <Button
                  onClick={() => {
                    if (confirm(`Block ${friend.nickname}? They will be removed from your friends list.`)) {
                      onBlockUser(friend.username);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl"
                  style={{ borderColor: '#d4183d', color: '#d4183d' }}
                >
                  <Ban size={16} className="mr-1" />
                  Block
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
