import { io, Socket } from 'socket.io-client'
import SimplePeer from 'simple-peer'

export interface CallParticipant {
  id: string
  name: string
  stream?: MediaStream
  peer?: SimplePeer.Instance
}

export interface CallState {
  isActive: boolean
  type: 'audio' | 'video' | null
  participants: CallParticipant[]
  localStream?: MediaStream
  localAudioEnabled: boolean
  localVideoEnabled: boolean
}

class CallingService {
  private socket: Socket | null = null
  private localStream: MediaStream | null = null
  private peers: Map<string, SimplePeer.Instance> = new Map()
  private onCallStateChange: ((state: CallState) => void) | null = null
  private onIncomingCall: ((call: { type: 'audio' | 'video', caller: string, callerName: string }) => void) | null = null

  constructor() {
    // Initialize socket connection
    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      autoConnect: false
    })

    this.setupSocketListeners()
  }

  private setupSocketListeners() {
    if (!this.socket) return

    this.socket.on('connect', () => {
      console.log('Connected to calling server')
    })

    this.socket.on('incoming-call', (data: { type: 'audio' | 'video', caller: string, callerName: string }) => {
      console.log('Incoming call:', data)
      this.onIncomingCall?.(data)
    })

    this.socket.on('call-accepted', (data: { callerId: string, answer: any }) => {
      console.log('Call accepted by:', data.callerId)
      const peer = this.peers.get(data.callerId)
      if (peer) {
        peer.signal(data.answer)
      }
    })

    this.socket.on('call-rejected', (data: { callerId: string }) => {
      console.log('Call rejected by:', data.callerId)
      this.cleanupPeer(data.callerId)
    })

    this.socket.on('user-joined-call', (data: { userId: string, userName: string, signal: any }) => {
      console.log('User joined call:', data)
      this.addPeer(data.userId, data.userName, data.signal)
    })

    this.socket.on('user-left-call', (data: { userId: string }) => {
      console.log('User left call:', data.userId)
      this.removePeer(data.userId)
    })

    this.socket.on('signal', (data: { from: string, signal: any }) => {
      console.log('Received signal from:', data.from)
      const peer = this.peers.get(data.from)
      if (peer) {
        peer.signal(data.signal)
      }
    })
  }

  async initializeCall(userId: string, userName: string) {
    if (!this.socket) return

    this.socket.auth = { userId, userName }
    this.socket.connect()
  }

  async startCall(type: 'audio' | 'video', participants: string[], groupId: string) {
    try {
      // Get user media
      const constraints = {
        audio: true,
        video: type === 'video'
      }

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      // Notify other participants
      if (this.socket) {
        this.socket.emit('start-call', {
          type,
          participants,
          groupId
        })
      }

      return this.localStream
    } catch (error) {
      console.error('Error starting call:', error)
      throw error
    }
  }

  async joinCall(callId: string, userId: string, userName: string) {
    try {
      // Get user media
      const constraints = {
        audio: true,
        video: true // Always get video for joining calls
      }

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      if (this.socket) {
        this.socket.emit('join-call', {
          callId,
          userId,
          userName
        })
      }

      return this.localStream
    } catch (error) {
      console.error('Error joining call:', error)
      throw error
    }
  }

  private addPeer(userId: string, userName: string, signal?: any) {
    if (!this.localStream) return

    const peer = new SimplePeer({
      initiator: !signal,
      stream: this.localStream,
      trickle: false
    })

    peer.on('signal', (signal) => {
      if (this.socket) {
        this.socket.emit('signal', {
          to: userId,
          signal
        })
      }
    })

    peer.on('stream', (stream) => {
      console.log('Received stream from:', userId)
      this.updateCallState({
        participants: this.getCurrentParticipants().map(p => 
          p.id === userId ? { ...p, stream } : p
        )
      })
    })

    if (signal) {
      peer.signal(signal)
    }

    this.peers.set(userId, peer)
  }

  private removePeer(userId: string) {
    const peer = this.peers.get(userId)
    if (peer) {
      peer.destroy()
      this.peers.delete(userId)
    }

    this.updateCallState({
      participants: this.getCurrentParticipants().filter(p => p.id !== userId)
    })
  }

  private cleanupPeer(userId: string) {
    this.removePeer(userId)
  }

  private getCurrentParticipants(): CallParticipant[] {
    const participants: CallParticipant[] = []
    
    // Add local participant
    if (this.localStream) {
      participants.push({
        id: 'local',
        name: 'You',
        stream: this.localStream
      })
    }

    // Add remote participants
    this.peers.forEach((peer, userId) => {
      participants.push({
        id: userId,
        name: `User ${userId}`,
        peer
      })
    })

    return participants
  }

  private updateCallState(updates: Partial<CallState>) {
    const currentState = {
      isActive: this.peers.size > 0 || !!this.localStream,
      type: this.localStream?.getVideoTracks().length ? 'video' : 'audio',
      participants: this.getCurrentParticipants(),
      localStream: this.localStream || undefined,
      localAudioEnabled: this.localStream?.getAudioTracks()[0]?.enabled ?? false,
      localVideoEnabled: this.localStream?.getVideoTracks()[0]?.enabled ?? false
    }

    const newState = { ...currentState, ...updates }
    this.onCallStateChange?.(newState)
  }

  acceptCall(callerId: string, answer: any) {
    if (this.socket) {
      this.socket.emit('accept-call', { callerId, answer })
    }
  }

  rejectCall(callerId: string) {
    if (this.socket) {
      this.socket.emit('reject-call', { callerId })
    }
  }

  endCall() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop())
      this.localStream = null
    }

    // Destroy all peers
    this.peers.forEach(peer => peer.destroy())
    this.peers.clear()

    // Notify server
    if (this.socket) {
      this.socket.emit('end-call')
    }

    this.updateCallState({
      isActive: false,
      type: null,
      participants: [],
      localStream: undefined
    })
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        this.updateCallState({
          localAudioEnabled: audioTrack.enabled
        })
      }
    }
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        this.updateCallState({
          localVideoEnabled: videoTrack.enabled
        })
      }
    }
  }

  setCallStateCallback(callback: (state: CallState) => void) {
    this.onCallStateChange = callback
  }

  setIncomingCallCallback(callback: (call: { type: 'audio' | 'video', caller: string, callerName: string }) => void) {
    this.onIncomingCall = callback
  }

  disconnect() {
    this.endCall()
    if (this.socket) {
      this.socket.disconnect()
    }
  }
}

export const callingService = new CallingService() 