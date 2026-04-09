'use client'

import { useEffect, useState } from 'react'
import { DiskMetrics, DiskPartition } from '@/types/telemetry'
import { useSSE } from '@/hooks/useSSE'
import { useHistory } from '@/hooks/useHistory'
import { ChartCard } from '@/components/ChartCard'

interface Props {
  nodeId: string
  windowPoints: number
}

function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)} TB`
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  return `${(bytes / 1e3).toFixed(1)} KB`
}

function PartitionBar({ p }: { p: DiskPartition }) {
  const pct = parseFloat(p.used_percent.toFixed(1))
  const color = pct >= 90 ? 'bg-red-400' : pct >= 75 ? 'bg-yellow-400' : 'bg-indigo-400'

  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-mono text-neutral-600">{p.mountpoint}</span>
        <span className="text-neutral-400">
          {formatBytes(p.used)} / {formatBytes(p.total)} ({pct}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function DiskChart({ nodeId, windowPoints }: Props) {
  const history = useHistory<DiskMetrics>(nodeId, 'disk', windowPoints)
  const [partitions, setPartitions] = useState<DiskPartition[]>([])

  useEffect(() => {
    if (history.length > 0) {
      setPartitions(history[history.length - 1].payload.partitions)
    }
  }, [history])

  const status = useSSE<DiskMetrics>(nodeId, 'disk', (t) => {
    setPartitions(t.payload.partitions)
  })

  return (
    <ChartCard title="Disk Usage" nodeId={nodeId} status={status}>
      {partitions.length === 0 ? (
        <div className="flex h-24 items-center justify-center text-sm text-neutral-400">Waiting for data...</div>
      ) : (
        <div className="pt-1">
          {partitions.map((p) => (
            <PartitionBar key={p.mountpoint} p={p} />
          ))}
        </div>
      )}
    </ChartCard>
  )
}
