import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import ElectionDash from '@/app/components/Cards/ElectionDash';
import { TestWrapper } from '@/__tests__/test-utils'; // Import the TestWrapper


test('renders ElectionDash', () => {
  render(
  <TestWrapper>
    <ElectionDash />
  </TestWrapper>
  )
  });

