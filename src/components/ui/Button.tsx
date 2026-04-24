import {
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
  type ButtonHTMLAttributes,
  type ReactNode,
  type ReactElement,
} from 'react';
import { cn } from '@/lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  asChild?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-cyan-500 to-blue-500 text-[#021628] font-bold shadow-[0_4px_20px_rgba(0,212,255,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_0_64px_rgba(0,212,255,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white/5 text-white border border-white/15 backdrop-blur-md hover:bg-cyan-500/10 hover:border-cyan-500/35 hover:text-cyan-400',
  ghost: 'text-white/70 hover:bg-white/5 hover:text-white',
  danger:
    'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50',
  success: 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-green-500/25',
  gold: 'bg-gradient-to-br from-gold-500 to-gold-400 text-[#2a1f0a] font-bold shadow-[0_4px_20px_rgba(201,169,85,0.3)] hover:brightness-110',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2.5 text-[0.82rem] [&>svg]:h-3.5 [&>svg]:w-3.5',
  md: 'px-5 py-3.5 text-[0.9rem] [&>svg]:h-4 [&>svg]:w-4',
  lg: 'px-7 py-[15px] text-[0.98rem] [&>svg]:h-[18px] [&>svg]:w-[18px]',
  xl: 'px-9 py-[18px] text-[1.05rem] [&>svg]:h-5 [&>svg]:w-5',
};

const BASE = cn(
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold leading-none whitespace-nowrap select-none',
  'transition-all duration-[250ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  'focus-visible:outline-2 focus-visible:outline-cyan-500 focus-visible:outline-offset-2'
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', block, asChild, className, children, ...props }, ref) => {
    const classes = cn(BASE, variantStyles[variant], sizeStyles[size], block && 'w-full', className);

    if (asChild) {
      const child = Children.only(children) as ReactElement<{ className?: string }>;
      if (!isValidElement(child)) return null;
      return cloneElement(child, {
        ...props,
        className: cn(classes, child.props.className),
      } as Record<string, unknown>);
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
