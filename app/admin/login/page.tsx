"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { getSupabaseClient } from "@/lib/supabase/client";
import { CheckCircle2, HomeIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Use our custom session hook with redirectIfFound set to true
  // This will redirect to /admin if a valid session is found
  const { isLoading: isSessionLoading } = useSession({
    redirectIfFound: true,
    redirectTo: "/admin",
  });

  // Update the isCheckingAuth state based on our hook
  useEffect(() => {
    if (!isSessionLoading) {
      setIsCheckingAuth(false);
    }
  }, [isSessionLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Store session in localStorage for persistence
      if (data?.session) {
        localStorage.setItem(
          "supabase.auth.token",
          JSON.stringify(data.session)
        );
      }

      setSuccess(true);

      // Use a short timeout to show success message before redirecting
      setTimeout(() => {
        // Use window.location for a full page reload to ensure the session is properly recognized
        window.location.href = `${window.location.origin}/admin`;
      }, 500);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                <AlertDescription>
                  Login successful! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col justify-center items-center w-full">
          <Button
            asChild
            variant={"link"}
            className="text-md text-black dark:text-white"
          >
            <Link href={"/"}>
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to porfolio
            </Link>
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This area is restricted to administrators only
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
