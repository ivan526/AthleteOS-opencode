export type CapacityStatus = 'ready_to_push' | 'train_normally' | 'reduce_intensity' | 'recovery_required'

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high_caution'

export type DataQuality = 'high' | 'medium' | 'low' | 'insufficient'

export interface TrainingCapacity {
  score: number
  status: CapacityStatus
  statusText: string
  confidence: number
  dataQuality: DataQuality
  trend: number
  subscores: {
    sleep: number
    hrv: number
    form: number
    acwr: number
    monotony: number
    adherence: number
    subjectiveFatigue: number
    recoveryTrend: number
  }
}

export interface TrainingRisk {
  score: number
  level: RiskLevel
  userLabel: string
  confidence: number
  dataQuality: DataQuality
  mainFactors: {
    factor: string
    value: number
    message: string
  }[]
  safeRecommendation: string
}

export interface WorkoutRecommendation {
  sport: 'running' | 'cycling' | 'strength' | 'recovery'
  type: string
  title: string
  durationMinutes: number
  expectedTss: number
  intensity: 'easy' | 'moderate' | 'hard' | 'recovery'
  structure?: {
    warmup?: string
    mainSet?: string
    cooldown?: string
  }
}

export interface ExplanationItem {
  id: string
  text: string
  type: 'positive' | 'neutral' | 'warning'
}

export interface ProfessionalDetail {
  label: string
  value: number | string
  unit?: string
  description: string
}

export interface DailyData {
  date: string
  trainingCapacity: TrainingCapacity
  trainingRisk: TrainingRisk
  recommendation: WorkoutRecommendation
  explanations: ExplanationItem[]
  professionalDetails: ProfessionalDetail[]
}

export interface AthleteProfile {
  id: string
  name: string
  primarySport: 'running' | 'cycling' | 'triathlon'
  timezone: string
  dataLevel: 'A' | 'B' | 'C' | 'D'
}

export interface WeeklyReview {
  weekStart: string
  weekEnd: string
  summary: string
  adherence: number
  weeklyTss: number
  loadChangeVsLastWeek: number
  trainingRiskLevel: RiskLevel
  highlights: string[]
  warnings: string[]
  nextWeekRecommendation: string
}

export interface HistoryDataPoint {
  date: string
  ctl: number
  atl: number
  form: number
  tss: number
}
