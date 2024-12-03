import { FormEvent, useEffect, useRef, useState } from 'react'
import { Message } from '@/types'
import type { WSMessageSchema } from '@server/lib/validators/wsValidators'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'

import { userQueryOption } from '@/lib/queries'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface ChatInputProps {
  selectedContactId: string
}

export function ChatInput({ selectedContactId }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const wsRef = useRef<WebSocket | null>(null)
  const { data: user } = useQuery(userQueryOption)

  const queryClient = useQueryClient()

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5173/api')

    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connection opened')
    }

    ws.onmessage = (msg) => {
      if (typeof msg.data === 'string') {
        const { type, message, senderId, receiverId } = JSON.parse(
          msg.data
        ) as WSMessageSchema

        if (type === 'message' && message) {
          if (senderId == user?.id) {
            queryClient.setQueryData(
              ['MESSAGE', receiverId],
              (oldMessages: Message[]) => {
                const newMessage = {
                  id: Math.random(),
                  senderId,
                  receiverId,
                  sentAt: new Date().toISOString(),
                  content: message
                }

                const isDuplicate = oldMessages.some(
                  (existingMessage) =>
                    existingMessage.content === message &&
                    existingMessage.senderId === senderId
                )

                if (isDuplicate) {
                  return oldMessages
                }

                if (oldMessages.length === 0) {
                  return [newMessage]
                }
                return [newMessage, ...oldMessages]
              }
            )
          } else {
            queryClient.setQueryData(
              ['MESSAGE', senderId],
              (oldMessages: Message[]) => {
                const newMessage = {
                  id: Math.random(),
                  senderId,
                  receiverId,
                  sentAt: new Date().toISOString(),
                  content: message
                }

                const isDuplicate = oldMessages.some(
                  (existingMessage) =>
                    existingMessage.content === message &&
                    existingMessage.senderId === senderId
                )

                if (isDuplicate) {
                  return oldMessages
                }

                if (oldMessages.length === 0) {
                  return [newMessage]
                }

                return [newMessage, ...oldMessages]
              }
            )
          }
        }
      }
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
    }
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (wsRef.current) {
      setMessage('')
      wsRef.current.send(
        JSON.stringify({
          type: 'message',
          message,
          receiverId: selectedContactId,
          senderId: user?.id
        })
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center p-4">
      <Input
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mx-2 flex-1"
      />
      <Button type="submit" size="icon">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}
