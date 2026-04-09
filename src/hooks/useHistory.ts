'use client'

import { useEffect, useState } from 'react'
import { Telemetry } from '@/types/telemetry'

export function useHistory<T>(nodeId: string, type: string, limit: number): Telemetry<T>[] {
  const [records, setRecords] = useState<Telemetry<T>[]>([])

  useEffect(() => {
    const loomURL = process.env.NEXT_PUBLIC_LOOM_URL ?? 'http://localhost:8080'
    fetch(`${loomURL}/api/history?node_id=${nodeId}&type=${type}&limit=${limit}`)
      .then((r) => r.json())
      .then((data) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [nodeId, type, limit])

  return records
}
