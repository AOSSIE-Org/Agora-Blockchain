import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';
import { TestWrapper } from '@/__tests__/test-utils'; // Import the TestWrapper


test('renders ProfilePage', () => {
  render(
  <TestWrapper>
    <ProfilePage />
  </TestWrapper>
  )
  });

