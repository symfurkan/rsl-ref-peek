# rsl-ref-peek

A React component library for hover-based reference data display built on shadcn/ui.

## Overview

`rsl-ref-peek` provides a `ReferencedData` component that displays hover-based preview cards for referenced data. The component follows a slot-based composition pattern and delegates data fetching to external components, making it highly flexible and reusable.

## Features

- 🎯 **Hover-based data preview** - Show rich data cards on hover
- 🎨 **Built on shadcn/ui** - Uses HoverCard and other shadcn/ui primitives
- 🔌 **External data fetching** - Delegates data resolution to external components
- 🎭 **Slot composition** - Supports `asChild` pattern for flexible trigger elements
- 📝 **TypeScript support** - Full type safety with generics
- ⚡ **Lifecycle callbacks** - Handle loading, success, and error states
- 🔗 **Optional links** - Add navigation links to hover content

## Installation

```bash
npm install rsl-ref-peek
```

### Prerequisites

This package requires the following peer dependencies:

```bash
npm install react react-dom
```

You'll also need to have shadcn/ui set up in your project. If you haven't already:

```bash
npx shadcn@latest init
npx shadcn@latest add hover-card
```

## Quick Start

### 1. Create a data component

First, create a component that handles data fetching for your specific data type:

```tsx
import { useEffect, useState } from 'react'
import type { ReferencedDataComponentProps } from 'rsl-ref-peek'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export function UserPreview({ 
  dataId, 
  onResolved, 
  onError, 
  onLoading 
}: ReferencedDataComponentProps<User>) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      onLoading?.()

      try {
        const response = await fetch(`/api/users/${dataId}`)
        const userData = await response.json()
        setUser(userData)
        onResolved?.(userData)
      } catch (error) {
        onError?.(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [dataId, onResolved, onError, onLoading])

  if (loading) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!user) return null

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
```

### 2. Use ReferencedData component

```tsx
import { ReferencedData } from 'rsl-ref-peek'
import { UserPreview } from './UserPreview'

function TaskList() {
  return (
    <div>
      <p>
        This task was created by{' '}
        <ReferencedData
          dataId="user_123"
          component={UserPreview}
          linkUrl="/users/123"
          onResolved={(user) => console.log('User loaded:', user)}
        >
          <span className="text-primary font-medium cursor-pointer">
            John Doe
          </span>
        </ReferencedData>
      </p>
    </div>
  )
}
```

## API Reference

### ReferencedData Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataId` | `string` | **required** | Unique identifier for the data to fetch |
| `component` | `ReferencedDataComponent<T>` | **required** | Component that handles data fetching and display |
| `type` | `string` | `undefined` | Optional data type identifier |
| `asChild` | `boolean` | `false` | Render as child component (slot pattern) |
| `delay` | `number` | `300` | Hover delay in milliseconds |
| `linkUrl` | `string` | `undefined` | Optional link URL shown in hover content |
| `className` | `string` | `undefined` | Additional CSS classes for trigger element |
| `onResolved` | `(data: T) => void` | `undefined` | Called when data is successfully loaded |
| `onError` | `(error: Error) => void` | `undefined` | Called when an error occurs |
| `onLoading` | `() => void` | `undefined` | Called when loading starts |

### ReferencedDataComponentProps

Your data components should accept these props:

| Prop | Type | Description |
|------|------|-------------|
| `dataId` | `string` | The data identifier to fetch |
| `type` | `string \| undefined` | Optional data type |
| `onResolved` | `(data: T) => void \| undefined` | Success callback |
| `onError` | `(error: Error) => void \| undefined` | Error callback |
| `onLoading` | `() => void \| undefined` | Loading callback |

## Examples

### Basic Usage

```tsx
<ReferencedData dataId="user_123" component={UserPreview}>
  <span>John Doe</span>
</ReferencedData>
```

### With Custom Delay

```tsx
<ReferencedData 
  dataId="user_123" 
  component={UserPreview}
  delay={1000}
>
  <span>John Doe</span>
</ReferencedData>
```

### As Child (Slot Pattern)

```tsx
<ReferencedData 
  dataId="user_123" 
  component={UserPreview}
  asChild
>
  <button className="btn-primary">
    View Profile
  </button>
</ReferencedData>
```

### With Link in Hover Content

```tsx
<ReferencedData 
  dataId="user_123" 
  component={UserPreview}
  linkUrl="/users/123"
>
  <span>John Doe</span>
</ReferencedData>
```

### Multiple Data Types

```tsx
// Product preview component
<ReferencedData 
  dataId="prod_456" 
  component={ProductPreview}
  linkUrl="/products/456"
>
  <span className="text-blue-600">Amazing Widget</span>
</ReferencedData>

// Order preview component  
<ReferencedData 
  dataId="order_789" 
  component={OrderPreview}
  linkUrl="/orders/789"
>
  <span className="text-green-600">Order #789</span>
</ReferencedData>
```

## Integration with Data Fetching Libraries

### With React Query

```tsx
import { useQuery } from '@tanstack/react-query'

export function UserPreview({ dataId, onResolved, onError, onLoading }: ReferencedDataComponentProps<User>) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', dataId],
    queryFn: () => fetchUser(dataId),
    onSuccess: onResolved,
    onError: onError,
  })

  useEffect(() => {
    if (isLoading) onLoading?.()
  }, [isLoading, onLoading])

  if (isLoading) return <UserSkeleton />
  if (error) return <ErrorMessage />
  if (!user) return null

  return <UserCard user={user} />
}
```

### With SWR

```tsx
import useSWR from 'swr'

export function UserPreview({ dataId, onResolved, onError, onLoading }: ReferencedDataComponentProps<User>) {
  const { data: user, error, isLoading } = useSWR(
    `/api/users/${dataId}`,
    fetcher,
    {
      onSuccess: onResolved,
      onError: onError,
    }
  )

  useEffect(() => {
    if (isLoading) onLoading?.()
  }, [isLoading, onLoading])

  // ... rest of component
}
```

## Development

### Setup

```bash
git clone <repository-url>
cd rsl-ref-peek
npm install
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run format       # Format code with Prettier
```

### Running Tests

```bash
npm test
```

The test suite includes comprehensive tests for:
- Component rendering and interaction
- Hover behavior and timing
- Data loading lifecycle
- Error handling
- TypeScript type safety

## Design Principles

1. **External Data Resolution** - The component doesn't fetch data itself, allowing maximum flexibility
2. **shadcn/ui Foundation** - Built on proven UI primitives for consistency
3. **Slot Pattern Support** - Flexible composition with `asChild`
4. **Type Safety** - Full TypeScript support with generics
5. **Minimal API Surface** - Simple but powerful interface

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.