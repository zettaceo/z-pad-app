'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X, Send } from 'lucide-react';

import { cn } from '@/lib/cn';
import { PROJECTS } from '@/lib/mock-data';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

const INITIAL_MSG: Message = {
  role: 'ai',
  text: "Hey! I'm ZION, your AI assistant for Z-PAD. I can analyze any project, explain tokenomics, help you find opportunities, or answer questions about the platform. What would you like to know?",
};

function getSuggestions(pathname: string): string[] {
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    return ['Is this project safe?', 'Explain the AI Score', 'What are the risks?'];
  }
  if (pathname === '/dashboard') return ['How do I claim tokens?', 'What is my AI Rep?', 'Show top projects'];
  if (pathname === '/create') return ['What are Fair Launches?', 'Best tokenomics practices', 'How do fees work?'];
  return ['What is Z-PAD?', 'Find top AI projects', 'How does vetting work?'];
}

function generateResponse(question: string, pathname: string): string {
  const q = question.toLowerCase();

  // Project-specific
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    const projectId = pathname.split('/').pop();
    const p = PROJECTS.find((x) => x.id === projectId);
    if (p) {
      if (q.includes('safe') || q.includes('risk') || q.includes('scam')) {
        const riskLevel =
          p.aiScore >= 90 ? 'very low' : p.aiScore >= 75 ? 'low' : p.aiScore >= 60 ? 'moderate' : 'elevated';
        return `Based on my analysis, ${p.name} has a ${riskLevel} risk profile (AI Score: ${p.aiScore}/100). ${p.aiSummary}${
          p.aiFlags.length > 0 ? ' Flags: ' + p.aiFlags.join(', ') + '.' : ''
        }`;
      }
      if (q.includes('score') || q.includes('rating')) {
        const parts = Object.entries(p.aiBreakdown)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        return `${p.name} scored ${p.aiScore}/100 on my AI Vetting Engine. Breakdown: ${parts}. This composite score evaluates tokenomics, smart contract security, team verification, market positioning, liquidity ratios, and community signals.`;
      }
    }
  }

  if (q.includes('z-pad') || q.includes('what is') || q.includes('about')) {
    return "Z-PAD is the next-generation decentralized launchpad from the ZETTA ecosystem. Unlike PinkSale or Binance Launchpad, we combine: AI-powered vetting, fiat on-ramp (PIX, credit card), native banking via Z-BANCK, KYC-enforced creator verification, refundable sales (DYCO), and reputation-based allocation. We're the only launchpad where everything is connected — wallet, DEX, banking, and now AI.";
  }

  if (q.includes('top') || q.includes('best') || q.includes('find')) {
    const top = PROJECTS.filter((p) => p.status === 'live')
      .sort((a, b) => b.aiScore - a.aiScore)
      .slice(0, 3);
    return `Based on current AI Scores, here are my top picks: ${top.map((p, i) => `${i + 1}. ${p.name} (${p.symbol}) — Score: ${p.aiScore}/100`).join('. ')}.`;
  }

  if (q.includes('fair launch')) {
    return "A Fair Launch is a token sale where everyone gets tokens at the same price — no presale advantages, no VC discounts. Z-PAD supports Fair Launches as one of 5 sale mechanics (Fair Launch, Presale, Private, LBP, Bonding Curve).";
  }

  if (q.includes('fee') || q.includes('cost')) {
    return 'Z-PAD platform fees: 2% standard on successful raises, 1% for users staking 10,000+ Z (50% discount), 0.5 BNB listing fee for creators. Compared to PinkSale (2-5%) and CEX launchpads, we offer the most competitive rates plus way more features.';
  }

  if (q.includes('kyc') || q.includes('verify')) {
    return 'KYC verification unlocks higher allocation tiers, access to private sales, fiat payment methods, governance voting weight boost, and tax reporting tools. We use institutional-grade KYC (Veriff). Takes ~5 minutes. All creators launching on Z-PAD must complete KYC.';
  }

  if (q.includes('refund') || q.includes('dyco')) {
    return "Refundable Sales (DYCO) let you get your money back within 48h of TGE if the project fails to hit agreed KPIs. Think of it as warranty for crypto. Projects tagged 'Refundable' commit to this upfront.";
  }

  if (q.includes('reputation') || q.includes('rep')) {
    return 'Your Reputation Score (0-100) replaces staking requirements. Earned through successful past participations, KYC verification, community contributions, governance votes. Higher reputation = bigger allocation cap. No need to lock $50,000 in tokens.';
  }

  if (q.includes('claim')) {
    return 'To claim vested tokens: Dashboard → Positions → click any position with "Claim Available" → confirm transaction. Tokens appear in your wallet instantly. You can claim multiple times without losing the vesting schedule.';
  }

  if (q.includes('launch') || q.includes('create')) {
    return 'To launch your project on Z-PAD: Click Create in the nav, follow the 5-step wizard (Info → Tokenomics → Sale → Review → Deploy), complete creator KYC (mandatory), my AI will pre-screen your contract. Launch fee: 0.5 BNB + 2% of raise. Takes ~30 min, no code required.';
  }

  return "That's a great question. Z-PAD's edge comes from combining permissionless launches with institutional-grade vetting, fiat rails, and AI analysis. If you want specific guidance, try asking about a particular project, feature, or mechanism.";
}

export function ZionFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const pathname = usePathname();
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
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
        setMessages((m) => [...m, { role: 'ai', text: generateResponse(t, pathname) }]);
      },
      800 + Math.random() * 600
    );
  };

  return (
    <>
      <button
        onClick={() => setOpen((s) => !s)}
        className={cn(
          'fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full',
          'bg-gradient-to-br from-cyan-500 via-violet-500 to-[#8b5cf6]',
          'shadow-[0_0_32px_rgba(0,212,255,0.5),0_12px_48px_rgba(0,0,0,0.5)]',
          'border-2 border-white/15 flex items-center justify-center',
          'transition-all duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          open ? 'scale-90' : 'hover:scale-110'
        )}
        style={!open ? { animation: 'glow-pulse 3s ease-in-out infinite' } : {}}
        type="button"
        aria-label={open ? 'Close ZION AI' : 'Open ZION AI'}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <Sparkles className="w-[26px] h-[26px] text-white" />}
        {!open && (
          <span
            className="absolute -inset-1.5 rounded-full border-2 border-cyan-500/30"
            style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-[92px] right-6 w-[380px] max-w-[calc(100vw-48px)] h-[560px] max-h-[calc(100vh-120px)] bg-[rgba(7,13,37,0.95)] backdrop-blur-[24px] border border-white/14 rounded-[20px] shadow-2xl z-[150] flex flex-col overflow-hidden"
          style={{ animation: 'zionOpen 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          role="dialog"
          aria-labelledby="zion-title"
        >
          <style jsx>{`
            @keyframes zionOpen {
              from { opacity: 0; transform: scale(0.8) translateY(20px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          {/* Header */}
          <div className="px-[18px] py-4 border-b border-white/10 flex items-center gap-3 bg-gradient-to-br from-cyan-500/5 to-violet-500/5">
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-extrabold shadow-[0_0_16px_rgba(0,212,255,0.4)] shrink-0">
              <Sparkles className="w-5 h-5" />
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
                Online · Analyzing on-chain
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-md bg-white/[0.03] border border-white/10 text-white/70 flex items-center justify-center hover:bg-white/10 transition-all"
              type="button"
              aria-label="Close"
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
                    'w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[0.7rem] font-bold',
                    m.role === 'ai' ? 'bg-gradient-to-br from-cyan-500 to-violet-500 text-white' : 'bg-white/10 text-white/70'
                  )}
                >
                  {m.role === 'ai' ? <Sparkles className="w-3.5 h-3.5" /> : 'U'}
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
                <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white/[0.04] border border-white/10 rounded-[14px] rounded-tl-[4px] px-3.5 py-3">
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                        style={{
                          animation: `pulse-dot 1.2s infinite`,
                          animationDelay: `${delay}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="px-4 py-3 border-t border-white/10 flex flex-wrap gap-1.5">
            {getSuggestions(pathname).map((s) => (
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
              placeholder="Ask ZION anything..."
              className="flex-1 px-3.5 py-2.5 rounded-[10px] bg-white/[0.02] border border-white/10 text-white text-[0.88rem] outline-none focus:border-cyan-500 focus:bg-cyan-500/[0.03]"
              aria-label="Message ZION AI"
            />
            <button
              onClick={() => send(input)}
              className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all shrink-0"
              type="button"
              aria-label="Send"
            >
              <Send className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
