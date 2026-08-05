'use client'

export default function HeartbeatSpine() {
  return (
    <>
      <div 
        className="hidden md:block fixed top-0 bottom-0 left-[20px] w-[2px] z-[1] opacity-40 pointer-events-none"
      >
        <svg 
          className="w-[60px] h-full -ml-[29px]" 
          viewBox="0 0 60 100" 
          preserveAspectRatio="none"
        >
          <line 
            x1="30" 
            y1="0" 
            x2="30" 
            y2="100" 
            stroke="var(--teal)" 
            strokeWidth="1.4" 
            strokeDasharray="2 3"
            opacity="0.6" 
          />
        </svg>
      </div>
      <div 
        className="hidden md:block fixed left-[20px] top-1/2 w-[9px] h-[9px] -ml-[4.5px] rounded-full bg-[var(--teal)] z-[3] pointer-events-none"
        style={{ 
          boxShadow: '0 0 10px rgba(149,204,221,0.9)', 
          animation: 'beat 1.8s ease-in-out infinite' 
        }} 
      />
    </>
  )
}
