"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean
  onClose: () => void
}

export function Toast({ className, visible, onClose, children, ...props }: ToastProps) {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [visible, onClose])

  if (!visible) return null

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center justify-between w-auto max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700",
        className,
      )}
      {...props}
    >
      <div className="flex items-center">{children}</div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export const ToastProvider = () => null
export const ToastViewport = () => null
export const ToastTitle = () => null
export const ToastDescription = () => null
export const ToastClose = () => null
export const ToastAction = () => null

