'use client'

import { WeeklyReviewCard } from '@/components/training/WeeklyReviewCard'
import { weeklyReviewData } from '@/mocks/reviewData'

export default function ReviewPage() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-lg font-medium text-gray-800">每周复盘</h1>
      </div>

      <WeeklyReviewCard review={weeklyReviewData} />
    </div>
  )
}
