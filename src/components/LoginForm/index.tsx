'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createBrowserSupabase } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (mode: 'sign-in' | 'sign-up') => {
    setIsLoading(true);
    setError(null);

    if (mode === 'sign-in') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push('/auth/callback?next=/studio');
      }
    } else {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=/studio`,
        },
      });

      console.log('🚀 ~ handleEmailAuth ~ result:', result);
      if (result.error) {
        setError(result.error.message);
      } else if (result.data.session) {
        // ✅ manually set the session if Supabase didn't store it automatically
        await supabase.auth.setSession(result.data.session);
        router.push('/auth/callback?next=/studio');
      } else {
        router.push('/login');
      }
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=/studio`,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        variant="secondary"
        className="w-full"
        onClick={() => handleEmailAuth('sign-up')}
        disabled={isLoading}
      >
        {isLoading ? 'Loading…' : 'Sign up with Email'}
      </Button>

      <Button
        className="w-full"
        onClick={() => handleEmailAuth('sign-in')}
        disabled={isLoading}
      >
        {isLoading ? 'Loading…' : 'Sign in with Email'}
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase text-muted-foreground">
          or
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
    </div>
  );
}
