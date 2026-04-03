'use client'

import { useEffect, useRef, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Telemetry } from '@/types/telemetry'

interface Props {
  nodeId: string
}

interface DataPoint {
  time: string
  used_percent: number
}

const MAX_POINTS = 60

export default function MemoryChart({ nodeId }: Props) {
  const [data, setData] = useState<DataPoint[]>([])
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const loomURL = process.env.NEXT_PUBLIC_LOOM_URL ?? 'http://localhost:8080'
    const es = new EventSource(`${loomURL}/api/stream?node_id=${nodeId}&type=mem`)
    esRef.current = es

    es.onopen = () => setStatus('connected')

    es.onmessage = (e) => {
      const t: Telemetry = JSON.parse(e.data)
      const point: DataPoint = {
        time: new Date(t.ts / 1_000_000).toLocaleTimeString(),
        used_percent: parseFloat(t.payload.used_percent.toFixed(1)),
      }
      setData((prev) => [...prev.slice(-(MAX_POINTS - 1)), point])
    }

    es.onerror = () => {
      setStatus('disconnected')
      es.close()
    }

    return () => {
      es.close()
    }
  }, [nodeId])

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-500">Memory Usage</h2>
          <p className="mt-0.5 font-mono text-xs text-neutral-400">{nodeId}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
            status === 'connected'
              ? 'bg-green-50 text-green-700'
              : status === 'connecting'
              ? 'bg-yellow-50 text-yellow-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === 'connected'
                ? 'bg-green-500'
                : status === 'connecting'
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
          />
          {status}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-neutral-400">
          Waiting for data...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              formatter={(v) => [`${v}%`, 'Used']}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="used_percent"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
