'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodayData } from '@/lib/hooks'
import { Activity, Heart, Moon, TrendingUp, BarChart3, Target, RefreshCw } from 'lucide-react'

const dimensionConfig = {
  sleep: {
    label: '睡眠质量',
    icon: Moon,
    description: '基于睡眠时长、深度睡眠比例、恢复质量综合评分',
    goodText: '睡眠质量良好，身体恢复充分',
    badText: '睡眠质量一般，建议增加休息时长'
  },
  hrv: {
    label: '心率变异性',
    icon: Heart,
    description: '反映自主神经系统的平衡状态',
    goodText: 'HRV 处于正常范围，自主神经平衡',
    badText: 'HRV 偏低，身体可能处于应激状态'
  },
  form: {
    label: '训练状态',
    icon: TrendingUp,
    description: 'CTL（体能）与 ATL（疲劳）的差值，反映训练平衡',
    goodText: '训练状态良好，适应当前负荷',
    badText: '身体疲劳累积，注意恢复'
  },
  acwr: {
    label: '负荷变化比',
    icon: Activity,
    description: '急性负荷 / 慢性负荷，反映训练量变化幅度',
    goodText: '负荷变化平稳，训练量适中',
    badText: '负荷变化偏大，注意调整训练量'
  },
  monotony: {
    label: '训练单调性',
    icon: BarChart3,
    description: '日平均负荷 / 日负荷标准差，反映训练多样性',
    goodText: '训练内容多样化，刺激全面',
    badText: '训练略显单一，建议增加变化'
  },
  adherence: {
    label: '训练依从性',
    icon: Target,
    description: '过去 7 天实际训练天数 / 计划训练天数',
    goodText: '训练计划执行良好',
    badText: '训练执行有待加强'
  },
  subjective_fatigue: {
    label: '主观疲劳',
    icon: RefreshCw,
    description: '自我感觉的疲劳程度',
    goodText: '精神状态良好',
    badText: '主观感觉较疲劳'
  },
  recovery_trend: {
    label: '恢复趋势',
    icon: TrendingUp,
    description: '基于过去 3 天睡眠和 HRV 变化的趋势评估',
    goodText: '身体呈恢复趋势',
    badText: '需要更多恢复时间'
  }
}

export default function DecisionDetailsPage() {
  const { data, loading, error } = useTodayData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-lg mb-2">数据加载失败</p>
          <p className="text-sm">{error?.message || '请稍后重试'}</p>
        </div>
      </div>
    )
  }

  const capacity = data.training_capacity
  const risk = data.training_risk

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-600'
    if (score >= 50) return 'text-amber-600'
    return 'text-red-600'
  }

  const getBarColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getStatusBg = (status: string) => {
    if (status === 'ready_to_push') return 'bg-emerald-100 text-emerald-700'
    if (status === 'train_normally') return 'bg-blue-100 text-blue-700'
    if (status === 'reduce_intensity') return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 顶部标题 */}
        <div className="text-center py-6">
          <h1 className="text-xl font-semibold text-gray-800">训练能力决策依据</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(data.date_val).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* 综合评分卡片 */}
        <Card className="border-0 shadow-lg bg-white mb-6 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">今日训练能力得分</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-800">{capacity.score}</span>
                  <span className="text-xl text-gray-400">/ 100</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusBg(capacity.status)}`}>
                  {capacity.status_text}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  置信度 {Math.round(capacity.confidence * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 8 个维度详细分析 */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-gray-800">八维能力分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(capacity.dimension_scores).map(([key, value]) => {
              const config = dimensionConfig[key as keyof typeof dimensionConfig]
              const Icon = config?.icon || Activity
              const score = value as number
              const isGood = score >= 70
              
              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGood ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                        <Icon className={`w-5 h-5 ${isGood ? 'text-emerald-600' : 'text-amber-600'}`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{config?.label || key}</p>
                        <p className="text-xs text-gray-500">{config?.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                        {Math.round(score)}
                      </span>
                      <span className="text-sm text-gray-400">分</span>
                    </div>
                  </div>
                  
                  {/* 进度条 */}
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${getBarColor(score)}`}
                      style={{ width: `${Math.min(score, 100)}%` }}
                    />
                  </div>
                  
                  {/* 说明文字 */}
                  <p className={`text-sm ${isGood ? 'text-emerald-600' : 'text-amber-600'}`}>
                    💡 {isGood ? config?.goodText : config?.badText}
                  </p>
                  
                  {/* 分隔线 */}
                  {key !== 'recovery_trend' && (
                    <div className="h-px bg-gray-100 -mx-2"></div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* 风险评估卡片 */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-gray-800">训练风险评估</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-500">综合风险等级</p>
                <p className={`text-xl font-bold capitalize ${
                  risk.level === 'low' ? 'text-emerald-600' :
                  risk.level === 'moderate' ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {risk.user_label}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">
                  {Math.round(risk.score * 100)}%
                </div>
                <p className="text-xs text-gray-400">风险概率</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">主要影响因素</p>
              {risk.main_factors?.map((factor: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-gray-600">{idx + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{factor.factor_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{factor.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 训练建议卡片 */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium text-gray-800">今日训练建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-emerald-800">
                    {data.recommendation.title}
                  </p>
                  <p className="text-sm text-emerald-700 mt-1">
                    预计时长 {data.recommendation.duration_minutes} 分钟 · 
                    预期负荷 TSS {Math.round(data.recommendation.expected_tss)}
                  </p>
                  <p className="text-xs text-emerald-600 mt-2 opacity-80">
                    {risk.safe_recommendation || '根据当前状态调整训练强度'}
                  </p>
                </div>
              </div>
            </div>

            {data.recommendation.structure && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {data.recommendation.structure.warmup && (
                  <div className="p-3 bg-blue-50 rounded-xl text-center">
                    <p className="text-xs text-blue-600 font-medium">热身</p>
                    <p className="text-sm text-blue-800 mt-1">{data.recommendation.structure.warmup}</p>
                  </div>
                )}
                {data.recommendation.structure.main_set && (
                  <div className="p-3 bg-emerald-50 rounded-xl text-center">
                    <p className="text-xs text-emerald-600 font-medium">主课</p>
                    <p className="text-sm text-emerald-800 mt-1">{data.recommendation.structure.main_set}</p>
                  </div>
                )}
                {data.recommendation.structure.cooldown && (
                  <div className="p-3 bg-purple-50 rounded-xl text-center">
                    <p className="text-xs text-purple-600 font-medium">放松</p>
                    <p className="text-sm text-purple-800 mt-1">{data.recommendation.structure.cooldown}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 数据说明 */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-gray-400 text-center">
              💡 数据来源：Intervals.icu 同步数据 ·
              更新时间：{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
