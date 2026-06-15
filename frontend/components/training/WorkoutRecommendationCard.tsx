'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw } from 'lucide-react'
import type { WorkoutRecommendation, AdjustedRecommendation } from '@/lib/types'

interface WorkoutRecommendationCardProps {
  recommendation: WorkoutRecommendation
  adjustedRecommendation?: AdjustedRecommendation | null
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

export function WorkoutRecommendationCard({ 
  recommendation, 
  adjustedRecommendation 
}: WorkoutRecommendationCardProps) {
  const displayRec = adjustedRecommendation ? {
    ...recommendation,
    title: adjustedRecommendation.title,
    duration_minutes: adjustedRecommendation.duration_minutes,
    intensity: adjustedRecommendation.intensity as keyof typeof intensityConfig,
    sport: adjustedRecommendation.adjusted_type as keyof typeof sportIcons
  } : recommendation

  const intensity = intensityConfig[displayRec.intensity] || intensityConfig.easy

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-800">
            {adjustedRecommendation ? '调整后的训练建议' : '今日训练建议'}
          </CardTitle>
          <Badge variant="secondary" className={`${intensity.color}`}>
            {intensity.label}
          </Badge>
        </div>
        {adjustedRecommendation && (
          <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-start gap-2">
              <RefreshCw className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {adjustedRecommendation.reason}
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  训练能力影响: {adjustedRecommendation.training_capacity_impact > 0 ? '+' : ''}
                  {adjustedRecommendation.training_capacity_impact}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{sportIcons[displayRec.sport] || sportIcons.recovery}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {displayRec.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {displayRec.duration_minutes > 0 ? `${displayRec.duration_minutes} 分钟` : '无需训练'}
              </span>
              {recommendation.expected_tss && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  预计 TSS {recommendation.expected_tss}
                </span>
              )}
            </div>

            {recommendation.structure && !adjustedRecommendation && (
              <div className="space-y-2 text-sm">
                {recommendation.structure.warmup && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-16">热身</span>
                    <span className="text-gray-700">{recommendation.structure.warmup}</span>
                  </div>
                )}
                 {recommendation.structure.main_set && (
                  <div className="flex gap-2">
                    <span className="text-gray-500 min-w-16">主课</span>
                    <span className="text-gray-700">{recommendation.structure.main_set}</span>
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
