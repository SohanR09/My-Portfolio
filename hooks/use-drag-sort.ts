"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"

export interface DraggableItem {
  id: string
  sequence: number
  [key: string]: any
}

export function useDragSort<T extends DraggableItem>(
  initialItems: T[],
  tableName: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void,
) {
  const [items, setItems] = useState<T[]>([...initialItems].sort((a, b) => a.sequence - b.sequence))
  const [isDragging, setIsDragging] = useState(false)
  const [draggedItem, setDraggedItem] = useState<T | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  
  useEffect(() => {
    setItems([...initialItems].sort((a, b) => a.sequence - b.sequence))
  }, [initialItems])

  const handleDragStart = (item: T) => {
    setIsDragging(true)
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent, overItem: T) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === overItem.id) return

    const newItems = [...items]
    const draggedIndex = newItems.findIndex((item) => item.id === draggedItem.id)
    const overIndex = newItems.findIndex((item) => item.id === overItem.id)

    // Reorder the items
    newItems.splice(draggedIndex, 1)
    newItems.splice(overIndex, 0, draggedItem)

    // Update sequence numbers
    newItems.forEach((item, index) => {
      item.sequence = index + 1
    })

    setItems(newItems)
  }

  const handleDragEnd = async () => {
    setIsDragging(false)
    if (!draggedItem) return

    try {
      setIsUpdating(true)
      const supabase = getSupabaseClient()

      // Find the new sequence for the dragged item
      const updatedItem = items.find((item) => item.id === draggedItem.id)
      if (!updatedItem) return

      // Update the sequence in the database
      const { error } = await supabase
        .from(tableName)
        .update({ sequence: updatedItem.sequence })
        .eq("id", draggedItem.id)

      if (error) throw new Error(error.message)

      // Call success callback
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error updating sequence:", error)
      if (onError && error instanceof Error) onError(error)
    } finally {
      setIsUpdating(false)
      setDraggedItem(null)
    }
  }

  return {
    items,
    isDragging,
    isUpdating,
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  }
}

