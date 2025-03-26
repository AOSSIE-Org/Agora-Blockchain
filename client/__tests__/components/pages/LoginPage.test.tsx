import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import LoginPage from '@/app/components/Pages/LoginPage';
import { TestWrapper } from '@/__tests__/tests-utils';

test('renders LoginPage', () => {
  render(
  <TestWrapper>
    <LoginPage />
  </TestWrapper>
  )
  });
