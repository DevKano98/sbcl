type Props = { current: 1 | 2 | 3 }

export function StepIndicator({ current }: Props) {
  return (
    <div className="mb-7" aria-label={`Step ${current} of 3`}>
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        <span>Step {current} of 3</span><span>{current === 1 ? 'Your details' : current === 2 ? 'AWS Builder Center' : 'Complete'}</span>
      </div>
      <div className="flex gap-2" aria-hidden="true">
        {[1, 2, 3].map((step) => <span key={step} className={`h-1.5 flex-1 rounded-full ${step <= current ? 'bg-orange' : 'bg-line'}`} />)}
      </div>
    </div>
  )
}
