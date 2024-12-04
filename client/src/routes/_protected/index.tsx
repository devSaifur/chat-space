import { useState } from 'react'
import { Contact } from '@/types'
import { createFileRoute } from '@tanstack/react-router'

import { api } from '@/lib/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatInput } from '@/components/chat-input'
import { LoadingSpinner } from '@/components/loading-spinner'
import { MessagesContainer } from '@/components/messages-container'
import { Sidebar } from '@/components/sidebar'

export const Route = createFileRoute('/_protected/')({
  component: HomePage,
  loader: async () => {
    const res = await api.contacts.$get()
    if (!res.ok) {
      return null
    }
    return res.json()
  },
  pendingComponent: LoadingSpinner
})

function HomePage() {
  const contacts = Route.useLoaderData()

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  if (!selectedContact && contacts && contacts.length > 0) {
    setSelectedContact(contacts[0])
  }

  const selectedContactId = selectedContact?.id as string

  return (
    <div className="mx-auto flex h-screen max-w-7xl overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        setSelectedContact={setSelectedContact}
        selectedContactId={selectedContactId}
      />

      {/* Chat Area */}
      <div className="flex w-full flex-col md:flex md:w-2/3">
        {selectedContact && (
          <>
            <div className="flex items-center p-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={''} alt={selectedContact.name} />
                <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <p className="font-semibold">{selectedContact.name}</p>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <MessagesContainer selectedContactId={selectedContactId} />
            <ChatInput selectedContactId={selectedContactId} />
          </>
        )}
      </div>
    </div>
  )
}
