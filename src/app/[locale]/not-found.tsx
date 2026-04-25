import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="pt-[140px] pb-20">
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <div className="font-[family-name:var(--font-display)] text-[6rem] md:text-[8rem] font-extrabold tracking-[-0.04em] leading-none bg-gradient-to-br from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl font-extrabold tracking-[-0.025em] mt-4">
          Lost in space
        </h1>
        <p className="text-white/70 mt-3 leading-relaxed">
          This page has drifted into the void. It may have been moved, renamed, or never existed.
        </p>
        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Button asChild>
            <Link href="/">Back Home</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/projects">Explore Projects</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
