import { useRef } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import { api } from '@/lib/api'
import { useChatScroll } from '@/hooks/useChatScroll'

import { LoadingSpinner } from './loading-spinner'
import { MessageList } from './message-list'

interface ChatboxProps {
  selectedContactId: string
}

export function MessagesContainer({ selectedContactId }: ChatboxProps) {
  const { ref, inView } = useInView({
    threshold: 0.1
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useInfiniteQuery({
      queryKey: ['MESSAGE', selectedContactId],
      queryFn: async ({ pageParam }) => {
        const res = await api.messages.$get({
          query: { senderId: selectedContactId, cursor: pageParam.toString() }
        })
        if (res.status !== 200) {
          throw new Error(res.statusText)
        }
        return res.json()
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: 0,
      enabled: Boolean(selectedContactId),
      retry: false
    })

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }

  useChatScroll(containerRef, [data?.pages[0]])

  if (status === 'pending') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex justify-center pt-60">
        <p>You've yet to send each other a message.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-1 flex-col-reverse overflow-y-auto p-4 text-white dark:text-gray-200"
    >
      {data.pages.map((page, i) => (
        <div key={i}>
          <MessageList messages={page.messages} />
        </div>
      ))}

      <div ref={ref} className="pt-2">
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </div>
  )
}
