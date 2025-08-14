'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
  category: 'system' | 'hr' | 'finance' | 'inventory' | 'sales' | 'general'
  actionUrl?: string
  priority: 'low' | 'medium' | 'high'
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)

  // Sample notifications data
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Employee Onboarded',
        message: 'John Doe has been successfully onboarded to the Engineering department.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
        category: 'hr',
        priority: 'medium'
      },
      {
        id: '2',
        title: 'Inventory Alert',
        message: 'Low stock alert: Office supplies are running low. Please reorder soon.',
        type: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        read: false,
        category: 'inventory',
        priority: 'high'
      },
      {
        id: '3',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM.',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        read: true,
        category: 'system',
        priority: 'low'
      },
      {
        id: '4',
        title: 'Sales Target Achieved',
        message: 'Congratulations! The sales team has exceeded this month\'s target by 15%.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        read: true,
        category: 'sales',
        priority: 'medium'
      },
      {
        id: '5',
        title: 'Payment Received',
        message: 'Payment of $5,000 has been received from Client ABC Corp.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 240),
        read: false,
        category: 'finance',
        priority: 'high'
      },
      {
        id: '6',
        title: 'Leave Request Approved',
        message: 'Your leave request for next week has been approved by your manager.',
        type: 'success',
        timestamp: new Date(Date.now() - 1000 * 60 * 300),
        read: true,
        category: 'hr',
        priority: 'medium'
      },
      {
        id: '7',
        title: 'Database Backup Complete',
        message: 'Daily database backup has been completed successfully.',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 360),
        read: true,
        category: 'system',
        priority: 'low'
      },
      {
        id: '8',
        title: 'New Project Assignment',
        message: 'You have been assigned to Project Alpha. Check your dashboard for details.',
        type: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 420),
        read: false,
        category: 'general',
        priority: 'medium'
      }
    ]
    setNotifications(sampleNotifications)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="h-5 w-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'error':
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr':
        return 'bg-purple-100 text-purple-800'
      case 'finance':
        return 'bg-green-100 text-green-800'
      case 'inventory':
        return 'bg-blue-100 text-blue-800'
      case 'sales':
        return 'bg-orange-100 text-orange-800'
      case 'system':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-indigo-100 text-indigo-800'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.ceil(diffTime / (1000 * 60))
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.category === filter
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUnread = !showUnreadOnly || !notification.read
    
    return matchesFilter && matchesSearch && matchesUnread
  })

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 h-screen flex flex-col">
        <Header />
        <div className="flex-1 mt-16 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
              <div>
                  <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                  <p className="text-slate-600">Stay updated with important updates and alerts</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-500">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Mark All as Read
                  </button>
              </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    <option value="system">System</option>
                    <option value="hr">HR</option>
                    <option value="finance">Finance</option>
                    <option value="inventory">Inventory</option>
                    <option value="sales">Sales</option>
                    <option value="general">General</option>
                  </select>
          </div>

                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                    </div>

                {/* Unread Only Toggle */}
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={showUnreadOnly}
                      onChange={(e) => setShowUnreadOnly(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Show unread only</span>
                  </label>
                      </div>
                      </div>
                    </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No notifications found</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {searchQuery || filter !== 'all' || showUnreadOnly
                      ? 'Try adjusting your filters or search terms.'
                      : 'You\'re all caught up!'}
                  </p>
                      </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-lg shadow-sm border border-slate-200 p-4 transition-all ${
                      notification.read ? 'opacity-75' : 'ring-2 ring-blue-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(notification.type)}
              </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className={`text-sm font-medium ${
                                notification.read ? 'text-slate-600' : 'text-slate-900'
                              }`}>
                                {notification.title}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(notification.category)}`}>
                                {notification.category}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">
                                {formatTime(notification.timestamp)}
                              </span>
                              <div className="flex items-center space-x-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-xs text-red-600 hover:text-red-800 font-medium"
                                >
                                  Delete
                                </button>
                          </div>
                        </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
                        </div>
                      </div>
                    </div>
      </div>
    </div>
  )
}
