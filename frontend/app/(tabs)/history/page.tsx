'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadTrendChart } from '@/components/training/LoadTrendChart'
import { FormTrendChart } from '@/components/training/FormTrendChart'
import { WeightTrendChart } from '@/components/training/WeightTrendChart'
import { HistoryPageSkeleton } from '@/components/ui/skeleton'
import { useHistoryData, useActivities } from '@/lib/hooks'
import { 
  TrendingUp, 
  TrendingDown, 
  Activity as ActivityIcon,
  BarChart3,
  Target,
  Calendar,
  ChevronRight,
  Bike,
  PersonStanding,
  Waves,
  Scale
} from 'lucide-react'

// 运动类型图标映射
const sportIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Run': ActivityIcon,
  'Ride': Bike,
  'Swim': Waves,
  'Strength': PersonStanding,
}

const sportColors: Record<string, string> = {
  'Run': 'bg-emerald-100 text-emerald-600',
  'Ride': 'bg-blue-100 text-blue-600',
  'Swim': 'bg-cyan-100 text-cyan-600',
  'Strength': 'bg-amber-100 text-amber-600',
}

const sportNames: Record<string, string> = {
  'Run': '跑步',
  'Ride': '骑行',
  'Swim': '游泳',
  'Strength': '力量训练',
}

export default function HistoryPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d')
  const days = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30
  const { data: historyData, loading: historyLoading, error: historyError } = useHistoryData(days)
  const { data: activities, loading: activitiesLoading } = useActivities(days)

  if (historyLoading || activitiesLoading) {
    return <HistoryPageSkeleton />
  }

  if (historyError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">加载失败</p>
          <p className="text-gray-500 text-sm">{historyError.message}</p>
        </div>
      </div>
    )
  }

  const loadData = historyData || []
  
  // 计算当前时间范围的汇总数据
  const totalTSS = loadData.reduce((sum, d) => sum + d.tss, 0)
  const avgCTL = loadData.length > 0 ? loadData.reduce((sum, d) => sum + d.ctl, 0) / loadData.length : 0
  const latestForm = loadData[loadData.length - 1]?.form_value || 0
  const formTrend = latestForm - (loadData[loadData.length - 2]?.form_value || 0)

  return (
    <div className="space-y-4 pb-4">
      <div className="text-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">历史数据</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* 时间范围切换 */}
      <div className="flex justify-center gap-2 mb-2">
        {(['7d', '14d', '30d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {range === '7d' ? '近7天' : range === '14d' ? '近14天' : '近30天'}
          </button>
        ))}
      </div>

      {/* 时间范围关键指标卡片 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-800">{timeRange === '7d' ? '近7天' : timeRange === '14d' ? '近14天' : '近30天'}训练概览</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-xl">
              <p className="text-2xl font-bold text-emerald-600">{Math.round(totalTSS)}</p>
              <p className="text-xs text-emerald-600/80">周总负荷 (TSS)</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">{Math.round(avgCTL)}</p>
              <p className="text-xs text-blue-600/80">体能 (CTL)</p>
            </div>
            <div className="text-center p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center justify-center gap-1">
                {formTrend >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-amber-600" />
                )}
                <p className="text-2xl font-bold text-amber-600">
                  {latestForm > 0 ? '+' : ''}{Math.round(latestForm)}
                </p>
              </div>
              <p className="text-xs text-amber-600/80">状态 (Form)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 负荷趋势图表 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            负荷趋势
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <LoadTrendChart data={loadData.slice(-parseInt(timeRange))} />
        </CardContent>
      </Card>

      {/* 状态值趋势图 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-blue-600" />
            状态值 (Form) 趋势
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <FormTrendChart data={loadData.slice(-parseInt(timeRange))} />
        </CardContent>
      </Card>

      {/* 体重趋势图 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
            <Scale className="w-5 h-5 text-violet-600" />
            体重趋势
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <WeightTrendChart data={loadData.slice(-parseInt(timeRange))} />
        </CardContent>
      </Card>

      {/* 每日训练记录 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            近期训练记录
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {activities && activities.length > 0 ? (
              activities.map((activity) => {
                const sportType = activity.sport || 'Run'
                const Icon = sportIcons[sportType] || ActivityIcon
                const colorClass = sportColors[sportType] || 'bg-gray-100 text-gray-600'
                const sportName = sportNames[sportType] || '训练'
                
                const durationMinutes = activity.duration_seconds ? Math.round(activity.duration_seconds / 60) : 0
                const distanceKm = activity.distance_meters ? activity.distance_meters / 1000 : 0
                
                return (
                  <div 
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                         <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {new Date(activity.start_time).toLocaleDateString('zh-CN', { 
                            month: 'short', 
                            day: 'numeric',
                            weekday: 'short'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {sportName} · {durationMinutes} 分钟
                          {distanceKm > 0 && ` · ${distanceKm.toFixed(1)} km`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-600">
                          TSS {Math.round(activity.tss || 0)}
                        </p>
                        {activity.avg_hr && (
                          <p className="text-xs text-gray-500">
                            平均心率 {Math.round(activity.avg_hr)} bpm
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">暂无训练记录</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 训练目标进度 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-medium text-gray-800">周目标进度</span>
            </div>
            <span className="text-sm font-bold text-emerald-600">
              {Math.min(100, Math.round((totalTSS / 500) * 100))}%
            </span>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, (totalTSS / 500) * 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{Math.round(totalTSS)} / 500 TSS</span>
            <span>目标周负荷</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
