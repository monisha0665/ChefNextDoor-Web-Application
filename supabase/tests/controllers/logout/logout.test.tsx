import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import LogoutPage from '../../../app/logout/page';
import { logoutUser } from '../../../lib/api';

jest.mock('../../../lib/api', () => ({
  logoutUser: jest.fn().mockResolvedValue(true)
}));

describe('LogoutPage', () => {
  it('renders correctly and calls logoutUser', async () => {
    render(<LogoutPage />);
    expect(screen.getByText('Signing you out…')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(logoutUser).toHaveBeenCalled();
      expect(screen.getByText("You've been logged out")).toBeInTheDocument();
    });
  });
});
