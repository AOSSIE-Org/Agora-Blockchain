import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ElectionDetails from '@/app/components/Cards/ElectionDetails'
import { TestWrapper } from '@/__tests__/test-utils'
import { useElectionData } from '@/app/hooks/ElectionInfo'

// Full module mock with TypeScript support
vi.mock('@/app/hooks/ElectionInfo', () => ({
  useElectionData: vi.fn(() => ({
    electionData: [],
  })),
}))

describe('ElectionDetails Component', () => {
  test('renders with valid data', () => {
    // Mock complete data structure
    vi.mocked(useElectionData).mockReturnValue({
      electionData: [
        { result: null },
        { result: null },
        { result: [1672531200, 1672617600] }, // Valid timestamp array
        { result: '2' }, // String type result
        { result: '15000' }, // String type result
      ],
    })

    render(
      <TestWrapper>
        <ElectionDetails />
      </TestWrapper>
    )

    
  })

  
})