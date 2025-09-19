"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Ticker from "@/components/Ticker"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageToggle from "@/components/LanguageToggle"
import { useAuth } from "@/hooks/useAuth"
import { APIError } from "@/services/api"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const SignIn = () => {
  const { t, i18n } = useTranslation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { signIn } = useAuth()
  const navigate = useNavigate()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signIn(email, password)
      toast({
        title: t('auth.signInPage.success.title'),
        description: t('auth.signInPage.success.description'),
      })
      navigate("/") // Redirect to home page after successful login
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: t('auth.signInPage.error.title'),
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: t('auth.signInPage.error.title'),
          description: t('auth.signInPage.error.unexpectedError'),
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
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
              <CardTitle className="text-2xl font-bold text-center text-foreground">
                {t('auth.signInPage.title')}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {t('auth.signInPage.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground`} />
                    <Input
                      type="email"
                      placeholder={t('auth.signInPage.email')}
                      className={i18n.language === 'ar' ? 'pr-10' : 'pl-10'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-3 h-4 w-4 text-muted-foreground`} />
                    <Input
                      type="password"
                      placeholder={t('auth.signInPage.password')}
                      className={i18n.language === 'ar' ? 'pr-10' : 'pl-10'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className={`flex items-center ${i18n.language === 'ar' ? 'flex-row-reverse' : ''} justify-between`}>
                  <a href="#" className="text-sm text-primary hover:underline">
                    {t('auth.signInPage.forgotPassword')}
                  </a>
                  <div className={`flex items-center ${i18n.language === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">
                      {t('auth.signInPage.rememberMe')}
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('auth.signInPage.signingIn') : t('auth.signInPage.signInButton')}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {t('auth.dontHaveAccount')}{" "}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  {t('auth.registerHere')}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Forex King. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SignIn
