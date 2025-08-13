"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { authAPI } from "@/lib/api-service"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsSubmitting(true)
    setError("")
    setMessage("")

    try {
      const response = await authAPI.requestPasswordReset(email)
      if (response.success) {
        setMessage("Password reset link sent! Check your email.")
        setStep('reset')
      } else {
        setError(response.message || "Failed to send reset link")
      }
    } catch (err) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)
    setError("")
    setMessage("")

    try {
      const response = await authAPI.resetPassword(token, email, password, confirmPassword)
      if (response.success) {
        setMessage("Password reset successfully! You can now login with your new password.")
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(response.message || "Failed to reset password")
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-slate-100 p-4">
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
              Reset Password
            </CardTitle>
            <p className="text-orange-100 text-sm">
              {step === 'request' ? 'Enter your email to receive a reset link' : 'Enter your new password'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            {/* Back to Login Button */}
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="flex items-center text-sm text-orange-600 hover:underline focus:outline-none"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </button>
            </div>

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {step === 'request' ? (
              /* Request Reset Form */
              <form onSubmit={handleRequestReset} className="space-y-5">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-200 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending Reset Link...
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            ) : (
              /* Reset Password Form */
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-slate-700 mb-2">
                    Reset Token
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="token"
                      type="text"
                      placeholder="Enter reset token from email"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-200 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-200 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-orange-500 focus:ring-orange-200 transition-all duration-200"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
