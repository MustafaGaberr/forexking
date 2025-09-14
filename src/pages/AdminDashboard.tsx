"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AdminLogin } from "@/components/admin/AdminLogin"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = sessionStorage.getItem("admin_authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
      // Load any admin data here if needed
      const stored = localStorage.getItem("daily_performance_image")
      if (stored) setPreview(stored)
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  const handleSignOut = () => {
    sessionStorage.removeItem("admin_authenticated")
    setIsAuthenticated(false)
    navigate("/admin")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => {
      setIsAuthenticated(true);
      navigate('/admin');
    }} />
  }

  const onPick = () => fileRef.current?.click()

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      localStorage.setItem("daily_performance_image", dataUrl)
      setPreview(dataUrl)
      toast({ title: "Saved", description: "Daily image updated successfully." })
    }
    reader.readAsDataURL(file)
  }

  const onClear = () => {
    localStorage.removeItem("daily_performance_image")
    setPreview(null)
    toast({ title: "Cleared", description: "Daily image removed." })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full">
      <Navbar onToggle={setSidebarCollapsed} />
      <div className="fixed top-4 right-4 z-50">
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          typeof window !== 'undefined' && window.innerWidth <= 768
            ? "pt-20 px-2"
            : sidebarCollapsed
            ? "ml-20 px-4"
            : "ml-72 px-4"
        }`}
      >
        <div className="container mx-auto py-4 sm:py-8 px-4">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Upload the daily Deal Performance image</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Image</CardTitle>
                <CardDescription>Supported formats: PNG, JPG, JPEG, WEBP</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                  <Button onClick={onPick}>Choose Image</Button>
                  <Button variant="secondary" onClick={onClear}>Remove</Button>
                </div>
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-[70vh] w-auto rounded-md border border-border" />
                ) : (
                  <div className="text-sm text-muted-foreground">No image selected yet.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard



