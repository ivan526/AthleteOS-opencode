'use client'

import { WeeklyReviewCard } from '@/components/training/WeeklyReviewCard'
import { ReviewPageSkeleton } from '@/components/ui/skeleton'
import { useWeeklyReview } from '@/lib/hooks'

export default function ReviewPage() {
  const { data, loading, error } = useWeeklyReview()

  if (loading) {
    return <ReviewPageSkeleton />
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

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-lg font-medium text-gray-800">每周复盘</h1>
      </div>

      <WeeklyReviewCard review={data} />
    </div>
  )
}
