'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, BarChart3, Bike, Calendar, Check, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, Clock3, Coffee, Dumbbell, Flag, Gauge, HeartPulse, Home, Link2, ListChecks, LoaderCircle, Moon, Mountain, RefreshCw, Route, Settings, ShieldCheck, SmilePlus, Target, Timer, TriangleAlert, Zap } from 'lucide-react'
import type { ReactNode } from 'react'

export function StatusBar() {
  return <div className="status-bar"><span>9:41</span><span className="status-icons">▮▮▮  Wi‑Fi  ▰</span></div>
}

export function PageShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`ios-screen ${className}`}><StatusBar />{children}</div>
}

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`glass-card ${className}`}>{children}</section>
}

export function Ring({ value, label, percent = false, size = 'lg' }: { value: number | string; label?: string; percent?: boolean; size?: 'md' | 'lg' }) {
  const num = typeof value === 'number' ? value : 76
  const r = size === 'lg' ? 62 : 48
  const c = 2 * Math.PI * r
  return <div className={`ring ring-${size}`}>
    <svg viewBox="0 0 160 160">
      <circle cx="80" cy="80" r={r} className="ring-track" />
      <circle cx="80" cy="80" r={r} className="ring-value" strokeDasharray={c} strokeDashoffset={c - (num / 100) * c} />
      <circle cx="80" cy="80" r={r + 16} className="ring-dash" />
    </svg>
    <div className="ring-center"><b>{value}</b>{percent && <span>%</span>}{label && <em>{label}</em>}</div>
  </div>
}

export function HillArt({ small = false }: { small?: boolean }) {
  return <div className={`hill-art ${small ? 'small' : ''}`}><Mountain /><div className="sun" /><Route /></div>
}

export function MiniChart() { return <svg className="mini-chart" viewBox="0 0 210 120"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#7acb73" stopOpacity=".35"/><stop offset="1" stopColor="#7acb73" stopOpacity="0"/></linearGradient></defs><path d="M8 90 C35 45 54 82 75 52 S113 72 132 28 S168 64 200 12" fill="none" stroke="#bfe4bd" strokeWidth="5"/><path d="M8 90 C35 45 54 82 75 52 S113 72 132 28 S168 64 200 12 L200 120 L8 120Z" fill="url(#g)"/><g fill="#75c96f">{[8,75,132,168,200].map((x,i)=><circle key={i} cx={x} cy={[90,52,28,64,12][i]} r="6"/> )}</g></svg> }

const nav = [ ['今日','/today',Home], ['历史','/history',BarChart3], ['复盘','/review',ClipboardCheck], ['设置','/settings',Settings] ] as const
export function BottomNav() { const p = usePathname(); return <nav className="bottom-nav">{nav.map(([label, href, Icon]) => { const a = p.startsWith(href); return <Link href={href} key={href} className={a ? 'active' : ''}><Icon size={32}/><span>{label}</span></Link> })}</nav> }

export function IconBubble({ children }: { children: ReactNode }) { return <div className="icon-bubble">{children}</div> }
export const Icons = { Activity, BarChart3, Bike, Calendar, Check, CheckCircle2, ChevronLeft, ChevronRight, ClipboardCheck, Clock3, Coffee, Dumbbell, Flag, Gauge, HeartPulse, Link2, ListChecks, LoaderCircle, Moon, RefreshCw, Route, ShieldCheck, SmilePlus, Target, Timer, TriangleAlert, Zap }
