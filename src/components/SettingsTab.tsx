import { useState } from 'react';
import { User } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';

interface SettingsTabProps {
  currentUser: User;
  onUpdateProfile: (updates: Partial<User>) => void;
  onUnblockUser: (username: string) => void;
}

export function SettingsTab({ currentUser, onUpdateProfile, onUnblockUser }: SettingsTabProps) {
  const [showSecurity, setShowSecurity] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [volume, setVolume] = useState([75]);
  const [noiseSuppression, setNoiseSuppression] = useState(true);

  const handleSendVerification = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    alert(`Verification code sent to ${currentUser.email}: ${code}`);
  };

  const handleVerify = () => {
    if (verificationCode === sentCode) {
      setVerified(true);
      alert('Verified successfully!');
    } else {
      alert('Invalid verification code');
    }
  };

  const handleChangePassword = () => {
    if (newPassword.length < 8 || newPassword.length > 20) {
      alert('Password must be 8-20 characters');
      return;
    }
    if (!/\d/.test(newPassword)) {
      alert('Password must include at least one number');
      return;
    }
    
    onUpdateProfile({ password: newPassword });
    alert('Password changed successfully!');
    setNewPassword('');
    setVerified(false);
    setVerificationCode('');
    setSentCode('');
  };

  return (
    <div className="p-6 space-y-6">
      <h3 className="text-2xl" style={{ color: '#48573e' }}>
        Settings
      </h3>

      {/* Security Section */}
      <div>
        <button
          onClick={() => setShowSecurity(!showSecurity)}
          className="w-full text-left p-3 rounded-xl"
          style={{ backgroundColor: '#b4c7a7', color: '#48573e' }}
        >
          <h4>Security</h4>
        </button>
        
        {showSecurity && (
          <div className="mt-3 space-y-4 p-3 border-2 rounded-xl" style={{ borderColor: '#809671' }}>
            <div>
              <Label style={{ color: '#48573e' }}>Change Password</Label>
              {!verified ? (
                <div className="space-y-2 mt-2">
                  <Button
                    onClick={handleSendVerification}
                    className="w-full rounded-xl"
                    style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                  >
                    Send Verification Code
                  </Button>
                  
                  {sentCode && (
                    <>
                      <Input
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="rounded-xl"
                        style={{ borderColor: '#809671' }}
                        maxLength={6}
                      />
                      <Button
                        onClick={handleVerify}
                        className="w-full rounded-xl"
                        style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                      >
                        Verify
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-2 mt-2">
                  <p className="text-sm" style={{ color: '#666' }}>
                    Current password: {currentUser.password}
                  </p>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="rounded-xl"
                    style={{ borderColor: '#809671' }}
                  />
                  <Button
                    onClick={handleChangePassword}
                    className="w-full rounded-xl"
                    style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                  >
                    Change Password
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <Label style={{ color: '#48573e' }}>Blocked Users</Label>
              {!currentUser.blockedUsers || currentUser.blockedUsers.length === 0 ? (
                <p className="text-sm mt-2" style={{ color: '#666' }}>
                  No blocked users
                </p>
              ) : (
                <div className="space-y-2 mt-2">
                  {currentUser.blockedUsers.map(username => (
                    <div
                      key={username}
                      className="flex items-center justify-between p-2 rounded-xl"
                      style={{ backgroundColor: '#f0f0f0' }}
                    >
                      <span style={{ color: '#48573e' }}>@{username}</span>
                      <Button
                        onClick={() => onUnblockUser(username)}
                        size="sm"
                        className="rounded-xl"
                        style={{ backgroundColor: '#48573e', color: '#faf2e6' }}
                      >
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Audio Section */}
      <div>
        <h4 className="mb-3" style={{ color: '#48573e' }}>Audio</h4>
        <div className="space-y-4 p-3 border-2 rounded-xl" style={{ borderColor: '#809671' }}>
          <div>
            <Label style={{ color: '#48573e' }}>Volume ({volume[0]}%)</Label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="mt-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label style={{ color: '#48573e' }}>Noise Suppression</Label>
            <Switch
              checked={noiseSuppression}
              onCheckedChange={setNoiseSuppression}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
