"use client"

import { useState, useEffect, useRef } from 'react'
import { 
  Send, 
  Plus, 
  Users, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Image as ImageIcon,
  Video,
  File,
  Smile,
  Phone,
  Video as VideoCall,
  Settings,
  Trash2,
  Edit,
  UserPlus,
  UserMinus,
  MessageCircle,
  Clock,
  Check,
  CheckCheck,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/AuthProvider'
import MemberManagementModal from '@/components/MemberManagementModal'
import {
  ChatGroup,
  ChatMessage,
  ChatUser,
  createChatGroup,
  getChatGroups,
  subscribeToChatGroups,
  sendMessage,
  getGroupMessages,
  subscribeToGroupMessages,
  getAllUsers,
  subscribeToUserStatus,
  markMessagesAsRead,
  updateChatGroup,
  deleteChatGroup,
  addMessageReaction,
  removeMessageReaction,
  getReactionSummary
} from '@/lib/chat-service'
import { callingService, CallState, CallParticipant } from '@/lib/calling-service'
import { getAllDepartments, Department } from '@/lib/firebase-service'
import VideoCallInterface from '@/components/VideoCallInterface'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  type: 'text' | 'image' | 'file'
  mediaUrl?: string
  isRead: boolean
}

interface Group {
  id: string
  name: string
  members: string[]
  lastMessage?: Message
  unreadCount: number
  type: 'temporary' | 'permanent'
  description?: string
}

export default function ChatPage() {
  const { user } = useAuth()
  const [groups, setGroups] = useState<ChatGroup[]>([])
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showMemberManagement, setShowMemberManagement] = useState(false)
  const [allUsers, setAllUsers] = useState<ChatUser[]>([])
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([])
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDescription, setNewGroupDescription] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [filteredUsers, setFilteredUsers] = useState<ChatUser[]>([])
  const [showGroupSettings, setShowGroupSettings] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editingGroupName, setEditingGroupName] = useState('')
  const [editingGroupDescription, setEditingGroupDescription] = useState('')
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    type: null,
    participants: [],
    localAudioEnabled: true,
    localVideoEnabled: true
  })
  const [showCallNotification, setShowCallNotification] = useState(false)
  const [incomingCall, setIncomingCall] = useState<{type: 'audio' | 'video', caller: string, callerName: string} | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Subscribe to chat groups
  useEffect(() => {
    if (!user?.uid) return

    const unsubscribe = subscribeToChatGroups(user.uid, (groups) => {
      setGroups(groups)
    })

    return () => unsubscribe()
  }, [user?.uid])

  // Subscribe to user status
  useEffect(() => {
    const unsubscribe = subscribeToUserStatus((users) => {
      setOnlineUsers(users.filter(u => u.isOnline))
    })

    return () => unsubscribe()
  }, [])

  // Load all users and departments for member selection
  useEffect(() => {
    const loadUsersAndDepartments = async () => {
      try {
        console.log('Loading users and departments for chat...')
        const [users, departmentsData] = await Promise.all([
          getAllUsers(),
          getAllDepartments()
        ])
        console.log('Loaded users:', users)
        console.log('Loaded departments:', departmentsData)
        setAllUsers(users)
        setDepartments(departmentsData)
      } catch (error) {
        console.error('Error loading users and departments:', error)
      }
    }
    loadUsersAndDepartments()
  }, [])

  // Filter users based on selected department
  useEffect(() => {
    console.log('Filtering users - selectedDepartment:', selectedDepartment)
    console.log('All users:', allUsers)
    
    if (selectedDepartment === 'all') {
      setFilteredUsers(allUsers)
    } else {
      // Find the department name by ID
      const selectedDept = departments.find(dept => dept.id === selectedDepartment)
      const departmentName = selectedDept?.name
      
      console.log('Selected department:', selectedDept)
      console.log('Department name to match:', departmentName)
      
      const filtered = allUsers.filter(user => {
        // Check if user has department information
        const userDepartment = (user as any).department
        console.log('User department check:', user.name, userDepartment, departmentName)
        return userDepartment === departmentName
      })
      setFilteredUsers(filtered)
    }
    
    console.log('Filtered users result:', filteredUsers)
  }, [allUsers, selectedDepartment, departments])

  // Subscribe to messages for selected group
  useEffect(() => {
    if (!selectedGroup) return

    const unsubscribe = subscribeToGroupMessages(selectedGroup.id, (messages) => {
      setMessages(messages)
      // Mark messages as read
      if (user?.uid) {
        markMessagesAsRead(selectedGroup.id, user.uid)
      }
    })

    return () => unsubscribe()
  }, [selectedGroup, user?.uid])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize calling service
  useEffect(() => {
    if (true) { // Temporarily disabled authentication
      // Set up call state callback
      callingService.setCallStateCallback((state) => {
        setCallState(state)
      })

      // Set up incoming call callback
      callingService.setIncomingCallCallback((call) => {
        setIncomingCall(call)
        setShowCallNotification(true)
      })

      // Initialize calling service
      callingService.initializeCall(
        user.uid,
        user.displayName || user.email || 'Unknown User'
      )
    }

    // Cleanup on unmount
    return () => {
      callingService.disconnect()
    }
  }, [user])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedGroup || !user) return

    try {
      await sendMessage({
        groupId: selectedGroup.id,
        content: newMessage,
        sender: {
          id: user.uid,
          name: user.displayName || user.email || 'Unknown User',
          role: 'user'
        },
        type: 'text',
        isRead: false
      })
      setNewMessage('')
      setIsTyping(false)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true)
      // In a real implementation, you would send typing status to other users
      // This would typically be done through a separate Firestore collection or WebSocket
    } else if (isTyping && !e.target.value.trim()) {
      setIsTyping(false)
    }
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || selectedUsers.length === 0 || !user) return

    try {
      const groupId = await createChatGroup({
        name: newGroupName,
        description: newGroupDescription,
        type: 'permanent',
        members: [user.uid, ...selectedUsers],
        createdBy: user.uid
      })
      
      setNewGroupName('')
      setNewGroupDescription('')
      setSelectedUsers([])
      setShowCreateGroup(false)
      
      // Select the newly created group
      const newGroup = groups.find(g => g.id === groupId)
      if (newGroup) {
        setSelectedGroup(newGroup)
      }
    } catch (error) {
      console.error('Error creating group:', error)
    }
  }

  const handleOpenGroupSettings = () => {
    if (selectedGroup) {
      setEditingGroupName(selectedGroup.name)
      setEditingGroupDescription(selectedGroup.description || '')
      setShowGroupSettings(true)
    }
  }

  const handleUpdateGroupSettings = async () => {
    if (!selectedGroup || !editingGroupName.trim()) return

    try {
      await updateChatGroup(selectedGroup.id, {
        name: editingGroupName,
        description: editingGroupDescription
      })
      
      setShowGroupSettings(false)
      setEditingGroupName('')
      setEditingGroupDescription('')
    } catch (error) {
      console.error('Error updating group settings:', error)
    }
  }

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return

    try {
      await deleteChatGroup(selectedGroup.id)
      setShowDeleteConfirm(false)
      setSelectedGroup(null)
    } catch (error) {
      console.error('Error deleting group:', error)
    }
  }

  const handleStartCall = async (type: 'audio' | 'video') => {
    if (!selectedGroup || !user) return

    try {
      console.log(`Starting ${type} call for group: ${selectedGroup.name}`)
      
      // Initialize calling service
      await callingService.initializeCall(
        user.uid, 
        user.displayName || user.email || 'Unknown User'
      )

      // Start the call
      const participants = [user.uid, ...selectedGroup.members.filter(id => id !== user.uid)]
      await callingService.startCall(type, participants, selectedGroup.id)
      
    } catch (error) {
      console.error('Error starting call:', error)
      alert('Failed to start call. Please check your microphone and camera permissions.')
    }
  }

  const handleEndCall = () => {
    console.log('Ending call')
    callingService.endCall()
  }

  const handleJoinCall = async () => {
    if (!user || !incomingCall) return
    
    try {
      console.log('Joining existing call')
      
      // Initialize calling service
      await callingService.initializeCall(
        user.uid, 
        user.displayName || user.email || 'Unknown User'
      )

      // Join the call
      await callingService.joinCall(
        `call_${Date.now()}`, // In real app, this would be the actual call ID
        user.uid,
        user.displayName || user.email || 'Unknown User'
      )
      
    } catch (error) {
      console.error('Error joining call:', error)
      alert('Failed to join call. Please check your microphone and camera permissions.')
    }
  }

  const handleAcceptCall = async () => {
    if (!incomingCall || !user) return
    
    try {
      // Initialize calling service
      await callingService.initializeCall(
        user.uid, 
        user.displayName || user.email || 'Unknown User'
      )

      // Accept the call
      callingService.acceptCall(incomingCall.caller, {})
      
      setShowCallNotification(false)
      setIncomingCall(null)
    } catch (error) {
      console.error('Error accepting call:', error)
      alert('Failed to accept call.')
    }
  }

  const handleRejectCall = () => {
    if (!incomingCall) return
    
    callingService.rejectCall(incomingCall.caller)
    setShowCallNotification(false)
    setIncomingCall(null)
  }

  const quickReplies = [
    "Thanks!",
    "Got it!",
    "Will do!",
    "On it!",
    "Perfect!",
    "👍",
    "Great!",
    "Noted!"
  ]

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply)
    setShowQuickReplies(false)
  }

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!user) return

    try {
      const message = messages.find(m => m.id === messageId)
      if (!message) return

      // Check if user already reacted with this emoji
      const hasReacted = message.reactions?.some(reaction => 
        reaction.emoji === emoji && reaction.userId === user.uid
      )

      if (hasReacted) {
        // Remove reaction
        await removeMessageReaction(messageId, emoji, user.uid)
      } else {
        // Add reaction
        await addMessageReaction(
          messageId, 
          emoji, 
          user.uid, 
          user.displayName || user.email || 'Unknown User'
        )
      }
    } catch (error) {
      console.error('Error handling reaction:', error)
    }
  }

  const getReactionDisplay = (message: ChatMessage) => {
    if (!message.reactions || message.reactions.length === 0) return null
    
    const summary = getReactionSummary(message.reactions)
    const reactionEntries = Object.entries(summary)
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {reactionEntries.map(([emoji, data]) => (
          <div
            key={emoji}
            className="flex items-center space-x-1 bg-slate-100 rounded-full px-2 py-1 text-xs cursor-pointer hover:bg-slate-200"
            title={`${data.users.join(', ')} reacted with ${emoji}`}
          >
            <span>{emoji}</span>
            <span className="text-slate-600">{data.count}</span>
          </div>
        ))}
      </div>
    )
  }

  const hasUserReacted = (message: ChatMessage, emoji: string) => {
    if (!user || !message.reactions) return false
    return message.reactions.some(reaction => 
      reaction.emoji === emoji && reaction.userId === user.uid
    )
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedGroup || !user) return

    // For now, we'll just send a text message about the file
    // In a real implementation, you'd upload to Firebase Storage
    const message = `Sent file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`
    setNewMessage(message)
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.history.back()}
                className="hover:bg-slate-100"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
            </div>
            <Button
              onClick={() => {
                console.log('Create group button clicked')
                console.log('Current allUsers:', allUsers)
                setShowCreateGroup(true)
              }}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="flex-1 overflow-y-auto">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                selectedGroup?.id === group.id ? 'bg-orange-50 border-orange-200' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-600 font-semibold">
                    {getInitials(group.name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900 truncate">
                      {group.name}
                    </h3>
                    {group.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {group.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {group.lastMessage?.content || 'No messages yet'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {group.lastMessage ? formatTime(group.lastMessage.timestamp) : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredGroups.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <MessageCircle className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p>No conversations found</p>
            </div>
          )}
        </div>

        {/* Online Users */}
        <div className="p-4 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Online ({onlineUsers.length})</h3>
          <div className="space-y-2">
            {onlineUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xs font-semibold">
                    {getInitials(user.name)}
                  </span>
                </div>
                <span className="text-xs text-slate-600 truncate">{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedGroup ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-semibold">
                      {getInitials(selectedGroup.name)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{selectedGroup.name}</h2>
                    <p className="text-sm text-slate-500">
                      {selectedGroup.members.length} members • {selectedGroup.type}
                    </p>
                    {callState.isActive && (
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-600 font-medium">
                            {callState.type === 'video' ? 'Video Call' : 'Audio Call'} Active
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {callState.participants.length} participants
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!callState.isActive ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleStartCall('audio')}
                        className="hover:bg-green-50 hover:text-green-600"
                        title="Start Audio Call"
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleStartCall('video')}
                        className="hover:bg-blue-50 hover:text-blue-600"
                        title="Start Video Call"
                      >
                        <VideoCall className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => callingService.toggleAudio()}
                        className={callState.localAudioEnabled ? "hover:bg-green-50 hover:text-green-600" : "bg-red-50 text-red-600"}
                        title={callState.localAudioEnabled ? "Mute Audio" : "Unmute Audio"}
                      >
                        {callState.localAudioEnabled ? <Phone className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                      </Button>
                      {callState.type === 'video' && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => callingService.toggleVideo()}
                          className={callState.localVideoEnabled ? "hover:bg-blue-50 hover:text-blue-600" : "bg-red-50 text-red-600"}
                          title={callState.localVideoEnabled ? "Turn Off Video" : "Turn On Video"}
                        >
                          <VideoCall className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleEndCall}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        End Call
                      </Button>
                    </>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setShowMemberManagement(true)}>
                        <Users className="h-4 w-4 mr-2" />
                        Manage Members
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleOpenGroupSettings}>
                        <Settings className="h-4 w-4 mr-2" />
                        Group Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.sender.id === user?.uid
                const showDate = index === 0 || 
                  formatDate(message.timestamp) !== formatDate(messages[index - 1]?.timestamp)
                
                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {formatDate(message.timestamp)}
                        </Badge>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        {!isOwnMessage && (
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                              <span className="text-slate-600 text-xs font-semibold">
                                {getInitials(message.sender.name)}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">{message.sender.name}</span>
                          </div>
                        )}
                        
                        <div className={`p-3 rounded-lg ${
                          isOwnMessage 
                            ? 'bg-orange-500 text-white' 
                            : 'bg-white border border-slate-200'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          
                          {/* Reaction Display */}
                          {getReactionDisplay(message)}
                          
                          <div className={`flex items-center justify-between mt-2 ${
                            isOwnMessage ? 'text-orange-100' : 'text-slate-400'
                          }`}>
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 hover:bg-slate-100 ${
                                  hasUserReacted(message, '👍') ? 'bg-blue-100 text-blue-600' : ''
                                }`}
                                title="React with 👍"
                                onClick={() => handleReaction(message.id, '👍')}
                              >
                                <span className="text-xs">👍</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 hover:bg-slate-100 ${
                                  hasUserReacted(message, '❤️') ? 'bg-red-100 text-red-600' : ''
                                }`}
                                title="React with ❤️"
                                onClick={() => handleReaction(message.id, '❤️')}
                              >
                                <span className="text-xs">❤️</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`h-6 w-6 p-0 hover:bg-slate-100 ${
                                  hasUserReacted(message, '😊') ? 'bg-yellow-100 text-yellow-600' : ''
                                }`}
                                title="React with 😊"
                                onClick={() => handleReaction(message.id, '😊')}
                              >
                                <span className="text-xs">😊</span>
                              </Button>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">{formatTime(message.timestamp)}</span>
                              {isOwnMessage && (
                                message.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              {typingUsers.length > 0 && (
                <div className="mb-2 px-3 py-1 bg-slate-50 rounded-lg">
                  <span className="text-xs text-slate-500">
                    {typingUsers.length === 1 
                      ? `${typingUsers[0]} is typing...`
                      : `${typingUsers.length} people are typing...`
                    }
                  </span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuickReplies(!showQuickReplies)}
                  title="Quick replies"
                >
                  <span className="text-sm">⚡</span>
                </Button>
                <Input
                  value={newMessage}
                  onChange={handleTyping}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                  title="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {showQuickReplies && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {quickReplies.map((reply, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs"
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Select a conversation</h3>
              <p className="text-slate-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <Dialog open={showCreateGroup} onOpenChange={(open) => {
        console.log('Dialog open state changed:', open)
        setShowCreateGroup(open)
        if (open) {
          // Reset filters when dialog opens
          setSelectedDepartment('all')
          setSelectedUsers([])
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Group Name</label>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Enter group description"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Filter by Department</label>
              <Select value={selectedDepartment} onValueChange={(value) => {
                console.log('Department selection changed:', value)
                setSelectedDepartment(value)
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDepartment !== 'all' && (
                <p className="text-xs text-slate-500 mt-1">
                  Showing employees from: {departments.find(d => d.id === selectedDepartment)?.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Add Members</label>
              <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-4 text-slate-500">
                    <p className="text-sm">
                      {selectedDepartment === 'all' 
                        ? 'No users available' 
                        : 'No users in selected department'
                      }
                    </p>
                    <p className="text-xs">
                      {selectedDepartment === 'all' 
                        ? 'Add employees in the HR section first' 
                        : 'Try selecting a different department or all employees'
                      }
                    </p>
                  </div>
                ) : (
                  filteredUsers
                    .filter(u => u.id !== user?.uid)
                    .map((user) => (
                      <div
                        key={user.id}
                        className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                          selectedUsers.includes(user.id) 
                            ? 'bg-orange-50 border border-orange-200' 
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => {
                          setSelectedUsers(prev => 
                            prev.includes(user.id) 
                              ? prev.filter(id => id !== user.id)
                              : [...prev, user.id]
                          )
                        }}
                      >
                        <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-slate-600 text-xs font-semibold">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <span className="text-sm">{user.name}</span>
                        {(user as any).department && (
                          <span className="text-xs text-slate-500 ml-auto">
                            {(user as any).department}
                          </span>
                        )}
                        {selectedUsers.includes(user.id) && (
                          <Check className="h-4 w-4 text-orange-500 ml-auto" />
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm font-medium text-orange-800 mb-2">
                  Selected Members ({selectedUsers.length})
                </p>
                <div className="space-y-1">
                  {selectedUsers.map(userId => {
                    const user = filteredUsers.find(u => u.id === userId)
                    return user ? (
                      <div key={userId} className="flex items-center space-x-2 text-sm">
                        <div className="h-4 w-4 rounded-full bg-orange-200 flex items-center justify-center">
                          <span className="text-orange-600 text-xs font-semibold">
                            {getInitials(user.name)}
                          </span>
                        </div>
                        <span className="text-orange-700">{user.name}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                console.log('Create Group button clicked')
                console.log('Group name:', newGroupName)
                console.log('Selected users:', selectedUsers)
                console.log('Filtered users:', filteredUsers)
                handleCreateGroup()
              }}
              disabled={!newGroupName.trim() || selectedUsers.length === 0}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Create Group
              {!newGroupName.trim() && <span className="ml-2 text-xs">(Enter group name)</span>}
              {newGroupName.trim() && selectedUsers.length === 0 && <span className="ml-2 text-xs">(Select members)</span>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Management Modal */}
      {selectedGroup && (
        <MemberManagementModal
          isOpen={showMemberManagement}
          onClose={() => setShowMemberManagement(false)}
          groupId={selectedGroup.id}
          currentMembers={selectedGroup.members}
          groupName={selectedGroup.name}
        />
      )}

      {/* Group Settings Modal */}
      <Dialog open={showGroupSettings} onOpenChange={setShowGroupSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Group Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Group Name</label>
              <Input
                value={editingGroupName}
                onChange={(e) => setEditingGroupName(e.target.value)}
                placeholder="Enter group name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Description (Optional)</label>
              <Input
                value={editingGroupDescription}
                onChange={(e) => setEditingGroupDescription(e.target.value)}
                placeholder="Enter group description"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowGroupSettings(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateGroupSettings}
              disabled={!editingGroupName.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete "{selectedGroup?.name}"?</h3>
                <p className="text-sm text-slate-500">
                  This action cannot be undone. All messages and member data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteGroup}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Group
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Incoming Call Modal */}
      <Dialog open={showCallNotification} onOpenChange={setShowCallNotification}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Incoming Call</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                {incomingCall?.type === 'video' ? (
                  <VideoCall className="h-6 w-6 text-green-600" />
                ) : (
                  <Phone className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {incomingCall?.type === 'video' ? 'Video Call' : 'Audio Call'}
                </h3>
                <p className="text-sm text-slate-500">
                  Incoming call from {incomingCall?.callerName || incomingCall?.caller}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={handleRejectCall}
              className="bg-red-50 text-red-600 hover:bg-red-100"
            >
              Decline
            </Button>
            <Button
              onClick={handleAcceptCall}
              className="bg-green-600 hover:bg-green-700"
            >
              Accept
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Call Interface */}
      {callState.isActive && callState.type === 'video' && (
        <VideoCallInterface
          participants={callState.participants}
          localAudioEnabled={callState.localAudioEnabled}
          localVideoEnabled={callState.localVideoEnabled}
          onToggleAudio={() => callingService.toggleAudio()}
          onToggleVideo={() => callingService.toggleVideo()}
          onEndCall={handleEndCall}
        />
      )}
    </div>
  )
} 