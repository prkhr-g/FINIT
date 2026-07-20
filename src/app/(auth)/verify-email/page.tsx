'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['4', '8', '2', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  
  const { showToast } = useToast();
  const router = useRouter();
  
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer effect
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Focus utility
  const focusInput = (index: number) => {
    if (index >= 0 && index < 6) {
      inputRefs[index].current?.focus();
    }
  };

  const handleChange = (value: string, index: number) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const nextOtp = [...otp];
      nextOtp[index] = '';
      setOtp(nextOtp);
      return;
    }

    const nextOtp = [...otp];
    nextOtp[index] = cleaned[cleaned.length - 1];
    setOtp(nextOtp);

    if (index < 5) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const cleaned = pastedData.replace(/[^0-9]/g, '').slice(0, 6);
    
    if (cleaned.length > 0) {
      const nextOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        nextOtp[i] = cleaned[i] || '';
      }
      setOtp(nextOtp);
      const lastFocusIndex = Math.min(cleaned.length, 5);
      focusInput(lastFocusIndex);
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(45);
    showToast('A new 6-digit code has been sent!', 'success');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      showToast('Please enter the full 6-digit verification code', 'error');
      return;
    }

    setLoading(true);
    try {
      showToast('Email verified successfully!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      showToast(err.message || 'Verification failed', 'error');
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
              <circle cx="260" cy="150" r="4" fill="#E85A4F" />
            </svg>
            <div className="relative z-10 text-[60px]">✉️</div>
          </div>

          <p className="text-[12px] text-[#3A3936] opacity-80 leading-[1.6] z-10 m-0">
            Email verify karna zaroori hai — isse hum aapko important reminders bhej sakenge.
          </p>
        </div>

        {/* Right form panel */}
        <form onSubmit={handleSubmit} className="bg-[#EAE7DC] p-8 md:p-11 flex flex-col justify-center text-center min-h-[400px]">
          <p className="text-[11px] tracking-[0.15em] text-[#E85A4F] font-bold m-0 mb-2">ONE LAST STEP</p>
          <h1 className="text-[28px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Verify your email</h1>
          <p className="text-[13px] text-[#8E8D8A] m-0 mb-7 leading-[1.5]">
            Humne <span className="text-[#3A3936] font-semibold">aarav@mail.com</span> par 6-digit code bheja hai.
          </p>

          {/* OTP inputs */}
          <div className="flex gap-2 justify-center mb-6.5">
            {otp.map((digit, idx) => {
              return (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  maxLength={6}
                  value={digit}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className={`w-11 h-13 text-center rounded-[10px] text-[18px] font-bold transition-all focus:outline-none ${
                    digit 
                      ? 'border-2 border-[#E85A4F] bg-[#F7EDEC] text-[#E85A4F]' 
                      : 'border border-[#D8C3A5] bg-white text-[#3A3936]'
                  }`}
                />
              );
            })}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E85A4F] hover:bg-[#d44d42] active:scale-[0.99] text-white rounded-[10px] py-3.5 text-[14px] font-bold text-center mb-4 shadow-[0_4px_12px_rgba(232,90,79,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify email →'}
          </button>

          <p className="text-[12px] text-[#8E8D8A] m-0">
            Code nahi mila?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0}
              className="font-semibold text-[#3A3936] hover:underline focus:outline-none disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            >
              Resend
            </button>{' '}
            {timer > 0 && `(0:${timer < 10 ? '0' : ''}${timer})`}
          </p>
        </form>
      </div>
    </main>
  );
}