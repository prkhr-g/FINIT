'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { authService } from '@/services/auth.service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Guard so the OAuth-handling code below can only ever run ONCE per page load,
  // no matter how many times this component re-renders.
  const hasHandledOAuth = useRef(false);

  // Handle Google OAuth callback if tokens are present in URL
  useEffect(() => {
    if (hasHandledOAuth.current) return;

    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    
    if (accessToken && refreshToken) {
      hasHandledOAuth.current = true; // mark as handled BEFORE calling login/router
      login(accessToken, refreshToken, { id: 'oauth-user', email: 'google-user@example.com', name: 'Google User', role: 'USER' });
      showToast('Logged in with Google successfully!', 'success');
      router.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      login(data.accessToken, data.refreshToken, data.user);
      showToast('Logged in successfully!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };


  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080e1a] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[820px] rounded-[16px] overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-gradient-to-b from-[#111827] to-[#0b1221] border border-[#1a2235] min-h-[520px]">
        
        {/* Left decorative brand panel */}
        <div className="hidden md:flex bg-[#0d1526] border-r border-[#1a2235] relative p-8 flex-col justify-between overflow-hidden min-h-[500px]">
          <div className="text-[12px] tracking-[0.15em] text-[#8b90a3] font-bold z-10">
            FINT
          </div>
 
          <div className="relative flex-1 flex items-center justify-center">
            <style>{`
              @keyframes drawCircle {
                from {
                  stroke-dashoffset: 754;
                }
                to {
                  stroke-dashoffset: 0;
                }
              }
              .animate-draw-circle {
                stroke-dasharray: 754;
                stroke-dashoffset: 754;
                animation: drawCircle 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
              }
            `}</style>
            <svg viewBox="0 0 300 300" className="w-[280px] h-[280px] absolute">
              <circle cx="150" cy="150" r="120" fill="none" stroke="#1a2235" strokeWidth="1" />
              <circle 
                cx="150" 
                cy="150" 
                r="120" 
                fill="none" 
                stroke="#1558c6" 
                strokeWidth="1.5" 
                transform="rotate(-90 150 150)" 
                className="animate-draw-circle"
              />
              <circle cx="150" cy="150" r="120" fill="none" stroke="#1a2235" strokeWidth="1" strokeDasharray="1,4" className="opacity-60" transform="rotate(20 150 150)" />
              <circle cx="150" cy="30" r="4" fill="#1558c6" />
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-[52px] font-bold text-[#1558c6] opacity-10 m-0 tracking-[0.1em]">2026</p>
              <p className="text-[34px] font-bold text-white -mt-[14px] tracking-[0.02em]">FINT</p>
              <p className="text-[11px] tracking-[0.1em] text-[#8b90a3] mt-2 font-medium">FINANCIAL CLARITY, DAILY</p>
            </div>
          </div>
 
          <p className="text-[12px] text-[#8b90a3] leading-[1.6] z-10 m-0 font-medium">
            "Aapka score, aapki saving habits ka aaina hai — FINT ne mujhe 6 mahine mein apna emergency fund double karne mein madad ki."
            <br />
            <span className="font-semibold text-white">— Priya N., FINT user</span>
          </p>
        </div>
 
        {/* Right form panel */}
        <form onSubmit={handleSubmit} className="p-8 md:p-11 flex flex-col justify-center min-h-[500px]">
          <p className="text-[11px] tracking-[0.15em] text-[#8b90a3] font-bold m-0 mb-2">WELCOME BACK</p>
          <h1 className="text-[30px] font-bold text-white m-0 mb-1.5 tracking-[-0.02em]">Log in to FINT</h1>
          <p className="text-[13px] text-[#8b90a3] m-0 mb-7">Apni financial journey continue karein</p>
 
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-[11px] tracking-[0.06em] text-[#8b90a3] block mb-1.5 font-semibold uppercase">EMAIL</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#0d1526] border border-[#1a2235] rounded-[8px] px-3.5 py-3 text-[14px] text-white placeholder-[#8b90a3]/30 focus:outline-none focus:border-[#1558c6] focus:ring-0 transition-all"
              />
            </div>
 
            <div>
              <label htmlFor="password" className="text-[11px] tracking-[0.06em] text-[#8b90a3] block mb-1.5 font-semibold uppercase">PASSWORD</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-[#0d1526] border border-[#1a2235] rounded-[8px] px-3.5 py-3 text-[14px] text-white placeholder-[#8b90a3]/30 focus:outline-none focus:border-[#1558c6] focus:ring-0 transition-all"
              />
            </div>
          </div>
 
          <div className="text-right mt-2 mb-6">
            <Link href="/forgot-password" className="text-[12px] text-[#1558c6] font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1558c6] hover:bg-[#0f449e] active:scale-[0.99] text-white rounded-[8px] py-3.5 text-[14px] font-bold text-center mb-4.5 shadow-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log in →'}
          </button>
 
          <div className="flex items-center gap-2.5 my-4.5">
            <div className="flex-1 h-[1px] bg-[#1a2235]"></div>
            <span className="text-[11px] text-[#8b90a3] font-bold">OR</span>
            <div className="flex-1 h-[1px] bg-[#1a2235]"></div>
          </div>
 
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full border border-[#1a2235] hover:bg-[#151c26] bg-[#0d141e]/50 active:scale-[0.99] rounded-[8px] py-3 text-[13px] text-[#8b90a3] font-medium text-center mb-5.5 transition-all cursor-pointer"
          >
            Continue with Google
          </button>
 
          <p className="text-[12px] text-[#8b90a3] m-0 text-center">
            Naya account nahi hai?{' '}
            <Link href="/signup" className="text-white font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}