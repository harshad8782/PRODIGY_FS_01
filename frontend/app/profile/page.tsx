"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProfileForm } from "@/components/profile-form"
import { PasswordChangeForm } from "@/components/password-change-form"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProfilePage() {
  const { user, logout, login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState(user)

  useEffect(() => {
    if (user) {
      setProfileData(user)
      setLoading(false)
    } else {
      // If user is not in context, try to fetch from backend or redirect
      // For now, we'll just redirect if not authenticated
      if (!user && !loading) {
        router.push("/auth/login")
      }
    }
  }, [user, loading, router])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found.")
      }

      const response = await fetch("http://localhost:8080/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch profile data.")
      }

      const data = await response.json()
      setProfileData(data)
      login(data) // Update auth context with fresh data
      toast({
        title: "Profile Loaded",
        description: "Your profile data has been refreshed.",
      })
    } catch (error: any) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: error.message || "Could not load profile data.",
        variant: "destructive",
      })
      // If token is invalid or user not found, force logout
      if (error.message === "User not authenticated" || error.message === "Authenticated user not found in DB") {
        logout()
        router.push("/auth/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found.")
      }

      const response = await fetch("http://localhost:8080/api/profile", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete account.")
      }

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        variant: "default",
      })
      logout()
      router.push("/")
    } catch (error: any) {
      console.error("Error deleting account:", error)
      toast({
        title: "Deletion Failed",
        description: error.message || "An unexpected error occurred during account deletion.",
        variant: "destructive",
      })
    }
  }

  if (loading || !profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>
      <div className="min-h-screen bg-gray-100 px-4 py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Profile Settings</CardTitle>
              <CardDescription>Manage your account information and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile-info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile-info">Profile Info</TabsTrigger>
                  <TabsTrigger value="change-password">Change Password</TabsTrigger>
                  <TabsTrigger value="danger-zone">Danger Zone</TabsTrigger>
                </TabsList>
                <TabsContent value="profile-info" className="mt-4">
                  <ProfileForm profile={profileData} onUpdateSuccess={fetchProfile} />
                </TabsContent>
                <TabsContent value="change-password" className="mt-4">
                  <PasswordChangeForm onPasswordChangeSuccess={fetchProfile} />
                </TabsContent>
                <TabsContent value="danger-zone" className="mt-4">
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-800">Delete Account</CardTitle>
                      <CardDescription className="text-red-700">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">Delete Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove your
                              data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
