'use client'

import { CapacityCard } from '@/components/training/CapacityCard'
import { WorkoutRecommendationCard } from '@/components/training/WorkoutRecommendationCard'
import { ExplanationCard } from '@/components/training/ExplanationCard'
import { FeedbackActionBar } from '@/components/training/FeedbackActionBar'
import { ProfessionalDetails } from '@/components/training/ProfessionalDetails'
import { todayData } from '@/mocks/todayData'

export default function TodayPage() {
  const formattedDate = new Date(todayData.date).toLocaleDateString('zh-CN', {
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

      <CapacityCard capacity={todayData.trainingCapacity} />
      <WorkoutRecommendationCard recommendation={todayData.recommendation} />
      <ExplanationCard explanations={todayData.explanations} />
      <FeedbackActionBar />
      <ProfessionalDetails details={todayData.professionalDetails} />
    </div>
  )
}
