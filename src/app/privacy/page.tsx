import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — Z-PAD' };

export default function PrivacyPage() {
  return (
    <div className="pt-[100px]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-8">
          <Link href="/" className="hover:text-cyan-400">Home</Link>
          <span className="text-white/30">/</span>
          <span>Privacy Policy</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-[2.2rem] font-extrabold tracking-[-0.03em] mb-4">
          Privacy Policy
        </h1>
        <p className="text-white/50 text-[0.88rem] mb-10">Last updated: January 2026</p>
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">1. Information We Collect</h2>
            <p>We collect wallet addresses, on-chain transaction data, KYC verification data (processed by Veriff), and usage analytics. We do not collect unnecessary personal data.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>Your data is used to provide platform services, comply with legal requirements (including AML/KYC obligations), improve the ZION AI scoring engine, and send important service notifications.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">3. Data Sharing</h2>
            <p>We do not sell your personal data. We share data with KYC providers (Veriff), blockchain infrastructure partners, and law enforcement when legally required. All on-chain data is publicly visible by nature.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">4. Data Retention</h2>
            <p>KYC data is retained for 5 years to comply with financial regulations. Transaction logs are stored for 3 years. You may request deletion of non-regulatory data by contacting us.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">5. Cookies &amp; Analytics</h2>
            <p>We use minimal, privacy-preserving analytics (no third-party tracking). Session cookies are used for authentication only. You may disable non-essential cookies in your browser settings.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have rights to access, rectify, or erase your personal data. Submit requests to privacy@zettaword.com. We respond within 30 days.</p>
          </section>
          <section>
            <h2 className="font-[family-name:var(--font-display)] text-[1.2rem] font-bold text-white mb-3">7. Contact</h2>
            <p>Data Controller: ZETTA WORD. Contact: privacy@zettaword.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
