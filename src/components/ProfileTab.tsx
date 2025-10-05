import { useState, useMemo } from 'react';
import { User } from '../types';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { cities } from '../data/cities';
import { hobbies } from '../data/hobbies';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';
import { Upload, User as UserIcon } from 'lucide-react';

interface ProfileTabProps {
  currentUser: User;
  onUpdateProfile: (updates: Partial<User>) => void;
}

export function ProfileTab({ currentUser, onUpdateProfile }: ProfileTabProps) {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(currentUser.nickname || '');
  const [age, setAge] = useState(currentUser.age?.toString() || '');
  const [pronouns, setPronouns] = useState(currentUser.pronouns || '');
  const [selectedCity, setSelectedCity] = useState(
    currentUser.location ? `${currentUser.location.city}, ${currentUser.location.country}` : ''
  );
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(currentUser.hobbies || []);
  const [selectedLearning, setSelectedLearning] = useState<string[]>(currentUser.learningInterests || []);
  const [profilePicture, setProfilePicture] = useState(currentUser.profilePicture || '');
  
  const limitedHobbies = useMemo(() => hobbies.slice(0, 50), []);

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const selectedLocation = cities.find(c => `${c.city}, ${c.country}` === selectedCity);
    
    onUpdateProfile({
      nickname,
      age: parseInt(age),
      pronouns,
      location: selectedLocation ? { city: selectedLocation.city, country: selectedLocation.country } : currentUser.location,
      hobbies: selectedHobbies,
      learningInterests: selectedLearning,
      profilePicture,
    });
    
    setEditing(false);
  };

  const handleToggleHobby = (hobby: string) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobby)) {
        return prev.filter(h => h !== hobby);
      } else if (prev.length < 10) {
        return [...prev, hobby];
      }
      return prev;
    });
  };

  const handleToggleLearning = (hobby: string) => {
    setSelectedLearning(prev => {
      if (prev.includes(hobby)) {
        return prev.filter(h => h !== hobby);
      } else if (prev.length < 10) {
        return [...prev, hobby];
      }
      return prev;
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl" style={{ color: '#48573e' }}>
          Profile
        </h3>
        {!editing && (
          <Button
            onClick={() => setEditing(true)}
            className="rounded-xl"
            style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
          >
            Edit
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center">
        <img
          src={profilePicture || currentUser.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
          alt={currentUser.nickname}
          className="w-24 h-24 rounded-full border-4"
          style={{ borderColor: '#48573e' }}
        />
        <h4 className="mt-3" style={{ color: '#48573e' }}>
          @{currentUser.username}
        </h4>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <Label style={{ color: '#48573e' }}>Profile Picture</Label>
            <div className="mt-1 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex items-center justify-center" 
                   style={{ borderColor: '#809671', backgroundColor: '#f3f3f5' }}>
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6" style={{ color: '#809671' }} />
                )}
              </div>
              <div className="flex-1">
                <label 
                  htmlFor="profile-upload-edit"
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border cursor-pointer transition-colors hover:bg-gray-50 text-sm"
                  style={{ borderColor: '#809671', color: '#48573e' }}
                >
                  <Upload className="w-3 h-3" />
                  Change Photo
                </label>
                <input
                  id="profile-upload-edit"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Nickname</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 rounded-xl"
              style={{ borderColor: '#809671' }}
            />
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Age</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 rounded-xl"
              style={{ borderColor: '#809671' }}
            />
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Pronouns</Label>
            <Input
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className="mt-1 rounded-xl"
              style={{ borderColor: '#809671' }}
            />
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Location</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="mt-1 rounded-xl" style={{ borderColor: '#809671' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {cities.map((city, index) => (
                  <SelectItem key={index} value={`${city.city}, ${city.country}`}>
                    {city.city}, {city.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Hobbies ({selectedHobbies.length}/10)</Label>
            <ScrollArea className="h-40 border-2 rounded-xl mt-1" style={{ borderColor: '#809671' }}>
              <div className="p-2">
                {limitedHobbies.map(hobby => (
                  <div key={hobby.name} className="flex items-center space-x-2 p-1">
                    <Checkbox
                      checked={selectedHobbies.includes(hobby.name)}
                      onCheckedChange={() => handleToggleHobby(hobby.name)}
                    />
                    <Label className="cursor-pointer text-sm" style={{ color: '#48573e' }}>
                      {hobby.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Learning Interests ({selectedLearning.length}/10)</Label>
            <ScrollArea className="h-40 border-2 rounded-xl mt-1" style={{ borderColor: '#809671' }}>
              <div className="p-2">
                {limitedHobbies.map(hobby => (
                  <div key={hobby.name} className="flex items-center space-x-2 p-1">
                    <Checkbox
                      checked={selectedLearning.includes(hobby.name)}
                      onCheckedChange={() => handleToggleLearning(hobby.name)}
                    />
                    <Label className="cursor-pointer text-sm" style={{ color: '#48573e' }}>
                      {hobby.name}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 rounded-xl"
              style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
            >
              Save
            </Button>
            <Button
              onClick={() => setEditing(false)}
              variant="outline"
              className="flex-1 rounded-xl"
              style={{ borderColor: '#48573e', color: '#48573e' }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <Label style={{ color: '#666' }}>Nickname</Label>
            <p style={{ color: '#48573e' }}>{currentUser.nickname}</p>
          </div>
          <div>
            <Label style={{ color: '#666' }}>Age</Label>
            <p style={{ color: '#48573e' }}>{currentUser.age}</p>
          </div>
          <div>
            <Label style={{ color: '#666' }}>Pronouns</Label>
            <p style={{ color: '#48573e' }}>{currentUser.pronouns}</p>
          </div>
          <div>
            <Label style={{ color: '#666' }}>Location</Label>
            <p style={{ color: '#48573e' }}>
              {currentUser.location?.city}, {currentUser.location?.country}
            </p>
          </div>
          <div>
            <Label style={{ color: '#666' }}>Personality</Label>
            <p style={{ color: '#48573e' }}>{currentUser.personality}</p>
          </div>
          <div>
            <Label style={{ color: '#666' }}>Hobbies</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentUser.hobbies?.map(hobby => (
                <span
                  key={hobby}
                  className="px-2 py-1 rounded-full text-sm"
                  style={{ backgroundColor: '#b4c7a7', color: '#48573e' }}
                >
                  {hobby}
                </span>
              ))}
            </div>
          </div>
          <div>
            <Label style={{ color: '#666' }}>Learning Interests</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {currentUser.learningInterests?.map(interest => (
                <span
                  key={interest}
                  className="px-2 py-1 rounded-full text-sm"
                  style={{ backgroundColor: '#809671', color: '#faf2e6' }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
