import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { hobbies, categories } from '../data/hobbies';
import { ScrollArea } from './ui/scroll-area';

interface LearningInterestsPageProps {
  onComplete: (selectedInterests: string[]) => void;
}

export function LearningInterestsPage({ onComplete }: LearningInterestsPageProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleToggleInterest = (hobbyName: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(hobbyName)) {
        return prev.filter(h => h !== hobbyName);
      } else {
        if (prev.length >= 10) {
          setError('Maximum 10 interests allowed');
          return prev;
        }
        setError('');
        return [...prev, hobbyName];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedInterests.length === 0) {
      setError('Please select at least 1 interest to learn');
      return;
    }
    if (selectedInterests.length > 10) {
      setError('Maximum 10 interests allowed');
      return;
    }
    onComplete(selectedInterests);
  };

  const filteredHobbies = useMemo(() =>
    selectedCategory === 'all'
      ? hobbies
      : hobbies.filter(h => h.category === selectedCategory),
    [selectedCategory]
  );

  return (
    <div 
      className="size-full flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
      }}
    >
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl p-8 shadow-2xl"
        style={{
          backgroundColor: 'rgba(250, 242, 230, 0.95)',
          maxHeight: '90vh',
        }}
      >
        <h2 className="text-3xl mb-2 text-center" style={{ color: '#48573e' }}>
          What do you want to learn from others?
        </h2>
        <p className="text-center mb-4" style={{ color: '#666' }}>
          Select 1-10 interests ({selectedInterests.length} selected)
        </p>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className="px-4 py-2 rounded-xl transition-all"
            style={{
              backgroundColor: selectedCategory === 'all' ? '#48573e' : '#b4c7a7',
              color: '#faf2e6',
            }}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 rounded-xl transition-all"
              style={{
                backgroundColor: selectedCategory === category ? '#48573e' : '#b4c7a7',
                color: '#faf2e6',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <ScrollArea className="h-96 rounded-xl border-2" style={{ borderColor: '#809671' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {filteredHobbies.map((hobby) => (
              <div
                key={hobby.name}
                className="flex items-center space-x-2 p-3 rounded-lg hover:bg-opacity-50 transition-all cursor-pointer"
                style={{
                  backgroundColor: selectedInterests.includes(hobby.name) ? 'rgba(180, 199, 167, 0.3)' : 'transparent',
                }}
                onClick={() => handleToggleInterest(hobby.name)}
              >
                <Checkbox
                  id={`learn-${hobby.name}`}
                  checked={selectedInterests.includes(hobby.name)}
                  onCheckedChange={() => handleToggleInterest(hobby.name)}
                />
                <Label
                  htmlFor={`learn-${hobby.name}`}
                  className="cursor-pointer flex-1 break-words"
                  style={{ color: '#48573e' }}
                >
                  {hobby.name}
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>

        {error && (
          <p className="text-sm text-red-600 mt-4 text-center">{error}</p>
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
  );
}
