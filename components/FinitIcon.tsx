type IconName = 'spark' | 'map' | 'score' | 'brief' | 'chat' | 'home' | 'shield' | 'growth' | 'people' | 'calendar'

export default function FinitIcon({ name, className = '' }: { name: IconName, className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const shapes: Record<IconName, React.ReactNode> = {
    spark: <><path {...common} d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z" /><path {...common} d="m5 16 .8 2.2L8 19l-2.2.8L5 22l-.8-2.2L2 19l2.2-.8L5 16Z" /></>,
    map: <><path {...common} d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" /><path {...common} d="M9 3v15M15 6v15" /></>,
    score: <><circle {...common} cx="12" cy="12" r="8.5" /><path {...common} d="m8 13 2.4 2.3L16.5 9" /></>,
    brief: <><rect {...common} x="4" y="3" width="16" height="18" rx="2" /><path {...common} d="M8 8h8M8 12h8M8 16h4" /></>,
    chat: <><path {...common} d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.2-.6L4 20l1.5-3.5A7 7 0 0 1 4 12a7.5 7.5 0 0 1 8-7.5 7.5 7.5 0 0 1 8 7Z" /><path {...common} d="M8 12h.01M12 12h.01M16 12h.01" /></>,
    home: <><path {...common} d="m3 11 9-8 9 8" /><path {...common} d="M5 10v10h14V10M10 20v-6h4v6" /></>,
    shield: <><path {...common} d="M12 3 19 6v5c0 4.4-2.8 7.9-7 10-4.2-2.1-7-5.6-7-10V6l7-3Z" /><path {...common} d="m8.5 12 2.1 2.1 4.9-5" /></>,
    growth: <><path {...common} d="M4 19V5M4 19h16" /><path {...common} d="m7 15 4-4 3 2 5-6" /><path {...common} d="M15 7h4v4" /></>,
    people: <><circle {...common} cx="9" cy="8" r="3" /><path {...common} d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2" /><path {...common} d="M16 5.5a3 3 0 0 1 0 5.7M17 14a4.5 4.5 0 0 1 3.5 4.4v1.6" /></>,
    calendar: <><rect {...common} x="3" y="5" width="18" height="16" rx="2" /><path {...common} d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h5" /></>,
  }
  return <svg className={`finit-icon ${className}`} viewBox="0 0 24 24" aria-hidden="true">{shapes[name]}</svg>
}
