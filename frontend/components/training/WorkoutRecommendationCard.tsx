'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WorkoutRecommendation } from '@/lib/types'

interface WorkoutRecommendationCardProps {
  recommendation: WorkoutRecommendation
}

const sportIcons = {
  running: '🏃',
  cycling: '🚴',
  strength: '💪',
  recovery: '🧘'
}

const intensityConfig = {
  easy: { color: 'bg-green-100 text-green-700', label: '轻松' },
  moderate: { color: 'bg-blue-100 text-blue-700', label: '中等' },
  hard: { color: 'bg-orange-100 text-orange-700', label: '高强度' },
  recovery: { color: 'bg-purple-100 text-purple-700', label: '恢复' }
}

export function WorkoutRecommendationCard({ recommendation }: WorkoutRecommendationCardProps) {
  const intensity = intensityConfig[recommendation.intensity]

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-800">今日训练建议</CardTitle>
          <Badge variant="secondary" className={`${intensity.color}`}>
            {intensity.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{sportIcons[recommendation.sport]}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {recommendation.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {recommendation.durationMinutes} 分钟
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                预计 TSS {recommendation.expectedTss}
              </span>
            </div>

            {recommendation.structure && (
              <div className="space-y-2 text-sm">
                {recommendation.structure.warmup && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-16">热身</span>
                    <span className="text-gray-700">{recommendation.structure.warmup}</span>
                  </div>
                )}
                {recommendation.structure.mainSet && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-16">主课</span>
                    <span className="text-gray-700">{recommendation.structure.mainSet}</span>
                  </div>
                )}
                {recommendation.structure.cooldown && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-16">放松</span>
                    <span className="text-gray-700">{recommendation.structure.cooldown}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
