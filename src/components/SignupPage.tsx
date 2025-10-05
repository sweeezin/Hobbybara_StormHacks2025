import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import logoImage from 'figma:asset/028583a9d69cf6549ae89b1e29cda3c69534dfe3.png';

interface SignupPageProps {
  onSignup: (username: string, password: string, email: string) => { success: boolean; error?: string };
  onBack: () => void;
}

export function SignupPage({ onSignup, onBack }: SignupPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    setError('');

    // Validate username
    if (!username || username.length > 20) {
      setError('Username must be 1-20 characters');
      return;
    }

    // Validate password
    if (password.length < 8 || password.length > 20) {
      setError('Password must be 8-20 characters');
      return;
    }
    if (!/\d/.test(password)) {
      setError('Password must include at least one number');
      return;
    }

    // Validate email
    if (!email || (!email.includes('@') && !/^\d{10,}$/.test(email))) {
      setError('Please enter a valid email or phone number');
      return;
    }

    const result = onSignup(username, password, email);
    if (!result.success) {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div 
      className="size-full flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #809671 0%, #b4c7a7 100%)',
      }}
    >
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Decorative */}
        <div className="hidden md:flex flex-col items-center justify-center text-center space-y-6">
          <img 
            src={logoImage}
            alt="MerriMates Logo"
            className="w-full max-w-md"
            style={{
              filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.2))',
            }}
          />
          <p className="text-xl" style={{ color: '#faf2e6' }}>
            Join our community today
          </p>
        </div>

        {/* Right side - Form */}
        <div 
          className="bg-white rounded-3xl p-8 shadow-2xl"
          style={{
            backgroundColor: 'rgba(250, 242, 230, 0.95)',
          }}
        >
          <h2 className="text-3xl mb-6 text-center" style={{ color: '#48573e' }}>
            Create Account
          </h2>
          
          <div className="space-y-4">
            <div>
              <Label style={{ color: '#48573e' }}>Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username (max 20 characters)"
                className="mt-1 rounded-xl border-2"
                style={{ borderColor: '#809671' }}
                maxLength={20}
              />
              <p className="text-xs mt-1" style={{ color: '#666' }}>
                Not case-sensitive
              </p>
            </div>

            <div>
              <Label style={{ color: '#48573e' }}>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (8-20 characters)"
                className="mt-1 rounded-xl border-2"
                style={{ borderColor: '#809671' }}
                maxLength={20}
              />
              <p className="text-xs mt-1" style={{ color: '#666' }}>
                Must be 8-20 characters and include at least one number
              </p>
            </div>

            <div>
              <Label style={{ color: '#48573e' }}>Email/Phone</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email or phone number"
                className="mt-1 rounded-xl border-2"
                style={{ borderColor: '#809671' }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              onClick={handleSignup}
              className="w-full rounded-xl text-lg py-6"
              style={{
                backgroundColor: '#48573e',
                color: '#faf2e6',
              }}
            >
              Sign Up
            </Button>

            <button
              onClick={onBack}
              className="text-sm underline w-full text-center"
              style={{ color: '#48573e' }}
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
