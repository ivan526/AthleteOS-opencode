'use client'

import type { HistoryDataPoint } from '@/lib/types'

interface CapacityTrendChartProps {
  data: HistoryDataPoint[]
}

export function CapacityTrendChart({ data }: CapacityTrendChartProps) {
  if (!data || data.length < 2) {
    return (
      <div className="h-36 flex items-center justify-center text-gray-500 text-sm">
        暂无数据
      </div>
    )
  }

  const values = data.map(d => d.training_capacity || 0).filter(v => v > 0)
  if (values.length === 0) {
    return (
      <div className="h-36 flex items-center justify-center text-gray-500 text-sm">
        暂无能力数据
      </div>
    )
  }

  const minValue = Math.min(...values) - 5
  const maxValue = Math.max(...values) + 5
  const range = maxValue - minValue

  const getX = (index: number) => `${(index / (data.length - 1)) * 100}%`
  const getY = (value: number | null) => {
    if (!value) return '100%'
    return `${(1 - (value - minValue) / range) * 100}%`
  }

  const createPath = () => {
    return data.map((d, i) => {
      const x = getX(i)
      const y = getY(d.training_capacity)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const latestCapacity = data[data.length - 1].training_capacity || 0
  const capacityColor = latestCapacity >= 70 ? 'text-emerald-600' : 
                       latestCapacity >= 50 ? 'text-amber-600' : 'text-red-600'
  const capacityBg = latestCapacity >= 70 ? 'bg-emerald-50' : 
                     latestCapacity >= 50 ? 'bg-amber-50' : 'bg-red-50'

  return (
    <div>
      <div className="h-36 relative">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" />

          {/* 高风险区域 */}
          <rect x="0" y={getY(50)} width="100" height={getY(0)} fill="#fef2f2" opacity="0.3" />
          {/* 中风险区域 */}
          <rect x="0" y={getY(70)} width="100" height={getY(50)} fill="#fffbeb" opacity="0.3" />

          <path d={createPath()} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="flex justify-center gap-6 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">训练能力</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-red-100 text-[8px] flex items-center justify-center text-red-600">R</span>
          <span className="text-xs text-gray-500">恢复</span>
          <span className="w-3 h-3 rounded bg-amber-100 text-[8px] flex items-center justify-center text-amber-600 ml-2">M</span>
          <span className="text-xs text-gray-500">中等</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className={`text-center p-2 rounded-lg ${capacityBg}`}>
          <div className={`text-xl font-bold ${capacityColor}`}>
            {latestCapacity.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">当前能力</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-800">
            {Math.round(values.reduce((a, b) => a + b, 0) / values.length)}
          </div>
          <div className="text-xs text-gray-500">平均值</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-800">
            {Math.round(Math.max(...values))}
          </div>
          <div className="text-xs text-gray-500">最高值</div>
        </div>
      </div>
    </div>
  )
}
