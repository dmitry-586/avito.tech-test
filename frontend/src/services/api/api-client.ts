import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'

import { normalizeApiError } from './api-error'

type ApiResponse<T> = Promise<{ data: T }>
type QueryMethod = 'GET' | 'DELETE'
type MutationMethod = 'POST' | 'PUT' | 'PATCH'

const mapResponse = <T>({ data }: AxiosResponse<T>) => ({ data })

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

const request = async <T>(config: AxiosRequestConfig): ApiResponse<T> => {
  try {
    const result = await apiClient.request<T>(config)
    return mapResponse(result)
  } catch (error) {
    throw normalizeApiError(error)
  }
}

const createQueryMethod =
  (method: QueryMethod) =>
  <T = unknown>(url: string, config?: AxiosRequestConfig): ApiResponse<T> => {
    return request<T>({ ...config, url, method })
  }

const createMutationMethod =
  (method: MutationMethod) =>
  <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): ApiResponse<T> => {
    return request<T>({ ...config, url, method, data })
  }

export const api = {
  get: createQueryMethod('GET'),
  post: createMutationMethod('POST'),
  put: createMutationMethod('PUT'),
  patch: createMutationMethod('PATCH'),
  delete: createQueryMethod('DELETE'),
}
