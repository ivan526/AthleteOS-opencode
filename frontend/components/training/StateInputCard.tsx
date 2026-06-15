'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDailyState } from '@/lib/hooks'
import { Heart, Moon, Zap, Brain, Smile, Activity, ChevronDown, ChevronUp } from 'lucide-react'

interface StateInputCardProps {
  date: string
  onSaved?: () => void
}

const scoreLabels: Record<number, string> = {
  1: '极差',
  2: '很差',
  3: '较差',
  4: '略差',
  5: '一般',
  6: '还好',
  7: '良好',
  8: '不错',
  9: '很好',
  10: '完美'
}

const sliderColor = (value: number) => {
  if (value <= 3) return 'accent-red-500'
  if (value <= 5) return 'accent-amber-500'
  if (value <= 7) return 'accent-emerald-500'
  return 'accent-emerald-600'
}

export function StateInputCard({ date, onSaved }: StateInputCardProps) {
  const { data, loading, update } = useDailyState(date)
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSliderChange = async (field: string, value: number) => {
    setSaving(true)
    await update({ [field]: value })
    setSaving(false)
    onSaved?.()
  }

  const handleNotesChange = async (value: string) => {
    setSaving(true)
    await update({ notes: value })
    setSaving(false)
    onSaved?.()
  }

  const SliderRow = ({ 
    icon: Icon, 
    label, 
    field, 
    value, 
    color 
  }: { 
    icon: any
    label: string
    field: string
    value: number | null
    color: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        {value && (
          <span className={`text-sm font-bold ${color}`}>
            {value} - {scoreLabels[Math.round(value)]}
          </span>
        )}
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="0.5"
        value={value || 5}
        onChange={(e) => handleSliderChange(field, parseFloat(e.target.value))}
        className={`w-full h-2 rounded-lg cursor-pointer ${value ? sliderColor(value) : 'accent-gray-300'}`}
      />
    </div>
  )

  if (loading) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between"
        >
          <CardTitle className="text-base font-medium text-gray-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600" />
            今日状态调整
          </CardTitle>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 space-y-5">
          <p className="text-sm text-gray-500">
            调整以下指标会重新计算你的训练能力和风险评估
          </p>

          <SliderRow
            icon={Moon}
            label="睡眠质量"
            field="sleep_quality"
            value={data?.sleep_quality || null}
            color="text-indigo-600"
          />

          <SliderRow
            icon={Zap}
            label="主观疲劳"
            field="subjective_fatigue"
            value={data?.subjective_fatigue || null}
            color="text-amber-600"
          />

          <SliderRow
            icon={Activity}
            label="肌肉酸痛"
            field="muscle_soreness"
            value={data?.muscle_soreness || null}
            color="text-red-600"
          />

          <SliderRow
            icon={Brain}
            label="压力水平"
            field="stress_level"
            value={data?.stress_level || null}
            color="text-blue-600"
          />

          <SliderRow
            icon={Smile}
            label="情绪状态"
            field="mood"
            value={data?.mood || null}
            color="text-emerald-600"
          />

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">静息心率 (bpm)</label>
              <input
                type="number"
                placeholder="如 60"
                value={data?.resting_hr || ''}
                onChange={(e) => handleSliderChange('resting_hr', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">HRV (ms)</label>
              <input
                type="number"
                placeholder="如 45"
                value={data?.hrv_sdnn || ''}
                onChange={(e) => handleSliderChange('hrv_sdnn', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">备注</label>
            <textarea
              placeholder="记录今天的感受..."
              value={data?.notes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={2}
            />
          </div>

          {saving && (
            <p className="text-xs text-emerald-600 text-center">正在保存...</p>
          )}
        </CardContent>
      )}
    </Card>
  )
}
