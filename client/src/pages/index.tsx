import { useEffect, useRef, useState } from 'react'
import {
  ChevronLeft,
  Mic,
  MoreVertical,
  Paperclip,
  Search,
  Send
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

type Message = {
  id: number
  sender: 'user' | 'contact'
  content: string
  time: string
}

type Contact = {
  id: number
  name: string
  avatar: string
  lastMessage: string
  time: string
  messages: Message[]
}

const contacts: Contact[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Hey, how are you?',
    time: '10:30 AM',
    messages: [
      {
        id: 1,
        sender: 'contact',
        content: 'Hey, how are you?',
        time: '10:30 AM'
      },
      {
        id: 2,
        sender: 'user',
        content: "I'm good, thanks! How about you?'",
        time: '10:31 AM'
      },
      {
        id: 3,
        sender: 'contact',
        content: 'Doing well! Any plans for the weekend?',
        time: '10:32 AM'
      }
    ]
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Can we meet tomorrow?',
    time: 'Yesterday',
    messages: [
      {
        id: 1,
        sender: 'contact',
        content: 'Can we meet tomorrow?',
        time: 'Yesterday'
      },
      {
        id: 2,
        sender: 'user',
        content: 'Sure, what time works for you?',
        time: 'Yesterday'
      }
    ]
  },
  {
    id: 3,
    name: 'Carol Williams',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Thanks for your help!',
    time: 'Tuesday',
    messages: [
      {
        id: 1,
        sender: 'user',
        content: "How's the project coming along?",
        time: 'Tuesday'
      },
      {
        id: 2,
        sender: 'contact',
        content: "It's going well. Thanks for your help!",
        time: 'Tuesday'
      }
    ]
  },
  {
    id: 4,
    name: 'David Brown',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'See you at the meeting',
    time: 'Monday',
    messages: [
      {
        id: 1,
        sender: 'contact',
        content: "Don't forget about our team meeting tomorrow",
        time: 'Monday'
      },
      {
        id: 2,
        sender: 'user',
        content: 'Thanks for the reminder. See you at the meeting!',
        time: 'Monday'
      }
    ]
  },
  {
    id: 5,
    name: 'Eva Martinez',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'How was your vacation?',
    time: 'Last week',
    messages: [
      {
        id: 1,
        sender: 'contact',
        content: "Hey! You're back! How was your vacation?",
        time: 'Last week'
      },
      {
        id: 2,
        sender: 'user',
        content: "It was amazing! I'll show you some photos soon.",
        time: 'Last week'
      }
    ]
  },
  {
    id: 6,
    name: 'Frank Wilson',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Project update',
    time: '2 weeks ago',
    messages: [
      {
        id: 1,
        sender: 'contact',
        content: "I've sent you the latest project update",
        time: '2 weeks ago'
      },
      {
        id: 2,
        sender: 'user',
        content: "Got it, I'll review it asap",
        time: '2 weeks ago'
      }
    ]
  },
  {
    id: 7,
    name: 'Grace Lee',
    avatar: '/placeholder.svg?height=40&width=40',
    lastMessage: 'Happy birthday!',
    time: 'Last month',
    messages: [
      {
        id: 1,
        sender: 'contact',
        content: 'Happy birthday! Hope you have a great day!',
        time: 'Last month'
      },
      {
        id: 2,
        sender: 'user',
        content: 'Thank you so much!',
        time: 'Last month'
      }
    ]
  }
]

export default function HomePage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && selectedContact) {
      const newMessage: Message = {
        id: selectedContact.messages.length + 1,
        sender: 'user',
        content: message,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })
      }
      setSelectedContact({
        ...selectedContact,
        messages: [...selectedContact.messages, newMessage],
        lastMessage: message,
        time: 'Just now'
      })
      setMessage('')
    }
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedContact?.messages])

  return (
    <div className="mx-auto flex h-screen max-w-7xl overflow-hidden">
      {/* Sidebar */}
      <div
        className={`w-full bg-secondary md:w-1/3 ${selectedContact ? 'hidden md:block' : ''}`}
      >
        <div className="flex items-center justify-between p-4">
          <Avatar>
            <AvatarImage
              src="/placeholder.svg?height=40&width=40"
              alt="Your avatar"
            />
            <AvatarFallback>You</AvatarFallback>
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
        <div className="p-2">
          <Input placeholder="Search or start new chat" />
        </div>
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
      </div>

      {/* Chat Area */}
      <div
        className={`flex w-full flex-col md:w-2/3 ${!selectedContact ? 'hidden md:flex' : ''}`}
      >
        {selectedContact ? (
          <>
            <div className="items-center0 flex p-4">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 md:hidden"
                onClick={() => setSelectedContact(null)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                />
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
              {selectedContact.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-2 ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-blue-500'}`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`mt-1 text-xs ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </ScrollArea>
            <form
              onSubmit={handleSendMessage}
              className="flex items-center p-4"
            >
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mx-2 flex-1"
              />
              {message ? (
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon">
                  <Mic className="h-5 w-5" />
                </Button>
              )}
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
