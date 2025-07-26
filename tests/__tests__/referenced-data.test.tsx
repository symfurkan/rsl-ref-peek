import { render, screen, waitFor } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi } from 'vitest'
import { ReferencedData } from '@/components/referenced-data'
import type { ReferencedDataComponentProps } from '@/types'

// Mock component for testing
const MockDataComponent = ({ 
  dataId, 
  onResolved, 
  onError, 
  onLoading 
}: ReferencedDataComponentProps) => {
  // Simulate async data loading
  setTimeout(() => {
    if (dataId === 'error') {
      onError?.(new Error('Test error'))
    } else {
      onLoading?.()
      setTimeout(() => {
        onResolved?.({ id: dataId, name: `Test ${dataId}` })
      }, 100)
    }
  }, 50)

  if (dataId === 'error') {
    return <div>Error loading data</div>
  }

  return (
    <div data-testid="mock-data">
      <h4>Loading {dataId}...</h4>
    </div>
  )
}

describe('ReferencedData', () => {
  it('renders trigger content correctly', () => {
    render(
      <ReferencedData dataId="test" component={MockDataComponent}>
        <span>Test Content</span>
      </ReferencedData>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('applies custom className to trigger', () => {
    render(
      <ReferencedData 
        dataId="test" 
        component={MockDataComponent}
        className="custom-class"
      >
        <span>Test Content</span>
      </ReferencedData>
    )

    const trigger = screen.getByText('Test Content')
    expect(trigger.parentElement).toHaveClass('custom-class')
  })

  it('renders as child when asChild is true', () => {
    render(
      <ReferencedData 
        dataId="test" 
        component={MockDataComponent}
        asChild
      >
        <button>Custom Button</button>
      </ReferencedData>
    )

    const button = screen.getByRole('button', { name: 'Custom Button' })
    expect(button).toBeInTheDocument()
  })

  it('shows hover content on hover', async () => {
    const user = userEvent.setup()
    
    render(
      <ReferencedData dataId="test" component={MockDataComponent}>
        <span>Hover me</span>
      </ReferencedData>
    )

    const trigger = screen.getByText('Hover me')
    await user.hover(trigger)

    await waitFor(() => {
      expect(screen.getByTestId('mock-data')).toBeInTheDocument()
    })
  })

  it('calls lifecycle callbacks correctly', async () => {
    const user = userEvent.setup()
    const onResolved = vi.fn()
    const onError = vi.fn()
    const onLoading = vi.fn()

    render(
      <ReferencedData 
        dataId="test" 
        component={MockDataComponent}
        onResolved={onResolved}
        onError={onError}
        onLoading={onLoading}
      >
        <span>Test</span>
      </ReferencedData>
    )

    const trigger = screen.getByText('Test')
    await user.hover(trigger)

    await waitFor(() => {
      expect(onLoading).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(onResolved).toHaveBeenCalledWith({ id: 'test', name: 'Test test' })
    })
  })

  it('handles error state correctly', async () => {
    const user = userEvent.setup()
    const onError = vi.fn()

    render(
      <ReferencedData 
        dataId="error" 
        component={MockDataComponent}
        onError={onError}
      >
        <span>Error Test</span>
      </ReferencedData>
    )

    const trigger = screen.getByText('Error Test')
    await user.hover(trigger)

    await waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  it('renders link when linkUrl is provided', async () => {
    const user = userEvent.setup()

    render(
      <ReferencedData 
        dataId="test" 
        component={MockDataComponent}
        linkUrl="/test/123"
      >
        <span>With Link</span>
      </ReferencedData>
    )

    const trigger = screen.getByText('With Link')
    await user.hover(trigger)

    await waitFor(() => {
      const link = screen.getByText('Detayları Gör →')
      expect(link).toBeInTheDocument()
      expect(link.closest('a')).toHaveAttribute('href', '/test/123')
    })
  })

  it('respects custom delay', async () => {
    const user = userEvent.setup()

    render(
      <ReferencedData 
        dataId="test" 
        component={MockDataComponent}
        delay={500}
      >
        <span>Delayed</span>
      </ReferencedData>
    )

    const trigger = screen.getByText('Delayed')
    await user.hover(trigger)

    // Should show after delay
    await waitFor(() => {
      expect(screen.getByTestId('mock-data')).toBeInTheDocument()
    }, { timeout: 1000 })
  })
})