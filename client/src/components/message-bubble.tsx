import { Message } from '@/types'
import { useQuery } from '@tanstack/react-query'

import { userQueryOption } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { data: user } = useQuery(userQueryOption)

  return (
    <div
      key={message.id}
      className={`mb-4 flex items-start ${message.receiverId === user?.id ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-2 ${message.receiverId === user?.id ? 'bg-gray-500' : 'bg-blue-500'}`}
      >
        <p>{message.content}</p>
        <p className="mt-1 text-sm text-gray-300">
          {formatDate(message.sentAt)}
        </p>
      </div>
    </div>
  )
}
