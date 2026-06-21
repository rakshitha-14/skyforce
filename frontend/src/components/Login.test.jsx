import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Login from './Login';

// Mock AuthContext hook to isolate the test from the context provider wrapper
vi.mock('../context/AuthContext', () => {
  return {
    useAuth: () => ({
      login: vi.fn(),
      register: vi.fn(),
    }),
  };
});

test('renders Login component and verifies email and password inputs are present', () => {
  render(<Login />);
  
  // Verify that the email and password inputs are present in the DOM
  const emailInput = screen.getByPlaceholderText('name@company.com');
  const passwordInput = screen.getByPlaceholderText('••••••••');
  
  expect(emailInput).toBeDefined();
  expect(passwordInput).toBeDefined();
});
