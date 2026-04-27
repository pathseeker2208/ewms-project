import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Users from '../../pages/Users';
import UserService from '../../api/user.service';

jest.mock('../../api/user.service');

const mockUsers = [
  { id: 1, name: 'Admin', email: 'admin@test.com', role: 'ROLE_ADMIN', status: 'ACTIVE', lastActivity: new Date().toISOString() },
  { id: 2, name: 'Employee', email: 'emp@test.com', role: 'ROLE_EMPLOYEE', status: 'INACTIVE', lastActivity: null }
];

describe('Users Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserService.getAllUsers.mockResolvedValue({ data: mockUsers });
  });

  it('renders user management title', async () => {
    render(<Users />);
    expect(screen.getByText('User Management')).toBeInTheDocument();
  });

  it('fetches and displays users in the table', async () => {
    render(<Users />);
    await waitFor(() => {
      expect(screen.getByText('admin@test.com')).toBeInTheDocument();
      expect(screen.getByText('ROLE_ADMIN')).toBeInTheDocument();
      expect(screen.getByText('emp@test.com')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument(); // For null lastActivity
    });
  });

  it('handles user deletion after confirmation', async () => {
    window.confirm = jest.fn(() => true);
    UserService.deleteUser.mockResolvedValue({});
    render(<Users />);
    
    await waitFor(() => screen.getAllByText('Delete'));
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(window.confirm).toHaveBeenCalled();
    await waitFor(() => {
      expect(UserService.deleteUser).toHaveBeenCalledWith(1);
      expect(UserService.getAllUsers).toHaveBeenCalledTimes(2); // Initial + After delete
    });
  });

  it('does not delete if user cancels confirmation', async () => {
    window.confirm = jest.fn(() => false);
    render(<Users />);
    
    await waitFor(() => screen.getAllByText('Delete'));
    fireEvent.click(screen.getAllByText('Delete')[0]);
    
    expect(UserService.deleteUser).not.toHaveBeenCalled();
  });

  it('handles API errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    UserService.getAllUsers.mockRejectedValue(new Error('Fetch error'));
    render(<Users />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
