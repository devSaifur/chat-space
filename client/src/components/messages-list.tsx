import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'

const contacts = [
  {
    id: 1,
    name: 'John Doe',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Hello, how are you?',
    time: 'Today 12:30'
  },
  {
    id: 2,
    name: 'Jane Doe',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'I am good, thanks for asking.',
    time: 'Today 13:00'
  }
]

type Contact = (typeof contacts)[number]

export function MessagesList() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  if (!selectedContact && contacts && contacts.length > 0) {
    setSelectedContact(contacts[0])
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex cursor-pointer items-center p-3"
          onClick={() => setSelectedContact(contact)}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <p className="font-semibold">{contact.name}</p>
              <p className="text-xs text-gray-500">{contact.time}</p>
            </div>
            <p className="truncate text-sm text-gray-500">
              {contact.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}
