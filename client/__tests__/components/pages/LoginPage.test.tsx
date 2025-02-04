import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import LoginPage from '@/app/components/Pages/LoginPage';
import { TestWrapper } from '@/__tests__/test-utils'; // Import the TestWrapper


test('renders LoginPage', () => {
  render(
  <TestWrapper>
    <LoginPage />
  </TestWrapper>
  )
  });

