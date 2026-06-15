'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { TrainingCapacity } from '@/lib/types'

interface CapacityBreakdownCardProps {
  capacity: TrainingCapacity
}

const dimensionLabels: Record<string, string> = {
  sleep: '睡眠质量',
  hrv: '心率变异性 (HRV)',
  form: '训练状态 (Form)',
  acwr: '急性/慢性负荷比 (ACWR)',
  monotony: '训练单调性',
  adherence: '训练依从性',
  subjective_fatigue: '主观疲劳',
  recovery_trend: '恢复趋势'
}

const dimensionDescriptions: Record<string, { good: string; bad: string }> = {
  sleep: { good: '睡眠质量良好，身体恢复充分', bad: '睡眠质量一般，恢复可能不足' },
  hrv: { good: 'HRV 处于正常范围，自主神经平衡', bad: 'HRV 偏低，自主神经可能紧张' },
  form: { good: '训练状态良好，适应当前负荷', bad: '身体疲劳累积，注意恢复' },
  acwr: { good: '负荷变化平稳，训练量适中', bad: '负荷变化偏大，注意调整训练量' },
  monotony: { good: '训练内容多样化', bad: '训练略显单一，建议增加多样性' },
  adherence: { good: '训练计划执行良好', bad: '训练执行有待加强' },
  subjective_fatigue: { good: '精神状态良好', bad: '主观感觉较疲劳' },
  recovery_trend: { good: '身体呈恢复趋势', bad: '需要更多恢复时间' }
}

export function CapacityBreakdownCard({ capacity }: CapacityBreakdownCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardContent className="p-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="font-medium text-gray-800">查看完整决策依据</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4 space-y-4">
              {Object.entries(capacity.dimension_scores).map(([key, value]) => {
                const score = value as number
                const isGood = score >= 70
                const barColor = isGood ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'

                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {dimensionLabels[key] || key}
                      </span>
                      <span className={`text-sm font-semibold ${isGood ? 'text-emerald-600' : score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {Math.round(score)} 分
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor}`}
                        style={{ width: `${Math.min(score, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {isGood ? dimensionDescriptions[key]?.good : dimensionDescriptions[key]?.bad}
                    </p>
                  </div>
                )
              })}

              <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className="text-base">💡</span>
                  <div>
                    <p className="text-sm font-medium text-emerald-800">训练建议</p>
                    <p className="text-xs text-emerald-700 mt-1">
                      {capacity.score >= 80
                        ? '今天状态很好，可以安排高强度训练或增加训练量。'
                        : capacity.score >= 60
                        ? '今天状态正常，按照计划进行常规训练即可。'
                        : capacity.score >= 40
                        ? '建议降低训练强度，专注于技术练习或轻松恢复跑。'
                        : '今天优先考虑恢复，可安排休息、拉伸或轻度活动。'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
