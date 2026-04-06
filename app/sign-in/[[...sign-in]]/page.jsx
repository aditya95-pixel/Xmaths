'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  // Form State
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // --- GOOGLE OAUTH HANDLER ---
  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/', // Change this to your app's home route
      });
    } catch (err) {
      console.error(err);
      setError('Failed to initialize Google login.');
      setIsGoogleLoading(false);
    }
  };

  // --- EMAIL/PASSWORD HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    setIsEmailLoading(true);
    setError(''); 

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard'); // Change this to your app's home route
      } else {
        console.log("Sign in incomplete:", result);
        setError('Further verification is required.');
      }
    } catch (err) {
      console.error("Error signing in:", err.errors);
      setError(err.errors[0]?.longMessage || 'An error occurred during sign in.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    // Outer container with dark background and hidden overflow for background effects
    <div className="relative flex min-h-screen items-center justify-center bg-[#09090b] px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      
      {/* --- ANIMATED BACKGROUND ORBS --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* --- GLASSMORPHISM CARD --- */}
      <div className="relative z-10 w-full max-w-md p-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-purple-900/20">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-400 mt-2">Log in to continue your journey</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 text-sm text-red-400 bg-red-950/50 border border-red-900/50 rounded-xl text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* --- GOOGLE BUTTON --- */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isEmailLoading}
          className="w-full flex items-center justify-center px-4 py-3 mb-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isGoogleLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {/* --- DIVIDER --- */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <div className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Or email</div>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* --- EMAIL/PASSWORD FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isEmailLoading || isGoogleLoading}
            className="w-full flex justify-center py-3 px-4 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEmailLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}