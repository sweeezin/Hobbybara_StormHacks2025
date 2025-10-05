import { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface PersonalityPageProps {
  onComplete: (personality: 'Extrovert' | 'Introvert', lookingFor: 'Extrovert' | 'Introvert' | 'Both') => void;
}

export function PersonalityPage({ onComplete }: PersonalityPageProps) {
  const [personality, setPersonality] = useState<'Extrovert' | 'Introvert' | ''>('');
  const [lookingFor, setLookingFor] = useState<'Extrovert' | 'Introvert' | 'Both' | ''>('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!personality) {
      setError('Please select your personality type');
      return;
    }
    if (!lookingFor) {
      setError('Please select what you\'re looking for');
      return;
    }
    onComplete(personality, lookingFor);
  };

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
          Almost There!
        </h2>
        
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="text-xl" style={{ color: '#48573e' }}>
              I am an...
            </Label>
            <RadioGroup 
              value={personality} 
              onValueChange={(value) => setPersonality(value as 'Extrovert' | 'Introvert')}
              className="space-y-3"
            >
              <div 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor: personality === 'Extrovert' ? '#48573e' : '#809671',
                  backgroundColor: personality === 'Extrovert' ? 'rgba(180, 199, 167, 0.3)' : 'transparent',
                }}
                onClick={() => setPersonality('Extrovert')}
              >
                <RadioGroupItem value="Extrovert" id="extrovert" />
                <Label htmlFor="extrovert" className="cursor-pointer flex-1" style={{ color: '#48573e' }}>
                  <div>
                    <div>Extrovert</div>
                    <div className="text-sm opacity-70">I thrive in social settings and gain energy from being around others</div>
                  </div>
                </Label>
              </div>
              <div 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor: personality === 'Introvert' ? '#48573e' : '#809671',
                  backgroundColor: personality === 'Introvert' ? 'rgba(180, 199, 167, 0.3)' : 'transparent',
                }}
                onClick={() => setPersonality('Introvert')}
              >
                <RadioGroupItem value="Introvert" id="introvert" />
                <Label htmlFor="introvert" className="cursor-pointer flex-1" style={{ color: '#48573e' }}>
                  <div>
                    <div>Introvert</div>
                    <div className="text-sm opacity-70">I prefer smaller groups and recharge by spending time alone</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label className="text-xl" style={{ color: '#48573e' }}>
              I'm looking to connect with...
            </Label>
            <RadioGroup 
              value={lookingFor} 
              onValueChange={(value) => setLookingFor(value as 'Extrovert' | 'Introvert' | 'Both')}
              className="space-y-3"
            >
              <div 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor: lookingFor === 'Extrovert' ? '#48573e' : '#809671',
                  backgroundColor: lookingFor === 'Extrovert' ? 'rgba(180, 199, 167, 0.3)' : 'transparent',
                }}
                onClick={() => setLookingFor('Extrovert')}
              >
                <RadioGroupItem value="Extrovert" id="looking-extrovert" />
                <Label htmlFor="looking-extrovert" className="cursor-pointer flex-1" style={{ color: '#48573e' }}>
                  Extroverts
                </Label>
              </div>
              <div 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor: lookingFor === 'Introvert' ? '#48573e' : '#809671',
                  backgroundColor: lookingFor === 'Introvert' ? 'rgba(180, 199, 167, 0.3)' : 'transparent',
                }}
                onClick={() => setLookingFor('Introvert')}
              >
                <RadioGroupItem value="Introvert" id="looking-introvert" />
                <Label htmlFor="looking-introvert" className="cursor-pointer flex-1" style={{ color: '#48573e' }}>
                  Introverts
                </Label>
              </div>
              <div 
                className="flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor: lookingFor === 'Both' ? '#48573e' : '#809671',
                  backgroundColor: lookingFor === 'Both' ? 'rgba(180, 199, 167, 0.3)' : 'transparent',
                }}
                onClick={() => setLookingFor('Both')}
              >
                <RadioGroupItem value="Both" id="looking-both" />
                <Label htmlFor="looking-both" className="cursor-pointer flex-1" style={{ color: '#48573e' }}>
                  Both
                </Label>
              </div>
            </RadioGroup>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full rounded-xl text-lg py-6"
            style={{
              backgroundColor: '#48573e',
              color: '#faf2e6',
            }}
          >
            Complete Setup
          </Button>
        </div>
      </div>
    </div>
  );
}
