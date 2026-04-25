'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, Zap, TrendingUp, Vote, Shield, Gift, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

type NotifType = 'claim' | 'launch' | 'vote' | 'kyc' | 'reward' | 'price';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: number;
  href?: string;
  read: boolean;
}

const MOCK_NOTIFS: Notification[] = [
  {
    id: 'n1', type: 'claim', read: false,
    title: 'Tokens ready to claim',
    body: '78,125 ZETTA are unlocked and ready to claim from your vesting schedule.',
    time: Date.now() - 2 * 60000,
    href: '/dashboard',
  },
  {
    id: 'n2', type: 'launch', read: false,
    title: 'NexGen AI goes live in 3 days',
    body: 'AI Score 91/100 · Fair Launch · $5M target. Set a reminder to participate.',
    time: Date.now() - 14 * 60000,
    href: '/projects/nexgen-ai',
  },
  {
    id: 'n3', type: 'vote', read: false,
    title: 'Governance vote ending soon',
    body: 'ZIP-003 (Q3 Treasury: $5M AI Engine) ends in 7 days. Your vote matters.',
    time: Date.now() - 60 * 60000,
    href: '/governance',
  },
  {
    id: 'n4', type: 'kyc', read: true,
    title: 'Complete KYC to unlock private rounds',
    body: 'Earn +1,500 XP and access exclusive projects by verifying your identity.',
    time: Date.now() - 3 * 3600000,
    href: '/kyc',
  },
  {
    id: 'n5', type: 'price', read: true,
    title: 'ZETTA up +12.4% today',
    body: 'Your ZETTA position is now worth $4,875 — up $2,375 from your investment.',
    time: Date.now() - 6 * 3600000,
    href: '/dashboard',
  },
  {
    id: 'n6', type: 'reward', read: true,
    title: 'Quest completed: First Investment',
    body: 'You earned +500 XP and +50 Z for your first investment on Z-PAD!',
    time: Date.now() - 2 * 86400000,
    href: '/rewards',
  },
];

const ICONS: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  claim:  { icon: Zap,       color: 'text-cyan-400',   bg: 'bg-cyan-500/10'   },
  launch: { icon: TrendingUp,color: 'text-green-400',  bg: 'bg-green-400/10'  },
  vote:   { icon: Vote,      color: 'text-violet-400', bg: 'bg-violet-500/10' },
  kyc:    { icon: Shield,    color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  reward: { icon: Gift,      color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  price:  { icon: TrendingUp,color: 'text-green-400',  bg: 'bg-green-400/10'  },
};

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const dismiss = (id: string) => setNotifs(n => n.filter(x => x.id !== id));

  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  return (
    <div ref={ref} className="relative hidden md:block">
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
        aria-expanded={open}
        className={cn(
          'relative w-10 h-10 rounded-[10px] border flex items-center justify-center transition-all',
          open
            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400'
            : 'bg-white/[0.02] border-white/10 text-white/70 hover:border-white/20 hover:text-white'
        )}
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] rounded-full bg-cyan-500 text-[#021628] text-[0.6rem] font-extrabold flex items-center justify-center shadow-[0_0_8px_rgba(0,212,255,0.5)]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-24px)] bg-[rgba(7,13,37,0.97)] backdrop-blur-[24px] border border-white/14 rounded-[16px] shadow-2xl z-[200] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span className="font-[family-name:var(--font-display)] font-bold text-[0.95rem]">Notifications</span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[0.65rem] font-extrabold">
                  {unread} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[0.72rem] text-white/40 hover:text-cyan-400 transition-colors px-2 py-1"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-10 text-center text-white/30 text-[0.9rem]">
                All caught up! 🎉
              </div>
            ) : (
              notifs.map(n => {
                const { icon: Icon, color, bg } = ICONS[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn(
                      'relative flex gap-3 px-4 py-3.5 border-b border-white/5 last:border-0 transition-colors',
                      !n.read ? 'bg-cyan-500/[0.03]' : 'hover:bg-white/[0.02]'
                    )}
                  >
                    {/* Unread dot */}
                    {!n.read && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}

                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', bg)}>
                      <Icon className={cn('w-4 h-4', color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[0.86rem] mb-0.5 pr-6">{n.title}</div>
                      <div className="text-[0.78rem] text-white/50 leading-[1.5] mb-1.5">{n.body}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[0.7rem] text-white/30">{timeAgo(n.time)}</span>
                        {n.href && (
                          <Link
                            href={n.href as '/dashboard'}
                            onClick={() => { markRead(n.id); setOpen(false); }}
                            className="flex items-center gap-0.5 text-[0.72rem] text-cyan-400/70 hover:text-cyan-400 transition-colors"
                          >
                            View <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Dismiss */}
                    <button
                      type="button"
                      onClick={() => dismiss(n.id)}
                      className="absolute top-3 right-3 w-5 h-5 rounded flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all"
                      aria-label="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-white/8 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[0.74rem] text-white/30 hover:text-white/60 transition-colors"
            >
              Settings →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
