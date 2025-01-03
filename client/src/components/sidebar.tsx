import type { Contact } from '@/types'
import { useQuery } from '@tanstack/react-query'

import { userQueryOption } from '@/lib/queries'

import { AllUsers } from './all-users'
import { ContactsList } from './contacts-list'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface SidebarProps {
  setSelectedContact: (contact: Contact | null) => void
  selectedContactId: string
}

export function Sidebar({
  setSelectedContact,
  selectedContactId
}: SidebarProps) {
  const { data: user } = useQuery(userQueryOption)

  return (
    <div className="w-full md:block md:w-1/3">
      <div className="flex items-center justify-between p-4">
        <Avatar>
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="Your avatar"
          />
          <AvatarFallback>{user?.name}</AvatarFallback>
        </Avatar>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="w-full rounded-none *:w-full">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="messages">
          <ContactsList
            setSelectedContact={setSelectedContact}
            selectedContactId={selectedContactId}
          />
        </TabsContent>
        <TabsContent value="users">
          <AllUsers />
        </TabsContent>
      </Tabs>
    </div>
  )
}
