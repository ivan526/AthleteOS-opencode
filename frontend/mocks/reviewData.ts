import type { WeeklyReview } from '@/lib/types'

export const weeklyReviewData: WeeklyReview = {
  weekStart: '2026-06-08',
  weekEnd: '2026-06-14',
  summary: '本周训练完成度较好，负荷增长稳定。',
  adherence: 0.86,
  weeklyTss: 430,
  loadChangeVsLastWeek: 0.06,
  trainingRiskLevel: 'low',
  highlights: [
    '完成 6 次训练中的 5 次',
    '周负荷较上周增长 6%',
    '睡眠趋势稳定'
  ],
  warnings: [
    '周末连续两天强度偏高，下周初建议适当恢复'
  ],
  nextWeekRecommendation: '下周可以维持当前训练量，但建议控制高强度训练次数，注意恢复。'
}
