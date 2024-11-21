import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { api } from '@/lib/api'
import { userQueryOption } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

import { ScrollArea } from './ui/scroll-area'

interface ChatboxProps {
  selectedContactId: string
}

export function Chatbox({ selectedContactId }: ChatboxProps) {
  const { data: user } = useQuery(userQueryOption)

  const chatEndRef = useRef<HTMLDivElement>(null)

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages', selectedContactId],
    queryFn: async () => {
      const res = await api.messages.$get({
        query: { senderId: selectedContactId }
      })
      if (res.status !== 200) {
        throw new Error(res.statusText)
      }
      return res.json()
    },
    retry: false,
    enabled: Boolean(selectedContactId),
    staleTime: Infinity
  })

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  console.log(messages)

  return (
    <ScrollArea className="flex-1 bg-[url('/placeholder.svg?height=600&width=800')] bg-repeat p-4">
      {isLoading ? (
        <div className="pt-60">
          <Loader2 className="mx-auto size-10 animate-spin" />
        </div>
      ) : messages ? (
        <div className="flex flex-col-reverse">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex items-start ${msg.receiverId === user?.id ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-2 ${msg.receiverId === user?.id ? 'bg-gray-500' : 'bg-blue-500'}`}
              >
                <p>{msg.content}</p>
                <p
                  className={`mt-1 text-[10px] ${msg.receiverId === user?.id ? 'text-blue-100' : 'text-gray-400'}`}
                >
                  {formatDate(msg.sentAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center pt-60">
          <p>You've yet to send each other a message.</p>
        </div>
      )}
      <div ref={chatEndRef} />
    </ScrollArea>
  )
}
