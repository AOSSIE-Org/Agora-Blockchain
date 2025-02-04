import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ElectionMini from '@/app/components/Cards/ElectionMini'
import { TestWrapper } from '@/__tests__/test-utils'

// Mock the hooks
vi.mock('@/app/components/Hooks/GetMiniElectionInfo', () => ({
  useMiniElectionInfo: () => ({
    electionInfo: [1672531200, 1672617600, 'Test Election', 'Test Description'],
    isLoading: false,
  }),
  useMiniOwnerInfo: () => ({
    owner: '0x1234567890123456789012345678901234567890',
    loadingOwner: false,
  }),
}))

test('renders ElectionMini with mock data', () => {
  render(
    <TestWrapper>
      <ElectionMini 
        electionAddress="0x0000000000000000000000000000000000000000"
      />
    </TestWrapper>
  )

  
})