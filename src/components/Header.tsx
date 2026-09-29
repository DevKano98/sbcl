import { Blocks } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-[900px] items-center px-4 pb-7 pt-6 sm:px-5 sm:pt-8">
      <Link to="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-4" aria-label="AWS Student Builder home">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange text-navy"><Blocks size={21} strokeWidth={2.4} aria-hidden="true" /></span>
        <span className="flex flex-col leading-tight">
          <strong className="text-[15px] font-bold tracking-tight text-navy">AWS Student Builder</strong>
          <span className="mt-0.5 text-xs font-medium text-muted">Campus Registration</span>
        </span>
      </Link>
    </header>
  )
}
