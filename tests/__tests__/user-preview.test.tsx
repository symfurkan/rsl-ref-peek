import { render, screen, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { UserPreview } from '../../examples/basic/user-preview'

// Mock the fetch function
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('UserPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows loading state initially', () => {
    const onLoading = vi.fn()
    
    render(
      <UserPreview
        dataId="user_123"
        onLoading={onLoading}
      />
    )

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
    expect(onLoading).toHaveBeenCalled()
  })

  it('displays user data after successful fetch', async () => {
    const onResolved = vi.fn()
    
    render(
      <UserPreview
        dataId="user_123"
        onResolved={onResolved}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(onResolved).toHaveBeenCalledWith({
      id: 'user_123',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin'
    })
  })

  it('displays different user data for different IDs', async () => {
    render(
      <UserPreview dataId="user_456" />
    )

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    }, { timeout: 2000 })

    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('shows error state for unknown user', async () => {
    const onError = vi.fn()
    
    render(
      <UserPreview
        dataId="user_999"
        onError={onError}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Error loading user')).toBeInTheDocument()
    })

    expect(screen.getByText('User not found')).toBeInTheDocument()
    expect(onError).toHaveBeenCalledWith(expect.any(Error))
  })

  it('calls all lifecycle callbacks in correct order', async () => {
    const onLoading = vi.fn()
    const onResolved = vi.fn()
    const onError = vi.fn()
    
    render(
      <UserPreview
        dataId="user_123"
        onLoading={onLoading}
        onResolved={onResolved}
        onError={onError}
      />
    )

    // onLoading should be called first
    expect(onLoading).toHaveBeenCalled()

    // onResolved should be called after data loads
    await waitFor(() => {
      expect(onResolved).toHaveBeenCalled()
    })

    // onError should not be called for successful fetch
    expect(onError).not.toHaveBeenCalled()
  })

  it('handles network delay correctly', async () => {
    render(<UserPreview dataId="user_123" />)

    // Should show loading initially
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('reloads data when dataId changes', async () => {
    const onResolved = vi.fn()
    const { rerender } = render(
      <UserPreview dataId="user_123" onResolved={onResolved} />
    )

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    }, { timeout: 2000 })

    expect(onResolved).toHaveBeenCalledTimes(1)

    // Change dataId
    rerender(<UserPreview dataId="user_456" onResolved={onResolved} />)

    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    }, { timeout: 2000 })

    expect(onResolved).toHaveBeenCalledTimes(2)
  })
})