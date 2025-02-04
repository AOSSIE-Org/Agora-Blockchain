import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import HomePage from '@/app/components/Pages/HomePage';
import { TestWrapper } from '@/__tests__/test-utils'; // Import the TestWrapper


test('renders HomePage', () => {
  render(
  <TestWrapper>
    <HomePage />
  </TestWrapper>
  )
  });

