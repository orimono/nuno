'use client'

import { SSEStatus } from '@/hooks/useSSE'

interface Props {
  title: string
  nodeId: string
  status: SSEStatus
  children: React.ReactNode
}

export function ChartCard({ title, nodeId, status, children }: Props) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-500">{title}</h2>
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
      {children}
    </div>
  )
}
