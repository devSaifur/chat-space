import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import * as z from 'zod'

import { addContact } from '../data/contact'
import { getAllUsers, getUserByUsername } from '../data/user'
import { getUser } from '../middleware'
import type { Env } from '../types'

type Message = {
    id: number
    sender: 'user' | 'contact'
    content: string
    time: string
}

type Contact = {
    id: number
    name: string
    username: string
    avatar: string
    lastMessage: string
    time: string
    messages: Message[]
}

export const contacts: Contact[] = [
    {
        id: 1,
        name: 'Alice Johnson',
        username: 'alice',
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
        username: 'bob',
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
        username: 'carol',
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
        username: 'david',
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
        username: 'eva',
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
        username: 'frank',
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
        username: 'grace',
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

export const contactsRoutes = new Hono<Env>()
    .get('/', (c) => {
        const user = c.get('user')

        const contactWithLastMessage = contacts.map((contact) => {
            const { messages, ...rest } = contact
            return rest
        })

        return c.json(contactWithLastMessage, 200)
    })
    .post('/add', getUser, zValidator('json', z.string().min(3).max(126)), async (c) => {
        const username = c.req.valid('json')
        const user = c.get('user')

        try {
            const toBeAddedUser = await getUserByUsername(username)

            if (!toBeAddedUser) {
                return c.json({ error: 'User not found' }, 404)
            }

            await addContact(user.id, toBeAddedUser.id)
            return c.json({ message: 'Contact added successfully' }, 201)
        } catch (err) {
            console.error(err)
            return c.json({ error: 'Something went wrong' }, 500)
        }
    })
