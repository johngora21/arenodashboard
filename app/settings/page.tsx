'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Smartphone, 
  Globe, 
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface SettingsSection {
  id: string
  title: string
  icon: any
  description: string
}

const settingsSections: SettingsSection[] = [
  {
    id: 'personal',
    title: 'Personal Settings',
    icon: User,
    description: 'Manage your profile and preferences'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Configure notification preferences'
  },
  {
    id: 'security',
    title: 'Security',
    icon: Shield,
    description: 'Password and access control settings'
  },
  {
    id: 'system',
    title: 'System Settings',
    icon: Database,
    description: 'Company and workflow configurations'
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Mail,
    description: 'Email, SMS, and third-party services'
  }
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('personal')
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const renderPersonalSettings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            defaultValue="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            defaultValue="Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            defaultValue="john.doe@company.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            defaultValue="+1 (555) 123-4567"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Zone
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="UTC-5">Eastern Time (UTC-5)</option>
            <option value="UTC-6">Central Time (UTC-6)</option>
            <option value="UTC-7">Mountain Time (UTC-7)</option>
            <option value="UTC-8">Pacific Time (UTC-8)</option>
          </select>
        </div>
      </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900">Email Notifications</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-gray-700">Leave request approvals</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-gray-700">Payroll updates</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-gray-700">Training reminders</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm text-gray-700">System maintenance alerts</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900">SMS Notifications</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm text-gray-700">Emergency alerts</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm text-gray-700">Shift changes</span>
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900">In-App Notifications</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-gray-700">New messages</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-gray-700">Task assignments</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-gray-700">Approval requests</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
            placeholder="Enter current password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Enter new password"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Confirm new password"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Security Options</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm text-gray-700">Enable two-factor authentication</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-sm text-gray-700">Session timeout after 30 minutes</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-sm text-gray-700">Require password change every 90 days</span>
          </label>
        </div>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          defaultValue="iRis Technologies"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Leave Policy
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="standard">Standard (20 days/year)</option>
            <option value="generous">Generous (25 days/year)</option>
            <option value="minimal">Minimal (15 days/year)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Approval Hierarchy
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="direct">Direct Manager</option>
            <option value="department">Department Head</option>
            <option value="hr">HR Manager</option>
            <option value="ceo">CEO</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Working Hours
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Start Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              defaultValue="09:00"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">End Time</label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              defaultValue="17:00"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Email Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Server
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              defaultValue="smtp.gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              defaultValue="587"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            defaultValue="hr@company.com"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">SMS Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMS Provider
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="twilio">Twilio</option>
              <option value="nexmo">Nexmo</option>
              <option value="aws">AWS SNS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter API key"
            />
          </div>
        </div>
      </div>


    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'personal':
        return renderPersonalSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'security':
        return renderSecuritySettings()
      case 'system':
        return renderSystemSettings()
      case 'integrations':
        return renderIntegrationSettings()
      default:
        return renderPersonalSettings()
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account preferences and system configurations</p>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-300px)]">
                {/* Sidebar - Fixed height, no scroll */}
                <div className="lg:col-span-1 border-r border-gray-200">
                  <nav className="p-3">
                    <ul className="space-y-1">
                      {settingsSections.map((section) => (
                        <li key={section.id}>
                          <button
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              activeSection === section.id
                                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <section.icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium text-sm">{section.title}</div>
                                <div className="text-xs text-gray-500">
                                  {section.description}
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>

                {/* Content - Scrollable when content is long */}
                <div className="lg:col-span-2 p-4 flex flex-col h-full">
                  <div className="mb-4 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                      {settingsSections.find(s => s.id === activeSection)?.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {settingsSections.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                    <div className="space-y-4">
                      {renderContent()}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>
                      
                      {saved && (
                        <div className="flex items-center space-x-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Settings saved successfully!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
