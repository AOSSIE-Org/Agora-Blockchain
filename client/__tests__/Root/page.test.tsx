import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import Home from '@/app/page'; // Adjust the path accordingly
import { TestWrapper } from '../tests-utils';

test('renders Home', () => {
  render(
  <TestWrapper>
    <Home/>
  </TestWrapper>
  )
  });
