import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Settings from '../../pages/Settings';
import { ColorModeContext } from '../../theme/ThemeContext';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import api from '../../api/axios';
import { toast } from 'react-toastify';

jest.mock('../../api/axios');
jest.mock('react-toastify');

const mockStore = configureStore([]);
const store = mockStore({
  auth: { user: { name: 'John Doe' } }
});

const mockToggle = jest.fn();

const renderSettings = (mode = 'light') => {
  render(
    <Provider store={store}>
      <ColorModeContext.Provider value={{ toggleColorMode: mockToggle, mode }}>
        <Settings />
      </ColorModeContext.Provider>
    </Provider>
  );
};

describe('Settings Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and sections', () => {
    renderSettings();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('toggles dark mode', () => {
    renderSettings('light');
    const switchInput = screen.getByLabelText('Toggle Dark Mode');
    fireEvent.click(switchInput);
    expect(mockToggle).toHaveBeenCalled();
  });

  it('submits profile updates successfully', async () => {
    api.put.mockResolvedValue({ data: 'Profile updated!' });
    renderSettings();
    
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } });
    fireEvent.click(screen.getByText('Save Changes'));
    
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith('/users/profile', expect.objectContaining({ name: 'Jane Doe' }));
      expect(toast.success).toHaveBeenCalledWith('Profile updated!');
    });
  });

  it('handles profile update failure', async () => {
    api.put.mockRejectedValue(new Error('Failed'));
    renderSettings();
    
    fireEvent.click(screen.getByText('Save Changes'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update profile');
    });
  });

  it('uses default values from store', () => {
    renderSettings();
    expect(screen.getByLabelText(/name/i).value).toBe('John Doe');
  });
});
