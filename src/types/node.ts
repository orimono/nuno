export type NodeStatus = 0 | 1 | 2 | 3 | 4

export const StatusLabel: Record<NodeStatus, string> = {
  0: 'Pending',
  1: 'Online',
  2: 'Reconnecting',
  3: 'Offline',
  4: 'Evicted',
}

export const StatusColor: Record<NodeStatus, string> = {
  0: 'bg-yellow-400',
  1: 'bg-green-400',
  2: 'bg-blue-400',
  3: 'bg-neutral-400',
  4: 'bg-red-400',
}

export interface NodeInfo {
  node_id: string
  hostname: string
  os: string
  arch: string
  tags: string[]
  status: NodeStatus
  last_seen_at: string
}
