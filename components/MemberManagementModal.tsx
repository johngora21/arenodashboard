"use client"

import { useState, useEffect } from 'react'
import { X, Plus, Minus, Search, User, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ChatUser, getAllUsers, addMembersToGroup, removeMembersFromGroup } from '@/lib/chat-service'

interface MemberManagementModalProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
  currentMembers: string[]
  groupName: string
}

export default function MemberManagementModal({
  isOpen,
  onClose,
  groupId,
  currentMembers,
  groupName
}: MemberManagementModalProps) {
  const [allUsers, setAllUsers] = useState<ChatUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadUsers()
    }
  }, [isOpen])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const users = await getAllUsers()
      setAllUsers(users)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const availableUsers = filteredUsers.filter(user => !currentMembers.includes(user.id))

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return

    try {
      setLoading(true)
      await addMembersToGroup(groupId, selectedUsers)
      setSelectedUsers([])
      onClose()
    } catch (error) {
      console.error('Error adding members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    try {
      setLoading(true)
      await removeMembersFromGroup(groupId, [userId])
    } catch (error) {
      console.error('Error removing member:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Manage Members - {groupName}</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full">
          {/* Current Members */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Current Members ({currentMembers.length})</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {allUsers
                .filter(user => currentMembers.includes(user.id))
                .map(user => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-xs">
                          {getInitials(user.name)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.isOnline ? "default" : "secondary"} className="text-xs">
                        {user.isOnline ? 'Online' : 'Offline'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveMember(user.id)}
                        disabled={loading}
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Add New Members */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Add New Members</h3>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="pl-10"
              />
            </div>

            {/* Available Users */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {availableUsers.map(user => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id) 
                      ? 'bg-orange-50 border border-orange-200' 
                      : 'hover:bg-slate-50'
                  }`}
                  onClick={() => toggleUserSelection(user.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <span className="text-slate-600 font-semibold text-xs">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email} • {user.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.isOnline ? "default" : "secondary"} className="text-xs">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </Badge>
                    {selectedUsers.includes(user.id) && (
                      <Check className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
              
              {availableUsers.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <User className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm">No users available to add</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMembers} 
              disabled={selectedUsers.length === 0 || loading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {selectedUsers.length} Member{selectedUsers.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 