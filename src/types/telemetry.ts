export interface MemoryMetrics {
  total: number
  used: number
  free: number
  used_percent: number
}

export interface Telemetry {
  node_id: string
  ts: number
  type: string
  payload: MemoryMetrics
}
