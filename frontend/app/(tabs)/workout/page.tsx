'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodayData } from '@/lib/hooks'
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  Heart, 
  Zap,
  Thermometer,
  Clock,
  MapPin,
  Target
} from 'lucide-react'

export default function WorkoutDetailsPage() {
  const { data, loading, error } = useTodayData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-4">
        <div className="max-w-2xl mx-auto animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-48 bg-gray-200 rounded-xl"></div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
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
  const recommendation = data.recommendation
  const details = data.professional_details || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready_to_push': return 'from-emerald-500 to-teal-500'
      case 'train_normally': return 'from-blue-500 to-cyan-500'
      case 'reduce_intensity': return 'from-amber-500 to-orange-500'
      case 'recovery_required': return 'from-red-500 to-rose-500'
      default: return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pb-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* 顶部标题 */}
        <div className="text-center py-6">
          <h1 className="text-xl font-semibold text-gray-800">今日训练详情</h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(data.date_val).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* 状态大卡片 */}
        <Card className="border-0 shadow-lg bg-white mb-6 overflow-hidden">
          <div className={`h-3 bg-gradient-to-r ${getStatusColor(capacity.status)}`}></div>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">当前训练状态</p>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{capacity.status_text}</h2>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{capacity.score}</p>
                  <p className="text-xs text-gray-500">训练能力分</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{Math.round(capacity.confidence * 100)}%</p>
                  <p className="text-xs text-gray-500">置信度</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 今日训练推荐 */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              今日推荐训练
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-emerald-800">{recommendation.title}</h3>
                  <p className="text-sm text-emerald-600 mt-1">{recommendation.sport}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  {recommendation.intensity === 'easy' ? '低强度' : recommendation.intensity === 'moderate' ? '中等强度' : '高强度'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-800">{recommendation.duration_minutes}</p>
                  <p className="text-xs text-gray-500">预计时长 (分钟)</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-800">{Math.round(recommendation.expected_tss)}</p>
                  <p className="text-xs text-gray-500">预期负荷 (TSS)</p>
                </div>
              </div>
            </div>

            {/* 训练结构 */}
            {recommendation.structure && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">训练结构</p>
                
                {recommendation.structure.warmup && (
                  <div className="flex gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Thermometer className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">热身</p>
                      <p className="text-xs text-blue-600">{recommendation.structure.warmup}</p>
                    </div>
                  </div>
                )}

                {recommendation.structure.main_set && (
                  <div className="flex gap-3 p-3 bg-emerald-50 rounded-lg">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Activity className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-800">主课</p>
                      <p className="text-xs text-emerald-600">{recommendation.structure.main_set}</p>
                    </div>
                  </div>
                )}

                {recommendation.structure.cooldown && (
                  <div className="flex gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">放松</p>
                      <p className="text-xs text-purple-600">{recommendation.structure.cooldown}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 关键指标详情 */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              关键训练指标
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {details.map((detail: any, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
                  <p className="text-xl font-bold text-gray-800">
                    {Math.round(detail.numeric_value * 10) / 10}
                    <span className="text-xs text-gray-400 ml-1">{detail.unit || ''}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{detail.description_text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 决策说明 */}
        <Card className="border-0 shadow-sm bg-white mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              决策说明
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.explanations?.map((exp: any, idx: number) => (
              <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  exp.item_type === 'positive' ? 'bg-emerald-100' :
                  exp.item_type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {exp.item_type === 'positive' ? '✓' : exp.item_type === 'warning' ? '⚠' : 'ℹ'}
                </div>
                <p className="text-sm text-gray-700">{exp.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 数据来源说明 */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <p className="text-xs text-gray-400 text-center">
              💡 基于 Intervals.icu 真实训练数据计算 ·
              最后更新: {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
