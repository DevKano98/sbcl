import { CircleAlert, CircleCheck } from 'lucide-react'

export function Toast({ message, kind = 'error' }: { message: string; kind?: 'error' | 'success' }) {
  if (!message) return null
  return <div role={kind === 'error' ? 'alert' : 'status'} className={`fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-[480px] items-start gap-2.5 rounded-xl border bg-white p-4 text-sm font-medium shadow-lg ${kind === 'error' ? 'border-red-200 text-red-700' : 'border-emerald-200 text-emerald-800'}`}>
    {kind === 'error' ? <CircleAlert size={18} aria-hidden="true" /> : <CircleCheck size={18} aria-hidden="true" />}{message}
  </div>
}
