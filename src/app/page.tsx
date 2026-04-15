'use client'

import { useState } from 'react'
import NodeList from '@/components/NodeList'
import MemoryChart from '@/components/MemoryChart'
import CPUChart from '@/components/CPUChart'
import DiskChart from '@/components/DiskChart'
import NetworkChart from '@/components/NetworkChart'
import LoadChart from '@/components/LoadChart'
import WindowSelector from '@/components/WindowSelector'

const DEFAULT_WINDOW = 5 * 60 // 5 minutes in seconds

export default function Home() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [windowSeconds, setWindowSeconds] = useState(DEFAULT_WINDOW)

  return (
    <div className="flex h-screen bg-neutral-50">
      <aside className="flex w-72 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-4 py-4">
          <h1 className="text-base font-semibold text-neutral-900">Node Monitor</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <NodeList selectedId={selectedId} onSelect={setSelectedId} />
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-auto">
        {selectedId ? (
          <>
            <div className="flex items-center justify-end border-b border-neutral-200 bg-white px-8 py-3">
              <WindowSelector value={windowSeconds} onChange={setWindowSeconds} />
            </div>
            <div className="grid grid-cols-1 gap-6 p-8 xl:grid-cols-2">
              <CPUChart nodeId={selectedId} windowSeconds={windowSeconds} />
              <MemoryChart nodeId={selectedId} windowSeconds={windowSeconds} />
              <NetworkChart nodeId={selectedId} windowSeconds={windowSeconds} />
              <LoadChart nodeId={selectedId} windowSeconds={windowSeconds} />
              <div className="xl:col-span-2">
                <DiskChart nodeId={selectedId} windowSeconds={windowSeconds} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-neutral-400">Select a node to view telemetry</p>
          </div>
        )}
      </main>
    </div>
  )
}
