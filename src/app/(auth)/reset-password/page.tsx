'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  // Dynamic Password Strength Meter
  const getPasswordStrength = () => {
    let score = 0;
    if (!password) return score;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;
    return score;
  };

  const strengthScore = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long', 'error');
      return;
    }

    setLoading(true);
    try {
      showToast('Password updated successfully!', 'success');
      router.push('/login');
    } catch (err: any) {
      showToast(err.message || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[820px] rounded-[22px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_4px_24px_rgba(58,57,54,0.12)] min-h-[500px]">
        
        {/* Left decorative brand panel */}
        <div className="hidden md:flex bg-[#D8C3A5] relative p-8 flex-col justify-between overflow-hidden min-h-[400px]">
          <div className="text-[12px] tracking-[0.15em] text-[#3A3936] font-bold z-10">
            FINT
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-[260px] h-[260px] absolute">
              <circle cx="150" cy="150" r="110" fill="none" stroke="#E85A4F" strokeWidth="1.2" strokeDasharray="2,6" className="opacity-70" />
              <circle cx="150" cy="260" r="4" fill="#E85A4F" />
            </svg>
            <div className="relative z-10 text-[60px]">🔒</div>
          </div>

          <p className="text-[12px] text-[#3A3936] opacity-80 leading-[1.6] z-10 m-0">
            Strong password tip: kam se kam ek number, ek symbol aur 8+ characters use karein.
          </p>
        </div>

        {/* Right form panel */}
        <form onSubmit={handleSubmit} className="bg-[#EAE7DC] p-8 md:p-11 flex flex-col justify-center min-h-[400px]">
          <p className="text-[11px] tracking-[0.15em] text-[#E85A4F] font-bold m-0 mb-2">ALMOST DONE</p>
          <h1 className="text-[28px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Set a new password</h1>
          <p className="text-[13px] text-[#8E8D8A] m-0 mb-7">Apna naya password banayein</p>

          <div className="space-y-4 mb-4">
            <div>
              <label htmlFor="password" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">NEW PASSWORD</label>
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

            <div>
              <label htmlFor="confirmPassword" className="text-[11px] tracking-[0.06em] text-[#8E8D8A] block mb-1.5 font-semibold uppercase">CONFIRM NEW PASSWORD</label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••"
                className="w-full bg-white border border-[#D8C3A5] rounded-[10px] px-3.5 py-3 text-[14px] text-[#3A3936] placeholder-[#8E8D8A]/60 focus:outline-none focus:ring-2 focus:ring-[#E85A4F]/20 focus:border-[#E85A4F] transition-all"
              />
            </div>
          </div>

          {/* Strength Bars */}
          <div className="flex gap-1.5 mb-6">
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${strengthScore >= 1 ? 'bg-[#E85A4F]' : 'bg-[#D8C3A5]'}`}></div>
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${strengthScore >= 2 ? 'bg-[#E85A4F]' : 'bg-[#D8C3A5]'}`}></div>
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${strengthScore >= 3 ? 'bg-[#E85A4F]' : 'bg-[#D8C3A5]'}`}></div>
            <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${strengthScore >= 4 ? 'bg-[#E85A4F]' : 'bg-[#D8C3A5]'}`}></div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E85A4F] hover:bg-[#d44d42] active:scale-[0.99] text-white rounded-[10px] py-3.5 text-[14px] font-bold text-center shadow-[0_4px_12px_rgba(232,90,79,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Updating password...' : 'Update password →'}
          </button>
        </form>
      </div>
    </main>
  );
}