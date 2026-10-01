import type { CompletionDetails, RegistrationDetails } from '../types/registration'

type Action =
  | ({ action: 'create' } & RegistrationDetails)
  | ({ action: 'aws_clicked'; registration_id: string })
  | ({ action: 'complete' } & CompletionDetails)

type ApiResponse = { success: boolean; data?: { registration_id?: string }; message?: string }

async function postActionOnce(url: string, body: Action): Promise<ApiResponse> {
  const response = await fetch(url, {
    method: 'POST',
    // text/plain is a simple cross-origin request; Apps Script reads e.postData.contents.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
    redirect: 'follow',
  })
  if (!response.ok) throw new Error('request_failed')

  const result: ApiResponse = await response.json()
  if (!result.success) {
    throw new Error(result.message === 'Registration not found.' ? 'registration_not_found' : 'request_failed')
  }
  return result
}

async function postAction(body: Action): Promise<ApiResponse> {
  const url = import.meta.env.VITE_APPS_SCRIPT_URL?.trim()
  if (!url) {
    console.error('Set VITE_APPS_SCRIPT_URL in .env.local to the deployed Google Apps Script Web App URL.')
    throw new Error('service_unavailable')
  }

  // Apps Script can briefly fail while following its redirect or acquiring its
  // sheet lock. Every action is idempotent, so one retry is safe and prevents a
  // transient failure from blocking the Step 2 Continue/Complete action.
  try {
    return await postActionOnce(url, body)
  } catch (error) {
    console.error('Registration service request failed:', error)
    if (error instanceof Error && error.message === 'registration_not_found') throw error
    try {
      return await postActionOnce(url, body)
    } catch (retryError) {
      console.error('Registration service retry failed:', retryError)
      if (retryError instanceof Error && retryError.message === 'registration_not_found') throw retryError
      throw new Error('service_unavailable')
    }
  }
}

export function createRegistration(details: RegistrationDetails) {
  return postAction({ action: 'create', ...details })
}

export function markAwsClicked(registrationId: string) {
  return postAction({ action: 'aws_clicked', registration_id: registrationId })
}

export function completeRegistration(details: CompletionDetails) {
  return postAction({ action: 'complete', ...details })
}
