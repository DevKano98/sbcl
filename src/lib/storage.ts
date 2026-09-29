import type { SavedRegistration } from '../types/registration'

const keys = {
  id: 'aws_registration_id',
  name: 'aws_registration_name',
  email: 'aws_registration_email',
  phone: 'aws_registration_phone',
  alias: 'aws_registration_alias',
  completed: 'aws_registration_completed',
} as const

export function getSavedRegistration(): SavedRegistration | null {
  try {
    const registrationId = localStorage.getItem(keys.id)
    if (!registrationId) return null
    return {
      registrationId,
      name: localStorage.getItem(keys.name) ?? '',
      email: localStorage.getItem(keys.email) ?? '',
      phone: localStorage.getItem(keys.phone) ?? '',
      alias: localStorage.getItem(keys.alias) ?? '',
      completed: localStorage.getItem(keys.completed) === 'true',
    }
  } catch {
    return null
  }
}

export function saveRegistration(details: Pick<SavedRegistration, 'registrationId' | 'name' | 'email' | 'phone'>) {
  try {
    localStorage.setItem(keys.id, details.registrationId)
    localStorage.setItem(keys.name, details.name)
    localStorage.setItem(keys.email, details.email)
    localStorage.setItem(keys.phone, details.phone)
    localStorage.removeItem(keys.alias)
    localStorage.removeItem(keys.completed)
  } catch {
    // The current page still works when browser storage is disabled.
  }
}

export function saveCompletion(alias: string) {
  try {
    localStorage.setItem(keys.alias, alias)
    localStorage.setItem(keys.completed, 'true')
  } catch {
    // The success route remains available in this tab.
  }
}

export function clearRegistration() {
  try {
    Object.values(keys).forEach((key) => localStorage.removeItem(key))
  } catch {
    // Nothing to clear if browser storage is disabled.
  }
}

export function generateRegistrationId() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const values = new Uint32Array(6)
  crypto.getRandomValues(values)
  return `AWS-${Array.from(values, (value) => characters[value % characters.length]).join('')}`
}
