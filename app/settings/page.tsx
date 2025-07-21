"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import { useAuth } from "@/components/AuthProvider"
import { useRouter } from "next/navigation"
import { 
  Settings, 
  Save, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Phone,
  Globe,
  CreditCard,
  FileText,
  Palette,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface SettingsData {
  company: {
    name: string
    email: string
    phone: string
    address: string
    website: string
    logo: string
  }
  sms: {
    enabled: boolean
    apiKey: string
    secretKey: string
    sourceAddr: string
  }
  email: {
    enabled: boolean
    smtpHost: string
    smtpPort: string
    username: string
    password: string
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    primaryColor: string
    logoUrl: string
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    quoteAlerts: boolean
    systemUpdates: boolean
  }
}

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('company')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadSettings()
    }
  }, [user])

  const loadSettings = async () => {
    try {
      setDataLoading(true)
      // Mock settings data
      const mockSettings: SettingsData = {
        company: {
          name: "Areno Logistics",
          email: "info@arenologistics.com",
          phone: "+255 717 123 456",
          address: "Dar es Salaam, Tanzania",
          website: "https://arenologistics.com",
          logo: "/images/ArenoLogisticsLogo.png"
        },
        sms: {
          enabled: true,
          apiKey: "127b99114c09d449",
          secretKey: "YTJkZGZhODk0MjIwYjQ5NTdmYjQzNTMzMTZlZDI1MmE3OTY0ZDIzMzY2OTUyYjBkOGFiZDNjMjU5ZjEwNWNlNA==",
          sourceAddr: "ARENO"
        },
        email: {
          enabled: false,
          smtpHost: "",
          smtpPort: "",
          username: "",
          password: ""
        },
        appearance: {
          theme: 'light',
          primaryColor: '#f97316',
          logoUrl: "/images/ArenoLogisticsLogo.png"
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: true,
          quoteAlerts: true,
          systemUpdates: false
        }
      }
      setSettings(mockSettings)
    } catch (err) {
      console.error('Error loading settings:', err)
    } finally {
      setDataLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (section: keyof SettingsData, field: string, value: any) => {
    if (settings) {
      setSettings({
        ...settings,
        [section]: {
          ...settings[section],
          [field]: value
        }
      })
    }
  }

  const tabs = [
    { id: 'company', name: 'Company', icon: User },
    { id: 'sms', name: 'SMS Settings', icon: Phone },
    { id: 'email', name: 'Email Settings', icon: Mail },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm mx-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading authentication...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        <Header />
        
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
              <p className="text-slate-600">Manage your system configuration and preferences</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">Settings saved successfully!</span>
              </div>
            )}

            {dataLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading settings...</p>
              </div>
            ) : settings ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-slate-200">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {/* Company Settings */}
                  {activeTab === 'company' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900">Company Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={settings.company.name}
                            onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={settings.company.email}
                            onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={settings.company.phone}
                            onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            value={settings.company.website}
                            onChange={(e) => handleInputChange('company', 'website', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Address
                          </label>
                          <textarea
                            value={settings.company.address}
                            onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SMS Settings */}
                  {activeTab === 'sms' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900">SMS Configuration</h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="checkbox"
                          id="sms-enabled"
                          checked={settings.sms.enabled}
                          onChange={(e) => handleInputChange('sms', 'enabled', e.target.checked)}
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="sms-enabled" className="text-sm font-medium text-slate-700">
                          Enable SMS notifications
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            API Key
                          </label>
                          <input
                            type="text"
                            value={settings.sms.apiKey}
                            onChange={(e) => handleInputChange('sms', 'apiKey', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Secret Key
                          </label>
                          <input
                            type="password"
                            value={settings.sms.secretKey}
                            onChange={(e) => handleInputChange('sms', 'secretKey', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Source Address
                          </label>
                          <input
                            type="text"
                            value={settings.sms.sourceAddr}
                            onChange={(e) => handleInputChange('sms', 'sourceAddr', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email Settings */}
                  {activeTab === 'email' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900">Email Configuration</h3>
                      <div className="flex items-center space-x-2 mb-4">
                        <input
                          type="checkbox"
                          id="email-enabled"
                          checked={settings.email.enabled}
                          onChange={(e) => handleInputChange('email', 'enabled', e.target.checked)}
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="email-enabled" className="text-sm font-medium text-slate-700">
                          Enable email notifications
                        </label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            SMTP Host
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpHost}
                            onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            SMTP Port
                          </label>
                          <input
                            type="text"
                            value={settings.email.smtpPort}
                            onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Username
                          </label>
                          <input
                            type="text"
                            value={settings.email.username}
                            onChange={(e) => handleInputChange('email', 'username', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                          </label>
                          <input
                            type="password"
                            value={settings.email.password}
                            onChange={(e) => handleInputChange('email', 'password', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appearance Settings */}
                  {activeTab === 'appearance' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900">Appearance</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Theme
                          </label>
                          <select
                            value={settings.appearance.theme}
                            onChange={(e) => handleInputChange('appearance', 'theme', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="auto">Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Primary Color
                          </label>
                          <input
                            type="color"
                            value={settings.appearance.primaryColor}
                            onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                            className="w-full h-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications Settings */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900">Notification Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">Email Notifications</h4>
                            <p className="text-sm text-slate-500">Receive notifications via email</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.emailNotifications}
                            onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">SMS Notifications</h4>
                            <p className="text-sm text-slate-500">Receive notifications via SMS</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.smsNotifications}
                            onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">Quote Alerts</h4>
                            <p className="text-sm text-slate-500">Get notified when new quotes are received</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.quoteAlerts}
                            onChange={(e) => handleInputChange('notifications', 'quoteAlerts', e.target.checked)}
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-slate-900">System Updates</h4>
                            <p className="text-sm text-slate-500">Receive system update notifications</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={settings.notifications.systemUpdates}
                            onChange={(e) => handleInputChange('notifications', 'systemUpdates', e.target.checked)}
                            className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Settings */}
                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-slate-900">Security Settings</h3>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800">Security Features</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Advanced security settings will be available in future updates.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                    >
                      {saving ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-600">No settings data available</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
} 