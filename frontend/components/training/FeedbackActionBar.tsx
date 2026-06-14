'use client'

import { Button } from '@/components/ui/button'

const feedbackOptions = [
  { id: 'tired', label: '太累了', icon: '😴' },
  { id: 'no_time', label: '只有30分钟', icon: '⏰' },
  { id: 'discomfort', label: '腿部不适', icon: '🦵' },
  { id: 'change_sport', label: '换成骑行', icon: '🚴' },
  { id: 'rest', label: '今天休息', icon: '🛋️' }
]

export function FeedbackActionBar() {
  const handleFeedback = (id: string) => {
    console.log('Feedback:', id)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <p className="text-sm text-gray-600 mb-3">今天情况有变化？</p>
      <div className="flex flex-wrap gap-2">
        {feedbackOptions.map((option) => (
          <Button
            key={option.id}
            variant="secondary"
            size="sm"
            onClick={() => handleFeedback(option.id)}
            className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <span>{option.icon}</span>
            <span>{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
