import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RegisterPage from '../../../app/register/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() })
}));
jest.mock('../../../lib/api', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn()
}));

describe('RegisterPage', () => {
  it('renders correctly', () => {
    render(<RegisterPage />);
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@example.com')).toBeInTheDocument();
  });
});
