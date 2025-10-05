import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { cities } from '../data/cities'
import { Upload, User } from 'lucide-react'

interface ProfileSetupPageProps {
  onComplete: (profile: {
    nickname: string;
    age: number;
    pronouns: string;
    location: { city: string; country: string };
    profilePicture?: string;
  }) => void;
}

export function ProfileSetupPage({ onComplete }: ProfileSetupPageProps) {
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [customPronouns, setCustomPronouns] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [error, setError] = useState('');
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggType, setEasterEggType] = useState<'old' | 'young'>('old');

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be smaller than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicture(result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    setError('');
    setShowEasterEgg(false);

    if (!nickname) {
      setError('Please enter a nickname');
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
      setError('Please enter a valid age');
      return;
    }

    if (ageNum > 116) {
      setEasterEggType('old');
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setAge('');
      }, 3000);
      return;
    }

    if (ageNum < 15) {
      setEasterEggType('young');
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setAge('');
      }, 3000);
      return;
    }

    if (!pronouns) {
      setError('Please select your pronouns');
      return;
    }

    if (pronouns === 'other' && !customPronouns) {
      setError('Please enter your pronouns');
      return;
    }

    if (!selectedCity) {
      setError('Please select your location');
      return;
    }

    const selectedLocation = cities.find(c => `${c.city}, ${c.country}` === selectedCity);
    if (!selectedLocation) {
      setError('Invalid location selected');
      return;
    }

    onComplete({
      nickname,
      age: ageNum,
      pronouns: pronouns === 'other' ? customPronouns : pronouns,
      location: { city: selectedLocation.city, country: selectedLocation.country },
      profilePicture,
    });
  };

  if (showEasterEgg) {
    return (
      <div 
        className="size-full flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
        }}
      >
        {easterEggType === 'old' ? (
          <div className="text-center space-y-6 relative z-10">
            <div className="text-6xl animate-bounce">☄️</div>
            <h2 className="text-4xl" style={{ color: '#faf2e6' }}>
              Ok dinosaur! 🦕
            </h2>
            <p className="text-2xl" style={{ color: '#faf2e6' }}>
              IDK how you survived that asteroid but we're sending you back...
            </p>
          </div>
        ) : (
          <div className="text-center space-y-6 animate-pulse">
            <div className="text-6xl">🥚</div>
            <h2 className="text-4xl" style={{ color: '#faf2e6' }}>
              Too young for this adventure!
            </h2>
            <p className="text-2xl" style={{ color: '#faf2e6' }}>
              Back in the shell you go...
            </p>
          </div>
        )}
        
        <div 
          className="absolute inset-0 bg-black animate-pulse"
          style={{ 
            animationDuration: '1.5s',
            opacity: easterEggType === 'young' ? 0.8 : 0.3,
          }}
        />
      </div>
    );
  }

  return (
    <div 
      className="size-full flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
      }}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl"
        style={{
          backgroundColor: 'rgba(250, 242, 230, 0.95)',
        }}
      >
        <h2 className="text-3xl mb-6 text-center" style={{ color: '#48573e' }}>
          Let's Get to Know You
        </h2>
        
        <div className="space-y-4">
          <div>
            <Label style={{ color: '#48573e' }}>Preferred Nickname</Label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="What should we call you?"
              className="mt-1 rounded-xl border-2"
              style={{ borderColor: '#809671' }}
            />
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Profile Picture</Label>
            <div className="mt-1 flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center" 
                   style={{ borderColor: '#809671', backgroundColor: '#f3f3f5' }}>
                {profilePicture ? (
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8" style={{ color: '#809671' }} />
                )}
              </div>
              <div className="flex-1">
                <label 
                  htmlFor="profile-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderColor: '#809671', color: '#48573e' }}
                >
                  <Upload className="w-4 h-4" />
                  Choose Image
                </label>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
                <p className="text-xs mt-1" style={{ color: '#666' }}>
                  Max 5MB. JPG, PNG, GIF supported.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Age</Label>
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age (15-116)"
              className="mt-1 rounded-xl border-2"
              style={{ borderColor: '#809671' }}
              min={15}
              max={116}
            />
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Pronouns</Label>
            <Select value={pronouns} onValueChange={setPronouns}>
              <SelectTrigger 
                className="mt-1 rounded-xl border-2"
                style={{ borderColor: '#809671' }}
              >
                <SelectValue placeholder="Select your pronouns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="she/her">she/her</SelectItem>
                <SelectItem value="he/him">he/him</SelectItem>
                <SelectItem value="they/them">they/them</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            {pronouns === 'other' && (
              <Input
                value={customPronouns}
                onChange={(e) => setCustomPronouns(e.target.value)}
                placeholder="Enter your pronouns"
                className="mt-2 rounded-xl border-2"
                style={{ borderColor: '#809671' }}
              />
            )}
          </div>

          <div>
            <Label style={{ color: '#48573e' }}>Location (City, Country)</Label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger 
                className="mt-1 rounded-xl border-2"
                style={{ borderColor: '#809671' }}
              >
                <SelectValue placeholder="Select your location" />
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

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full rounded-xl text-lg py-6 mt-6"
            style={{
              backgroundColor: '#48573e',
              color: '#faf2e6',
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
