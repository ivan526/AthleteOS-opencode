'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消'
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
