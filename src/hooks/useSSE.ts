'use client'

import { useEffect, useRef, useState } from 'react'
import { Telemetry } from '@/types/telemetry'

export type SSEStatus = 'connecting' | 'connected' | 'disconnected'

export function useSSE<T>(nodeId: string, type: string, onMessage: (t: Telemetry<T>) => void) {
  const [status, setStatus] = useState<SSEStatus>('connecting')
  const esRef = useRef<EventSource | null>(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  useEffect(() => {
    const loomURL = process.env.NEXT_PUBLIC_LOOM_URL ?? 'http://localhost:8080'
    const es = new EventSource(`${loomURL}/api/stream?node_id=${nodeId}&type=${type}`)
    esRef.current = es

    es.onopen = () => setStatus('connected')

    es.onmessage = (e) => {
      const t: Telemetry<T> = JSON.parse(e.data)
      onMessageRef.current(t)
    }

    es.onerror = () => {
      setStatus('disconnected')
      es.close()
    }

    return () => {
      es.close()
    }
  }, [nodeId, type])

  return status
}
