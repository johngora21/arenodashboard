"use client";

import { useState } from "react";
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText,
  UserCheck,
  UserX,
  DollarSign,
  Calendar,
  Search
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'approval' | 'report';
  priority: 'high' | 'medium' | 'low';
  status: 'unread' | 'read';
  timestamp: Date;
  actionRequired?: boolean;
}

export default function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample notifications data - only system and approval/report related
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "System Maintenance Scheduled",
      message: "Scheduled maintenance will begin in 30 minutes. Please save your work and log out.",
      type: "system",
      priority: "high",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      actionRequired: false
    },
    {
      id: "2",
      title: "Leave Request Approval Required",
      message: "John Doe has requested 3 days of leave from March 15-17. Your approval is required.",
      type: "approval",
      priority: "medium",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      actionRequired: true
    },
    {
      id: "3",
      title: "Monthly Report Generated",
      message: "March 2024 financial report has been generated and is ready for review.",
      type: "report",
      priority: "low",
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      actionRequired: false
    },
    {
      id: "4",
      title: "Database Backup Completed",
      message: "Daily database backup completed successfully at 2:00 AM.",
      type: "system",
      priority: "low",
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      actionRequired: false
    },
    {
      id: "5",
      title: "Expense Report Pending",
      message: "Sarah Wilson's expense report for $299.99 is pending your approval.",
      type: "approval",
      priority: "medium",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      actionRequired: true
    },
    {
      id: "6",
      title: "Security Alert",
      message: "Multiple failed login attempts detected from IP 192.168.1.100.",
      type: "system",
      priority: "high",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 300),
      actionRequired: false
    },
    {
      id: "7",
      title: "Quarterly Performance Review",
      message: "Q1 2024 performance review report is available for your review.",
      type: "report",
      priority: "medium",
      status: "read",
      timestamp: new Date(Date.now() - 1000 * 60 * 360),
      actionRequired: false
    },
    {
      id: "8",
      title: "New User Access Request",
      message: "Mike Johnson requests access to the Finance module. Approval needed.",
      type: "approval",
      priority: "medium",
      status: "unread",
      timestamp: new Date(Date.now() - 1000 * 60 * 420),
      actionRequired: true
    }
  ]);

  const filteredNotifications = notifications.filter(notification => 
    notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return <Bell className="h-5 w-5" />;
      case 'approval': return <UserCheck className="h-5 w-5" />;
      case 'report': return <FileText className="h-5 w-5" />;
      default: return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'approval': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'report': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const approvalCount = notifications.filter(n => n.type === 'approval' && n.status === 'unread').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-hidden mt-16 pl-0">
          <div className="h-full flex flex-col">
            {/* Header - Fixed height */}
            <div className="mb-8 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                  <p className="text-slate-600 mt-1">System alerts and approval requests</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <span>{unreadCount} unread</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4" />
                    <span>{approvalCount} pending approvals</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Search - Fixed height */}
            <div className="mb-6 flex-shrink-0">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notifications List - Scrollable area */}
            <div className="flex-1 overflow-auto">
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No notifications found</h3>
                    <p className="text-slate-500">Try adjusting your search.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow ${
                        notification.status === 'unread' ? 'border-l-4 border-l-blue-500' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg border ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-slate-900">{notification.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                            {notification.status === 'unread' && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                New
                              </span>
                            )}
                            {notification.actionRequired && (
                              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                Action Required
                              </span>
                            )}
                          </div>
                          <p className="text-slate-600 mb-2">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(notification.timestamp)}</span>
                            </span>
                            <span className="capitalize">{notification.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
