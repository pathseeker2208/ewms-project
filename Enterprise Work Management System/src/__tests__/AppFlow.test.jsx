import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { store } from '../store/store';
import AppRoutes from '../routes/AppRoutes';
import api from '../api/axios';
import ProjectService from '../api/project.service';

// Mock API calls
jest.mock('../api/axios');
jest.mock('../api/project.service');
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return { ...OriginalRecharts, ResponsiveContainer: ({ children }) => <div>{children}</div> };
});
jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return { ...OriginalRecharts, ResponsiveContainer: ({ children }) => <div>{children}</div> };
});

describe('App Integration Flow', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Mock Login Response
    api.post.mockResolvedValueOnce({
      data: {
        token: 'fake-jwt-token',
        id: 1,
        name: 'Integration Test Admin',
        email: 'admin@test.com',
        roles: ['ROLE_ADMIN']
      }
    });

    // Mock Projects List
    ProjectService.getAllProjects.mockResolvedValue({
      data: [
        { id: 101, name: 'Flow Project', description: 'Test Flow', status: 'IN_PROGRESS' }
      ]
    });

    // Mock Dashboard Activity
    api.get.mockResolvedValue({
      data: []
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('allows user to login and navigate to projects', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );

    // 1. Wait for the lazy-loaded Login page to render
    const heading = await screen.findByRole('heading', { name: /Sign in/i });
    expect(heading).toBeInTheDocument();

    // 2. Perform Login
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'admin@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // 3. Wait for redirect to Dashboard
    await waitFor(() => {
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
    });

    // 4. Verify Dashboard metrics are visible after login
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });
});
