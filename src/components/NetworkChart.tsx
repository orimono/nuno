'use client'

import { useEffect, useRef, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { NetworkMetrics } from '@/types/telemetry'
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
  recv_kbps: number
  sent_kbps: number
}

function formatKbps(v: number) {
  if (v >= 1024) return `${(v / 1024).toFixed(1)} MB/s`
  return `${v.toFixed(1)} KB/s`
}

function toPoints(records: { ts: number; payload: NetworkMetrics }[]): DataPoint[] {
  const points: DataPoint[] = []
  for (let i = 1; i < records.length; i++) {
    const prev = records[i - 1]
    const curr = records[i]
    const dtSec = (curr.ts - prev.ts) / 1_000_000 / 1000
    if (dtSec <= 0) continue
    const totalRecvNow = curr.payload.interfaces.reduce((s, x) => s + x.bytes_recv, 0)
    const totalSentNow = curr.payload.interfaces.reduce((s, x) => s + x.bytes_sent, 0)
    const totalRecvPrev = prev.payload.interfaces.reduce((s, x) => s + x.bytes_recv, 0)
    const totalSentPrev = prev.payload.interfaces.reduce((s, x) => s + x.bytes_sent, 0)
    const tsMs = curr.ts / 1_000_000
    points.push({
      tsMs,
      time: new Date(tsMs).toLocaleTimeString(),
      recv_kbps: parseFloat(Math.max(0, (totalRecvNow - totalRecvPrev) / dtSec / 1024).toFixed(2)),
      sent_kbps: parseFloat(Math.max(0, (totalSentNow - totalSentPrev) / dtSec / 1024).toFixed(2)),
    })
  }
  return points
}

export default function NetworkChart({ nodeId, windowSeconds }: Props) {
  const history = useHistory<NetworkMetrics>(nodeId, 'net', windowSeconds)
  const [data, setData] = useState<DataPoint[]>([])
  const prevRef = useRef<{ ts: number; recv: number; sent: number } | null>(null)

  useEffect(() => {
    setData(toPoints(history))
    if (history.length > 0) {
      const last = history[history.length - 1]
      prevRef.current = {
        ts: last.ts / 1_000_000,
        recv: last.payload.interfaces.reduce((s, x) => s + x.bytes_recv, 0),
        sent: last.payload.interfaces.reduce((s, x) => s + x.bytes_sent, 0),
      }
    }
  }, [history])

  const status = useSSE<NetworkMetrics>(nodeId, 'net', (t) => {
    const totalRecv = t.payload.interfaces.reduce((s, i) => s + i.bytes_recv, 0)
    const totalSent = t.payload.interfaces.reduce((s, i) => s + i.bytes_sent, 0)
    const nowMs = t.ts / 1_000_000

    if (prevRef.current !== null) {
      const dtSec = (nowMs - prevRef.current.ts) / 1000
      if (dtSec > 0) {
        const recvKbps = parseFloat(Math.max(0, (totalRecv - prevRef.current.recv) / dtSec / 1024).toFixed(2))
        const sentKbps = parseFloat(Math.max(0, (totalSent - prevRef.current.sent) / dtSec / 1024).toFixed(2))
        const point: DataPoint = { tsMs: nowMs, time: new Date(nowMs).toLocaleTimeString(), recv_kbps: recvKbps, sent_kbps: sentKbps }
        const cutoff = Date.now() - windowSeconds * 1000
        setData((prev) => [...prev, point].filter((p) => p.tsMs >= cutoff))
      }
    }
    prevRef.current = { ts: nowMs, recv: totalRecv, sent: totalSent }
  })

  return (
    <ChartCard title="Network I/O" nodeId={nodeId} status={status}>
      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-neutral-400">Waiting for data...</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} interval="preserveStartEnd" />
            <YAxis tickFormatter={formatKbps} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={64} />
            <Tooltip formatter={(v) => [formatKbps(Number(v ?? 0))]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="recv_kbps" name="Recv" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="sent_kbps" name="Sent" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}
