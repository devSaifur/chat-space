import { useQuery } from '@tanstack/react-query'

import { contactsQueryOption } from '@/lib/queries'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { ScrollArea } from './ui/scroll-area'

export function ContactsList() {
  const { data: contacts } = useQuery(contactsQueryOption)

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      {contacts?.map((contact) => (
        <div key={contact.id} className="flex cursor-pointer items-center p-3">
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
            <p className="truncate text-sm text-gray-500">
              {'No messages yet'}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}
