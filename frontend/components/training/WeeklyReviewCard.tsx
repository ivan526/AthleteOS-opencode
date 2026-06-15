'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WeeklyReviewResponse } from '@/lib/types'

interface WeeklyReviewCardProps {
  review: WeeklyReviewResponse
}

const riskLevelConfig = {
  low: { color: 'bg-green-100 text-green-700', label: '低风险' },
  moderate: { color: 'bg-yellow-100 text-yellow-700', label: '中等风险' },
  elevated: { color: 'bg-orange-100 text-orange-700', label: '风险偏高' },
  high_caution: { color: 'bg-red-100 text-red-700', label: '高风险' }
}

export function WeeklyReviewCard({ review }: WeeklyReviewCardProps) {
  const riskConfig = riskLevelConfig[review.training_risk_level]

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-800">本周总结</CardTitle>
        <p className="text-sm text-gray-500">
          {new Date(review.week_start).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} - {new Date(review.week_end).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{review.weekly_tss}</div>
            <div className="text-xs text-gray-500">本周 TSS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{Math.round(review.adherence * 100)}%</div>
            <div className="text-xs text-gray-500">完成率</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+{Math.round(review.load_change_vs_last_week * 100)}%</div>
            <div className="text-xs text-gray-500">较上周</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-sm text-gray-700">{review.summary}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">亮点</h4>
          <ul className="space-y-1">
            {review.highlights.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-green-500 mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {review.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">注意事项</h4>
            <ul className="space-y-1">
              {review.warnings.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="mt-0.5">⚠</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">训练风险</span>
            <Badge variant="secondary" className={riskConfig.color}>
              {riskConfig.label}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 bg-emerald-50 p-3 rounded-lg">
            {review.next_week_recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
