import { AvatarImage } from '@radix-ui/react-avatar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, UserRoundPlus } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/lib/api'

import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'

export function AllUsers() {
  const queryClient = useQueryClient()

  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const res = await api.users.$get()
      if (!res.ok) {
        return null
      }
      return res.json()
    },
    staleTime: Infinity
  })

  const { mutate: addContact, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const res = await api.contacts.add.$post({
        json: email
      })
      if (!res.ok) {
        throw new Error()
      }
      return res.json()
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users'], type: 'all' })
      queryClient.invalidateQueries({ queryKey: ['contacts'], type: 'all' })
      toast.success('Contact added successfully')
    },
    onError: () => {
      toast.error('Something went wrong')
    }
  })

  if (isLoading) {
    return (
      <div className="mt-20 flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      {users?.map((user) => (
        <div key={user.name} className="flex cursor-pointer items-center p-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={undefined} alt={user.name} />
            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-1">
            <p className="font-semibold">{user.name}</p>
          </div>
          <Button
            onClick={() => addContact(user.email)}
            disabled={isPending || isLoading}
            variant="ghost"
            size="icon"
          >
            <UserRoundPlus className="h-5 w-5" />
          </Button>
        </div>
      ))}
    </ScrollArea>
  )
}
