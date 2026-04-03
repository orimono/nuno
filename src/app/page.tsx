'use client'

import { useState } from 'react'
import NodeList from '@/components/NodeList'
import MemoryChart from '@/components/MemoryChart'

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* 左侧节点列表 */}
      <aside className="flex w-72 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-4">
          <h1 className="text-base font-semibold text-neutral-900">Node Monitor</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <NodeList selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </aside>

      {/* 右侧图表区域 */}
      <main className="flex flex-1 flex-col overflow-auto p-8">
        {selectedId ? (
          <div className="flex flex-col gap-6">
            <MemoryChart nodeId={selectedId} />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-neutral-400">Select a node to view telemetry</p>
          </div>
        )}
      </main>
    </div>
  )
}
