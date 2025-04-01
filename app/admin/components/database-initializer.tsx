"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getSupabaseClient } from "@/lib/supabase/client"

export function DatabaseInitializer() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasData, setHasData] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    checkForExistingData()
  }, [])

  const checkForExistingData = async () => {
    setIsChecking(true)
    try {
      const supabase = getSupabaseClient()

      // Check if any of the tables have data
      const tables = ["about_items", "skills", "experiences", "education", "projects", "blog_categories", "blog_posts"]

      for (const table of tables) {
        const { data, error } = await supabase.from(table).select("id").limit(1)

        if (error) {
          if (error.code !== "42P01") {
            // Ignore "relation does not exist" errors
            console.error(`Error checking ${table}:`, error)
          }
        } else if (data && data.length > 0) {
          setHasData(true)
          break
        }
      }
    } catch (err) {
      console.error("Error checking for existing data:", err)
    } finally {
      setIsChecking(false)
    }
  }

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setSuccess(false)
    setError(null)

    try {
      const response = await fetch("/api/init-database")
      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Refresh the page after 2 seconds to show the initialized data
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setError(data.error || "Unknown error occurred")
      }
    } catch (err) {
      setError("Failed to initialize database. Please try again.")
      console.error("Error initializing database:", err)
    } finally {
      setIsInitializing(false)
    }
  }

  const handleInitClick = () => {
    if (hasData) {
      setShowConfirmDialog(true)
    } else {
      initializeDatabase()
    }
  }

  return (
    <>
      <div className="space-y-4">
        <Alert variant={success ? "default" : "destructive"} className="bg-white">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Initialization</AlertTitle>
          <AlertDescription>
            {isChecking
              ? "Checking database status..."
              : hasData
                ? "Database already contains data. Initializing will reset all data."
                : "Your database needs to be initialized with sample data before you can use the admin panel."}
          </AlertDescription>
        </Alert>

        <div className="flex justify-end">
          <Button onClick={handleInitClick} disabled={isInitializing || isChecking}>
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>
        </div>

        {success && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Database initialized successfully. Refreshing page...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Database Reset</DialogTitle>
            <DialogDescription>
              This will delete all existing data and replace it with sample data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirmDialog(false)
                initializeDatabase()
              }}
            >
              Reset Database
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

