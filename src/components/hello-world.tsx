import { cn } from '@/lib/utils'

interface HelloWorldProps {
  className?: string
  name?: string
}

export function HelloWorld({ className, name = 'World' }: HelloWorldProps) {
  return (
    <div className={cn('p-4 bg-blue-100 text-blue-900 rounded-lg', className)}>
      <h1 className="text-2xl font-bold">Hello {name}!</h1>
      <p className="mt-2 text-sm">This is a test component to verify our setup.</p>
    </div>
  )
}