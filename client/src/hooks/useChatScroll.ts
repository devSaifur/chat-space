import { RefObject, useEffect } from 'react'

export function useChatScroll(
  containerRef: RefObject<HTMLDivElement>,
  dependencies: any[] = []
) {
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [...dependencies])
}
