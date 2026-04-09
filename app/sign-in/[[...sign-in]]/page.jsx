'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Added Next.js Link import

export default function CustomSignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    setIsGoogleLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (err) {
      setError('Failed to initialize Google login.');
      setIsGoogleLoading(false);
    }
  };

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
        router.push('/'); 
      } else {
        setError('Further verification is required.');
      }
    } catch (err) {
      setError(err.errors[0]?.longMessage || 'An error occurred during sign in.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    // Outer container: Pitch dark slate
    <div className="relative flex min-h-screen items-center justify-center bg-[#020617] px-4 sm:px-6 lg:px-8 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* --- DUO-TONE BACKGROUND ORBS --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse duration-1000"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[150px] animate-pulse duration-1000" style={{ animationDelay: '3s' }}></div>

      {/* --- GLASSMORPHISM CARD --- */}
      <div className="relative z-10 w-full max-w-md p-8 backdrop-blur-2xl bg-[#0f172a]/40 border border-slate-800 rounded-[2rem] shadow-[0_0_50px_-12px_rgba(6,182,212,0.15)]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">Log in to continue your journey</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl text-center backdrop-blur-sm shadow-inner">
            {error}
          </div>
        )}

        {/* --- GOOGLE BUTTON --- */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isEmailLoading}
          className="w-full flex items-center justify-center px-4 py-3.5 mb-6 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-200 font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-cyan-500/10"
        >
          {isGoogleLoading ? (
            <div className="w-5 h-5 border-2 border-slate-500 border-t-cyan-400 rounded-full animate-spin"></div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
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
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-widest">Or email</div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        </div>

        {/* --- EMAIL/PASSWORD FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-400 ml-1">
              Email
            </label>
            <input
              type="email"
              required
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#020617]/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 shadow-inner"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-400 ml-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#020617]/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300 shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isEmailLoading || isGoogleLoading}
            className="w-full flex justify-center py-3.5 px-4 mt-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEmailLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* --- REGISTER LINK ADDED HERE --- */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link 
            href="/sign-up" 
            className="font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200"
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}