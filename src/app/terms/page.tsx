import Link from 'next/link';

import { FEES } from '@/config/fees';

export const metadata = { title: 'Terms of Service — Z-PAD' };

export default function TermsPage() {
  return (
    <div className="pt-[100px]">
      <div className="max-w-[800px] mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-8">
          <Link href="/" className="hover:text-cyan-400">Home</Link>
          <span className="text-white/30">/</span>
          <span>Terms of Service</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[2.2rem] font-extrabold tracking-[-0.03em] mb-4">
          Terms of Service
        </h1>
        <p className="text-white/50 text-[0.88rem] mb-10">Last updated: January 2026</p>
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the Z-PAD platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">2. Eligibility</h2>
            <p>You must be at least 18 years old and comply with all applicable laws in your jurisdiction to use Z-PAD. The platform is not available in jurisdictions where participation in token sales or DeFi activities is prohibited.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">3. Risk Disclosure</h2>
            <p>Participating in token launches involves significant financial risk. You may lose all funds invested. Past performance is not indicative of future results. ZION AI scores are informational tools and do not constitute financial advice.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">4. KYC Requirements</h2>
            <p>Project creators must complete KYC verification through our institutional-grade verification partner. Failure to maintain valid KYC may result in suspension of services.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">5. Platform Fees</h2>
            <p>Z-PAD charges a {FEES.platformPct}% fee on successful raises ({FEES.stakerPlatformPct}% for stakers holding {FEES.stakerMinZ.toLocaleString()}+ Z tokens). A {FEES.listingBnb} BNB listing fee applies to project creation. Fees are subject to change with 30 days notice.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">6. Limitation of Liability</h2>
            <p>Z-PAD and the ZETTA ecosystem are provided on an &quot;as is&quot; basis. We disclaim all warranties and shall not be liable for any losses arising from smart contract exploits, market volatility, or third-party actions.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">7. Contact</h2>
            <p>For legal inquiries, contact legal@zettaword.com. For platform support, use the ZION AI assistant or visit our documentation.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
