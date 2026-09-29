import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'

type BaseProps = { id: string; label: string; error?: string; hint?: string; children?: ReactNode }
type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { options?: never }
type SelectProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { options: string[] }

export function FormField(props: InputProps | SelectProps) {
  const { id, label, error, hint } = props
  const className = `min-h-12 w-full rounded-xl border bg-white px-3.5 py-3 text-base text-navy outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-orange/30 ${error ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-orange'}`
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-navy">{label}</label>
      {'options' in props && props.options ? (
        <select id={id} className={className} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} value={props.value} onChange={props.onChange} required={props.required}>
          <option value="">Select your year</option>
          {props.options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (() => {
        const { label: _label, error: _error, hint: _hint, options: _options, ...inputProps } = props as InputProps
        void _label; void _error; void _hint; void _options
        return <input {...inputProps} id={id} className={className} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} />
      })()}
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-600">{error}</p>}
      {!error && hint && <p id={`${id}-hint`} className="text-xs leading-relaxed text-muted">{hint}</p>}
    </div>
  )
}
