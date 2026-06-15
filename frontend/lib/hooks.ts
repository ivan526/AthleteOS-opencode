import { useState, useEffect } from 'react'
import apiClient from './api'
import type {
  DailyDataResponse,
  HistoryDataPoint,
  WeeklyReviewResponse
} from './types'

interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useTodayData(): UseQueryResult<DailyDataResponse> {
  const [data, setData] = useState<DailyDataResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getTodayData()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}

export function useHistoryData(days: number = 30): UseQueryResult<HistoryDataPoint[]> {
  const [data, setData] = useState<HistoryDataPoint[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getHistoryData(days)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [days])

  return { data, loading, error, refetch: fetchData }
}

export function useWeeklyReview(): UseQueryResult<WeeklyReviewResponse> {
  const [data, setData] = useState<WeeklyReviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiClient.getWeeklyReview()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}
