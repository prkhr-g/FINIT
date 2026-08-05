'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/providers/ToastProvider';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [income, setIncome] = useState('₹50,000 – ₹1,50,000');
  const [goal, setGoal] = useState('Build Emergency Fund');
  const [experience, setExperience] = useState('Intermediate (Have some active portfolios)');
  const [loading, setLoading] = useState(false);
  
  const { showToast } = useToast();
  const router = useRouter();

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        showToast('Onboarding completed! Welcome to FINT.', 'success');
        router.push('/dashboard');
      }, 1000);
    }
  };

  // SVG dash array dynamic progress
  const getStrokeDashArray = () => {
    if (step === 1) return '90 300';
    if (step === 2) return '190 300';
    return '300 300';
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[820px] rounded-[22px] overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-[0_4px_24px_rgba(58,57,54,0.12)] min-h-[520px]">
        
        {/* Left decorative brand panel */}
        <div className="hidden md:flex bg-[#D8C3A5] relative p-8 flex-col justify-between overflow-hidden min-h-[440px]">
          <div className="text-[12px] tracking-[0.15em] text-[#3A3936] font-bold z-10">
            FINT
          </div>

          <div className="relative flex-1 flex items-center justify-center">
            <svg viewBox="0 0 300 300" className="w-[280px] h-[280px] absolute">
              <circle 
                cx="150" 
                cy="150" 
                r="120" 
                fill="none" 
                stroke="#E85A4F" 
                strokeWidth="1.2" 
                strokeDasharray={getStrokeDashArray()} 
                strokeDashoffset="-20" 
                className="opacity-90 transition-all duration-500 ease-out" 
              />
              <circle cx="150" cy="150" r="120" fill="none" stroke="#3A3936" strokeWidth="1" strokeDasharray="1,4" className="opacity-25" />
              <circle cx="150" cy="30" r="4" fill="#E85A4F" />
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-[12px] tracking-[0.1em] text-[#3A3936] m-0 mb-1.5 font-semibold">STEP</p>
              <p className="text-[44px] font-semibold text-[#E85A4F] m-0 transition-all duration-300">{step} / 3</p>
            </div>
          </div>

          <p className="text-[12px] text-[#3A3936] opacity-80 leading-[1.6] z-10 m-0">
            Yeh sirf 3 quick steps hain — aapka pehla FINT Score 60 second mein taiyar ho jaayega.
          </p>
        </div>

        {/* Right form panel */}
        <div className="bg-[#EAE7DC] p-8 md:p-10 flex flex-col justify-center min-h-[440px]">
          <p className="text-[11px] tracking-[0.15em] text-[#E85A4F] font-bold m-0 mb-2">WELCOME, AARAV</p>

          {step === 1 && (
            <>
              <h1 className="text-[24px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">What's your monthly income?</h1>
              <p className="text-[13px] text-[#8E8D8A] m-0 mb-[22px]">Isse hum behtar recommendations bana sakenge</p>

              <div className="flex flex-col gap-2.5 mb-6.5">
                {[
                  '₹0 – ₹50,000',
                  '₹50,000 – ₹1,50,000',
                  '₹1,50,000+'
                ].map((opt) => {
                  const isSelected = income === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIncome(opt)}
                      className={`w-full text-left rounded-[12px] px-4 py-3.5 text-[14px] transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-2 border-[#E85A4F] bg-[#F7EDEC] text-[#E85A4F] font-semibold flex justify-between items-center' 
                          : 'border border-[#D8C3A5] bg-white text-[#3A3936] hover:bg-white/60'
                      }`}
                    >
                      {opt} {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-[24px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">What's your primary financial goal?</h1>
              <p className="text-[13px] text-[#8E8D8A] m-0 mb-[22px]">Apne wealth vision ko select karein</p>

              <div className="flex flex-col gap-2.5 mb-6.5">
                {[
                  'Build Emergency Fund',
                  'Retirement Planning',
                  'Tax Optimization & Investing'
                ].map((opt) => {
                  const isSelected = goal === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setGoal(opt)}
                      className={`w-full text-left rounded-[12px] px-4 py-3.5 text-[14px] transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-2 border-[#E85A4F] bg-[#F7EDEC] text-[#E85A4F] font-semibold flex justify-between items-center' 
                          : 'border border-[#D8C3A5] bg-white text-[#3A3936] hover:bg-white/60'
                      }`}
                    >
                      {opt} {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-[24px] font-semibold text-[#3A3936] m-0 mb-1.5 tracking-[-0.02em]">What's your investment experience?</h1>
              <p className="text-[13px] text-[#8E8D8A] m-0 mb-[22px]">Apna current investing level select karein</p>

              <div className="flex flex-col gap-2.5 mb-6.5">
                {[
                  'Beginner (New to stocks/mutual funds)',
                  'Intermediate (Have some active portfolios)',
                  'Advanced (Trade option/derivatives regularly)'
                ].map((opt) => {
                  const isSelected = experience === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setExperience(opt)}
                      className={`w-full text-left rounded-[12px] px-4 py-3.5 text-[14px] transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-2 border-[#E85A4F] bg-[#F7EDEC] text-[#E85A4F] font-semibold flex justify-between items-center' 
                          : 'border border-[#D8C3A5] bg-white text-[#3A3936] hover:bg-white/60'
                      }`}
                    >
                      {opt} {isSelected && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <button
            type="button"
            onClick={handleContinue}
            disabled={loading}
            className="w-full bg-[#E85A4F] hover:bg-[#d44d42] active:scale-[0.99] text-white rounded-[10px] py-3.5 text-[14px] font-bold text-center shadow-[0_4px_12px_rgba(232,90,79,0.25)] transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Processing...' : step === 3 ? 'Finish Onboarding' : 'Continue →'}
          </button>
        </div>
      </div>
    </main>
  );
}