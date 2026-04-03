'use client'

import { useEffect, useState } from 'react'
import { NodeInfo, StatusColor, StatusLabel } from '@/types/node'

interface Props {
  selectedId: string | null
  onSelect: (nodeId: string) => void
}

export default function NodeList({ selectedId, onSelect }: Props) {
  const [nodes, setNodes] = useState<NodeInfo[]>([])

  const loomURL = process.env.NEXT_PUBLIC_LOOM_URL ?? 'http://localhost:8080'

  useEffect(() => {
    const fetchNodes = () => {
      fetch(`${loomURL}/api/nodes`)
        .then((r) => r.json())
        .then(setNodes)
        .catch(() => {})
    }

    fetchNodes()
    const id = setInterval(fetchNodes, 5000)
    return () => clearInterval(id)
  }, [loomURL])

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-neutral-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-neutral-700">Nodes</h2>
        <p className="mt-0.5 text-xs text-neutral-400">{nodes.length} registered</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {nodes.length === 0 ? (
          <p className="px-4 py-6 text-xs text-neutral-400">No nodes registered</p>
        ) : (
          nodes.map((n) => (
            <button
              key={n.node_id}
              onClick={() => onSelect(n.node_id)}
              className={`w-full border-b border-neutral-100 px-4 py-3 text-left transition-colors hover:bg-neutral-50 ${
                selectedId === n.node_id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 shrink-0 rounded-full ${StatusColor[n.status]}`} />
                <span className="truncate text-sm font-medium text-neutral-800">
                  {n.hostname}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 pl-4">
                <span className="text-xs text-neutral-400">{StatusLabel[n.status]}</span>
                <span className="text-neutral-300">·</span>
                <span className="font-mono text-xs text-neutral-400">
                  {n.os}/{n.arch}
                </span>
              </div>
              <p className="mt-0.5 truncate pl-4 font-mono text-xs text-neutral-300">
                {n.node_id}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
