import { useEffect, useRef } from 'react'

export function useAbortController() {
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortControllerRef.current = new AbortController()
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  return abortControllerRef.current
}
