import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import ProfilePage from '@/app/profile/page';
import { TestWrapper } from '../tests-utils';

test('renders ProfilePage', () => {
  render(
  <TestWrapper>
    <ProfilePage />
  </TestWrapper>
  )
  });
