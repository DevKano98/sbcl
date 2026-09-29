import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { FormField } from '../components/FormField'
import { LoadingButton } from '../components/LoadingButton'
import { StepIndicator } from '../components/StepIndicator'
import { Toast } from '../components/Toast'
import { createRegistration } from '../lib/api'
import { clearRegistration, generateRegistrationId, getSavedRegistration, saveRegistration } from '../lib/storage'
import { normalizePhone, validateRegistration, type RegistrationErrors, type RegistrationFields } from '../lib/validation'

const initial: RegistrationFields = { full_name: '', email: '', phone: '', college: '', branch: '', year: '', confirmed: false }
const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other']

export function RegisterPage() {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(() => getSavedRegistration())
  const [values, setValues] = useState<RegistrationFields>(initial)
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const idRef = useRef<string | null>(null)
  const submittingRef = useRef(false)

  function update(field: keyof RegistrationFields, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function startNew() {
    clearRegistration()
    setSaved(null)
    setValues(initial)
    idRef.current = null
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submittingRef.current) return
    const nextErrors = validateRegistration(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    submittingRef.current = true
    setLoading(true)
    setToast('')
    const registrationId = idRef.current ?? generateRegistrationId()
    idRef.current = registrationId
    try {
      await createRegistration({
        registration_id: registrationId,
        full_name: values.full_name.trim(),
        email: values.email.trim(),
        phone: normalizePhone(values.phone),
        college: values.college.trim(),
        branch: values.branch.trim(),
        year: values.year,
        status: 'started',
      })
      saveRegistration({ registrationId, name: values.full_name.trim(), email: values.email.trim(), phone: normalizePhone(values.phone) })
      navigate(`/builder/${registrationId}`)
    } catch {
      setToast('Unable to save your details right now. Please try again.')
    } finally {
      submittingRef.current = false
      setLoading(false)
    }
  }

  return <div className="min-h-screen bg-canvas"><Header />
    <main className="mx-auto w-full max-w-[560px] px-4 pb-12 sm:px-5">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-8">
        <StepIndicator current={1} />
        <h1 className="text-[29px] font-extrabold leading-tight tracking-tight text-navy">Tell us about you</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">Enter your details before continuing to AWS Builder Center.</p>

        {saved && !saved.completed ? <div className="mt-7 rounded-xl border border-orange/30 bg-[#fffaf1] p-5">
          <p className="font-bold text-navy">You have a registration in progress</p>
          <p className="mt-1 text-sm text-muted">Registration ID: {saved.registrationId}</p>
          <Link to={`/builder/${saved.registrationId}`} className="mt-4 flex min-h-12 items-center justify-center rounded-xl bg-orange px-4 font-bold text-navy focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange/40">Continue previous registration</Link>
          <button type="button" onClick={startNew} className="mt-3 min-h-11 w-full rounded-lg text-sm font-semibold text-muted underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange">Start New Registration</button>
        </div> : <form onSubmit={submit} noValidate className="mt-7 space-y-5">
          <FormField id="full_name" label="Full Name *" value={values.full_name} onChange={(e) => update('full_name', e.target.value)} error={errors.full_name} autoComplete="name" required />
          <FormField id="email" label="Email *" type="email" inputMode="email" value={values.email} onChange={(e) => update('email', e.target.value)} error={errors.email} autoComplete="email" required />
          <FormField id="phone" label="WhatsApp Number *" type="tel" inputMode="tel" value={values.phone} onChange={(e) => update('phone', e.target.value)} error={errors.phone} hint="Indian mobile number, with or without +91." autoComplete="tel" required />
          <FormField id="college" label="College *" value={values.college} onChange={(e) => update('college', e.target.value)} error={errors.college} autoComplete="organization" required />
          <FormField id="branch" label="Branch / Department *" value={values.branch} onChange={(e) => update('branch', e.target.value)} error={errors.branch} required />
          <FormField id="year" label="Current Year *" value={values.year} onChange={(e) => update('year', e.target.value)} error={errors.year} options={years} required />
          <div>
            <label htmlFor="confirmed" className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-3.5 text-sm leading-relaxed text-navy">
              <input id="confirmed" type="checkbox" checked={values.confirmed} onChange={(e) => update('confirmed', e.target.checked)} aria-invalid={Boolean(errors.confirmed)} aria-describedby={errors.confirmed ? 'confirmed-error' : undefined} className="mt-0.5 h-5 w-5 shrink-0 accent-[#FF9900]" />
              <span>I confirm that the information provided above is correct.</span>
            </label>
            {errors.confirmed && <p id="confirmed-error" role="alert" className="mt-1.5 text-sm text-red-600">{errors.confirmed}</p>}
          </div>
          <LoadingButton type="submit" loading={loading}>Continue to AWS Builder Center</LoadingButton>
        </form>}
      </div>
    </main><Toast message={toast} /></div>
}
