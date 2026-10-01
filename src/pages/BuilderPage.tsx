import { useRef, useState } from 'react'
import { ArrowUpRight, CheckCircle2, ChevronDown, ExternalLink, Image as ImageIcon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { FormField } from '../components/FormField'
import { LoadingButton } from '../components/LoadingButton'
import { StepIndicator } from '../components/StepIndicator'
import { Toast } from '../components/Toast'
import { completeRegistration, markAwsClicked, RegistrationApiError } from '../lib/api'
import { getSavedRegistration, saveCompletion } from '../lib/storage'
import { validateBuilder } from '../lib/validation'

const referralUrl = import.meta.env.VITE_AWS_REFERRAL_URL || 'https://bit.ly/4hWkXKR'
const instructions = ['Open AWS Builder Center', 'Sign in or create your profile', 'Complete your profile', 'Find your Builder Alias', 'Come back here']

export function BuilderPage() {
  const { registrationId } = useParams()
  const navigate = useNavigate()
  const saved = getSavedRegistration()
  const [opened, setOpened] = useState(false)
  const [alias, setAlias] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [errors, setErrors] = useState({ alias: '', displayName: '' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const submittingRef = useRef(false)
  const clickedRef = useRef(false)

  if (!registrationId || !/^AWS-[A-Z0-9]{6}$/.test(registrationId) || saved?.registrationId !== registrationId) {
    return <div className="min-h-screen bg-canvas"><Header /><main className="mx-auto max-w-[560px] px-4"><div className="rounded-2xl border border-line bg-white p-6 shadow-card"><h1 className="text-2xl font-bold text-navy">Registration not found</h1><p className="mt-2 text-muted">Please start your registration again from this browser.</p><Link to="/" className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-orange px-5 font-bold text-navy">Go to home</Link></div></main></div>
  }
  const id = registrationId

  function handleAwsClick() {
    setOpened(true)
    if (clickedRef.current) return
    clickedRef.current = true
    void markAwsClicked(id).catch(() => {
      clickedRef.current = false
      setToast('We could not update your progress. You can still complete your registration below.')
    })
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return
    const nextErrors = validateBuilder(alias, displayName)
    setErrors(nextErrors)
    if (nextErrors.alias || nextErrors.displayName) return
    const builderAlias = `@${alias.trim().replace(/^@+/, '')}`
    submittingRef.current = true
    setLoading(true)
    setToast('')
    try {
      await completeRegistration({
        registration_id: id,
        aws_builder_alias: builderAlias,
        aws_display_name: displayName.trim(),
      })
      saveCompletion(builderAlias)
      navigate(`/success/${id}`)
    } catch (error) {
      setToast(error instanceof RegistrationApiError ? error.message : 'Unable to save your Builder Alias. Please check your connection and try again.')
    } finally {
      submittingRef.current = false
      setLoading(false)
    }
  }

  return <div className="min-h-screen bg-canvas"><Header />
    <main className="mx-auto w-full max-w-[560px] px-4 pb-12 sm:px-5">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8">
        <StepIndicator current={2} />
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-navy">Complete your AWS Builder Center profile</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">Follow these steps, then return here to submit your Builder Alias.</p>

        <ol className="mt-7 space-y-3">
          {instructions.map((item, index) => <li key={item} className="flex items-center gap-3 text-sm text-navy"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff3de] font-bold text-[#965600]">{index + 1}</span><span className="font-medium">{item}</span></li>)}
        </ol>

        <a href={referralUrl} target="_blank" rel="noopener noreferrer" onClick={handleAwsClick} className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-orange px-5 py-3 text-center text-base font-bold text-navy transition hover:bg-[#eb8d00] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange/40">Open AWS Builder Center <ArrowUpRight size={19} aria-hidden="true" /></a>
        {opened && <p role="status" className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700"><CheckCircle2 size={17} aria-hidden="true" />AWS Builder Center opened in another tab.</p>}

        <div className="my-8 flex items-center gap-3"><span className="h-px flex-1 bg-line" /><span className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">Finished your AWS profile?</span><span className="h-px flex-1 bg-line" /></div>

        <form onSubmit={submit} noValidate className="space-y-5">
          <FormField id="alias" label="AWS Builder Alias *" value={alias} onChange={(e) => { setAlias(e.target.value); setErrors((v) => ({ ...v, alias: '' })) }} error={errors.alias} hint="Enter your Builder Alias. It will be saved as @alias in the registration sheet." autoComplete="off" required />
          <FormField id="aws_display_name" label="Name on AWS Builder Center *" value={displayName} onChange={(e) => { setDisplayName(e.target.value); setErrors((v) => ({ ...v, displayName: '' })) }} error={errors.displayName} hint="Enter the name displayed on your AWS Builder Center profile." autoComplete="name" required />
          <details className="group rounded-xl border border-line bg-[#fcfcfd] p-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange [&::-webkit-details-marker]:hidden">Where do I find my Builder Alias?<ChevronDown size={18} className="shrink-0 text-muted transition group-open:rotate-180" aria-hidden="true" /></summary>
            <div className="pt-4 text-sm leading-relaxed text-muted"><p>Open your AWS Builder Center profile. Look for the Builder Alias shown with your profile details, then copy it exactly into the field above.</p><div className="mt-4 flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white text-center text-xs text-muted"><ImageIcon size={22} aria-hidden="true" />Screenshot guide coming soon</div></div>
          </details>
          <LoadingButton type="submit" loading={loading}>Complete Registration</LoadingButton>
        </form>
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted"><ExternalLink size={14} className="mt-0.5 shrink-0" aria-hidden="true" />AWS Builder Center opens in a separate tab. Keep this page open to finish registration.</p>
      </div>
    </main><Toast message={toast} /></div>
}
