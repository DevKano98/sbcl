export type RegistrationDetails = {
  registration_id: string
  full_name: string
  email: string
  phone: string
  college: string
  branch: string
  year: string
  status: 'started'
}

export type CompletionDetails = {
  registration_id: string
  aws_builder_alias: string
  aws_display_name: string
}

export type SavedRegistration = {
  registrationId: string
  name: string
  email: string
  phone: string
  alias: string
  completed: boolean
}
