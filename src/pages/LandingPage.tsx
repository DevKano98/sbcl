import { ArrowRight, Check, ExternalLink, UserRound, PencilLine } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { clearRegistration, getSavedRegistration } from '../lib/storage'

const steps = [
  { title: 'Enter your details', icon: UserRound },
  { title: 'Join AWS Builder Center', icon: ExternalLink },
  { title: 'Submit your Builder Alias', icon: PencilLine },
]

export function LandingPage() {
  const navigate = useNavigate()
  const saved = getSavedRegistration()

  function startNew() {
    clearRegistration()
    navigate('/register')
  }

  return <div className="min-h-screen bg-canvas">
    <Header />
    <main className="mx-auto w-full max-w-[900px] px-4 pb-12 sm:px-5">
      <section className="rounded-2xl border border-line bg-white px-5 py-8 shadow-card sm:px-10 sm:py-12">
        <div className="mx-auto max-w-[620px]">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange/30 bg-[#fff8ea] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#875000]"><Check size={14} aria-hidden="true" /> Campus Registration</p>
          <h1 className="max-w-[560px] text-[34px] font-extrabold leading-[1.12] tracking-tight text-navy sm:text-5xl">Join AWS Builder Center</h1>
          <p className="mt-4 max-w-[490px] text-base leading-relaxed text-muted sm:text-lg">Complete your campus registration in just a few minutes.</p>

          <div className="mt-9 space-y-3" aria-label="Registration steps">
            {steps.map(({ title, icon: Icon }, index) => <div key={title} className="flex items-center gap-3.5 rounded-xl border border-line bg-[#fcfcfd] p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff3de] text-sm font-bold text-[#965600]">{index + 1}</span>
              <span className="flex-1 text-sm font-semibold text-navy sm:text-base">{title}</span>
              <Icon size={18} className="shrink-0 text-muted" aria-hidden="true" />
            </div>)}
          </div>

          {saved && !saved.completed && <div className="mt-7 rounded-xl border border-orange/30 bg-[#fffaf1] p-4">
            <p className="text-sm font-bold text-navy">Continue previous registration</p>
            <p className="mt-1 text-sm text-muted">Registration ID: <span className="font-semibold text-navy">{saved.registrationId}</span></p>
            <Link to={`/builder/${saved.registrationId}`} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg px-1 text-sm font-bold text-[#9a5900] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange">Continue <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>}

          <button onClick={startNew} className="mt-8 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange px-5 py-3 text-base font-bold text-navy transition hover:bg-[#eb8d00] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange/40 sm:w-auto sm:min-w-[240px]">
            {saved && !saved.completed ? 'Start New Registration' : 'Start Registration'} <ArrowRight size={19} aria-hidden="true" />
          </button>
          <p className="mt-3 text-center text-xs text-muted sm:text-left">Takes around 2–3 minutes</p>
        </div>
      </section>
      <footer className="pt-8 text-center text-xs leading-relaxed text-muted">Facilitated by <span className="font-semibold text-navy">Dev Kanojiya</span><br />AWS Student Builder Campus Leader</footer>
    </main>
  </div>
}
