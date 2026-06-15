export type CapacityStatus = 'ready_to_push' | 'train_normally' | 'reduce_intensity' | 'recovery_required'

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high_caution'

export type DataQuality = 'high' | 'medium' | 'low' | 'insufficient'

export type IntensityLevel = 'easy' | 'moderate' | 'hard' | 'recovery'

export type SportType = 'running' | 'cycling' | 'strength' | 'recovery'

export interface RiskFactor {
  factor_name: string
  factor_value: number
  message: string
}

export interface TrainingCapacity {
  score: number
  status: CapacityStatus
  status_text: string
  confidence: number
  data_quality: DataQuality
  trend: number
  dimension_scores: Record<string, number>
}

export interface TrainingRisk {
  score: number
  level: RiskLevel
  user_label: string
  confidence: number
  data_quality: DataQuality
  main_factors: RiskFactor[]
  safe_recommendation: string
}

export interface WorkoutStructure {
  warmup?: string
  main_set?: string
  cooldown?: string
}

export interface WorkoutRecommendation {
  sport: SportType
  workout_type: string
  title: string
  duration_minutes: number
  expected_tss: number
  intensity: IntensityLevel
  structure?: WorkoutStructure
}

export interface ExplanationItem {
  item_id: string
  text: string
  item_type: string
}

export interface ProfessionalDetail {
  label: string
  numeric_value: number
  unit?: string
  description_text: string
}

export interface DailyDataResponse {
  date_val: string
  training_capacity: TrainingCapacity
  training_risk: TrainingRisk
  recommendation: WorkoutRecommendation
  explanations: ExplanationItem[]
  professional_details: ProfessionalDetail[]
}

export interface HistoryDataPoint {
  date_val: string
  ctl: number
  atl: number
  form_value: number
  tss: number
}

export interface WeeklyReviewResponse {
  week_start: string
  week_end: string
  summary: string
  adherence: number
  weekly_tss: number
  load_change_vs_last_week: number
  training_risk_level: RiskLevel
  highlights: string[]
  warnings: string[]
  next_week_recommendation: string
}

// Auth Types
export interface User {
  id: number
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
