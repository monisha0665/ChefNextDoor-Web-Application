import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import AdminDashboardPage from '../../../app/(admin)/admin/dashboard/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));
jest.mock('../../../lib/authContext', () => ({
  useAuth: () => ({ profile: { role: 'admin' }, loading: false })
}));
jest.mock('../../../lib/chefContext', () => ({
  useChefContext: () => ({ chefs: [], addChef: jest.fn(), deleteChef: jest.fn() })
}));

describe('AdminDashboardPage', () => {
  it('renders correctly', () => {
    render(<AdminDashboardPage />);
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });
});
