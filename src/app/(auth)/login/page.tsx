'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[820px] rounded-[22px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_4px_24px_rgba(58,57,54,0.12)] min-h-[520px]">
        
        {/* Left decorative brand panel */}
        <div className="hidden md:flex bg-[#D8C3A5] relative p-8 flex-col justify-between overflow-hidden min-h-[500px]">
          <div className="text-[12px] tracking-[0.15em] text-[#3A3936] font-bold z-10">
            FINT
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-[280px] h-[280px] absolute">
              <circle cx="150" cy="150" r="120" fill="none" stroke="#E85A4F" strokeWidth="1.2" strokeDasharray="2,6" className="opacity-70" />
              <circle cx="150" cy="150" r="120" fill="none" stroke="#8E8D8A" strokeWidth="1" strokeDasharray="1,4" className="opacity-40" transform="rotate(20 150 150)" />
              <circle cx="150" cy="30" r="4" fill="#E85A4F" />
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-[52px] font-light text-[#3A3936] opacity-15 m-0 tracking-[0.1em]">2026</p>
              <p className="text-[34px] font-semibold text-[#E85A4F] -mt-[14px] tracking-[0.02em]">FINT</p>
              <p className="text-[11px] tracking-[0.1em] text-[#3A3936] mt-2 font-medium">FINANCIAL CLARITY, DAILY</p>
            </div>
          </div>

          <p className="text-[12px] text-[#3A3936] opacity-80 leading-[1.6] z-10 m-0">
            "Aapka score, aapki saving habits ka aaina hai — FINT ne mujhe 6 mahine mein apna emergency fund double karne mein madad ki."
            <br />
            <span className="font-semibold">— Priya N., FINT user</span>
          </p>
        </div>

        {/* Right form panel */}
        <form onSubmit={handleSubmit} className="bg-[#EAE7DC] p-8 md:p-11 flex flex-col justify-center min-h-[500px]">
          <p className="text-[11px] tracking-[0.15em] text-[#E85A4F] font-bold m-0 mb-2">WELCOME BACK</p>
          <h1 className="text-[30px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Log in to FINT</h1>
          <p className="text-[13px] text-[#8E8D8A] m-0 mb-7">Apni financial journey continue karein</p>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">EMAIL</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-[#D8C3A5] rounded-[10px] px-3.5 py-3 text-[14px] text-[#3A3936] placeholder-[#8E8D8A]/60 focus:outline-none focus:ring-2 focus:ring-[#E85A4F]/20 focus:border-[#E85A4F] transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">PASSWORD</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-white border border-[#D8C3A5] rounded-[10px] px-3.5 py-3 text-[14px] text-[#3A3936] placeholder-[#8E8D8A]/60 focus:outline-none focus:ring-2 focus:ring-[#E85A4F]/20 focus:border-[#E85A4F] transition-all"
              />
            </div>
          </div>

          <div className="text-right mt-2 mb-6">
            <Link href="/forgot-password" className="text-[12px] text-[#E85A4F] font-semibold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E85A4F] hover:bg-[#d44d42] active:scale-[0.99] text-white rounded-[10px] py-3.5 text-[14px] font-bold text-center mb-4.5 shadow-[0_4px_12px_rgba(232,90,79,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log in →'}
          </button>

          <div className="flex items-center gap-2.5 my-4.5">
            <div className="flex-1 h-[1px] bg-[#D8C3A5]"></div>
            <span className="text-[11px] text-[#8E8D8A] font-bold">OR</span>
            <div className="flex-1 h-[1px] bg-[#D8C3A5]"></div>
          </div>

          <button
            type="button"
            className="w-full border border-[#D8C3A5] hover:bg-white/40 active:scale-[0.99] rounded-[10px] py-3 text-[13px] text-[#3A3936] font-medium text-center mb-5.5 transition-all cursor-pointer"
          >
            Continue with Google
          </button>

          <p className="text-[12px] text-[#8E8D8A] m-0 text-center">
            Naya account nahi hai?{' '}
            <Link href="/signup" className="text-[#3A3936] font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}