export interface MemoryMetrics {
  total: number
  used: number
  free: number
  used_percent: number
}

export interface CPUMetrics {
  used_percent: number
  per_cpu: number[]
}

export interface DiskPartition {
  mountpoint: string
  total: number
  used: number
  free: number
  used_percent: number
}

export interface DiskMetrics {
  partitions: DiskPartition[]
}

export interface NetworkInterface {
  name: string
  bytes_sent: number
  bytes_recv: number
  packets_sent: number
  packets_recv: number
}

export interface NetworkMetrics {
  interfaces: NetworkInterface[]
}

export interface LoadMetrics {
  load1: number
  load5: number
  load15: number
}

export interface Telemetry<T = MemoryMetrics> {
  node_id: string
  ts: number
  type: string
  payload: T
}
