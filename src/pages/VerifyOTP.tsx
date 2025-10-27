"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Ticker from "@/components/Ticker"
import LanguageToggle from "@/components/LanguageToggle"
import { authAPI, APIError } from "@/services/api"
import { useTranslation } from "react-i18next"

const VerifyOTP = () => {
  const { t, i18n } = useTranslation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get email from navigation state
  const email = location.state?.email || ""
  const name = location.state?.name || ""

  useEffect(() => {
    window.scrollTo(0, 0)
    
    // Redirect if no email provided
    if (!email) {
      toast({
        title: t('auth.verifyOtpPage.error.title'),
        description: "No email found. Please register again.",
        variant: "destructive",
      })
      navigate("/register")
    }
  }, [email, navigate, toast, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (otp.length !== 6) {
      toast({
        title: t('auth.verifyOtpPage.error.title'),
        description: t('auth.verifyOtpPage.error.invalidOtp'),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.verifyOTP({ email, otp })
      
      // Save user data
      localStorage.setItem("forexking_token", response.accessToken)
      localStorage.setItem("user", JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        token: response.accessToken,
      }))
      
      toast({
        title: t('auth.verifyOtpPage.success.title'),
        description: t('auth.verifyOtpPage.success.description'),
      })
      
      // Mark that we should show welcome popup
      try {
        sessionStorage.setItem("showWelcomePopup", "true")
      } catch (e) {
        // ignore sessionStorage errors
      }
      
      // Redirect to home
      navigate("/")
      
      // Refresh to update auth context
      window.location.reload()
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: t('auth.verifyOtpPage.error.title'),
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: t('auth.verifyOtpPage.error.title'),
          description: t('auth.verifyOtpPage.error.unexpectedError'),
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    
    try {
      await authAPI.resendOTP({ email })
      toast({
        title: t('auth.verifyOtpPage.success.resendTitle'),
        description: t('auth.verifyOtpPage.success.resendDescription'),
      })
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: t('auth.verifyOtpPage.error.title'),
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: t('auth.verifyOtpPage.error.title'),
          description: t('auth.verifyOtpPage.error.unexpectedError'),
          variant: "destructive",
        })
      }
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar onToggle={setIsSidebarCollapsed} />
      <Ticker />

      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-foreground">
                {t('auth.verifyOtpPage.title')}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {t('auth.verifyOtpPage.description')} <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {t('auth.verifyOtpPage.otpLabel')}
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    className="text-center text-2xl tracking-widest font-mono"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtp(value)
                    }}
                    maxLength={6}
                    required
                    autoFocus
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {t('auth.verifyOtpPage.otpHint')}
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                  {isLoading ? t('auth.verifyOtpPage.verifying') : t('auth.verifyOtpPage.verifyButton')}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  {t('auth.verifyOtpPage.didntReceive')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? t('auth.verifyOtpPage.resending') : t('auth.verifyOtpPage.resendButton')}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                variant="ghost"
                onClick={() => navigate("/register")}
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('auth.verifyOtpPage.backToRegister')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <LanguageToggle />
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Forex King. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default VerifyOTP

