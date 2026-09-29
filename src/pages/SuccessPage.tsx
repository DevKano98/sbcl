import { Check, ArrowRight } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { StepIndicator } from '../components/StepIndicator'
import { clearRegistration, getSavedRegistration } from '../lib/storage'

export function SuccessPage() {
  const { registrationId } = useParams()
  const navigate = useNavigate()
  const saved = getSavedRegistration()

  if (!registrationId || saved?.registrationId !== registrationId || !saved.completed) {
    return <div className="min-h-screen bg-canvas"><Header /><main className="mx-auto max-w-[560px] px-4"><div className="rounded-2xl border border-line bg-white p-6 shadow-card"><h1 className="text-2xl font-bold text-navy">Registration not found</h1><p className="mt-2 text-muted">Your completed registration is not available in this browser.</p><Link to="/" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-orange px-5 font-bold text-navy">Go to home</Link></div></main></div>
  }

  function registerAnother() {
    clearRegistration()
    navigate('/register')
  }

  return <div className="min-h-screen bg-canvas"><Header />
    <main className="mx-auto w-full max-w-[560px] px-4 pb-12 sm:px-5">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8">
        <StepIndicator current={3} />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><Check size={32} strokeWidth={2.5} aria-hidden="true" /></div>
        <h1 className="mt-5 text-[32px] font-extrabold tracking-tight text-navy">You're done</h1>
        <p className="mt-2 text-base leading-relaxed text-muted">Your registration has been submitted successfully.</p>

        <div className="mt-7 divide-y divide-line rounded-xl border border-line bg-[#fcfcfd] px-4">
          <div className="flex items-center justify-between gap-3 py-4"><span className="text-sm text-muted">Registration ID</span><strong className="break-all text-right text-sm text-navy">{registrationId}</strong></div>
          <div className="flex items-center justify-between gap-3 py-4"><span className="text-sm text-muted">AWS Builder Alias</span><strong className="break-all text-right text-sm text-navy">{saved.alias}</strong></div>
          <div className="flex items-center justify-between gap-3 py-4"><span className="text-sm text-muted">Status</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Completed</span></div>
        </div>
        <p className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-900">Your AWS Builder Alias has been submitted for review.</p>
        <Link to="/" className="mt-7 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange px-5 py-3 font-bold text-navy transition hover:bg-[#eb8d00] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange/40">Done <ArrowRight size={18} aria-hidden="true" /></Link>
        <button type="button" onClick={registerAnother} className="mt-3 min-h-12 w-full rounded-xl text-sm font-semibold text-muted underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange">Register Another Student</button>
      </div>
    </main>
  </div>
}
