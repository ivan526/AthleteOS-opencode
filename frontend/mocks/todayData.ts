import type { DailyData } from '@/lib/types'

export const todayData: DailyData = {
  date: '2026-06-14',
  trainingCapacity: {
    score: 76,
    status: 'train_normally',
    statusText: '状态稳定，适合正常训练',
    confidence: 0.82,
    dataQuality: 'medium',
    trend: 4,
    subscores: {
      sleep: 83,
      hrv: 78,
      form: 72,
      acwr: 80,
      monotony: 65,
      adherence: 89,
      subjectiveFatigue: 75,
      recoveryTrend: 78
    }
  },
  trainingRisk: {
    score: 0.21,
    level: 'low',
    userLabel: '训练风险较低',
    confidence: 0.76,
    dataQuality: 'medium',
    mainFactors: [
      {
        factor: 'acwr',
        value: 1.1,
        message: '近期训练负荷稳定'
      },
      {
        factor: 'monotony',
        value: 1.7,
        message: '最近一周训练重复性适中'
      }
    ],
    safeRecommendation: '当前状态良好，可以按计划进行正常训练。'
  },
  recommendation: {
    sport: 'running',
    type: 'tempo_run',
    title: '节奏跑',
    durationMinutes: 50,
    expectedTss: 65,
    intensity: 'moderate',
    structure: {
      warmup: '10分钟轻松跑',
      mainSet: '30分钟节奏跑（配速约5:00/km）',
      cooldown: '10分钟放松跑'
    }
  },
  explanations: [
    {
      id: '1',
      text: '昨晚睡眠恢复良好，睡眠评分 83',
      type: 'positive'
    },
    {
      id: '2',
      text: '近期训练负荷稳定，ACWR 1.10 处于安全区间',
      type: 'positive'
    },
    {
      id: '3',
      text: '当前疲劳处于可接受范围，Form -8',
      type: 'neutral'
    }
  ],
  professionalDetails: [
    { label: 'Form', value: -8, description: '训练平衡状态，正值表示恢复充分' },
    { label: 'ACWR', value: 1.10, description: '急性慢性负荷比，0.8-1.3为安全区间' },
    { label: 'Monotony', value: 1.7, description: '训练单调性，越低表示训练变化越丰富' },
    { label: 'CTL', value: 62, description: '长期训练负荷（42天指数移动平均）' },
    { label: 'ATL', value: 70, description: '短期疲劳（7天指数移动平均）' },
    { label: '本周 TSS', value: 280, unit: 'TSS', description: '本周训练压力总分' },
    { label: '数据质量', value: '中等', description: '已有 45 天历史数据，建议继续积累' }
  ]
}
