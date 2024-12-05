import { FormEvent, useEffect, useState } from 'react'
import { Message } from '@/types'
import type { WSMessageSchema } from '@server/lib/validators/wsValidators'
import { InfiniteData, useQuery, useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

import { userQueryOption } from '@/lib/queries'

import { Button } from './ui/button'
import { Input } from './ui/input'

interface ChatInputProps {
  selectedContactId: string
}

const wsUrl = 'ws://localhost:5173/api'

export function ChatInput({ selectedContactId }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const queryClient = useQueryClient()
  const { data: user } = useQuery(userQueryOption)

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl)

  useEffect(() => {
    if (typeof lastMessage?.data === 'string') {
      const { type, message, senderId, receiverId } = JSON.parse(
        lastMessage.data
      ) as WSMessageSchema

      console.log(type, message, senderId, receiverId)

      if (type === 'message' && message) {
        if (senderId == user?.id) {
          queryClient.setQueryData(
            ['MESSAGE', receiverId],
            (
              oldData?: InfiniteData<{
                messages: Message[]
                nextCursor: number
              }>
            ) => {
              const newMessage = {
                id: Math.random(),
                senderId,
                receiverId,
                sentAt: new Date().toISOString(),
                content: message
              }

              // If no existing data, create a new infinite data structure
              if (!oldData || !oldData.pages.length) {
                return {
                  pageParams: [0],
                  pages: [
                    {
                      messages: [newMessage],
                      nextCursor: 1
                    }
                  ]
                }
              }

              // Create a copy of the first page and prepend the new message
              const firstPage = oldData.pages[0]
              const updatedFirstPage = {
                ...firstPage,
                messages: [...firstPage.messages, newMessage]
              }

              // Return updated data structure
              return {
                pageParams: oldData.pageParams,
                pages: [updatedFirstPage, ...oldData.pages.slice(1)]
              }
            }
          )
        } else {
          queryClient.setQueryData(
            ['MESSAGE', senderId],
            (
              oldData?: InfiniteData<{
                messages: Message[]
                nextCursor: number
              }>
            ) => {
              const newMessage = {
                id: Math.random(),
                senderId,
                receiverId,
                sentAt: new Date().toISOString(),
                content: message
              }

              // If no existing data, create a new infinite data structure
              if (!oldData || !oldData.pages.length) {
                return {
                  pageParams: [0],
                  pages: [
                    {
                      messages: [newMessage],
                      nextCursor: 1
                    }
                  ]
                }
              }

              // Create a copy of the first page and prepend the new message
              const firstPage = oldData.pages[0]
              const updatedFirstPage = {
                ...firstPage,
                messages: [...firstPage.messages, newMessage]
              }

              // Return updated data structure
              return {
                pageParams: oldData.pageParams,
                pages: [updatedFirstPage, ...oldData.pages.slice(1)]
              }
            }
          )
        }
      }
    }

    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
    }[readyState]

    console.log(connectionStatus)
  }, [lastMessage, readyState])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage('')
    sendMessage(
      JSON.stringify({
        type: 'message',
        message,
        receiverId: selectedContactId,
        senderId: user?.id
      })
    )
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
