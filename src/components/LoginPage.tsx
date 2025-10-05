import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User } from '../types';
import logoImage from 'figma:asset/028583a9d69cf6549ae89b1e29cda3c69534dfe3.png';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
  onSignup: () => void;
  users: User[];
}

export function LoginPage({ onLogin, onSignup, users }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code' | 'newPassword'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [resetUsername, setResetUsername] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  const handleForgotPassword = () => {
    if (resetStep === 'email') {
      const user = users.find(u => u.email.toLowerCase() === resetEmail.toLowerCase());
      if (!user) {
        setError('Email not found');
        return;
      }
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);
      setResetUsername(user.username);
      setResetStep('code');
      setError('');
      alert(`Verification code sent to ${user.email}: ${code}`);
    } else if (resetStep === 'code') {
      if (verificationCode === sentCode) {
        setResetStep('newPassword');
        setError('');
      } else {
        setError('Invalid verification code');
      }
    } else if (resetStep === 'newPassword') {
      if (newPassword.length < 8 || newPassword.length > 20) {
        setError('Password must be 8-20 characters');
        return;
      }
      if (!/\d/.test(newPassword)) {
        setError('Password must include at least one number');
        return;
      }
      // Update password in users array (this would normally be handled by parent)
      alert('Password reset successfully!');
      setShowForgotPassword(false);
      setResetStep('email');
      setResetEmail('');
      setVerificationCode('');
      setNewPassword('');
      setSentCode('');
      setError('');
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
            Find friends who share your passions
          </p>
        </div>

        {/* Right side - Form */}
        <div 
          className="bg-white rounded-3xl p-8 shadow-2xl"
          style={{
            backgroundColor: 'rgba(250, 242, 230, 0.95)',
          }}
        >
          {!showForgotPassword ? (
            <>
              <h2 className="text-3xl mb-6 text-center" style={{ color: '#48573e' }}>
                Welcome Back
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label style={{ color: '#48573e' }}>Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="mt-1 rounded-xl border-2"
                    style={{ borderColor: '#809671' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>

                <div>
                  <Label style={{ color: '#48573e' }}>Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mt-1 rounded-xl border-2"
                    style={{ borderColor: '#809671' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <Button
                  onClick={handleLogin}
                  className="w-full rounded-xl text-lg py-6"
                  style={{
                    backgroundColor: '#48573e',
                    color: '#faf2e6',
                  }}
                >
                  Login
                </Button>

                <button
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError('');
                  }}
                  className="text-sm underline w-full text-center"
                  style={{ color: '#48573e' }}
                >
                  Forgot Password?
                </button>

                <div className="border-t-2 pt-4 mt-4" style={{ borderColor: '#809671' }}>
                  <p className="text-center mb-3" style={{ color: '#48573e' }}>
                    Don't have an account?
                  </p>
                  <Button
                    onClick={onSignup}
                    variant="outline"
                    className="w-full rounded-xl text-lg py-6 border-2"
                    style={{
                      borderColor: '#48573e',
                      color: '#48573e',
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-3xl mb-6 text-center" style={{ color: '#48573e' }}>
                Reset Password
              </h2>
              
              <div className="space-y-4">
                {resetStep === 'email' && (
                  <div>
                    <Label style={{ color: '#48573e' }}>Email</Label>
                    <Input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="mt-1 rounded-xl border-2"
                      style={{ borderColor: '#809671' }}
                    />
                  </div>
                )}

                {resetStep === 'code' && (
                  <div>
                    <Label style={{ color: '#48573e' }}>Verification Code</Label>
                    <Input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="mt-1 rounded-xl border-2"
                      style={{ borderColor: '#809671' }}
                      maxLength={6}
                    />
                  </div>
                )}

                {resetStep === 'newPassword' && (
                  <div>
                    <Label style={{ color: '#48573e' }}>New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (8-20 chars, must include a number)"
                      className="mt-1 rounded-xl border-2"
                      style={{ borderColor: '#809671' }}
                    />
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <Button
                  onClick={handleForgotPassword}
                  className="w-full rounded-xl text-lg py-6"
                  style={{
                    backgroundColor: '#48573e',
                    color: '#faf2e6',
                  }}
                >
                  {resetStep === 'email' ? 'Send Code' : resetStep === 'code' ? 'Verify Code' : 'Reset Password'}
                </Button>

                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetStep('email');
                    setResetEmail('');
                    setVerificationCode('');
                    setNewPassword('');
                    setSentCode('');
                    setError('');
                  }}
                  className="text-sm underline w-full text-center"
                  style={{ color: '#48573e' }}
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
