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
  AlertCircle,
  Users,
  Key,
  UserCheck,
  Lock
} from 'lucide-react'

interface SettingsSection {
  id: string
  title: string
  icon: any
  description: string
}

const settingsSections: SettingsSection[] = [
  {
    id: 'user-access',
    title: 'User Access Management',
    icon: Users,
    description: 'Manage user accounts, roles, and credentials'
  },
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
  const [activeSection, setActiveSection] = useState('user-access')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setShowUserModal(true)
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

  const renderUserAccessSettings = () => {
    const users = [
      { id: 1, name: 'John Doe', email: 'john.doe@company.com', department: 'Engineering', role: 'Developer', status: 'Active', lastLogin: '2 hours ago', avatar: 'JD' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', department: 'HR', role: 'HR Manager', status: 'Active', lastLogin: '1 day ago', avatar: 'JS' },
      { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Sales', role: 'Sales Rep', status: 'Blocked', lastLogin: 'Never', avatar: 'MJ' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Finance', role: 'Accountant', status: 'Inactive', lastLogin: '3 days ago', avatar: 'SW' },
      { id: 5, name: 'David Brown', email: 'david.brown@company.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Pending', lastLogin: 'Never', avatar: 'DB' }
    ];

    return (
      <div className="space-y-4 h-full overflow-hidden flex flex-col">
        {/* Simple Search */}
        <div className="flex gap-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search users..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
            <option value="">All Departments</option>
            <option value="hr">HR</option>
            <option value="engineering">Engineering</option>
            <option value="sales">Sales</option>
            <option value="finance">Finance</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>

        {/* Users Table - Fixed height with scroll */}
        <div className="bg-white rounded-lg border border-gray-200 flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Login</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-600' :
                          user.status === 'Blocked' ? 'bg-red-100 text-red-600' :
                          user.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {user.avatar}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' :
                        user.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                        user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleUserClick(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Action
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Access Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">User Access Management</h2>
                <button 
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center text-lg font-medium ${
                    selectedUser.status === 'Active' ? 'bg-green-100 text-green-600' :
                    selectedUser.status === 'Blocked' ? 'bg-red-100 text-red-600' :
                    selectedUser.status === 'Inactive' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {selectedUser.avatar}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm">
                      <span className="text-gray-600">{selectedUser.department}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-600">{selectedUser.role}</span>
                      <span className="text-gray-600">•</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedUser.status === 'Active' ? 'bg-green-100 text-green-800' :
                        selectedUser.status === 'Blocked' ? 'bg-red-100 text-red-800' :
                        selectedUser.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Access Management Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="">Select Role</option>
                      <option value="user">Standard User</option>
                      <option value="hr">HR Manager</option>
                      <option value="admin">Administrator</option>
                      <option value="super-admin">Super Administrator</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Password</label>
                    <input
                      type="password"
                      placeholder="Set password"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                    <span className="text-sm text-gray-700">Force password change on first login</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500" defaultChecked />
                    <span className="text-sm text-gray-700">Send welcome email</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                    Grant Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'user-access':
        return renderUserAccessSettings();
      case 'personal':
        return renderPersonalSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'system':
        return renderSystemSettings();
      case 'integrations':
        return renderIntegrationSettings();
      default:
        return renderUserAccessSettings();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-hidden mt-16 pl-0">
          <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="mb-6 flex-shrink-0">
              <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
              <p className="text-slate-600 mt-1">Manage your application settings</p>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar Navigation */}
              <nav className="w-64 bg-white rounded-lg border border-gray-200 p-2 flex-shrink-0 overflow-y-auto">
                {settingsSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-2 py-2 rounded-md mb-2 transition-colors ${
                      activeSection === section.id
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{section.title}</div>
                    <div className="text-sm text-gray-500">{section.description}</div>
                  </button>
                ))}
              </nav>

              {/* Content Area */}
              <div className="flex-1 ml-4 overflow-hidden">
                <div className="bg-white rounded-lg border border-gray-200 p-2 h-full overflow-hidden">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
