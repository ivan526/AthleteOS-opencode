import type {
  DailyDataResponse,
  HistoryDataPoint,
  WeeklyReviewResponse,
  User,
  TokenResponse,
  LoginRequest,
  RegisterRequest
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  private getAuthHeaders(): Record<string, string> {
    if (this.token) {
      return { Authorization: `Bearer ${this.token}` }
    }
    return {}
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options?.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<TokenResponse> {
    const formData = new FormData()
    formData.append('username', data.email)
    formData.append('password', data.password)
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      body: formData
    })
    if (!response.ok) {
      throw new Error('登录失败，请检查邮箱和密码')
    }
    return response.json()
  }

  async register(data: RegisterRequest): Promise<User> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me')
  }

  // Training endpoints
  async getTodayData(): Promise<DailyDataResponse> {
    return this.request<DailyDataResponse>('/training/today')
  }

  async getHistoryData(days: number = 30): Promise<HistoryDataPoint[]> {
    return this.request<HistoryDataPoint[]>(`/training/history?days=${days}`)
  }

  async getWeeklyReview(): Promise<WeeklyReviewResponse> {
    return this.request<WeeklyReviewResponse>('/training/weekly-review')
  }

  // Sync endpoints
  async syncIntervalsIcu(apiKey: string, athleteId: string, days: number = 90) {
    return this.request('/sync/intervals-icu', {
      method: 'POST',
      body: JSON.stringify({ api_key: apiKey, athlete_id: athleteId, days })
    })
  }

  async getSyncStatus() {
    return this.request('/sync/status')
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/settings')
  }

  async updateSettings(data: { intervals_api_key?: string; intervals_athlete_id?: string }) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async syncWithSavedCredentials(days: number = 90) {
    return this.request(`/settings/sync?days=${days}`, {
      method: 'POST'
    })
  }
}

export const apiClient = new ApiClient()

export default apiClient
