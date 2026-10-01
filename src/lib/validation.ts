export type RegistrationFields = {
  full_name: string
  email: string
  phone: string
  college: string
  branch: string
  year: string
  confirmed: boolean
}

export type RegistrationErrors = Partial<Record<keyof RegistrationFields, string>>

export function normalizePhone(phone: string) {
  return phone.replace(/[\s-]/g, '')
}

export function validateRegistration(values: RegistrationFields): RegistrationErrors {
  const errors: RegistrationErrors = {}
  if (values.full_name.trim().length < 2) errors.full_name = 'Enter your full name (at least 2 characters).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(normalizePhone(values.phone))) errors.phone = 'Enter a valid Indian WhatsApp number.'
  if (!values.college.trim()) errors.college = 'Enter your college name.'
  if (!values.branch.trim()) errors.branch = 'Enter your branch or department.'
  if (!values.year) errors.year = 'Select your current year.'
  if (!values.confirmed) errors.confirmed = 'Please confirm your details.'
  return errors
}

export function validateBuilder(alias: string, displayName: string) {
  return {
    alias: alias.trim().replace(/^@+/, '') ? '' : 'Enter your Builder Alias.',
    displayName: displayName.trim() ? '' : 'Enter the name shown on your AWS Builder profile.',
  }
}
