// __tests__/components/Cards/ElectionInfoCard.test.tsx
import { expect, test } from 'vitest'

import { render } from '@testing-library/react';
import ElectionInfoCard from '@/app/components/Cards/ElectionInfoCard';
import { TestWrapper } from '@/__tests__/test-utils';

test('renders ElectionInfoCard', () => {
  // Mock valid counts data
  const mockCounts = {
    total: 10,
    pending: 2,
    active: 5,
    ended: 3
  };

  render(
    <TestWrapper>
      <ElectionInfoCard 
        counts={mockCounts}
        filterStatus="all"
        setFilterStatus={() => {}}
      />
    </TestWrapper>
  );
});