import { FormEvent, useEffect, useRef, useState } from 'react'
import { Contact } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  ChevronLeft,
  Loader2,
  MoreVertical,
  Paperclip,
  Search,
  Send
} from 'lucide-react'

import { api } from '@/lib/api'
import { contactsQueryOption, userQueryOption } from '@/lib/queries'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PageLoader } from '@/components/page-loader'
import { Sidebar } from '@/components/sidebar'

export const Route = createFileRoute('/_protected/')({
  component: HomePage,
  loader: async ({ context }) => {
    return await context.queryClient.fetchQuery(contactsQueryOption)
  },
  pendingComponent: PageLoader
})

function HomePage() {
  const [message, setMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  const contacts = Route.useLoaderData()
  const wsRef = useRef<WebSocket | null>(null)
  const { data: user } = useQuery(userQueryOption)

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  if (!selectedContact && contacts && contacts.length > 0) {
    setSelectedContact(contacts[0])
  }

  const senderId = selectedContact?.id as string

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', senderId],
    queryFn: async () => {
      const res = await api.messages.$post({
        json: senderId
      })
      if (res.status !== 200) {
        throw new Error(res.statusText)
      }
      return res.json()
    },
    retry: false,
    enabled: Boolean(senderId),
    staleTime: Infinity
  })

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
        JSON.stringify({ type: 'message', message, to: selectedContact?.id })
      )
    }
  }

  return (
    <div className="mx-auto flex h-screen max-w-7xl overflow-hidden">
      <Sidebar setSelectedContact={setSelectedContact} />

      {/* Chat Area */}
      <div className="flex w-full flex-col md:flex md:w-2/3">
        {selectedContact && (
          <>
            <div className="flex items-center p-4">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 md:hidden"
                onClick={() => setSelectedContact(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage src={''} alt={selectedContact.name} />
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
              {isLoading ? (
                <div className="pt-60">
                  <Loader2 className="mx-auto size-10 animate-spin" />
                </div>
              ) : messages ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.receiverId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-2 ${msg.receiverId === user?.id ? 'bg-blue-500 text-white' : 'bg-blue-500'}`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`mt-1 text-xs ${msg.receiverId === user?.id ? 'text-blue-100' : 'text-gray-500'}`}
                      >
                        {formatDate(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex justify-center pt-60">
                  <p>You've yet to send each other a message.</p>
                </div>
              )}
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
