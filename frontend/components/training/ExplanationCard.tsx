'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ExplanationItem } from '@/lib/types'

interface ExplanationCardProps {
  explanations: ExplanationItem[]
}

type ExplanationType = 'positive' | 'neutral' | 'warning'

const typeConfig: Record<ExplanationType, { icon: string; color: string; bg: string }> = {
  positive: { icon: '✓', color: 'text-green-600', bg: 'bg-green-50' },
  neutral: { icon: 'ℹ', color: 'text-blue-600', bg: 'bg-blue-50' },
  warning: { icon: '⚠', color: 'text-amber-600', bg: 'bg-amber-50' }
}

export function ExplanationCard({ explanations }: ExplanationCardProps) {
  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-gray-800">为什么这样安排？</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {explanations.map((item) => {
            const itemType = item.item_type as ExplanationType
            const config = typeConfig[itemType] || typeConfig.neutral
            return (
              <li key={item.item_id} className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full ${config.bg} ${config.color} flex items-center justify-center text-sm`}>
                  {config.icon}
                </span>
                <span className="text-gray-700">{item.text}</span>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
