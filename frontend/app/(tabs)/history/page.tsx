'use client'

import { LoadTrendChart } from '@/components/training/LoadTrendChart'
import { HistoryPageSkeleton } from '@/components/ui/skeleton'
import { useHistoryData } from '@/lib/hooks'

export default function HistoryPage() {
  const { data, loading, error } = useHistoryData()

  if (loading) {
    return <HistoryPageSkeleton />
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

  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-lg font-medium text-gray-800">历史数据</h1>
      </div>

      <LoadTrendChart data={data || []} />

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-medium text-gray-800 mb-3">近7天训练</h3>
        <div className="space-y-3">
          {(data || []).slice(-7).reverse().map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm text-gray-600">
                {new Date(item.date_val).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-emerald-600">TSS {Math.round(item.tss)}</span>
                <span className="text-sm text-gray-500">Form {item.form_value.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
