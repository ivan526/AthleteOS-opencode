'use client'

import { LoadTrendChart } from '@/components/training/LoadTrendChart'
import { historyData } from '@/mocks/historyData'

export default function HistoryPage() {
  return (
    <div className="space-y-4">
      <div className="text-center mb-2">
        <h1 className="text-lg font-medium text-gray-800">历史数据</h1>
      </div>

      <LoadTrendChart data={historyData} />

      <div className="bg-white rounded-xl shadow-sm p-4">
        <h3 className="font-medium text-gray-800 mb-3">近7天训练</h3>
        <div className="space-y-3">
          {historyData.slice(-7).map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <span className="text-sm text-gray-600">
                {new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-emerald-600">TSS {item.tss}</span>
                <span className="text-sm text-gray-500">Form {item.form}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
