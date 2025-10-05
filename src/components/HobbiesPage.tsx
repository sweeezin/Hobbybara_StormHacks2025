import { useState, useMemo } from 'react'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { hobbies, categories } from '../data/hobbies'
import { ScrollArea } from './ui/scroll-area'

interface HobbiesPageProps {
  onComplete: (selectedHobbies: string[]) => void;
}

export function HobbiesPage({ onComplete }: HobbiesPageProps) {
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleToggleHobby = (hobbyName: string) => {
    setSelectedHobbies(prev => {
      if (prev.includes(hobbyName)) {
        return prev.filter(h => h !== hobbyName);
      } else {
        if (prev.length >= 10) {
          setError('Maximum 10 hobbies allowed');
          return prev;
        }
        setError('');
        return [...prev, hobbyName];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedHobbies.length === 0) {
      setError('Please select at least 1 hobby');
      return;
    }
    if (selectedHobbies.length > 10) {
      setError('Maximum 10 hobbies allowed');
      return;
    }
    onComplete(selectedHobbies);
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
          What hobbies do you have?
        </h2>
        <p className="text-center mb-4" style={{ color: '#666' }}>
          Select 1-10 hobbies ({selectedHobbies.length} selected)
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
                  backgroundColor: selectedHobbies.includes(hobby.name) ? 'rgba(180, 199, 167, 0.3)' : 'transparent',
                }}
                onClick={() => handleToggleHobby(hobby.name)}
              >
                <Checkbox
                  id={hobby.name}
                  checked={selectedHobbies.includes(hobby.name)}
                  onCheckedChange={() => handleToggleHobby(hobby.name)}
                />
                <Label
                  htmlFor={hobby.name}
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
