import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import AppRoutes from '../../routes/AppRoutes';
import api from '../../api/axios';
import ProjectService from '../../api/project.service';

jest.mock('../../api/axios');
jest.mock('../../api/project.service');
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return { ...Original, ResponsiveContainer: ({ children }) => <div>{children}</div> };
});
jest.mock('../../layouts/MainLayout', () => {
  const { Outlet } = require('react-router-dom');
  return () => <div data-testid="main-layout"><Outlet /></div>;
});

const mockStore = configureStore([]);

const unauthStore = () => mockStore({ auth: { user: null, isLoggedIn: false } });
const authStore = () => mockStore({
  auth: {
    user: { id: 1, name: 'Admin User', email: 'admin@test.com', roles: ['ROLE_ADMIN'] },
    isLoggedIn: true,
  },
});

const setupApiMocks = () => {
  api.post.mockResolvedValue({
    data: { token: 'jwt-token', id: 1, name: 'Admin User', email: 'admin@test.com', roles: ['ROLE_ADMIN'] },
  });
  api.get.mockImplementation((url) => {
    if (url === '/dashboard/metrics') {
      return Promise.resolve({
        data: {
          totalProjects: 3, totalTasks: 12, completedTasks: 5, pendingTasks: 7,
          projectProgress: [{ name: 'Alpha', Tasks: 4, Completed: 2 }],
          statusBreakdown: [{ name: 'TODO', value: 7 }],
        },
      });
    }
    if (url === '/activity') {
      return Promise.resolve({
        data: [{ id: 1, action: 'Created', entityType: 'Project', timestamp: new Date().toISOString(), user: { name: 'Admin User' } }],
      });
    }
    return Promise.resolve({ data: [] });
  });
  ProjectService.getAllProjects.mockResolvedValue({ data: [] });
};

afterEach(() => jest.clearAllMocks());
beforeEach(() => {
  localStorage.clear();
  setupApiMocks();
});

describe('Integration: Full User Workflow', () => {
  it('Step 1: Login page renders all form elements', async () => {
    render(
      <Provider store={unauthStore()}>
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    const heading = await screen.findByRole('heading', { name: /sign in/i }, { timeout: 8000 });
    expect(heading).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('Step 2: Unauthenticated user is redirected to /login from /dashboard', async () => {
    render(
      <Provider store={unauthStore()}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    const heading = await screen.findByRole('heading', { name: /sign in/i }, { timeout: 8000 });
    expect(heading).toBeInTheDocument();
  });

  it('Step 3: Authenticated admin can access the Dashboard', async () => {
    render(
      <Provider store={authStore()}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
    }, { timeout: 10000 });
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
  });

  it('Step 4: Dashboard shows correct metrics from API', async () => {
    render(
      <Provider store={authStore()}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // totalProjects
      expect(screen.getByText('12')).toBeInTheDocument(); // totalTasks
    }, { timeout: 10000 });
  });

  it('Step 5: Authenticated user can access protected routes like /settings', async () => {
    render(
      <Provider store={authStore()}>
        <MemoryRouter initialEntries={['/settings']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    // Settings page lazy-loads — wait for its heading
    const settingsHeading = await screen.findByText(/settings/i, {}, { timeout: 8000 });
    expect(settingsHeading).toBeInTheDocument();
  });
});
