'use client'

import { create } from 'zustand'
import { apiClient } from './api'
import type { User, LoginRequest, RegisterRequest, AuthState } from './types'

interface AuthStore extends AuthState {
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  loadUserFromStorage: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null })
    try {
      const tokenResponse = await apiClient.login(data)
      apiClient.setToken(tokenResponse.access_token)
      const user = await apiClient.getCurrentUser()
      set({
        user,
        token: tokenResponse.access_token,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '登录失败',
        isLoading: false
      })
      throw error
    }
  },

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.register(data)
      const tokenResponse = await apiClient.login({ email: data.email, password: data.password })
      apiClient.setToken(tokenResponse.access_token)
      const user = await apiClient.getCurrentUser()
      set({
        user,
        token: tokenResponse.access_token,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '注册失败',
        isLoading: false
      })
      throw error
    }
  },

  logout: () => {
    apiClient.setToken(null)
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
  },

  loadUserFromStorage: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
    if (!token) return

    try {
      apiClient.setToken(token)
      const user = await apiClient.getCurrentUser()
      set({
        user,
        token,
        isAuthenticated: true
      })
    } catch {
      apiClient.setToken(null)
      set({
        user: null,
        token: null,
        isAuthenticated: false
      })
    }
  },

  clearError: () => set({ error: null })
}))
