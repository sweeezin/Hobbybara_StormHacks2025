import { useState } from 'react';
import { Friend } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { MapPin } from 'lucide-react';

interface SearchResultsProps {
  users: Friend[];
  searchQuery: string;
  onViewProfile: (user: Friend) => void;
  blockedUsers: string[];
  friendUsernames: string[];
}

export function SearchResults({ users, searchQuery, onViewProfile, blockedUsers, friendUsernames }: SearchResultsProps) {
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [hobbyFilter, setHobbyFilter] = useState<string>('all');
  const [personalityFilter, setPersonalityFilter] = useState<string>('all');

  // Filter users
  const filteredUsers = users.filter(user => {
    if (blockedUsers.includes(user.username)) return false;
    
    if (ageFilter !== 'all') {
      const [min, max] = ageFilter.split('-').map(Number);
      if (max) {
        if (user.age < min || user.age > max) return false;
      } else {
        if (user.age < min) return false;
      }
    }

    if (hobbyFilter !== 'all' && !user.hobbies.includes(hobbyFilter)) {
      return false;
    }

    if (personalityFilter !== 'all' && user.personality !== personalityFilter) {
      return false;
    }

    return true;
  });

  // Get unique hobbies from results
  const allHobbies = Array.from(new Set(users.flatMap(u => u.hobbies))).sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl" style={{ color: '#48573e' }}>
          Search Results for "{searchQuery}"
        </h2>
        <p style={{ color: '#666' }}>
          {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl" style={{ backgroundColor: '#fff' }}>
        <div>
          <Label className="text-sm" style={{ color: '#48573e' }}>Age Range</Label>
          <Select value={ageFilter} onValueChange={setAgeFilter}>
            <SelectTrigger className="mt-1 rounded-xl" style={{ borderColor: '#809671' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ages</SelectItem>
              <SelectItem value="15-20">15-20</SelectItem>
              <SelectItem value="21-30">21-30</SelectItem>
              <SelectItem value="31-40">31-40</SelectItem>
              <SelectItem value="41-50">41-50</SelectItem>
              <SelectItem value="51-100">51+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm" style={{ color: '#48573e' }}>Hobby</Label>
          <Select value={hobbyFilter} onValueChange={setHobbyFilter}>
            <SelectTrigger className="mt-1 rounded-xl" style={{ borderColor: '#809671' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectItem value="all">All Hobbies</SelectItem>
              {allHobbies.map(hobby => (
                <SelectItem key={hobby} value={hobby}>{hobby}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm" style={{ color: '#48573e' }}>Personality</Label>
          <Select value={personalityFilter} onValueChange={setPersonalityFilter}>
            <SelectTrigger className="mt-1 rounded-xl" style={{ borderColor: '#809671' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Extrovert">Extrovert</SelectItem>
              <SelectItem value="Introvert">Introvert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <p style={{ color: '#666' }}>
            No users found matching your criteria
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map(user => (
            <div
              key={user.username}
              className="p-4 rounded-xl border-2 cursor-pointer hover:shadow-lg transition-all"
              style={{
                borderColor: '#809671',
                backgroundColor: '#fff',
              }}
              onClick={() => onViewProfile(user)}
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={user.profilePicture}
                  alt={user.nickname}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 style={{ color: '#48573e' }}>{user.nickname}</h3>
                  <p className="text-sm opacity-60" style={{ color: '#48573e' }}>
                    @{user.username}
                  </p>
                  <p className="text-sm" style={{ color: '#666' }}>
                    {user.age} • {user.pronouns}
                  </p>
                </div>
                {friendUsernames.includes(user.username) && (
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                  >
                    Friend
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-sm mb-2" style={{ color: '#666' }}>
                <MapPin size={14} />
                <span>{user.location.city}, {user.location.country}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {user.hobbies.slice(0, 3).map(hobby => (
                  <span
                    key={hobby}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: searchQuery.toLowerCase().includes(hobby.toLowerCase()) 
                        ? '#48573e' 
                        : '#b4c7a7',
                      color: searchQuery.toLowerCase().includes(hobby.toLowerCase())
                        ? '#faf2e6'
                        : '#48573e',
                    }}
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
