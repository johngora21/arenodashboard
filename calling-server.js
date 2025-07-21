const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"]
  }
})

// Store active calls and participants
const activeCalls = new Map()
const userSockets = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Store user info when they connect
  socket.on('user-info', (data) => {
    userSockets.set(data.userId, socket.id)
    socket.userId = data.userId
    socket.userName = data.userName
    console.log('User registered:', data.userId, data.userName)
  })

  // Handle starting a call
  socket.on('start-call', (data) => {
    const { type, participants, groupId } = data
    const callId = groupId || `call_${Date.now()}`
    
    console.log('Starting call:', callId, 'Type:', type, 'Participants:', participants)
    
    // Store call info
    activeCalls.set(callId, {
      id: callId,
      type,
      participants,
      initiator: socket.userId,
      active: true
    })

    // Notify participants about incoming call
    participants.forEach(participantId => {
      if (participantId !== socket.userId) {
        const participantSocketId = userSockets.get(participantId)
        if (participantSocketId) {
          io.to(participantSocketId).emit('incoming-call', {
            type,
            caller: socket.userId,
            callerName: socket.userName,
            callId
          })
        }
      }
    })

    socket.callId = callId
    socket.join(callId)
  })

  // Handle joining a call
  socket.on('join-call', (data) => {
    const { callId, userId, userName } = data
    const call = activeCalls.get(callId)
    
    if (call && call.active) {
      console.log('User joining call:', userId, 'Call:', callId)
      
      socket.callId = callId
      socket.join(callId)
      
      // Notify other participants
      socket.to(callId).emit('user-joined-call', {
        userId,
        userName,
        signal: null // Will be sent via signal event
      })
    }
  })

  // Handle call acceptance
  socket.on('accept-call', (data) => {
    const { callerId, answer } = data
    const callerSocketId = userSockets.get(callerId)
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-accepted', {
        callerId: socket.userId,
        answer
      })
    }
  })

  // Handle call rejection
  socket.on('reject-call', (data) => {
    const { callerId } = data
    const callerSocketId = userSockets.get(callerId)
    
    if (callerSocketId) {
      io.to(callerSocketId).emit('call-rejected', {
        callerId: socket.userId
      })
    }
  })

  // Handle WebRTC signaling
  socket.on('signal', (data) => {
    const { to, signal } = data
    const targetSocketId = userSockets.get(to)
    
    if (targetSocketId) {
      io.to(targetSocketId).emit('signal', {
        from: socket.userId,
        signal
      })
    }
  })

  // Handle ending a call
  socket.on('end-call', () => {
    if (socket.callId) {
      const call = activeCalls.get(socket.callId)
      if (call) {
        console.log('Ending call:', socket.callId)
        
        // Notify other participants
        socket.to(socket.callId).emit('user-left-call', {
          userId: socket.userId
        })
        
        // Clean up call if no more participants
        const room = io.sockets.adapter.rooms.get(socket.callId)
        if (room && room.size <= 1) {
          activeCalls.delete(socket.callId)
        }
      }
    }
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    
    // Remove from user sockets
    if (socket.userId) {
      userSockets.delete(socket.userId)
    }
    
    // Handle leaving call
    if (socket.callId) {
      socket.to(socket.callId).emit('user-left-call', {
        userId: socket.userId
      })
    }
  })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Calling server running on port ${PORT}`)
}) 