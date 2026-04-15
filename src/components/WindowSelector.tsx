'use client'

interface Option {
  label: string
  seconds: number
}

const OPTIONS: Option[] = [
  { label: '5m',  seconds: 5 * 60 },
  { label: '15m', seconds: 15 * 60 },
  { label: '30m', seconds: 30 * 60 },
  { label: '1h',  seconds: 60 * 60 },
  { label: '3h',  seconds: 3 * 60 * 60 },
]

interface Props {
  value: number
  onChange: (seconds: number) => void
}

export default function WindowSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-neutral-400">Window:</span>
      <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
        {OPTIONS.map((o) => (
          <button
            key={o.label}
            onClick={() => onChange(o.seconds)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              value === o.seconds
                ? 'bg-white text-neutral-800 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
