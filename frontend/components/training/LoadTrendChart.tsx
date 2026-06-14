'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HistoryDataPoint } from '@/lib/types'

interface LoadTrendChartProps {
  data: HistoryDataPoint[]
}

export function LoadTrendChart({ data }: LoadTrendChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.ctl, d.atl))) * 1.1

  const getX = (index: number) => `${(index / (data.length - 1)) * 100}%`
  const getY = (value: number) => `${(1 - value / maxValue) * 100}%`

  const createPath = (key: 'ctl' | 'atl') => {
    return data.map((d, i) => {
      const x = getX(i)
      const y = getY(d[key])
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-800">负荷趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-48">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" />

            <path d={createPath('ctl')} fill="none" stroke="#10b981" strokeWidth="2" />
            <path d={createPath('atl')} fill="none" stroke="#f59e0b" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-gray-600">CTL (体能)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-600">ATL (疲劳)</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{data[data.length - 1].ctl}</div>
            <div className="text-xs text-gray-500">当前 CTL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{data[data.length - 1].atl}</div>
            <div className="text-xs text-gray-500">当前 ATL</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">{data[data.length - 1].form}</div>
            <div className="text-xs text-gray-500">Form</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
