'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/providers/ToastProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your registered email address', 'error');
      return;
    }

    setLoading(true);
    try {
      showToast('Reset link has been sent to your email!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send reset link', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[820px] rounded-[22px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_4px_24px_rgba(58,57,54,0.12)] min-h-[480px]">
        
        {/* Left decorative brand panel */}
        <div className="hidden md:flex bg-[#D8C3A5] relative p-8 flex-col justify-between overflow-hidden min-h-[400px]">
          <div className="text-[12px] tracking-[0.15em] text-[#3A3936] font-bold z-10">
            FINT
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-[260px] h-[260px] absolute">
              <circle cx="150" cy="150" r="110" fill="none" stroke="#E85A4F" strokeWidth="1.2" strokeDasharray="2,6" className="opacity-70" />
              <circle cx="150" cy="40" r="4" fill="#E85A4F" />
            </svg>
            <div className="relative z-10 text-[60px]">🔑</div>
          </div>

          <p className="text-[12px] text-[#3A3936] opacity-80 leading-[1.6] z-10 m-0">
            Aapka data hamesha secure hai — reset link sirf 15 minute ke liye valid rahega.
          </p>
        </div>

        {/* Right form panel */}
        <form onSubmit={handleSubmit} className="bg-[#EAE7DC] p-8 md:p-11 flex flex-col justify-center min-h-[400px]">
          <p className="text-[11px] tracking-[0.15em] text-[#E85A4F] font-bold m-0 mb-2">RESET ACCESS</p>
          <h1 className="text-[28px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Forgot your password?</h1>
          <p className="text-[13px] text-[#8E8D8A] m-0 mb-7 leading-[1.5]">
            Koi baat nahi — apna registered email daaliye, hum reset link bhej denge.
          </p>

          <div className="mb-6.5">
            <label htmlFor="email" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">REGISTERED EMAIL</label>
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E85A4F] hover:bg-[#d44d42] active:scale-[0.99] text-white rounded-[10px] py-3.5 text-[14px] font-bold text-center mb-4.5 shadow-[0_4px_12px_rgba(232,90,79,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Sending link...' : 'Send reset link →'}
          </button>

          <p className="text-[12px] text-[#8E8D8A] m-0 text-center mt-2">
            Yaad aa gaya?{' '}
            <Link href="/login" className="text-[#3A3936] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}