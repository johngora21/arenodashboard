'use client'

import React, { useRef, useEffect } from 'react'
import { CallParticipant } from '@/lib/calling-service'
import { Button } from '@/components/ui/button'
import { Phone, VideoCall, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react'

interface VideoCallInterfaceProps {
  participants: CallParticipant[]
  localAudioEnabled: boolean
  localVideoEnabled: boolean
  onToggleAudio: () => void
  onToggleVideo: () => void
  onEndCall: () => void
}

export default function VideoCallInterface({
  participants,
  localAudioEnabled,
  localVideoEnabled,
  onToggleAudio,
  onToggleVideo,
  onEndCall
}: VideoCallInterfaceProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  useEffect(() => {
    // Set up local video stream
    const localParticipant = participants.find(p => p.id === 'local')
    if (localParticipant?.stream && localVideoRef.current) {
      localVideoRef.current.srcObject = localParticipant.stream
    }
  }, [participants])

  useEffect(() => {
    // Set up remote video streams
    participants.forEach(participant => {
      if (participant.id !== 'local' && participant.stream) {
        const videoElement = remoteVideoRefs.current.get(participant.id)
        if (videoElement) {
          videoElement.srcObject = participant.stream
        }
      }
    })
  }, [participants])

  const remoteParticipants = participants.filter(p => p.id !== 'local')

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 text-white">
        <div>
          <h2 className="text-lg font-semibold">Video Call</h2>
          <p className="text-sm text-gray-300">
            {participants.length} participants
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={onEndCall}
          className="bg-red-600 hover:bg-red-700"
        >
          <PhoneOff className="h-4 w-4 mr-2" />
          End Call
        </Button>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
              You
            </div>
            {!localVideoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <VideoOff className="h-12 w-12 mx-auto mb-2" />
                  <p>Camera Off</p>
                </div>
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {remoteParticipants.map((participant) => (
            <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={(el) => {
                  if (el) remoteVideoRefs.current.set(participant.id, el)
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                {participant.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4 p-4 bg-black/50">
        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleAudio}
          className={`rounded-full p-4 ${
            localAudioEnabled 
              ? 'bg-white/20 text-white hover:bg-white/30' 
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {localAudioEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={onToggleVideo}
          className={`rounded-full p-4 ${
            localVideoEnabled 
              ? 'bg-white/20 text-white hover:bg-white/30' 
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {localVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={onEndCall}
          className="rounded-full p-4 bg-red-600 hover:bg-red-700"
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
} 