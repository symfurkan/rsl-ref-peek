import { useEffect, useState } from 'react'
import type { ReferencedDataComponentProps } from '@/types'

interface User {
  id: string
  name: string
  email: string
  role: string
}

// Simulated API call
const fetchUser = async (id: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
  
  const users: Record<string, User> = {
    'user_123': {
      id: 'user_123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin'
    },
    'user_456': {
      id: 'user_456',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User'
    }
  }
  
  const user = users[id]
  if (!user) {
    throw new Error('User not found')
  }
  
  return user
}

export function UserPreview({ 
  dataId, 
  onResolved, 
  onError, 
  onLoading 
}: ReferencedDataComponentProps<User>) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true)
      setError(null)
      onLoading?.()

      try {
        const userData = await fetchUser(dataId)
        setUser(userData)
        onResolved?.(userData)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMsg)
        onError?.(new Error(errorMsg))
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [dataId, onResolved, onError, onLoading])

  if (loading) {
    return (
      <div className="space-y-2" data-testid="loading-skeleton">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-destructive text-sm">
        <p className="font-medium">Error loading user</p>
        <p className="text-xs opacity-80">{error}</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-2">
      <div>
        <h4 className="font-semibold">{user.name}</h4>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          {user.role}
        </span>
      </div>
    </div>
  )
}