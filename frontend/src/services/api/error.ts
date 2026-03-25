import { AxiosError } from 'axios'

const TIMEOUT_ERROR_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT'])

function getErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  if (
    'message' in data &&
    typeof data.message === 'string' &&
    data.message.trim()
  ) {
    return data.message
  }

  if ('error' in data && typeof data.error === 'string' && data.error.trim()) {
    return data.error
  }

  return undefined
}

export function normalizeApiError(error: unknown): Error {
  if (error instanceof AxiosError) {
    if (error.code === 'ERR_CANCELED') {
      const abortError = new Error('Request was canceled.')
      abortError.name = 'AbortError'
      return abortError
    }

    if (TIMEOUT_ERROR_CODES.has(error.code ?? '')) {
      return new Error('Server response timed out. Please try again.', {
        cause: error,
      })
    }

    if (error.response) {
      const message =
        getErrorMessage(error.response.data) ??
        `Server request failed with status ${error.response.status}.`

      return new Error(message, { cause: error })
    }

    if (error.request) {
      return new Error('Unable to reach the server. Check your connection.', {
        cause: error,
      })
    }
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('An unknown error occurred.', { cause: error })
}
