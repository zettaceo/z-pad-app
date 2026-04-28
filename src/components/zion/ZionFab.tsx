'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { X, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

import { cn } from '@/lib/cn';
import { useFocusTrap } from '@/lib/use-focus-trap';
import { PROJECTS } from '@/lib/mock-data';
import { FEES } from '@/config/fees';
import { getProjectContent } from '@/lib/project-i18n';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

type TFn = (key: string, values?: Record<string, unknown>) => string;

function getSuggestions(pathname: string, t: TFn): string[] {
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    return [t('suggestSafe'), t('suggestScore'), t('suggestRisks')];
  }
  if (pathname === '/dashboard') return [t('suggestClaim'), t('suggestRep'), t('suggestTop')];
  if (pathname === '/create') return [t('suggestFairLaunch'), t('suggestTokenomics'), t('suggestFees')];
  return [t('suggestZpad'), t('suggestFind'), t('suggestVetting')];
}

function generateResponse(question: string, pathname: string, t: TFn, locale: string): string {
  const q = question.toLowerCase();

  // Multi-language keyword helpers
  const matches = (patterns: string[]) => patterns.some((p) => q.includes(p));

  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    const projectId = pathname.split('/').pop();
    const p = PROJECTS.find((x) => x.id === projectId);
    if (p) {
      const i18n = getProjectContent(p.id, locale);
      const aiSummary = i18n?.aiSummary ?? p.aiSummary;

      if (matches(['safe', 'risk', 'scam', 'seguro', 'risco', 'golpe', 'seguridad', 'riesgo', 'estafa', '安全', '风险', '骗'])) {
        const riskLevel =
          p.aiScore >= 90
            ? t('riskVeryLow')
            : p.aiScore >= 75
            ? t('riskLow')
            : p.aiScore >= 60
            ? t('riskModerate')
            : t('riskElevated');
        const flags = p.aiFlags.length > 0 ? t('respFlags', { flags: p.aiFlags.join(', ') }) : '';
        return t('respRisk', { name: p.name, riskLevel, score: p.aiScore, summary: aiSummary }) + flags;
      }

      if (matches(['score', 'rating', 'pontuacao', 'nota', 'puntuacion', 'calificacion', '评分', '分数'])) {
        const breakdown = Object.entries(p.aiBreakdown)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        return t('respScore', { name: p.name, score: p.aiScore, breakdown });
      }
    }
  }

  if (matches(['z-pad', 'what is', 'about', 'o que e', 'sobre', 'que es', '什么是', 'zpad'])) {
    return t('respZpad');
  }

  if (matches(['top', 'best', 'find', 'melhor', 'encontrar', 'mejor', 'buscar', '最好', '找'])) {
    const top = PROJECTS.filter((p) => p.status === 'live')
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);
    const list = top.map((p, i) => `${i + 1}. ${p.name} (${p.symbol}) — Score: ${p.aiScore}/100`).join('. ');
    return t('respTop', { list });
  }

  if (matches(['fair launch', 'fair', 'lancamento justo', 'lanzamiento justo', '公平启动', '公平发行'])) {
    return t('respFairLaunch');
  }

  if (matches(['fee', 'cost', 'taxa', 'custo', 'comision', 'costo', '费用', '手续费'])) {
    return t('respFees', {
      platformPct: FEES.platformPct,
      stakerPct: FEES.stakerPlatformPct,
      minZ: FEES.stakerMinZ.toLocaleString(),
      discountPct: FEES.stakerDiscountPct,
      listingBnb: FEES.listingBnb,
    });
  }

  if (matches(['kyc', 'verify', 'verificar', 'verificacao', 'verificacion', '验证', 'kyc'])) {
    return t('respKyc');
  }

  if (matches(['refund', 'dyco', 'reembolso', 'devolver', 'reembolsar', '退款', '退钱'])) {
    return t('respRefund');
  }

  if (matches(['reputation', 'rep', 'reputacao', 'reputacion', '声誉', '信誉'])) {
    return t('respReputation');
  }

  if (matches(['claim', 'resgatar', 'reclamar', '领取', '提取'])) {
    return t('respClaim');
  }

  if (matches(['launch', 'create', 'lancar', 'criar', 'lanzar', 'crear', '启动', '发射', '创建'])) {
    return t('respLaunch', {
      listingBnb: FEES.listingBnb,
      platformPct: FEES.platformPct,
    });
  }

  return t('respDefault');
}

export function ZionFab() {
  const tz = useTranslations('zion');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const pathname = usePathname();
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Set initial message after mount so it uses the current locale
  useEffect(() => {
    setMessages([{ role: 'ai', text: tz('initialMsg') }]);
  }, [tz]);

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: 'user', text: t }]);
    setInput('');
    setTyping(true);
    setTimeout(
      () => {
        setTyping(false);
        setMessages((m) => [
          ...m,
          { role: 'ai', text: generateResponse(t, pathname, tz as TFn, locale) },
        ]);
      },
      800 + Math.random() * 600
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen((s) => !s)}
        className={cn(
          'fixed bottom-6 right-6 z-[150] w-[60px] h-[60px] rounded-full',
          'bg-[#040d24]',
          'shadow-[0_0_32px_rgba(0,212,255,0.45),0_12px_48px_rgba(0,0,0,0.6)]',
          'border border-cyan-500/30 flex items-center justify-center overflow-hidden',
          'transition-all duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          open ? 'scale-90' : 'hover:scale-110 hover:border-cyan-500/60 hover:shadow-[0_0_44px_rgba(0,212,255,0.65)]'
        )}
        style={!open ? { animation: 'glow-pulse 3s ease-in-out infinite' } : {}}
        type="button"
        aria-label={open ? tz('closeLabel') : tz('openLabel')}
        aria-expanded={open}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Image
            src="/assets/zion-avatar.svg"
            alt="ZION AI"
            width={60}
            height={60}
            className="w-full h-full object-cover"
            priority
          />
        )}
        {!open && (
          <span
            className="absolute -inset-1.5 rounded-full border border-cyan-500/25"
            style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          ref={dialogRef}
          className="fixed bottom-[92px] right-6 w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-120px)] bg-[rgba(7,13,37,0.95)] backdrop-blur-[24px] border border-white/14 rounded-[20px] shadow-2xl z-[150] flex flex-col overflow-hidden animate-[zionOpen_0.4s_cubic-bezier(0.34,1.56,0.64,1)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="zion-title"
        >
          {/* Header */}
          <div className="px-[18px] py-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-br from-cyan-500/5 to-violet-500/5">
            <div className="w-[38px] h-[38px] rounded-full overflow-hidden bg-[#040d24] border border-cyan-500/30 shadow-[0_0_12px_rgba(0,212,255,0.35)] shrink-0">
              <Image src="/assets/zion-avatar.svg" alt="" width={38} height={38} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div
                id="zion-title"
                className="font-[family-name:var(--font-display)] font-bold text-[0.98rem] tracking-[-0.01em]"
              >
                ZION AI
              </div>
              <div className="text-[0.72rem] text-green-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#00e676] animate-pulse-dot" />
                {tz('online')}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-md bg-white/[0.03] border border-white/10 text-white/70 flex items-center justify-center hover:bg-white/10 transition-all"
              type="button"
              aria-label={tz('closeLabel')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'flex gap-2.5',
                  m.role === 'user' ? 'flex-row-reverse' : '',
                  'animate-[fadeIn_0.3s]'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[0.7rem] font-bold overflow-hidden',
                    m.role === 'ai' ? 'bg-[#040d24] border border-cyan-500/30' : 'bg-white/10 text-white/70'
                  )}
                >
                  {m.role === 'ai' ? (
                    <Image src="/assets/zion-avatar.svg" alt="" width={28} height={28} className="w-full h-full object-cover" />
                  ) : (
                    'U'
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[75%] px-3.5 py-2.5 rounded-[14px] text-[0.86rem] leading-[1.55]',
                    m.role === 'ai'
                      ? 'bg-white/[0.04] border border-white/10 rounded-tl-[4px]'
                      : 'bg-gradient-to-br from-cyan-500/12 to-blue-500/8 border border-cyan-500/20 rounded-tr-[4px]'
                  )}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full shrink-0 overflow-hidden bg-[#040d24] border border-cyan-500/30">
                  <Image src="/assets/zion-avatar.svg" alt="" width={28} height={28} className="w-full h-full object-cover" />
                </div>
                <div className="bg-white/[0.04] border border-white/10 rounded-[14px] rounded-tl-[4px] px-3.5 py-3">
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                        style={{ animation: 'pulse-dot 1.2s infinite', animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-4 py-3 border-t border-white/10 flex flex-wrap gap-1.5">
            {getSuggestions(pathname, tz as TFn).map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-2.5 py-1.5 rounded-full text-[0.76rem] bg-cyan-500/6 border border-cyan-500/18 text-cyan-400 hover:bg-cyan-500/12 hover:border-cyan-500/35 transition-all"
                type="button"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') send(input);
              }}
              placeholder={tz('placeholder')}
              className="flex-1 px-3.5 py-2.5 rounded-[10px] bg-white/[0.02] border border-white/10 text-white text-[0.88rem] outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.03]"
              aria-label={tz('msgLabel')}
            />
            <button
              onClick={() => send(input)}
              className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all shrink-0"
              type="button"
              aria-label={tz('sendLabel')}
            >
              <Send className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
