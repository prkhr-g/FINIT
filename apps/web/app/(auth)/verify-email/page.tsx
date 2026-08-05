'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';
import { authService } from '@/services/auth.service';

type VerifyStatus = 'verifying' | 'success' | 'error' | 'missing';

// The backend verifies email via a link sent to the user's inbox
// (GET /auth/verify-email?token=...), not an OTP code. This page reads
// that token from the URL and calls the backend automatically.
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerifyStatus>(token ? 'verifying' : 'missing');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await authService.verifyEmail(token);
        if (cancelled) return;
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
        showToast('Email verified successfully!', 'success');
        setTimeout(() => router.push('/login'), 2000);
      } catch (err: any) {
        if (cancelled) return;
        setStatus('error');
        setMessage(err.message || 'This verification link is invalid or has expired.');
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
              <circle cx="260" cy="150" r="4" fill="#E85A4F" />
            </svg>
            <div className="relative z-10 text-[60px]">✉️</div>
          </div>

          <p className="text-[12px] text-[#3A3936] opacity-80 leading-[1.6] z-10 m-0">
            Email verify karna zaroori hai — isse hum aapko important reminders bhej sakenge.
          </p>
        </div>

        {/* Right status panel */}
        <div className="bg-[#EAE7DC] p-8 md:p-11 flex flex-col justify-center text-center min-h-[400px]">
          <p className="text-[11px] tracking-[0.15em] text-[#E85A4F] font-bold m-0 mb-2">ONE LAST STEP</p>

          {status === 'verifying' && (
            <>
              <h1 className="text-[26px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Verifying your email…</h1>
              <p className="text-[13px] text-[#8E8D8A] m-0">Please wait a moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="text-[48px] mb-2">✅</div>
              <h1 className="text-[26px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Email verified!</h1>
              <p className="text-[13px] text-[#8E8D8A] m-0 mb-6">{message} Redirecting you to log in…</p>
              <Link
                href="/login"
                className="w-full bg-[#E85A4F] hover:bg-[#d44d42] active:scale-[0.99] text-white rounded-[10px] py-3.5 text-[14px] font-bold text-center shadow-[0_4px_12px_rgba(232,90,79,0.25)] transition-all cursor-pointer inline-block"
              >
                Go to login →
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="text-[48px] mb-2">⚠️</div>
              <h1 className="text-[26px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Verification failed</h1>
              <p className="text-[13px] text-[#8E8D8A] m-0 mb-6">{message}</p>
              <Link
                href="/signup"
                className="w-full border border-[#D8C3A5] hover:bg-white/40 active:scale-[0.99] rounded-[10px] py-3 text-[13px] text-[#3A3936] font-medium text-center transition-all cursor-pointer inline-block"
              >
                Back to sign up
              </Link>
            </>
          )}

          {status === 'missing' && (
            <>
              <div className="text-[48px] mb-2">📬</div>
              <h1 className="text-[26px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">Check your inbox</h1>
              <p className="text-[13px] text-[#8E8D8A] m-0 mb-6 leading-[1.5]">
                We&apos;ve sent a verification link to your email. Click it to activate your account, then come back and log in.
              </p>
              <Link
                href="/login"
                className="w-full border border-[#D8C3A5] hover:bg-white/40 active:scale-[0.99] rounded-[10px] py-3 text-[13px] text-[#3A3936] font-medium text-center transition-all cursor-pointer inline-block"
              >
                Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}