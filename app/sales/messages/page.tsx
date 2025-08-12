'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft,
  Mail,
  MessageSquare,
  Phone,
  Users,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Send,
  Archive,
  Tag,
  MoreHorizontal,
  Reply,
  Forward,
  Star,
  Trash2,
  Eye,
  MessageCircle,
  Smartphone,
  Globe,
  Building2
} from 'lucide-react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  platform: string
  sender: string
  senderEmail?: string
  senderPhone?: string
  subject: string
  content: string
  timestamp: string
  status: 'unread' | 'read' | 'replied' | 'archived'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'inquiry' | 'support' | 'sales' | 'complaint' | 'feedback' | 'general'
  assignedTo?: string
  tags: string[]
  isStarred: boolean
}

export default function UnifiedMessagesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('inbox')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [replyContent, setReplyContent] = useState('')

  // Mock messages from different platforms
  const messages: Message[] = [
    {
      id: '1',
      platform: 'whatsapp',
      sender: 'John Smith',
      senderPhone: '+255 712 345 678',
      subject: 'Product Inquiry',
      content: 'Hi, I\'m interested in your software solutions. Can you tell me more about your pricing?',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'unread',
      priority: 'high',
      category: 'inquiry',
      assignedTo: 'Sarah Johnson',
      tags: ['pricing', 'software'],
      isStarred: false
    },
    {
      id: '2',
      platform: 'facebook',
      sender: 'Maria Garcia',
      senderEmail: 'maria.garcia@email.com',
      subject: 'Customer Support',
      content: 'I\'ve been having issues with my account login. Can you help me reset my password?',
      timestamp: '2024-01-20T09:15:00Z',
      status: 'read',
      priority: 'medium',
      category: 'support',
      assignedTo: 'Mike Wilson',
      tags: ['login', 'password'],
      isStarred: true
    },
    {
      id: '3',
      platform: 'instagram',
      sender: 'David Brown',
      subject: 'Partnership Opportunity',
      content: 'Love your products! Would love to discuss a potential partnership for our upcoming event.',
      timestamp: '2024-01-20T08:45:00Z',
      status: 'unread',
      priority: 'high',
      category: 'sales',
      tags: ['partnership', 'event'],
      isStarred: false
    },
    {
      id: '4',
      platform: 'email',
      sender: 'Lisa Chen',
      senderEmail: 'lisa.chen@company.com',
      subject: 'Order Status Update',
      content: 'I placed an order last week and haven\'t received any updates. Order #12345',
      timestamp: '2024-01-20T07:30:00Z',
      status: 'replied',
      priority: 'medium',
      category: 'support',
      assignedTo: 'Emma Davis',
      tags: ['order', 'status'],
      isStarred: false
    },
    {
      id: '5',
      platform: 'twitter',
      sender: '@tech_enthusiast',
      subject: 'Feature Request',
      content: 'Would be great to have mobile app support for your platform!',
      timestamp: '2024-01-20T06:20:00Z',
      status: 'read',
      priority: 'low',
      category: 'feedback',
      tags: ['mobile', 'app'],
      isStarred: false
    },
    {
      id: '6',
      platform: 'linkedin',
      sender: 'Robert Wilson',
      senderEmail: 'robert.wilson@enterprise.com',
      subject: 'Enterprise Solution',
      content: 'Looking for enterprise-level solutions for our 500+ employee company.',
      timestamp: '2024-01-20T05:10:00Z',
      status: 'unread',
      priority: 'urgent',
      category: 'sales',
      assignedTo: 'Sarah Johnson',
      tags: ['enterprise', 'large-scale'],
      isStarred: true
    }
  ]

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: <Globe className="h-4 w-4" />, color: 'text-gray-600' },
    { id: 'whatsapp', name: 'WhatsApp', icon: <Smartphone className="h-4 w-4" />, color: 'text-green-600' },
    { id: 'facebook', name: 'Facebook', icon: <Users className="h-4 w-4" />, color: 'text-blue-600' },
    { id: 'instagram', name: 'Instagram', icon: <MessageCircle className="h-4 w-4" />, color: 'text-pink-600' },
    { id: 'twitter', name: 'Twitter/X', icon: <MessageSquare className="h-4 w-4" />, color: 'text-black' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Building2 className="h-4 w-4" />, color: 'text-blue-700' },
    { id: 'email', name: 'Email', icon: <Mail className="h-4 w-4" />, color: 'text-gray-600' }
  ]

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    return platform ? platform.icon : <MessageSquare className="h-4 w-4" />
  }

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId)
    return platform ? platform.color : 'text-gray-600'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-gray-100 text-gray-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPlatform = selectedPlatform === 'all' || message.platform === selectedPlatform
    return matchesSearch && matchesPlatform
  })

  const unreadCount = messages.filter(m => m.status === 'unread').length
  const urgentCount = messages.filter(m => m.priority === 'urgent').length

  const handleReply = () => {
    if (replyContent.trim() && selectedMessage) {
      console.log('Sending reply:', replyContent)
      setReplyContent('')
      // Here you would typically send the reply via API
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <Sidebar />
      <div className="ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 mt-16">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col gap-4">
              {/* Back Button */}
              <div className="flex justify-start">
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Sales
                </Button>
              </div>
              
              {/* Page Title */}
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Unified Messages</h1>
                <p className="text-slate-600 mt-1 text-base">Centralized inbox for all platform messages</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {urgentCount} Urgent
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {unreadCount} Unread
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Messages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center gap-2">
                              <div className={platform.color}>
                                {platform.icon}
                              </div>
                              {platform.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          selectedMessage?.id === message.id
                            ? 'border-blue-500 bg-blue-50'
                            : message.status === 'unread'
                            ? 'border-slate-200 bg-white hover:bg-slate-50'
                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100'
                        }`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`${getPlatformColor(message.platform)} mt-1`}>
                            {getPlatformIcon(message.platform)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{message.sender}</p>
                              {message.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm font-medium text-slate-900 mb-1 truncate">
                              {message.subject}
                            </p>
                            <p className="text-xs text-slate-600 mb-2 line-clamp-2">
                              {message.content}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${getPriorityColor(message.priority)}`}>
                                {message.priority}
                              </Badge>
                              <Badge className={`text-xs ${getStatusColor(message.status)}`}>
                                {message.status}
                              </Badge>
                              <span className="text-xs text-slate-500 ml-auto">
                                {formatDate(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    Message Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMessage ? (
                    <div className="space-y-6">
                      {/* Message Header */}
                      <div className="border-b pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`${getPlatformColor(selectedMessage.platform)}`}>
                              {getPlatformIcon(selectedMessage.platform)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{selectedMessage.sender}</h3>
                              <p className="text-sm text-slate-600">
                                {selectedMessage.senderEmail || selectedMessage.senderPhone}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <Badge className={getPriorityColor(selectedMessage.priority)}>
                            {selectedMessage.priority} Priority
                          </Badge>
                          <Badge className={getStatusColor(selectedMessage.status)}>
                            {selectedMessage.status}
                          </Badge>
                          <Badge variant="outline">
                            {selectedMessage.category}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {formatDate(selectedMessage.timestamp)}
                          </span>
                        </div>

                        <h4 className="font-semibold text-lg mb-2">{selectedMessage.subject}</h4>
                        
                        {selectedMessage.tags.length > 0 && (
                          <div className="flex items-center gap-2 mb-3">
                            <Tag className="h-4 w-4 text-slate-400" />
                            {selectedMessage.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-slate-800 whitespace-pre-wrap">{selectedMessage.content}</p>
                      </div>

                      {/* Reply Section */}
                      <div className="space-y-3">
                        <h4 className="font-semibold">Reply</h4>
                        <Textarea
                          placeholder="Type your reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={4}
                        />
                        <div className="flex items-center gap-2">
                          <Button onClick={handleReply} className="bg-blue-500 hover:bg-blue-600">
                            <Send className="h-4 w-4 mr-2" />
                            Send Reply
                          </Button>
                          <Button variant="outline">
                            <Forward className="h-4 w-4 mr-2" />
                            Forward
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">Select a message to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
