'use client'

import { useEffect, useState } from 'react'
import { Telemetry } from '@/types/telemetry'

const MAX_POINTS = 300

export function useHistory<T>(nodeId: string, type: string, windowSeconds: number): Telemetry<T>[] {
  const [records, setRecords] = useState<Telemetry<T>[]>([])

  useEffect(() => {
    const osaURL = process.env.NEXT_PUBLIC_OSA_URL ?? 'http://localhost:8081'
    const toTs = Math.floor(Date.now() / 1000)
    const fromTs = toTs - windowSeconds
    const url = `${osaURL}/api/history?node_id=${nodeId}&type=${type}&from_ts=${fromTs}&to_ts=${toTs}&max_points=${MAX_POINTS}`

    fetch(url)
      .then((r) => r.json())
      .then((data) => setRecords(data?.items ?? []))
      .catch(() => setRecords([]))
  }, [nodeId, type, windowSeconds])

  return records
}
