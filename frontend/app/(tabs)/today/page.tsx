'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CapacityCard } from '@/components/training/CapacityCard'
import { WorkoutRecommendationCard } from '@/components/training/WorkoutRecommendationCard'
import { ExplanationCard } from '@/components/training/ExplanationCard'
import { FeedbackActionBar } from '@/components/training/FeedbackActionBar'
import { ProfessionalDetails } from '@/components/training/ProfessionalDetails'
import { StateInputCard } from '@/components/training/StateInputCard'
import { TodayPageSkeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { useTodayData } from '@/lib/hooks'
import apiClient from '@/lib/api'
import type { AdjustedRecommendation } from '@/lib/types'

export default function TodayPage() {
  const { data, loading, error, refetch } = useTodayData()
  const [adjustedRecommendation, setAdjustedRecommendation] = useState<AdjustedRecommendation | null>(null)

  const handleFeedback = async (feedbackType: string) => {
    try {
      const result = await apiClient.submitFeedback(feedbackType, data?.date_val)
      setAdjustedRecommendation(result)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
    }
  }

  if (loading) {
    return <TodayPageSkeleton />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载失败</p>
          <p className="text-gray-500 text-sm">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const formattedDate = new Date(data.date_val).toLocaleDateString('zh-CN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{formattedDate}</p>
      </div>

      <CapacityCard capacity={data.training_capacity} />
      
      <StateInputCard date={data.date_val} onSaved={refetch} />
      
      {/* 查看完整决策依据 - 跳转卡片 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <Link href="/analysis" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800">查看完整决策依据</p>
                <p className="text-xs text-gray-500">8 维能力分析 + 风险评估 + 训练建议</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </CardContent>
      </Card>
      
      <WorkoutRecommendationCard 
        recommendation={data.recommendation}
        adjustedRecommendation={adjustedRecommendation}
      />
      <ExplanationCard explanations={data.explanations} />
      <FeedbackActionBar onFeedback={handleFeedback} />
      <ProfessionalDetails details={data.professional_details} />
    </div>
  )
}
