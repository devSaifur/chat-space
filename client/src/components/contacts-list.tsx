import type { Contact } from '@/types'
import { useQuery } from '@tanstack/react-query'

import { contactsQueryOption } from '@/lib/queries'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'

interface ContactsListProps {
  setSelectedContact: (contact: Contact | null) => void
  selectedContactId: string
}

export function ContactsList({
  setSelectedContact,
  selectedContactId
}: ContactsListProps) {
  const { data: contacts } = useQuery(contactsQueryOption)

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      {contacts?.map((contact) => (
        <div
          onClick={() => setSelectedContact(contact)}
          key={contact.id}
          className={`flex cursor-pointer items-center p-3 ${contact.id === selectedContactId && 'bg-secondary'}`}
        >
          <Avatar className="h-12 w-12">
            <AvatarImage src={''} alt={contact.name} />
            <AvatarFallback>{contact.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <div className="flex justify-between">
              <p className="font-semibold">{contact.name}</p>
              <p className="text-xs text-gray-500">
                {new Date().toLocaleString()}
              </p>
            </div>
            <p className="truncate text-sm text-gray-300">
              {'No messages yet'}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}
