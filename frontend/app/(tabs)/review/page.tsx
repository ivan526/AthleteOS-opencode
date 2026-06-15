'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeeklyReviewCard } from '@/components/training/WeeklyReviewCard'
import { TodayPageSkeleton } from '@/components/ui/skeleton'
import { useWeeklyReview } from '@/lib/hooks'
import { 
  Trophy, 
  AlertTriangle, 
  Target, 
  TrendingUp, 
  Activity,
  Calendar,
  Zap,
  Heart,
  BarChart3,
  ChevronRight,
  Star,
  Lightbulb
} from 'lucide-react'

export default function ReviewPage() {
  const { data, loading, error } = useWeeklyReview()

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

  const weekStart = new Date(data.week_start)
  const weekEnd = new Date(data.week_end)

  // 计算表现评级
  const getPerformanceGrade = (tss: number) => {
    if (tss >= 400) return { grade: 'A+', color: 'text-emerald-600', bg: 'bg-emerald-100' }
    if (tss >= 300) return { grade: 'A', color: 'text-emerald-600', bg: 'bg-emerald-100' }
    if (tss >= 200) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (tss >= 100) return { grade: 'C', color: 'text-amber-600', bg: 'bg-amber-100' }
    return { grade: 'D', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const performance = getPerformanceGrade(data.weekly_tss)
  const riskColor = data.training_risk_level === 'low' ? 'text-emerald-600' 
    : data.training_risk_level === 'moderate' ? 'text-amber-600' : 'text-red-600'
  const riskBg = data.training_risk_level === 'low' ? 'bg-emerald-100' 
    : data.training_risk_level === 'moderate' ? 'bg-amber-100' : 'bg-red-100'
  const riskLabel = data.training_risk_level === 'low' ? '低风险' 
    : data.training_risk_level === 'moderate' ? '中等风险' : '较高风险'

  return (
    <div className="space-y-4 pb-4">
      {/* 顶部标题 */}
      <div className="text-center mb-2">
        <h1 className="text-lg font-semibold text-gray-800">每周复盘</h1>
        <p className="text-sm text-gray-500 mt-1">
          {weekStart.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </p>
      </div>

      {/* 周表现总评卡片 */}
      <Card className="border-0 shadow-lg bg-white overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500"></div>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">本周训练评级</p>
              <div className="flex items-baseline gap-3">
                <div className={`px-4 py-2 rounded-xl ${performance.bg}`}>
                  <span className={`text-3xl font-bold ${performance.color}`}>{performance.grade}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{Math.round(data.weekly_tss)}</p>
                  <p className="text-xs text-gray-500">总训练负荷 (TSS)</p>
                </div>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 核心指标网格 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="font-medium text-gray-800">核心指标</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">训练依从性</span>
              </div>
              <p className="text-2xl font-bold text-emerald-700">{data.adherence}%</p>
              <p className="text-xs text-emerald-600/70">计划完成度</p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">负荷变化</span>
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {data.load_change_vs_last_week > 0 ? '+' : ''}{Math.round(data.load_change_vs_last_week)}%
              </p>
              <p className="text-xs text-blue-600/70">vs 较上周</p>
            </div>
            
            <div className={`p-3 rounded-xl ${riskBg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4" style={{ color: riskColor }} />
                <span className="text-xs font-medium" style={{ color: riskColor }}>训练风险</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: riskColor }}>{riskLabel}</p>
              <p className="text-xs opacity-70" style={{ color: riskColor }}>整体评估</p>
            </div>
            
            <div className="p-3 bg-amber-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-600 font-medium">训练天数</span>
              </div>
              <p className="text-2xl font-bold text-amber-700">{Math.round(data.adherence / 14)} 天</p>
              <p className="text-xs text-amber-600/70">本周有效训练</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 本周亮点 */}
      {data.highlights && data.highlights.length > 0 && (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-medium text-gray-800">本周亮点</span>
            </div>
            
            <div className="space-y-3">
              {data.highlights.map((highlight: string, idx: number) => (
                <div key={idx} className="flex gap-3 p-3 bg-emerald-50 rounded-xl">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-emerald-600 text-xs font-bold">✓</span>
                  </div>
                  <p className="text-sm text-emerald-800">{highlight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 需要注意的事项 */}
      {data.warnings && data.warnings.length > 0 && (
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <span className="font-medium text-gray-800">需要注意</span>
            </div>
            
            <div className="space-y-3">
              {data.warnings.map((warning: string, idx: number) => (
                <div key={idx} className="flex gap-3 p-3 bg-amber-50 rounded-xl">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-600 text-xs font-bold">!</span>
                  </div>
                  <p className="text-sm text-amber-800">{warning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 下周建议 */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-medium text-gray-800">下周训练建议</span>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-blue-800">{data.next_week_recommendation}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 周总结卡片 */}
      <WeeklyReviewCard review={data} />
    </div>
  )
}
