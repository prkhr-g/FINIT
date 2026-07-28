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
    <main className="flex min-h-screen items-center justify-center bg-[#080e1a] p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[820px] rounded-[16px] overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-gradient-to-b from-[#111827] to-[#0b1221] border border-[#1a2235] min-h-[560px]">
        
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
              <circle cx="150" cy="150" r="90" fill="none" stroke="#1a2235" strokeWidth="1" strokeDasharray="1,4" className="opacity-60" />
              <circle cx="150" cy="30" r="4" fill="#1558c6" />
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-[44px] font-bold text-white m-0 tracking-[0.02em]">782</p>
              <p className="text-[11px] tracking-[0.1em] text-[#8b90a3] mt-2 font-semibold leading-normal">
                AVG. SCORE IMPROVEMENT<br />IN 90 DAYS
              </p>
            </div>
          </div>
 
          <div className="z-10">
            <p className="text-[12px] text-[#8b90a3] leading-[1.7] m-0">
              ✓ Free 6-month score tracking<br />
              ✓ Personalized AI recommendations<br />
              ✓ Bank-level data privacy
            </p>
          </div>
        </div>
 
        {/* Right form panel */}
        <form onSubmit={handleSubmit} className="p-8 md:p-10 flex flex-col justify-center min-h-[500px]">
          <p className="text-[11px] tracking-[0.15em] text-[#8b90a3] font-bold m-0 mb-2">GET STARTED</p>
          <h1 className="text-[28px] font-bold text-white m-0 mb-1.5 tracking-[-0.02em]">Create your account</h1>
          <p className="text-[13px] text-[#8b90a3] m-0 mb-6">2 minute mein apna financial advisor set karein</p>
 
          <div className="space-y-3.5 mb-5">
            <div>
              <label htmlFor="name" className="text-[11px] tracking-[0.06em] text-[#8b90a3] block mb-1.5 font-semibold uppercase">FULL NAME</label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full bg-[#0d1526] border border-[#1a2235] rounded-[8px] px-3.5 py-3 text-[14px] text-white placeholder-[#8b90a3]/30 focus:outline-none focus:border-[#1558c6] focus:ring-0 transition-all"
              />
            </div>
 
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
 
            <div className="flex gap-2.5">
              <div className="flex-1">
                <label htmlFor="password" className="text-[11px] tracking-[0.06em] text-[#8b90a3] block mb-1.5 font-semibold uppercase">PASSWORD</label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d1526] border border-[#1a2235] rounded-[8px] px-3.5 py-3 text-[14px] text-white placeholder-[#8b90a3]/30 focus:outline-none focus:border-[#1558c6] focus:ring-0 transition-all"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="confirmPassword" className="text-[11px] tracking-[0.06em] text-[#8b90a3] block mb-1.5 font-semibold uppercase">CONFIRM</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d1526] border border-[#1a2235] rounded-[8px] px-3.5 py-3 text-[14px] text-white placeholder-[#8b90a3]/30 focus:outline-none focus:border-[#1558c6] focus:ring-0 transition-all"
                />
              </div>
            </div>
          </div>
 
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1558c6] hover:bg-[#0f449e] active:scale-[0.99] text-white rounded-[8px] py-3.5 text-[14px] font-bold text-center mb-3.5 shadow-none transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
 
          <p className="text-[11px] text-[#8b90a3] m-0 mb-4 text-center leading-[1.5]">
            Sign up karke aap FINT ke Terms se agree karte hain.
          </p>
 
          <p className="text-[12px] text-[#8b90a3] m-0 text-center">
            Pehle se account hai?{' '}
            <Link href="/login" className="text-white font-bold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}