'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useTranslations } from 'next-intl';

import { PROPOSALS } from '@/lib/mock-data';
import { fmt } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type Vote = 'for' | 'against' | 'abstain';

export default function GovernancePage() {
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const t = useTranslations('governance');
  const tc = useTranslations('common');

  const castVote = (proposalId: string, vote: Vote) => {
    if (votes[proposalId]) return;
    setVotes((v) => ({ ...v, [proposalId]: vote }));
    const proposal = PROPOSALS.find((p) => p.id === proposalId);
    toast.success(`Vote cast: ${vote} on "${proposal?.title ?? 'proposal'}"`);
  };

  return (
    <div className="pt-[100px]">
      <section className="pt-10 pb-6 border-b border-white/5">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-4">
            <Link href="/" className="hover:text-cyan-400">{tc('home')}</Link>
            <span className="text-white/30">/</span>
            <span>{t('breadcrumb')}</span>
          </div>
          <div className="flex items-end justify-between flex-wrap gap-5">
            <div>
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold text-cyan-400 uppercase tracking-[0.12em] font-[family-name:var(--font-mono)] before:content-[''] before:w-6 before:h-px before:bg-cyan-500">
                {t('label')}
              </span>
              <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-0.03em] mt-2.5">
                {t('title1')}{' '}
                <span className="bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                  {t('title2')}
                </span>
              </h1>
              <p className="text-white/70 mt-2 max-w-[640px]">
                {t('desc')}
              </p>
            </div>
            <Button>
              <Plus className="w-4 h-4" />
              {t('newProposal')}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { l: t('activeProposals'), v: String(PROPOSALS.filter((p) => p.status === 'active').length), c: t('yourVote'), up: true },
              { l: t('votingPower'), v: '10,000', c: t('votingPowerSub') },
              { l: t('totalVoted'), v: '8.4M Z', c: t('totalVotedSub') },
              { l: t('participation'), v: '64%', c: '+8% MoM', up: true },
            ].map((s) => (
              <div key={s.l} className="bg-bg-075 border border-white/10 rounded-[14px] p-5">
                <div className="text-[0.76rem] text-white/50 uppercase tracking-wider mb-2 font-semibold">{s.l}</div>
                <div className="font-[family-name:var(--font-display)] text-[1.8rem] font-extrabold tracking-[-0.025em] leading-[1.1] mb-1.5">{s.v}</div>
                <div className={`font-[family-name:var(--font-mono)] text-[0.8rem] ${s.up ? 'text-green-400' : 'text-white/50'}`}>{s.c}</div>
              </div>
            ))}
          </div>

          <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold tracking-[-0.025em] mb-6">
            {t('activeTitle')}<span className="text-cyan-500 font-black">.</span>
          </h2>

          {PROPOSALS.map((p) => (
            <div key={p.id} className="bg-bg-075 border border-white/10 rounded-[14px] p-6 mb-4 hover:border-cyan-500/35 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="font-[family-name:var(--font-display)] font-bold text-[1.05rem] tracking-[-0.015em]">
                    {p.title}
                  </div>
                  <div className="text-[0.76rem] text-white/50 mt-1 flex gap-3 flex-wrap">
                    <span>{p.id.toUpperCase()}</span>
                    <span>·</span><span>{p.category}</span>
                    <span>·</span><span>By {p.author}</span>
                    <span>·</span><span>{p.status === 'active' ? `${t('ends')} ${fmt.timeLeft(p.endsAt).d}d` : t('ended')}</span>
                  </div>
                </div>
                {p.status === 'active' ? <Badge variant="live">{t('live')}</Badge> : <Badge variant="passed" />}
              </div>
              <p className="text-white/70 text-[0.9rem] leading-relaxed mb-4">{p.desc}</p>

              <div className="flex flex-col gap-2.5">
                {[
                  { label: t('for'), pct: p.votes.for, color: 'bg-gradient-to-r from-green-400 to-cyan-600', text: 'text-green-400' },
                  { label: t('against'), pct: p.votes.against, color: 'bg-gradient-to-r from-red-500 to-orange-500', text: 'text-red-400' },
                  { label: t('abstain'), pct: p.votes.abstain, color: 'bg-gradient-to-r from-white/30 to-white/20', text: 'text-white/50' },
                ].map((v) => (
                  <div key={v.label} className="grid grid-cols-[44px_1fr_44px] sm:grid-cols-[60px_1fr_60px] items-center gap-2 sm:gap-3 text-[0.82rem]">
                    <div className={`font-semibold ${v.text}`}>{v.label}</div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${v.color} rounded-full transition-[width] duration-1000`} style={{ width: `${v.pct}%` }} />
                    </div>
                    <div className="font-[family-name:var(--font-mono)] font-semibold text-right">{v.pct}%</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2.5 items-center justify-between flex-wrap">
                <div className="text-[0.82rem] text-white/50 font-[family-name:var(--font-mono)]">
                  {fmt.number(p.totalVotes)} {t('zVoted')}
                </div>
                {p.status === 'active' ? (
                  votes[p.id] ? (
                    <span className="text-[0.82rem] text-white/50 font-[family-name:var(--font-mono)]">
                      {t('voted')}: <strong className="text-cyan-400 capitalize">{votes[p.id]}</strong>
                    </span>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="success" size="sm" onClick={() => castVote(p.id, 'for')}>{t('voteFor')}</Button>
                      <Button variant="danger" size="sm" onClick={() => castVote(p.id, 'against')}>{t('voteAgainst')}</Button>
                      <Button variant="ghost" size="sm" onClick={() => castVote(p.id, 'abstain')}>{t('abstain')}</Button>
                    </div>
                  )
                ) : (
                  <Badge variant="passed">{t('executed')}</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
