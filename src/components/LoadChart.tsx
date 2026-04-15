'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { LoadMetrics } from '@/types/telemetry'
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
  load1: number
  load5: number
  load15: number
}

function toPoint(ts: number, payload: LoadMetrics): DataPoint {
  const tsMs = ts / 1_000_000
  return {
    tsMs,
    time: new Date(tsMs).toLocaleTimeString(),
    load1: parseFloat(payload.load1.toFixed(2)),
    load5: parseFloat(payload.load5.toFixed(2)),
    load15: parseFloat(payload.load15.toFixed(2)),
  }
}

export default function LoadChart({ nodeId, windowSeconds }: Props) {
  const history = useHistory<LoadMetrics>(nodeId, 'load', windowSeconds)
  const [data, setData] = useState<DataPoint[]>([])

  useEffect(() => {
    setData(history.map((t) => toPoint(t.ts, t.payload)))
  }, [history])

  const status = useSSE<LoadMetrics>(nodeId, 'load', (t) => {
    const point = toPoint(t.ts, t.payload)
    const cutoff = Date.now() - windowSeconds * 1000
    setData((prev) => [...prev, point].filter((p) => p.tsMs >= cutoff))
  })

  return (
    <ChartCard title="Load Average" nodeId={nodeId} status={status}>
      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-neutral-400">Waiting for data...</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="load1" name="1m" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="load5" name="5m" stroke="#a78bfa" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="load15" name="15m" stroke="#ddd6fe" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
