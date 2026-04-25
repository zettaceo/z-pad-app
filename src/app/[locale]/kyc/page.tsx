'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield, CheckCircle, ChevronRight, User, FileText, Camera,
  AlertTriangle, Clock, Lock, Upload, X, Eye, EyeOff
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { n: 1, label: 'Personal Info', icon: User },
  { n: 2, label: 'ID Document', icon: FileText },
  { n: 3, label: 'Selfie Check', icon: Camera },
  { n: 4, label: 'Verified', icon: CheckCircle },
];

const COUNTRIES = [
  'Brazil', 'United States', 'United Kingdom', 'Germany', 'France',
  'Japan', 'South Korea', 'Singapore', 'Canada', 'Australia',
  'Portugal', 'Spain', 'Argentina', 'Mexico', 'Netherlands',
  'Switzerland', 'UAE', 'India', 'Nigeria', 'South Africa',
];

const DOC_TYPES = [
  { id: 'passport', label: 'Passport' },
  { id: 'driver', label: "Driver's License" },
  { id: 'national', label: 'National ID Card' },
  { id: 'residence', label: 'Residence Permit' },
];

export default function KycPage() {
  const [step, setStep] = useState<Step>(1);
  const [showDob, setShowDob] = useState(false);
  const [docType, setDocType] = useState('passport');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', country: '',
    address: '', city: '', zip: '',
  });

  const update = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const step1Valid = form.firstName && form.lastName && form.dob && form.country;
  const step2Valid = frontUploaded && (docType === 'passport' || backUploaded);
  const step3Valid = selfieUploaded;

  function UploadZone({ uploaded, onUpload, label, sublabel }: {
    uploaded: boolean; onUpload: () => void; label: string; sublabel?: string;
  }) {
    return (
      <button
        type="button"
        onClick={onUpload}
        className={cn(
          'w-full rounded-[12px] border-2 border-dashed p-6 text-center transition-all cursor-pointer group',
          uploaded
            ? 'border-green-400/40 bg-green-400/5'
            : 'border-white/15 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5'
        )}
      >
        {uploaded ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-400/15 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="text-green-400 font-semibold text-[0.88rem]">Uploaded</div>
            <button
              onClick={e => { e.stopPropagation(); onUpload(); }}
              className="text-[0.74rem] text-white/40 hover:text-white/60 flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
              <Upload className="w-5 h-5 text-white/40 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className="text-[0.88rem] font-medium text-white/80">{label}</div>
            {sublabel && <div className="text-[0.75rem] text-white/40">{sublabel}</div>}
            <div className="text-[0.72rem] text-white/30">JPG, PNG or PDF — max 10 MB</div>
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="pt-[100px] pb-20 min-h-screen">
      <section className="pt-8">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[0.82rem] text-white/50 mb-6">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>KYC Verification</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/25 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[2rem] font-extrabold tracking-[-0.03em] mb-2">
              Identity Verification
            </h1>
            <p className="text-white/60 text-[0.95rem]">
              One-time verification. Unlocks private rounds, fiat payments, and governance weight boost.
            </p>
          </div>

          {/* Benefits banner */}
          {step < 4 && (
            <div className="grid grid-cols-3 gap-2 mb-7">
              {[
                { icon: Lock, label: 'Private rounds access', color: 'text-cyan-400' },
                { icon: Shield, label: '+1,500 XP · +200 Z', color: 'text-green-400' },
                { icon: Clock, label: '~5 min process', color: 'text-violet-400' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="bg-white/[0.03] border border-white/10 rounded-[10px] p-3 text-center">
                  <Icon className={cn('w-4 h-4 mx-auto mb-1.5', color)} />
                  <div className="text-[0.72rem] text-white/60">{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Step progress */}
          {step < 4 && (
            <div className="flex items-center mb-8">
              {STEPS.slice(0, 3).map((s, i) => (
                <div key={s.n} className="flex items-center flex-1">
                  <div className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center font-bold text-[0.85rem] transition-all border',
                    step > s.n
                      ? 'bg-green-400/15 border-green-400/40 text-green-400'
                      : step === s.n
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                        : 'bg-white/[0.03] border-white/10 text-white/30'
                  )}>
                    {step > s.n ? <CheckCircle className="w-4 h-4" /> : s.n}
                  </div>
                  <div className="ml-2 flex-1">
                    <div className={cn(
                      'text-[0.72rem] font-semibold',
                      step === s.n ? 'text-cyan-400' : step > s.n ? 'text-green-400' : 'text-white/30'
                    )}>
                      {s.label}
                    </div>
                  </div>
                  {i < 2 && (
                    <div className={cn(
                      'w-8 h-[2px] mx-2 rounded-full',
                      step > s.n + 1 ? 'bg-green-400/40' : step > s.n ? 'bg-cyan-500/30' : 'bg-white/8'
                    )} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* STEP 1 — Personal Info */}
          {step === 1 && (
            <div className="bg-bg-075 border border-white/10 rounded-[18px] p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[1.1rem]">Personal Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.76rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={e => update('firstName', e.target.value)}
                      placeholder="John"
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 text-white text-[0.9rem] outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.76rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={e => update('lastName', e.target.value)}
                      placeholder="Smith"
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 text-white text-[0.9rem] outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.76rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type={showDob ? 'date' : 'password'}
                      value={form.dob}
                      onChange={e => update('dob', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 text-white text-[0.9rem] outline-none focus:border-cyan-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDob(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                    >
                      {showDob ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.76rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">Country of Residence</label>
                  <select
                    value={form.country}
                    onChange={e => update('country', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 text-white text-[0.9rem] outline-none focus:border-cyan-500 transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-[#0d1636]">Select country…</option>
                    {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#0d1636]">{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.76rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => update('address', e.target.value)}
                    placeholder="123 Main Street"
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 text-white text-[0.9rem] outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[0.76rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">City</label>
                    <input type="text" value={form.city} onChange={e => update('city', e.target.value)} placeholder="São Paulo"
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 text-white text-[0.9rem] outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[0.76rem] text-white/50 uppercase tracking-wider mb-1.5 font-semibold">ZIP / Postal Code</label>
                    <input type="text" value={form.zip} onChange={e => update('zip', e.target.value)} placeholder="01310-100"
                      className="w-full px-3.5 py-2.5 rounded-[10px] bg-white/[0.03] border border-white/10 text-white text-[0.9rem] outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <p className="text-[0.74rem] text-white/40 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Data encrypted · never sold
                </p>
                <Button onClick={() => setStep(2)} disabled={!step1Valid}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2 — Document Upload */}
          {step === 2 && (
            <div className="bg-bg-075 border border-white/10 rounded-[18px] p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[1.1rem]">Government-Issued ID</h2>
              </div>

              {/* Doc type selector */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                {DOC_TYPES.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDocType(d.id)}
                    className={cn(
                      'py-2.5 px-3.5 rounded-[10px] border text-[0.84rem] font-medium transition-all text-left',
                      docType === d.id
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-400'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:border-white/20'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <UploadZone
                  uploaded={frontUploaded}
                  onUpload={() => setFrontUploaded(s => !s)}
                  label="Front side"
                  sublabel="Clear photo of the front of your document"
                />
                {docType !== 'passport' && (
                  <UploadZone
                    uploaded={backUploaded}
                    onUpload={() => setBackUploaded(s => !s)}
                    label="Back side"
                    sublabel="Clear photo of the back of your document"
                  />
                )}
              </div>

              <div className="mt-4 p-3.5 rounded-[10px] bg-blue-500/5 border border-blue-500/15 flex gap-2.5">
                <AlertTriangle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-[0.8rem] text-white/60">
                  Ensure all corners are visible, text is legible, and no flash glare. Documents must be valid (not expired).
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-white/50 hover:text-white text-[0.88rem] transition-colors"
                >
                  ← Back
                </button>
                <Button onClick={() => setStep(3)} disabled={!step2Valid}>
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 — Selfie */}
          {step === 3 && (
            <div className="bg-bg-075 border border-white/10 rounded-[18px] p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-cyan-400" />
                </div>
                <h2 className="font-[family-name:var(--font-display)] font-bold text-[1.1rem]">Selfie Verification</h2>
              </div>

              <p className="text-white/60 text-[0.88rem] mb-5 leading-relaxed">
                Take a clear photo of yourself holding your ID document. Make sure your face and the document are both clearly visible.
              </p>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { ok: true, label: 'Face clearly visible' },
                  { ok: true, label: 'ID held up to camera' },
                  { ok: true, label: 'Good lighting' },
                  { ok: false, label: 'No sunglasses' },
                  { ok: false, label: 'No hats/masks' },
                  { ok: false, label: 'No filters' },
                ].map(({ ok, label }) => (
                  <div key={label} className={cn(
                    'rounded-[8px] p-2 text-center text-[0.7rem] border',
                    ok ? 'bg-green-400/5 border-green-400/20 text-green-400' : 'bg-red-400/5 border-red-400/20 text-red-400'
                  )}>
                    <div className="text-base mb-0.5">{ok ? '✓' : '✗'}</div>
                    {label}
                  </div>
                ))}
              </div>

              <UploadZone
                uploaded={selfieUploaded}
                onUpload={() => setSelfieUploaded(s => !s)}
                label="Upload selfie with ID"
                sublabel="Photo or screenshot accepted"
              />

              <div className="mt-6 pt-5 border-t border-white/10 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-white/50 hover:text-white text-[0.88rem] transition-colors"
                >
                  ← Back
                </button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!step3Valid}
                  className="bg-gradient-to-br from-cyan-500 to-blue-500"
                >
                  Submit for Review
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4 — Success */}
          {step === 4 && (
            <div className="bg-bg-075 border border-green-400/20 rounded-[18px] p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-[1.6rem] font-extrabold tracking-[-0.03em] mb-2">
                Submitted!
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                Your verification is being reviewed by Veriff. This typically takes <strong className="text-white">2–10 minutes</strong>.
                You'll receive a notification once approved.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-7">
                {[
                  { label: 'XP earned', value: '+1,500 XP', color: 'text-cyan-400' },
                  { label: 'Z earned', value: '+200 Z', color: 'text-green-400' },
                  { label: 'Status', value: 'Pending', color: 'text-yellow-400' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/10 rounded-[10px] p-3">
                    <div className="text-[0.7rem] text-white/40 mb-1">{label}</div>
                    <div className={cn('font-[family-name:var(--font-display)] font-bold', color)}>{value}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="secondary" asChild><Link href="/dashboard">Go to Dashboard</Link></Button>
                <Button asChild><Link href="/projects">Explore Projects</Link></Button>
              </div>
            </div>
          )}

          {/* Privacy note */}
          {step < 4 && (
            <p className="text-center text-[0.75rem] text-white/30 mt-5">
              Powered by Veriff · Encrypted end-to-end · GDPR compliant ·{' '}
              <Link href="/privacy" className="hover:text-white/60 underline underline-offset-2">Privacy Policy</Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
