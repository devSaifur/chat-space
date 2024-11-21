import type { Contact } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { MoreVertical, Search } from 'lucide-react'

import { userQueryOption } from '@/lib/queries'

import { AllUsers } from './all-users'
import { ContactsList } from './contacts-list'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

interface SidebarProps {
  setSelectedContact: (contact: Contact | null) => void
}

export function Sidebar({ setSelectedContact }: SidebarProps) {
  const { data: user } = useQuery(userQueryOption)

  return (
    <div className="w-full bg-secondary md:block md:w-1/3">
      <div className="flex items-center justify-between p-4">
        <Avatar>
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="Your avatar"
          />
          <AvatarFallback>{user?.username}</AvatarFallback>
        </Avatar>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="w-full *:w-full">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="users">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="messages">
          <ContactsList setSelectedContact={setSelectedContact} />
        </TabsContent>
        <TabsContent value="users">
          <AllUsers />
        </TabsContent>
      </Tabs>
    </div>
  )
}
