import { expect, test } from 'vitest'
import { render } from '@testing-library/react';
import ChatBot from '@/app/components/ChatBot/ChatBot';
import { TestWrapper } from '@/__tests__/tests-utils'; // Import the TestWrapper


test('renders ChatBot', () => {
  render(
  <TestWrapper>
    <ChatBot />
  </TestWrapper>
  )
  });
