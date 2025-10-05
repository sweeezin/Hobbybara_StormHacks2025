import { useEffect, useState } from 'react';

interface WelcomePageProps {
  nickname: string;
}

export function WelcomePage({ nickname }: WelcomePageProps) {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in
    setTimeout(() => setOpacity(1), 100);
    // Fade out
    setTimeout(() => setOpacity(0), 2500);
  }, []);

  return (
    <div 
      className="size-full flex items-center justify-center p-4 transition-opacity duration-1000"
      style={{
        background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
        opacity,
      }}
    >
      <div className="text-center space-y-6">
        <div 
          className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl animate-bounce"
          style={{
            background: 'radial-gradient(circle, #b4c7a7 0%, #809671 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}
        >
          🎉
        </div>
        <h1 className="text-5xl" style={{ color: '#faf2e6' }}>
          Welcome, {nickname}!
        </h1>
        <p className="text-2xl" style={{ color: '#faf2e6' }}>
          Let's find your MerriMates
        </p>
      </div>
    </div>
  );
}
