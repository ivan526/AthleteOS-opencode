interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border-0 p-6 space-y-4">
      <Skeleton className="h-5 w-1/3 mb-4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}

export function CapacityCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Skeleton className="w-32 h-32 rounded-full" />
        </div>
        <Skeleton className="h-6 w-24 mx-auto mb-3 rounded-full" />
        <div className="flex items-center justify-center gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function TodayPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <Skeleton className="h-5 w-32 mx-auto" />
      </div>
      <CapacityCardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}

export function HistoryPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <Skeleton className="h-5 w-32 mx-auto" />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Skeleton className="h-64 w-full mb-4" />
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4">
        <Skeleton className="h-5 w-32 mb-3" />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-8 w-full mb-2" />
        ))}
      </div>
    </div>
  )
}

export function ReviewPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <Skeleton className="h-5 w-32 mx-auto" />
      </div>
      <CardSkeleton />
      <CardSkeleton />
    </div>
  )
}
