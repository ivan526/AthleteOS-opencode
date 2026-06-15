'use client'

import { useState } from 'react'
import type { HistoryDataPoint } from '@/lib/types'

interface WeightTrendChartProps {
  data: HistoryDataPoint[]
}

export function WeightTrendChart({ data }: WeightTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length < 2) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
        暂无数据
      </div>
    )
  }

  const values = data.map(d => d.weight || 0).filter(v => v > 0)
  if (values.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
        暂无体重数据
      </div>
    )
  }

  const minValue = Math.min(...values) - 0.5
  const maxValue = Math.max(...values) + 0.5
  const range = maxValue - minValue

  const chartWidth = 100
  const chartHeight = 85
  const bottomMargin = 18

  const getX = (index: number) => chartWidth * 0.08 + (index / (data.length - 1)) * chartWidth * 0.85
  const getY = (value: number | null) => {
    if (!value) return bottomMargin + chartHeight
    return bottomMargin + (1 - (value - minValue) / range) * chartHeight
  }

  const createPath = () => {
    return data.map((d, i) => {
      const x = getX(i)
      const y = getY(d.weight)
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const latestWeight = data[data.length - 1].weight || 0
  const avgWeight = values.reduce((a, b) => a + b, 0) / values.length

  return (
    <div>
      <div className="h-80 relative">
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 ${chartWidth} ${chartHeight + bottomMargin + 8}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 背景网格线 */}
          {[0.25, 0.5, 0.75].map((ratio, i) => (
            <line
              key={i}
              x1="6"
              x2={chartWidth - 6}
              y1={bottomMargin + chartHeight * ratio}
              y2={bottomMargin + chartHeight * ratio}
              stroke="#e5e7eb"
              strokeWidth="0.3"
              strokeDasharray="2,1.5"
            />
          ))}

          {/* 趋势线 */}
          <path 
            d={createPath()} 
            fill="none" 
            stroke="#8b5cf6" 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 数据点 */}
          {data.map((d, i) => {
            if (!d.weight) return null
            const isHovered = hoveredIndex === i
            return (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(d.weight)}
                r={isHovered ? 3.2 : 2.2}
                fill="#8b5cf6"
                stroke="white"
                strokeWidth="1"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ cursor: 'pointer' }}
              />
            )
          })}

          {/* X轴日期标签 */}
          {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0 || i === data.length - 1).map((d, idx) => {
            const realIndex = data.indexOf(d)
            return (
              <text
                key={idx}
                x={getX(realIndex)}
                y={chartHeight + bottomMargin + 3}
                fontSize="4.2"
                fill="#6b7280"
                textAnchor="middle"
                fontWeight="500"
              >
                {formatDate(d.date_val)}
              </text>
            )
          })}
        </svg>

        {/* 悬停提示 */}
        {hoveredIndex !== null && data[hoveredIndex].weight && (
          <div 
            className="absolute top-3 right-3 bg-white shadow-xl rounded-lg px-4 py-2.5 text-sm border border-gray-200 z-10"
          >
            <div className="text-gray-500 text-xs mb-1.5 font-medium">
              {formatDate(data[hoveredIndex].date_val)}
            </div>
            <div className="font-bold text-violet-600 text-base">
              {data[hoveredIndex].weight?.toFixed(1)} kg
            </div>
          </div>
        )}
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-8 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
          <span className="text-xs text-gray-600 font-medium">体重 (kg)</span>
        </div>
      </div>

      {/* 底部统计 */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xl font-bold text-violet-600">
            {latestWeight.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">当前体重</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-700">
            {avgWeight.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">平均值</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-700">
            {(Math.max(...values) - Math.min(...values)).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">波动幅度</div>
        </div>
      </div>
    </div>
  )
}
