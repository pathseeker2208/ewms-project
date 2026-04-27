import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import AppRoutes from '../routes/AppRoutes';
import api from '../api/axios';

jest.mock('../api/axios');
jest.mock('../layouts/MainLayout', () => {
  const { Outlet } = require('react-router-dom');
  return () => <div data-testid="main-layout"><Outlet /></div>;
});
jest.mock('recharts', () => {
  const Original = jest.requireActual('recharts');
  return { ...Original, ResponsiveContainer: ({ children }) => <div>{children}</div> };
});

const mockStore = configureStore([]);
const unauthStore = () => mockStore({ auth: { user: null, isLoggedIn: false } });
const authStore = (role = 'ROLE_ADMIN') => mockStore({
  auth: { user: { id: 1, name: 'Test User', roles: [role] }, isLoggedIn: true },
});

beforeEach(() => {
  localStorage.clear();
  api.get.mockResolvedValue({ data: { totalProjects: 0, totalTasks: 0, completedTasks: 0, pendingTasks: 0, projectProgress: [], statusBreakdown: [] } });
});
afterEach(() => jest.clearAllMocks());

describe('App - Root Application Routing', () => {
  it('renders the login page at /login for unauthenticated users', async () => {
    render(
      <Provider store={unauthStore()}>
        <MemoryRouter initialEntries={['/login']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    const heading = await screen.findByRole('heading', { name: /sign in/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the signup page at /signup', async () => {
    render(
      <Provider store={unauthStore()}>
        <MemoryRouter initialEntries={['/signup']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    const heading = await screen.findByRole('heading', { name: /sign up/i });
    expect(heading).toBeInTheDocument();
  });

  it('redirects unauthenticated users from /dashboard to /login', async () => {
    render(
      <Provider store={unauthStore()}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    const heading = await screen.findByRole('heading', { name: /sign in/i });
    expect(heading).toBeInTheDocument();
  });

  it('redirects unauthenticated users from /projects to /login', async () => {
    render(
      <Provider store={unauthStore()}>
        <MemoryRouter initialEntries={['/projects']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    const heading = await screen.findByRole('heading', { name: /sign in/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders Dashboard for an authenticated user at /dashboard', async () => {
    render(
      <Provider store={authStore()}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <AppRoutes />
        </MemoryRouter>
      </Provider>
    );
    await screen.findByText('Total Projects');
    expect(screen.queryByText('Total Tasks')).toBeInTheDocument();
  });
});
