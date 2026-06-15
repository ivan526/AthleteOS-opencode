'use client'

import { useState } from 'react'
import type { HistoryDataPoint } from '@/lib/types'

interface FormTrendChartProps {
  data: HistoryDataPoint[]
}

const zones = [
  { name: '过渡期', min: 20, max: Infinity, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.12)' },
  { name: '精力充沛', min: 5, max: 20, color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.09)' },
  { name: '灰色地带', min: -10, max: 5, color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.06)' },
  { name: '最优', min: -30, max: -10, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.09)' },
  { name: '高风险', min: -Infinity, max: -30, color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.12)' },
]

export function FormTrendChart({ data }: FormTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length < 2) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
        暂无数据
      </div>
    )
  }

  const yMin = -40
  const yMax = 30
  const range = yMax - yMin

  const chartWidth = 100
  const chartHeight = 85
  const bottomMargin = 18

  const getX = (index: number) => chartWidth * 0.08 + (index / (data.length - 1)) * chartWidth * 0.85
  const getY = (value: number) => bottomMargin + (1 - (value - yMin) / range) * chartHeight
  const zoneY = (value: number) => bottomMargin + ((yMax - value) / range) * chartHeight

  const pathPoints = data.map((d, i) => {
    const x = getX(i)
    const y = getY(d.form_value)
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')

  const latestForm = data[data.length - 1].form_value
  const currentZone = zones.find(z => latestForm >= z.min && latestForm < z.max) || zones[2]

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  return (
    <div>
      <div className="h-80 relative">
        <svg 
          className="w-full h-full" 
          viewBox={`0 0 ${chartWidth} ${chartHeight + bottomMargin + 8}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* 区间背景色 */}
          {zones.map((zone) => (
            <rect
              key={zone.name}
              x="3"
              y={zoneY(zone.max)}
              width={chartWidth - 6}
              height={zoneY(zone.min) - zoneY(zone.max)}
              fill={zone.bgColor}
              rx="1.5"
            />
          ))}

          {/* 区间分隔虚线 */}
          {[20, 5, -10, -30].map((value, i) => (
            <line
              key={i}
              x1="6"
              x2={chartWidth - 6}
              y1={zoneY(value)}
              y2={zoneY(value)}
              stroke="#d1d5db"
              strokeWidth="0.3"
              strokeDasharray="2,1.5"
            />
          ))}

          {/* 0线加粗 */}
          <line x1="6" x2={chartWidth - 6} y1={zoneY(0)} y2={zoneY(0)} stroke="#9ca3af" strokeWidth="0.6" />

          {/* 趋势线 */}
          <path 
            d={pathPoints} 
            fill="none" 
            stroke={currentZone.color} 
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 数据点圆点 */}
          {data.map((d, i) => {
            const pointZone = zones.find(z => d.form_value >= z.min && d.form_value < z.max) || zones[2]
            const isHovered = hoveredIndex === i
            return (
              <g key={i}>
                {isHovered && (
                  <circle
                    cx={getX(i)}
                    cy={getY(d.form_value)}
                    r="5"
                    fill={pointZone.color}
                    opacity="0.25"
                  />
                )}
                <circle
                  cx={getX(i)}
                  cy={getY(d.form_value)}
                  r={isHovered ? 3.2 : 2.2}
                  fill={pointZone.color}
                  stroke="white"
                  strokeWidth="1"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{ cursor: 'pointer' }}
                />
              </g>
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

          {/* Y轴数值标签 */}
          {[20, 0, -20, -40].map((value) => (
            <text
              key={value}
              x="1"
              y={zoneY(value) + 1.5}
              fontSize="4"
              fill="#9ca3af"
              textAnchor="start"
            >
              {value}
            </text>
          ))}
        </svg>

        {/* 悬停提示 */}
        {hoveredIndex !== null && (
          <div 
            className="absolute top-3 right-3 bg-white shadow-xl rounded-lg px-4 py-2.5 text-sm border border-gray-200 z-10"
          >
            <div className="text-gray-500 text-xs mb-1.5 font-medium">
              {formatDate(data[hoveredIndex].date_val)}
            </div>
            <div className="font-bold text-base" style={{ color: currentZone.color }}>
              Form {data[hoveredIndex].form_value.toFixed(1)}
            </div>
          </div>
        )}
      </div>

      {/* 区间图例 */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
        {zones.map(zone => (
          <div key={zone.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.color }}></div>
            <span className="text-xs text-gray-600 font-medium">{zone.name}</span>
          </div>
        ))}
      </div>

      {/* 底部统计 */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: currentZone.color }}>
            {latestForm.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">当前 Form</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-gray-700">
            {(data.reduce((a, b) => a + b.form_value, 0) / data.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">平均值</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold" style={{ color: currentZone.color }}>
            {currentZone.name}
          </div>
          <div className="text-xs text-gray-500 mt-0.5">当前区间</div>
        </div>
      </div>
    </div>
  )
}
