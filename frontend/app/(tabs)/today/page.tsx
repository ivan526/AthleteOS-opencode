'use client'

import { CapacityCard } from '@/components/training/CapacityCard'
import { WorkoutRecommendationCard } from '@/components/training/WorkoutRecommendationCard'
import { ExplanationCard } from '@/components/training/ExplanationCard'
import { FeedbackActionBar } from '@/components/training/FeedbackActionBar'
import { ProfessionalDetails } from '@/components/training/ProfessionalDetails'
import { TodayPageSkeleton } from '@/components/ui/skeleton'
import { useTodayData } from '@/lib/hooks'

export default function TodayPage() {
  const { data, loading, error } = useTodayData()

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
      <WorkoutRecommendationCard recommendation={data.recommendation} />
      <ExplanationCard explanations={data.explanations} />
      <FeedbackActionBar />
      <ProfessionalDetails details={data.professional_details} />
    </div>
  )
}
