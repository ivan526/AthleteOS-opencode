'use client'

import { Card, CardContent } from '@/components/ui/card'
import type { TrainingCapacity } from '@/lib/types'

interface CapacityCardProps {
  capacity: TrainingCapacity
}

const statusConfig = {
  ready_to_push: {
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    ringColor: 'stroke-green-500',
    label: '状态很好'
  },
  train_normally: {
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    ringColor: 'stroke-emerald-500',
    label: '状态稳定'
  },
  reduce_intensity: {
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    ringColor: 'stroke-amber-500',
    label: '状态一般'
  },
  recovery_required: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    ringColor: 'stroke-red-500',
    label: '需要恢复'
  }
}

export function CapacityCard({ capacity }: CapacityCardProps) {
  const config = statusConfig[capacity.status]
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (capacity.score / 100) * circumference

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-700 mb-4">今日训练能力</h2>

          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="45"
                fill="none"
                className={config.ringColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{capacity.score}</span>
              <span className="text-sm text-gray-500">/ 100</span>
            </div>
          </div>

          <div className={`inline-block px-4 py-1.5 rounded-full ${config.bgColor} ${config.color} text-sm font-medium mb-3`}>
            {capacity.status_text}
          </div>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <svg className={`w-4 h-4 ${capacity.trend >= 0 ? 'text-green-500' : 'text-red-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={capacity.trend >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
              </svg>
              <span className="text-gray-600">较昨日 {capacity.trend >= 0 ? '+' : ''}{capacity.trend}</span>
            </div>
            <div className="text-gray-500">
              置信度 {Math.round(capacity.confidence * 100)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
