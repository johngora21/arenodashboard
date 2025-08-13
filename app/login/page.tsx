"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const { user, signInWithEmail, loading, error, clearError } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    clearError()
    setFormErrors({})
  }, [clearError])
      
  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await signInWithEmail(formData.email, formData.password)
    } catch (err) {
      // Error is handled by the AuthProvider
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-slate-100 p-4">
      {loading ? (
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <Loader2 className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Checking authentication...</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <div className="flex justify-center mb-4">
                <Image 
                  src="/images/iRis-logo.png" 
                  alt="iRis" 
                  width={100} 
                  height={100} 
                  className="object-contain rounded-full"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Welcome to iRis
              </CardTitle>
              <p className="text-orange-100 text-sm">
                Sign in to access the iRis Company
              </p>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                        formErrors.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-red-600 text-xs mt-2 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="redirect relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-200 ${
                        formErrors.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                          : 'border-slate-200 focus:border-orange-500 focus:ring-orange-200'
                      }`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-600 text-xs mt-2 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Signing In...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-orange-600 hover:underline focus:outline-none"
                  onClick={() => router.push('/reset-password')}
                >
                  Forgot Password?
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
