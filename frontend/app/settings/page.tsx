'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Save, Loader2 } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallet } from '@/lib/hooks/useWallet';
import { useAppStore } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const router = useRouter();
  const { authenticated } = usePrivy();
  const { address } = useWallet();
  const { user, setUser } = useAppStore();
  
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) {
      setDisplayName(user.name);
    }
  }, [user?.name]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h1 className="text-2xl font-black text-neutral-900 mb-2 uppercase">Settings unavailable</h1>
          <p className="text-[var(--ink-muted)] mb-4">Please login first</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!address) return;
    
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          displayName: displayName.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save');
        return;
      }

      // Update local store
      if (user) {
        setUser({ ...user, name: displayName.trim() || user.name });
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="bg-[var(--accent)] text-white py-16 border-b-4 border-neutral-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white neo-border neo-shadow-sm flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black mb-1 uppercase">Profile Settings</h1>
              <p className="text-white/80">Manage your display name</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-black text-neutral-900 mb-6 uppercase">Profile Information</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-semibold text-neutral-900 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white neo-border neo-shadow-sm rounded-xl focus:outline-none transition-all"
                />
                <p className="text-sm text-[var(--ink-muted)] mt-2">
                  This name will be displayed throughout the app
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  Wallet Address
                </label>
                <div className="px-4 py-3 bg-white rounded-xl neo-border neo-shadow-sm">
                  <code className="text-sm text-neutral-700 break-all">{address}</code>
                </div>
                <p className="text-sm text-[var(--ink-muted)] mt-2">
                  Wallet address cannot be changed
                </p>
              </div>

              {error && (
                <div className="p-4 bg-white neo-border neo-shadow-sm rounded-xl">
                  <p className="text-sm text-neutral-900 font-semibold">{error}</p>
                </div>
              )}

              {saved && (
                <div className="p-4 bg-white neo-border neo-shadow-sm rounded-xl">
                  <p className="text-sm text-neutral-900 font-semibold">✓ Profile saved successfully!</p>
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
