import { FormEvent, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeft,
  MoreVertical,
  Paperclip,
  Search,
  Send
} from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/lib/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageLoader } from '@/components/page-loader'
import { Sidebar } from '@/components/sidebar'

export const Route = createFileRoute('/_protected/')({
  component: HomePage,
  loader: async () => {
    const res = await api.contacts.$get()
    if (!res.ok) {
      toast.error('Something went wrong, please try again')
      return null
    }
    return res.json()
  },
  pendingComponent: PageLoader
})

type Contact = {
  id: number
  name: string
  username: string
  avatar: string
  lastMessage: string
  time: string
}

function HomePage() {
  const [message, setMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const contacts = Route.useLoaderData()
  const wsRef = useRef<WebSocket | null>(null)

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  if (!selectedContact && contacts && contacts.length > 0) {
    setSelectedContact(contacts[0])
  }

  const username = selectedContact?.username as string

  const { data: messagesQueryResult } = useQuery({
    queryKey: ['messages', username],
    queryFn: async () => {
      const res = await api.messages[':username'].$get({
        param: { username }
      })
      if (res.status !== 200) {
        throw new Error(res.statusText)
      }
      return res.json()
    },
    enabled: !!username
  })

  const messages = messagesQueryResult ? messagesQueryResult : []

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/api')

    wsRef.current = ws

    ws.onopen = () => {
      console.log('WebSocket connection opened')
    }

    ws.onmessage = (msg) => {
      if (typeof msg.data === 'string') {
        const data = JSON.parse(msg.data)
        if (data.type === 'message') {
          console.log(data.message)
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
      wsRef.current.send(
        JSON.stringify({ type: 'message', message, to: 'test' })
      )
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-7xl overflow-hidden">
      <Sidebar />

      {/* Chat Area */}
      <div className="flex w-full flex-col md:flex md:w-2/3">
        {selectedContact && (
          <>
            <div className="items-center0 flex p-4">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 md:hidden"
                onClick={() => setSelectedContact(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                />
                <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="font-semibold">{selectedContact.name}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 bg-[url('/placeholder.svg?height=600&width=800')] bg-repeat p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-2 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-blue-500'}`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </ScrollArea>
            <form onSubmit={handleSubmit} className="flex items-center p-4">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
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
          </>
        )}
      </div>
    </div>
  )
}
