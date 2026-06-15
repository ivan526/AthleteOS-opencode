'use client'

import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 11)
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
    
    const duration = toast.duration || 3000
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }))
    }, duration)
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  }
}))

// Helper functions
export function toast(message: string, type: ToastType = 'info', duration?: number) {
  useToastStore.getState().addToast({ message, type, duration })
}

export function successToast(message: string, duration?: number) {
  toast(message, 'success', duration)
}

export function errorToast(message: string, duration?: number) {
  toast(message, 'error', duration)
}

export function infoToast(message: string, duration?: number) {
  toast(message, 'info', duration)
}

export function warningToast(message: string, duration?: number) {
  toast(message, 'warning', duration)
}
