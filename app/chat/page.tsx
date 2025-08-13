'use client'

import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  type: 'text' | 'file' | 'image'
  fileUrl?: string
  fileName?: string
}

interface ChatGroup {
  id: string
  name: string
  type: 'direct' | 'group'
  members: string[]
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

interface Employee {
  id: string
  name: string
  email: string
  department: string
  position: string
  avatar?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedGroup, setSelectedGroup] = useState<ChatGroup | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showEmployeeList, setShowEmployeeList] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample employees data
  const [employees] = useState<Employee[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@company.com', department: 'Engineering', position: 'Senior Developer' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Design', position: 'UI/UX Designer' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Marketing', position: 'Marketing Manager' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Sales', position: 'Sales Representative' },
    { id: '5', name: 'David Brown', email: 'david.brown@company.com', department: 'Engineering', position: 'Frontend Developer' },
    { id: '6', name: 'Lisa Davis', email: 'lisa.davis@company.com', department: 'HR', position: 'HR Specialist' },
    { id: '7', name: 'Tom Anderson', email: 'tom.anderson@company.com', department: 'Finance', position: 'Financial Analyst' },
    { id: '8', name: 'Emily Taylor', email: 'emily.taylor@company.com', department: 'Design', position: 'Graphic Designer' }
  ])

  // Sample data
  const [groups, setGroups] = useState<ChatGroup[]>([
    {
      id: '1',
      name: 'General Team',
      type: 'group',
      members: ['John Doe', 'Jane Smith', 'Mike Johnson'],
      lastMessage: 'Great work everyone!',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Project Alpha',
      type: 'group',
      members: ['John Doe', 'Sarah Wilson'],
      lastMessage: 'Meeting at 3 PM',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60),
      unreadCount: 0
    },
    {
      id: '3',
      name: 'John Doe',
      type: 'direct',
      members: ['John Doe'],
      lastMessage: 'Thanks for the update',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 120),
      unreadCount: 1
    }
  ])

  const [sampleMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello everyone! How are you doing?',
      sender: 'John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'text'
    },
    {
      id: '2',
      text: 'I\'m doing great! Working on the new feature.',
      sender: 'Jane Smith',
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: 'text'
    },
    {
      id: '3',
      text: 'Great work everyone!',
      sender: 'Mike Johnson',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
      type: 'text'
    }
  ])

  useEffect(() => {
    if (selectedGroup) {
      setMessages(sampleMessages)
    }
  }, [selectedGroup])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedGroup) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'You',
        timestamp: new Date(),
        type: 'text'
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && selectedGroup) {
      const message: Message = {
        id: Date.now().toString(),
        text: `File: ${file.name}`,
        sender: 'You',
        timestamp: new Date(),
        type: 'file',
        fileName: file.name,
        fileUrl: URL.createObjectURL(file)
      }
      setMessages(prev => [...prev, message])
    }
  }

  const handleCreateGroup = () => {
    if (newGroupName.trim() && selectedMembers.length > 0) {
      const newGroup: ChatGroup = {
        id: Date.now().toString(),
        name: newGroupName,
        type: 'group',
        members: selectedMembers,
        unreadCount: 0
      }
      setGroups(prev => [newGroup, ...prev])
      setNewGroupName('')
      setSelectedMembers([])
      setShowCreateGroup(false)
      setSelectedGroup(newGroup)
    }
  }

  const handleStartDirectChat = (employee: Employee) => {
    // Check if direct chat already exists
    const existingChat = groups.find(group => 
      group.type === 'direct' && group.members.includes(employee.name)
    )
    
    if (existingChat) {
      setSelectedGroup(existingChat)
    } else {
      const newDirectChat: ChatGroup = {
        id: Date.now().toString(),
        name: employee.name,
        type: 'direct',
        members: [employee.name],
        unreadCount: 0
      }
      setGroups(prev => [newDirectChat, ...prev])
      setSelectedGroup(newDirectChat)
    }
    setShowEmployeeList(false)
  }

  const toggleMemberSelection = (memberName: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberName) 
        ? prev.filter(name => name !== memberName)
        : [...prev, memberName]
    )
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays > 1) return date.toLocaleDateString()
    return formatTime(date)
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64 h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex mt-16 pl-6 pr-6">
          {/* Chat Groups Sidebar */}
          <div className="w-80 bg-white border-r border-slate-200 flex flex-col rounded-lg shadow-sm">
            {/* Header with Create Group and New Chat buttons */}
            <div className="p-4 border-b border-slate-200">
              <div className="flex space-x-2 mb-3">
                <button
                  onClick={() => setShowCreateGroup(true)}
                  className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Create Group
                </button>
                <button
                  onClick={() => setShowEmployeeList(true)}
                  className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  New Chat
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Groups List */}
            <div className="flex-1 overflow-y-auto">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedGroup?.id === group.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {getInitials(group.name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {group.name}
                        </h3>
                        {group.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {group.unreadCount}
                          </span>
                        )}
                      </div>
                      {group.lastMessage && (
                        <p className="text-sm text-slate-500 truncate">
                          {group.lastMessage}
                        </p>
                      )}
                      {group.lastMessageTime && (
                        <p className="text-xs text-slate-400">
                          {formatDate(group.lastMessageTime)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedGroup ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {getInitials(selectedGroup.name)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                          {selectedGroup.name}
                        </h2>
                        <p className="text-sm text-slate-500">
                          {selectedGroup.members.length} members • {selectedGroup.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'You'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      >
                        {message.type === 'file' ? (
                          <div className="flex items-center space-x-2">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium">{message.fileName}</span>
                          </div>
                        ) : (
                          <p className="text-sm">{message.text}</p>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.sender === 'You' ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => {
                          setNewMessage(e.target.value)
                          setIsTyping(e.target.value.length > 0)
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={1}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  {isTyping && (
                    <p className="text-xs text-slate-500 mt-2">Typing...</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No conversation selected</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose a conversation from the sidebar to start chatting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Group Modal */}
        {showCreateGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Create New Group</h2>
                <button
                  onClick={() => setShowCreateGroup(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Enter group name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Select Members
                  </label>
                  <div className="max-h-48 overflow-y-auto border border-slate-300 rounded-lg p-2">
                    {employees.map((employee) => (
                      <label key={employee.id} className="flex items-center space-x-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(employee.name)}
                          onChange={() => toggleMemberSelection(employee.name)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{employee.name}</p>
                          <p className="text-xs text-slate-500">{employee.position} • {employee.department}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCreateGroup(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateGroup}
                    disabled={!newGroupName.trim() || selectedMembers.length === 0}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Create Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Employee List Modal */}
        {showEmployeeList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Start New Chat</h2>
                <button
                  onClick={() => setShowEmployeeList(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Search Tab */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2">
                {employees
                  .filter(employee => 
                    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((employee) => (
                  <div
                    key={employee.id}
                    onClick={() => handleStartDirectChat(employee)}
                    className="flex items-center space-x-3 p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {getInitials(employee.name)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{employee.name}</p>
                      <p className="text-xs text-slate-500">{employee.position} • {employee.department}</p>
                    </div>
                  </div>
                ))}
                
                {/* No results message */}
                {employees.filter(employee => 
                  employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  employee.position.toLowerCase().includes(searchQuery.toLowerCase())
                ).length === 0 && searchQuery && (
                  <div className="text-center py-8">
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
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">No employees found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Try searching with a different term.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
