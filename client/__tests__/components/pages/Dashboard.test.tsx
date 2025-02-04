import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import Dashboard from '@/app/components/Pages/Dashboard';
import { TestWrapper } from '@/__tests__/test-utils'; // Import the TestWrapper


test('renders Dashboard', () => {
  render(
  <TestWrapper>
    <Dashboard />
  </TestWrapper>
  )
  });