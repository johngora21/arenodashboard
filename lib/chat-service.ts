import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase-config'
import { getAllEmployees } from './firebase-service'
import { emailService } from './email-service'

export interface MessageReaction {
  emoji: string
  userId: string
  userName: string
  timestamp: Timestamp
}

export interface ChatMessage {
  id: string
  groupId: string
  sender: {
    id: string
    name: string
    role: string
  }
  content: string
  timestamp: Timestamp
  type: 'text' | 'image' | 'video' | 'file' | 'document'
  mediaUrl?: string
  fileName?: string
  fileSize?: string
  isRead: boolean
  reactions?: MessageReaction[]
}

export interface ChatGroup {
  id: string
  name: string
  type: 'temporary' | 'permanent'
  members: string[]
  lastMessage?: ChatMessage
  unreadCount: number
  description?: string
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ChatUser {
  id: string
  name: string
  email: string
  role: string
  department: string
  isOnline: boolean
  lastSeen: Timestamp
}

// Create a new chat group
export const createChatGroup = async (groupData: Omit<ChatGroup, 'id' | 'createdAt' | 'updatedAt' | 'lastMessage' | 'unreadCount'>) => {
  try {
    const groupRef = await addDoc(collection(db, 'chatGroups'), {
      ...groupData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      unreadCount: 0
    })
    return groupRef.id
  } catch (error) {
    console.error('Error creating chat group:', error)
    throw error
  }
}

// Get all chat groups for a user
export const getChatGroups = async (userId: string) => {
  try {
    const groupsRef = collection(db, 'chatGroups')
    const q = query(groupsRef, where('members', 'array-contains', userId), orderBy('updatedAt', 'desc'))
    const querySnapshot = await getDocs(q)
    
    const groups: ChatGroup[] = []
    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data()
      } as ChatGroup)
    })
    
    return groups
  } catch (error) {
    console.error('Error fetching chat groups:', error)
    throw error
  }
}

// Get real-time updates for chat groups
export const subscribeToChatGroups = (userId: string, callback: (groups: ChatGroup[]) => void) => {
  const groupsRef = collection(db, 'chatGroups')
  const q = query(groupsRef, where('members', 'array-contains', userId), orderBy('updatedAt', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const groups: ChatGroup[] = []
    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data()
      } as ChatGroup)
    })
    callback(groups)
  })
}

// Add members to a chat group
export const addMembersToGroup = async (groupId: string, memberIds: string[]) => {
  try {
    const groupRef = doc(db, 'chatGroups', groupId)
    await updateDoc(groupRef, {
      members: arrayUnion(...memberIds),
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error adding members to group:', error)
    throw error
  }
}

// Remove members from a chat group
export const removeMembersFromGroup = async (groupId: string, memberIds: string[]) => {
  try {
    const groupRef = doc(db, 'chatGroups', groupId)
    await updateDoc(groupRef, {
      members: arrayRemove(...memberIds),
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error removing members from group:', error)
    throw error
  }
}

// Update group details
export const updateChatGroup = async (groupId: string, updates: Partial<ChatGroup>) => {
  try {
    const groupRef = doc(db, 'chatGroups', groupId)
    await updateDoc(groupRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating chat group:', error)
    throw error
  }
}

// Delete a chat group
export const deleteChatGroup = async (groupId: string) => {
  try {
    await deleteDoc(doc(db, 'chatGroups', groupId))
  } catch (error) {
    console.error('Error deleting chat group:', error)
    throw error
  }
}

// Send a message to a group
export const sendMessage = async (messageData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
  try {
    const messageRef = await addDoc(collection(db, 'chatMessages'), {
      ...messageData,
      timestamp: serverTimestamp()
    })
    
    // Update the group's last message and unread count
    const groupRef = doc(db, 'chatGroups', messageData.groupId)
    await updateDoc(groupRef, {
      lastMessage: {
        id: messageRef.id,
        content: messageData.content,
        timestamp: serverTimestamp(),
        sender: messageData.sender
      },
      unreadCount: messageData.isRead ? 0 : 1,
      updatedAt: serverTimestamp()
    })

    // Send emails to group members (excluding the sender)
    try {
      const groupDoc = await getDoc(groupRef)
      if (groupDoc.exists()) {
        const groupData = groupDoc.data() as ChatGroup
        const allUsers = await getAllUsers()
        
        // Get group members excluding the sender
        const recipients = allUsers.filter(user => 
          groupData.members.includes(user.id) && user.id !== messageData.sender.id
        )

        // Send email to each recipient
        for (const recipient of recipients) {
          try {
            await emailService.sendGroupMessageEmail(
              messageData.sender.name,
              messageData.sender.name, // Using name as email for now
              recipient.email,
              recipient.name,
              messageData.content,
              groupData.name
            )
            console.log(`Email sent to ${recipient.name} (${recipient.email})`)
          } catch (emailError) {
            console.error(`Failed to send email to ${recipient.email}:`, emailError)
            // Continue with other recipients even if one fails
          }
        }
      }
    } catch (emailError) {
      console.error('Error sending emails:', emailError)
      // Don't fail the message sending if email fails
    }
    
    return messageRef.id
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

// Get messages for a group
export const getGroupMessages = async (groupId: string) => {
  try {
    const messagesRef = collection(db, 'chatMessages')
    const q = query(messagesRef, where('groupId', '==', groupId), orderBy('timestamp', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const messages: ChatMessage[] = []
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ChatMessage)
    })
    
    return messages
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

// Subscribe to real-time messages for a group
export const subscribeToGroupMessages = (groupId: string, callback: (messages: ChatMessage[]) => void) => {
  const messagesRef = collection(db, 'chatMessages')
  const q = query(messagesRef, where('groupId', '==', groupId), orderBy('timestamp', 'asc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const messages: ChatMessage[] = []
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      } as ChatMessage)
    })
    callback(messages)
  })
}

// Mark messages as read
export const markMessagesAsRead = async (groupId: string, userId: string) => {
  try {
    const groupRef = doc(db, 'chatGroups', groupId)
    await updateDoc(groupRef, {
      unreadCount: 0,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error marking messages as read:', error)
    throw error
  }
}

// Get all users for member selection
export const getAllUsers = async () => {
  try {
    const employees = await getAllEmployees()
    
    // Convert employees to ChatUser format
    const users: ChatUser[] = employees.map(employee => ({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      isOnline: false, // Default to offline
      lastSeen: employee.lastActive ? new Date(employee.lastActive) as any : new Date() as any
    }))
    
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Update user online status
export const updateUserStatus = async (userId: string, isOnline: boolean) => {
  try {
    // For now, we'll just log the status change since we're using employees
    console.log(`User ${userId} status changed to ${isOnline ? 'online' : 'offline'}`)
    // In a real implementation, you might want to store this in a separate collection
  } catch (error) {
    console.error('Error updating user status:', error)
    throw error
  }
}

// Subscribe to user status changes
export const subscribeToUserStatus = (callback: (users: ChatUser[]) => void) => {
  // For now, we'll just return the current users without real-time updates
  // In a real implementation, you might want to set up a separate collection for online status
  const getCurrentUsers = async () => {
    try {
      const users = await getAllUsers()
      callback(users)
    } catch (error) {
      console.error('Error getting users for status subscription:', error)
      callback([])
    }
  }
  
  // Get initial users
  getCurrentUsers()
  
  // Return a cleanup function
  return () => {
    // Cleanup function - in a real implementation, you'd unsubscribe from Firestore listeners
  }
}

// Add reaction to a message
export const addMessageReaction = async (messageId: string, emoji: string, userId: string, userName: string) => {
  try {
    const messageRef = doc(db, 'chatMessages', messageId)
    await updateDoc(messageRef, {
      reactions: arrayUnion({
        emoji,
        userId,
        userName,
        timestamp: Timestamp.now()
      })
    })
  } catch (error) {
    console.error('Error adding reaction:', error)
    throw error
  }
}

// Remove reaction from a message
export const removeMessageReaction = async (messageId: string, emoji: string, userId: string) => {
  try {
    const messageRef = doc(db, 'chatMessages', messageId)
    const messageDoc = await getDoc(messageRef)
    
    if (messageDoc.exists()) {
      const messageData = messageDoc.data()
      const reactions = messageData.reactions || []
      
      // Remove the specific reaction
      const updatedReactions = reactions.filter((reaction: MessageReaction) => 
        !(reaction.emoji === emoji && reaction.userId === userId)
      )
      
      await updateDoc(messageRef, {
        reactions: updatedReactions
      })
    }
  } catch (error) {
    console.error('Error removing reaction:', error)
    throw error
  }
}

// Get reaction summary for a message
export const getReactionSummary = (reactions: MessageReaction[] = []) => {
  const summary: { [emoji: string]: { count: number, users: string[] } } = {}
  
  reactions.forEach(reaction => {
    if (!summary[reaction.emoji]) {
      summary[reaction.emoji] = { count: 0, users: [] }
    }
    summary[reaction.emoji].count++
    summary[reaction.emoji].users.push(reaction.userName)
  })
  
  return summary
} 