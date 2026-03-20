import { AxiosError } from 'axios'

const TIMEOUT_ERROR_CODES = new Set(['ECONNABORTED', 'ETIMEDOUT'])

function getErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') {
    return undefined
  }

  if ('message' in data && typeof data.message === 'string' && data.message.trim()) {
    return data.message
  }

  if ('error' in data && typeof data.error === 'string' && data.error.trim()) {
    return data.error
  }

  return undefined
}

export function normalizeApiError(error: unknown): Error {
  if (error instanceof AxiosError) {
    if (TIMEOUT_ERROR_CODES.has(error.code ?? '')) {
      return new Error('Сервер отвечает слишком долго. Попробуйте еще раз.', { cause: error })
    }

    if (error.response) {
      const message =
        getErrorMessage(error.response.data) ??
        `Ошибка запроса к серверу. Код ответа: ${error.response.status}.`

      return new Error(message, { cause: error })
    }

    if (error.request) {
      return new Error('Не удалось связаться с сервером. Проверьте подключение.', {
        cause: error,
      })
    }
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Произошла неизвестная ошибка.', { cause: error })
}
