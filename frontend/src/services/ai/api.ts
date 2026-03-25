import { api } from '../api'
import type { AiEndpointIn, AiEndpointOut } from './types'

interface RequestOptions {
  signal?: AbortSignal
}

export const improveDescription = async (
  payload: AiEndpointIn,
  options?: RequestOptions,
): Promise<AiEndpointOut> => {
  const { data } = await api.post<AiEndpointOut>(
    '/ai/improve-description',
    payload,
    { signal: options?.signal },
  )

  return data
}

export const suggestPrice = async (
  payload: AiEndpointIn,
  options?: RequestOptions,
): Promise<AiEndpointOut> => {
  const { data } = await api.post<AiEndpointOut>(
    '/ai/suggest-price',
    payload,
    { signal: options?.signal, timeout: 30_000 },
  )

  return data
}
