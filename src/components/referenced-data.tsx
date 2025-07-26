import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { cn } from '@/lib/utils'
import type { ReferencedDataComponent } from '@/types'

export interface ReferencedDataProps<T = unknown> {
  dataId: string
  type?: string
  asChild?: boolean
  delay?: number
  linkUrl?: string
  component: ReferencedDataComponent<T>
  onResolved?: (data: T) => void
  onError?: (error: Error) => void
  onLoading?: () => void
  children: React.ReactNode
  className?: string
}

export function ReferencedData<T = unknown>({
  dataId,
  type,
  asChild = false,
  delay = 300,
  linkUrl,
  component: Component,
  onResolved,
  onError,
  onLoading,
  children,
  className,
}: ReferencedDataProps<T>) {
  const TriggerComponent = asChild ? Slot : 'span'

  return (
    <HoverCard openDelay={delay} closeDelay={150}>
      <HoverCardTrigger asChild>
        <TriggerComponent
          className={cn(
            'cursor-pointer underline decoration-dotted underline-offset-4 hover:decoration-solid',
            className
          )}
        >
          {children}
        </TriggerComponent>
      </HoverCardTrigger>
      
      <HoverCardContent className="w-80">
        <Component
          dataId={dataId}
          type={type}
          onResolved={onResolved}
          onError={onError}
          onLoading={onLoading}
        />
        
        {linkUrl && (
          <div className="mt-3 pt-3 border-t">
            <a
              href={linkUrl}
              className={cn(
                'inline-flex items-center text-sm font-medium text-primary hover:underline',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
              )}
            >
              Detayları Gör →
            </a>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}