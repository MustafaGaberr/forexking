"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/Navbar"
import Ticker from "@/components/Ticker"
import ThemeToggle from "@/components/ThemeToggle"
import LanguageToggle from "@/components/LanguageToggle"
import { authAPI, APIError } from "@/services/api"
import { useTranslation } from "react-i18next"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

const Register = () => {
  const { t, i18n } = useTranslation()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!strongPasswordRegex.test(formData.password)) {
      toast({
        title: t("auth.registerPage.error.title"),
        description:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("auth.registerPage.error.title"),
        description: t("auth.registerPage.error.passwordsNotMatch"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true)

    try {
      // ✅ تأكد أن رقم الموبايل يبدأ بـ "+"
      const formattedPhone = formData.phone.startsWith("+")
        ? formData.phone
        : `+${formData.phone}`

      const result = await authAPI.signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNumber: formattedPhone,
      })
      
      toast({
        title: t("auth.registerPage.success.title"),
        description: "Please check your email for verification code.",
      })
      
      // Navigate to OTP verification page with email
      navigate("/verify-otp", {
        state: {
          email: result.email,
          name: result.name,
        },
      })
    } catch (error) {
      if (error instanceof APIError) {
        toast({
          title: t("auth.registerPage.error.title"),
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: t("auth.registerPage.error.title"),
          description: t("auth.registerPage.error.unexpectedError"),
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <Navbar onToggle={setIsSidebarCollapsed} />
      <Ticker />

      <div className="max-w-7xl mx-auto py-20 px-4">
        <div className="flex justify-center">
          <Card className="w-full max-w-md bg-card border-border">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center text-foreground">
                {t("auth.registerPage.title")}
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                {t("auth.registerPage.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <User
                    className={`absolute ${
                      i18n.language === "ar" ? "right-3" : "left-3"
                    } top-3 h-4 w-4 text-muted-foreground`}
                  />
                  <Input
                    placeholder={t("auth.registerPage.fullName")}
                    className={i18n.language === "ar" ? "pr-10" : "pl-10"}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail
                    className={`absolute ${
                      i18n.language === "ar" ? "right-3" : "left-3"
                    } top-3 h-4 w-4 text-muted-foreground`}
                  />
                  <Input
                    type="email"
                    placeholder={t("auth.registerPage.email")}
                    className={i18n.language === "ar" ? "pr-10" : "pl-10"}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                {/* ✅ Phone (with country dropdown) */}
                <div className="relative">
                  <PhoneInput
                    country={"eg"}
                    value={formData.phone}
                    onChange={(phone) => setFormData({ ...formData, phone })}
                    inputClass="!w-full !h-10 !pl-12 !text-sm !border !border-input !rounded-md focus:!ring-2 focus:!ring-ring focus:!ring-offset-2 !bg-[#f5f5f5]"
                    buttonClass="!border-none !bg-transparent"
                    dropdownClass="!bg-card !text-foreground"
                    containerClass={`${
                      i18n.language === "ar"
                        ? "flex-row-reverse text-right"
                        : ""
                    }`}
                    placeholder={t("auth.registerPage.phone")}
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock
                    className={`absolute ${
                      i18n.language === "ar" ? "right-3" : "left-3"
                    } top-3 h-4 w-4 text-muted-foreground`}
                  />
                  <Input
                    type="password"
                    placeholder={t("auth.registerPage.password")}
                    className={i18n.language === "ar" ? "pr-10" : "pl-10"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Lock
                    className={`absolute ${
                      i18n.language === "ar" ? "right-3" : "left-3"
                    } top-3 h-4 w-4 text-muted-foreground`}
                  />
                  <Input
                    type="password"
                    placeholder={t("auth.registerPage.confirmPassword")}
                    className={i18n.language === "ar" ? "pr-10" : "pl-10"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                {/* Terms */}
                <div
                  className={`flex items-center ${
                    i18n.language === "ar"
                      ? "space-x-reverse space-x-2"
                      : "space-x-2"
                  }`}
                >
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground"
                  >
                    {t("auth.agreeToTerms")}{" "}
                    <a href="#" className="text-primary hover:underline">
                      {t("auth.termsOfService")}
                    </a>{" "}
                    {t("auth.and")}{" "}
                    <a href="#" className="text-primary hover:underline">
                      {t("auth.privacyPolicy")}
                    </a>
                  </label>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? t("auth.registerPage.creatingAccount")
                    : t("auth.registerPage.registerButton")}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col">
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {t("auth.alreadyHaveAccount")}{" "}
                <Link
                  to="/signin"
                  className="font-medium text-primary hover:underline"
                >
                  {t("auth.signInHere")}
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>

      <footer className="py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {/* <ThemeToggle /> */}
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Forex King. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Register
