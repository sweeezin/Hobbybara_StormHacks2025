import { useState, useMemo } from 'react';
import { User, Friend } from '../types';
import { AppSidebar } from './AppSidebar';
import { SearchResults } from './SearchResults';
import { UserProfile } from './UserProfile';
import { Input } from './ui/input';
import { Search, Menu } from 'lucide-react';
import { hobbies } from '../data/hobbies';
import { cities } from '../data/cities';

interface MainPageProps {
  currentUser: User;
  friends: Friend[];
  onLogout: () => void;
  onDeleteAccount: () => void;
  onUpdateProfile: (updates: Partial<User>) => void;
  onAddFriend: (friend: Friend) => void;
  onRemoveFriend: (username: string) => void;
  onBlockUser: (username: string) => void;
  onUnblockUser: (username: string) => void;
}

// Generate mock users
const generateMockUsers = (): Friend[] => {
  const names = [
    'SarahJane', 'MikeTheHiker', 'ArtLover23', 'CodeNinja', 'YogaMaster',
    'BookwormBella', 'GamerGal', 'ChefCharlie', 'PhotoPhil', 'MusicMaya',
    'DanceDan', 'CraftyCathy', 'RunnerRyan', 'PainterPete', 'GuitarGrace',
    'BakerBeth', 'ClimberCam', 'WriterWill', 'SingerSara', 'FitnessFrank'
  ];

  const pronounsList = ['she/her', 'he/him', 'they/them'];
  const personalities: ('Extrovert' | 'Introvert')[] = ['Extrovert', 'Introvert'];

  return names.map((name, i) => ({
    username: name,
    nickname: name.replace(/([A-Z])/g, ' $1').trim(),
    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    topHobby: hobbies[i % hobbies.length].name,
    hobbies: [
      hobbies[i % hobbies.length].name,
      hobbies[(i + 1) % hobbies.length].name,
      hobbies[(i + 2) % hobbies.length].name,
    ],
    age: 18 + (i % 40),
    pronouns: pronounsList[i % pronounsList.length],
    location: cities[i % cities.length],
    personality: personalities[i % 2],
    learningInterests: [
      hobbies[(i + 3) % hobbies.length].name,
      hobbies[(i + 4) % hobbies.length].name,
    ],
  }));
};

export function MainPage({
  currentUser,
  friends,
  onLogout,
  onDeleteAccount,
  onUpdateProfile,
  onAddFriend,
  onRemoveFriend,
  onBlockUser,
  onUnblockUser,
}: MainPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Friend | null>(null);
  
  const mockUsers = useMemo(() => generateMockUsers(), []);
  
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const searchLower = searchQuery.toLowerCase();
    return mockUsers.filter(user => {
      return (
        user.hobbies.some(h => h.toLowerCase().includes(searchLower)) ||
        user.learningInterests.some(i => i.toLowerCase().includes(searchLower)) ||
        user.username.toLowerCase().includes(searchLower) ||
        user.nickname.toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery, mockUsers]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.trim().length > 0);
  };

  const handleViewProfile = (user: Friend) => {
    setSelectedUser(user);
    setIsSearching(false);
  };

  const handleBackToMain = () => {
    setSelectedUser(null);
    setIsSearching(false);
    setSearchQuery('');
  };

  const isFriend = (username: string) => {
    return friends.some(f => f.username === username);
  };

  const isBlocked = (username: string) => {
    return currentUser.blockedUsers?.includes(username) || false;
  };

  if (selectedUser) {
    return (
      <UserProfile
        user={selectedUser}
        currentUser={currentUser}
        isFriend={isFriend(selectedUser.username)}
        isBlocked={isBlocked(selectedUser.username)}
        onBack={handleBackToMain}
        onAddFriend={onAddFriend}
        onRemoveFriend={onRemoveFriend}
        onBlockUser={onBlockUser}
        onUnblockUser={onUnblockUser}
      />
    );
  }

  return (
    <div 
      className="size-full flex"
      style={{
        background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
      }}
    >
      <AppSidebar
        currentUser={currentUser}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={onLogout}
        onDeleteAccount={onDeleteAccount}
        onUpdateProfile={onUpdateProfile}
        onUnblockUser={onUnblockUser}
        friends={friends}
        onViewFriend={handleViewProfile}
        onRemoveFriend={onRemoveFriend}
        onBlockUser={onBlockUser}
      />

      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Header with Menu and Search */}
        <div className="flex items-center gap-4 mb-6">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl"
              style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
            >
              <Menu size={24} />
            </button>
          )}
          
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              size={20}
              style={{ color: '#48573e' }}
            />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Let's find some new friends..."
              className="pl-10 rounded-xl border-2 py-6"
              style={{
                borderColor: '#48573e',
                backgroundColor: 'rgba(250, 242, 230, 0.95)',
                color: '#48573e',
              }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className="flex-1 rounded-3xl p-6 overflow-auto"
          style={{
            backgroundColor: 'rgba(250, 242, 230, 0.95)',
          }}
        >
          {isSearching ? (
            <SearchResults
              users={filteredUsers}
              searchQuery={searchQuery}
              onViewProfile={handleViewProfile}
              blockedUsers={currentUser.blockedUsers || []}
              friendUsernames={friends.map(f => f.username)}
            />
          ) : (
            <div>
              <h2 className="text-2xl mb-6" style={{ color: '#48573e' }}>
                Your Friends
              </h2>
              
              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl opacity-60" style={{ color: '#48573e' }}>
                    Let's find some new friends!
                  </p>
                  <p className="mt-2 opacity-40" style={{ color: '#48573e' }}>
                    Use the search bar above to discover people with similar hobbies
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map((friend) => (
                    <div
                      key={friend.username}
                      className="p-4 rounded-xl border-2 cursor-pointer hover:shadow-lg transition-all"
                      style={{
                        borderColor: '#809671',
                        backgroundColor: '#fff',
                      }}
                      onClick={() => handleViewProfile(friend)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={friend.profilePicture}
                          alt={friend.nickname}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <h3 style={{ color: '#48573e' }}>{friend.nickname}</h3>
                          <p className="text-sm opacity-60" style={{ color: '#48573e' }}>
                            @{friend.username}
                          </p>
                        </div>
                      </div>
                      <div 
                        className="px-3 py-1 rounded-full inline-block"
                        style={{
                          backgroundColor: '#b4c7a7',
                          color: '#48573e',
                        }}
                      >
                        {friend.topHobby}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
