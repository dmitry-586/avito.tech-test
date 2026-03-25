import { useEffect, useRef } from 'react'

interface AbortControllerState {
  abort: () => void
  nextSignal: () => AbortSignal
}

export function useAbortController(): AbortControllerState {
  const controllerRef = useRef<AbortController | null>(null)

  const abort = () => {
    controllerRef.current?.abort()
  }

  const nextSignal = () => {
    abort()

    const controller = new AbortController()
    controllerRef.current = controller

    return controller.signal
  }

  useEffect(() => abort, [])

  return {
    abort,
    nextSignal,
  }
}
