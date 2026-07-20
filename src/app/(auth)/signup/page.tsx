'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { authService } from '@/services/auth.service';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(password)) {
      showToast(
        'Password must have 8+ characters with uppercase, lowercase, a number and a special character',
        'error'
      );
      return;
    }

    setLoading(true);
    try {
      await authService.signup({ name, email, password });
      showToast('Account created! Please check your email to verify your account.', 'success');
      router.push('/login');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[820px] rounded-[22px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_4px_24px_rgba(58,57,54,0.12)] min-h-[560px]">
        
        {/* Left decorative brand panel */}
        <div className="hidden md:flex bg-[#D8C3A5] relative p-8 flex-col justify-between overflow-hidden min-h-[500px]">
          <div className="text-[12px] tracking-[0.15em] text-[#3A3936] font-bold z-10">
            FINT
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-[280px] h-[280px] absolute">
              <circle cx="150" cy="150" r="120" fill="none" stroke="#E85A4F" strokeWidth="1.2" strokeDasharray="2,6" className="opacity-70" />
              <circle cx="150" cy="150" r="90" fill="none" stroke="#8E8D8A" strokeWidth="1" strokeDasharray="1,4" className="opacity-40" />
              <circle cx="150" cy="30" r="4" fill="#E85A4F" />
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-[34px] font-semibold text-[#E85A4F] m-0 tracking-[0.02em]">782</p>
              <p className="text-[11px] tracking-[0.1em] text-[#3A3936] mt-1.5 font-bold leading-normal">
                AVG. SCORE IMPROVEMENT<br />IN 90 DAYS
              </p>
            </div>
          </div>

          <div className="z-10">
            <p className="text-[12px] text-[#3A3936] opacity-80 leading-[1.7] m-0">
              ✓ Free 6-month score tracking<br />
              ✓ Personalized AI recommendations<br />
              ✓ Bank-level data privacy
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <form onSubmit={handleSubmit} className="bg-[#EAE7DC] p-8 md:p-10 flex flex-col justify-center min-h-[500px]">
          <p className="text-[11px] tracking-[0.15em] text-[#E85A4F] font-bold m-0 mb-2">GET STARTED</p>
          <h1 className="text-[28px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Create your account</h1>
          <p className="text-[13px] text-[#8E8D8A] m-0 mb-6">2 minute mein apna financial advisor set karein</p>

          <div className="space-y-3.5 mb-5">
            <div>
              <label htmlFor="name" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">FULL NAME</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full bg-white border border-[#D8C3A5] rounded-[10px] px-3.5 py-3 text-[14px] text-[#3A3936] placeholder-[#8E8D8A]/60 focus:outline-none focus:ring-2 focus:ring-[#E85A4F]/20 focus:border-[#E85A4F] transition-all"
              />
            </div>

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

            <div className="flex gap-2.5">
              <div className="flex-1">
                <label htmlFor="password" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">PASSWORD</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#D8C3A5] rounded-[10px] px-3.5 py-3 text-[14px] text-[#3A3936] placeholder-[#8E8D8A]/60 focus:outline-none focus:ring-2 focus:ring-[#E85A4F]/20 focus:border-[#E85A4F] transition-all"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="confirmPassword" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">CONFIRM</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border border-[#D8C3A5] rounded-[10px] px-3.5 py-3 text-[14px] text-[#3A3936] placeholder-[#8E8D8A]/60 focus:outline-none focus:ring-2 focus:ring-[#E85A4F]/20 focus:border-[#E85A4F] transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E85A4F] hover:bg-[#d44d42] active:scale-[0.99] text-white rounded-[10px] py-3.5 text-[14px] font-bold text-center mb-3.5 shadow-[0_4px_12px_rgba(232,90,79,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>

          <p className="text-[11px] text-[#8E8D8A] m-0 mb-4 text-center leading-[1.5]">
            Sign up karke aap FINT ke Terms se agree karte hain.
          </p>

          <p className="text-[12px] text-[#8E8D8A] m-0 text-center">
            Pehle se account hai?{' '}
            <Link href="/login" className="text-[#3A3936] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}