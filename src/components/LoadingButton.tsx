import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading: boolean; children: ReactNode }

export function LoadingButton({ loading, children, className = '', disabled, ...rest }: Props) {
  return (
    <button {...rest} disabled={loading || disabled} className={`flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-orange px-5 py-3 text-center text-base font-bold text-navy transition hover:bg-[#eb8d00] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange/40 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
      {loading && <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
}
