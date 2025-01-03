import { Loader2 } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex justify-center p-6">
      <Loader2 className="size-8 animate-spin text-gray-700 dark:text-gray-200" />
    </div>
  )
}
