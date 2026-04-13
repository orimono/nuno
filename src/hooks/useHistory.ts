'use client'

import { useEffect, useState } from 'react'
import { Telemetry } from '@/types/telemetry'

export function useHistory<T>(nodeId: string, type: string, limit: number): Telemetry<T>[] {
  const [records, setRecords] = useState<Telemetry<T>[]>([])

  useEffect(() => {
    const osaURL = process.env.NEXT_PUBLIC_OSA_URL ?? 'http://localhost:8081'
    fetch(`${osaURL}/api/history?node_id=${nodeId}&type=${type}&limit=${limit}`)
      .then((r) => r.json())
      .then((data) => setRecords(data ?? []))
      .catch(() => setRecords([]))
  }, [nodeId, type, limit])

  return records
}
