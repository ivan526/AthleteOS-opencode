'use client'

import { useState } from 'react'

interface FeedbackActionBarProps {
  onFeedback?: (feedback: string) => void
}

const feedbackOptions = [
  { id: 'as_planned', label: '按计划训练', emoji: '✓' },
  { id: 'too_tired', label: '太累了', emoji: '😴' },
  { id: 'no_time', label: '没时间', emoji: '⏰' },
  { id: 'legs_sore', label: '腿部不适', emoji: '🦵' },
  { id: 'switch_cycle', label: '换成骑行', emoji: '🚴' },
  { id: 'rest_day', label: '今天休息', emoji: '🛋️' },
]

export function FeedbackActionBar({ onFeedback }: FeedbackActionBarProps) {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSelect = async (id: string) => {
    setSelected(id)
    setSaving(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setSaving(false)
    onFeedback?.(id)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <span className="text-emerald-600 text-sm">✓</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800 text-sm">
              {selected 
                ? `已选择: ${feedbackOptions.find(f => f.id === selected)?.label}`
                : '今天感觉怎么样？'}
            </span>
            {saving && (
              <span className="text-xs text-emerald-600 animate-pulse">更新中...</span>
            )}
          </div>
        </div>
        <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2">
          <p className="text-xs text-gray-500 mb-3">
            选择你的状态，系统会动态调整今日训练建议
          </p>
          <div className="grid grid-cols-3 gap-2">
            {feedbackOptions.map((option) => {
              const isSelected = selected === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all ${
                    isSelected 
                      ? 'ring-2 ring-emerald-500 ring-offset-1 bg-emerald-50' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <span className="text-lg">{option.emoji}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
