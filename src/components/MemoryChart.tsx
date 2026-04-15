'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MemoryMetrics } from '@/types/telemetry'
import { useSSE } from '@/hooks/useSSE'
import { useHistory } from '@/hooks/useHistory'
import { ChartCard } from '@/components/ChartCard'

interface Props {
  nodeId: string
  windowSeconds: number
}

interface DataPoint {
  tsMs: number
  time: string
  used_percent: number
}

function toPoint(ts: number, payload: MemoryMetrics): DataPoint {
  const tsMs = ts / 1_000_000
  return {
    tsMs,
    time: new Date(tsMs).toLocaleTimeString(),
    used_percent: parseFloat(payload.used_percent.toFixed(1)),
  }
}

export default function MemoryChart({ nodeId, windowSeconds }: Props) {
  const history = useHistory<MemoryMetrics>(nodeId, 'mem', windowSeconds)
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    setData(history.map((t) => toPoint(t.ts, t.payload)))
  }, [history])

  const status = useSSE<MemoryMetrics>(nodeId, 'mem', (t) => {
    const point = toPoint(t.ts, t.payload)
    const cutoff = Date.now() - windowSeconds * 1000
    setData((prev) => [...prev, point].filter((p) => p.tsMs >= cutoff))
  })

  return (
    <ChartCard title="Memory Usage" nodeId={nodeId} status={status}>
      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-neutral-400">Waiting for data...</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
            <Tooltip formatter={(v) => [`${v}%`, 'Used']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Line type="monotone" dataKey="used_percent" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
