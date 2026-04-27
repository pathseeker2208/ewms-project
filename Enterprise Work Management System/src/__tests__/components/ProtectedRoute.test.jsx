import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ProtectedRoute from '../../components/ProtectedRoute';

const mockStore = configureStore([]);

const buildStore = (isLoggedIn, roles = []) =>
  mockStore({
    auth: {
      isLoggedIn,
      user: isLoggedIn ? { id: 1, name: 'Test', roles } : null,
    },
  });

const renderRoute = (isLoggedIn, roles = ['ROLE_EMPLOYEE']) =>
  render(
    <Provider store={buildStore(isLoggedIn, roles)}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-only"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <div>Admin Only Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe('ProtectedRoute Component', () => {
  it('redirects to /login when user is NOT authenticated (isLoggedIn=false)', () => {
    renderRoute(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected content when user IS authenticated (ROLE_EMPLOYEE)', () => {
    renderRoute(true, ['ROLE_EMPLOYEE']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders protected content for ROLE_ADMIN user', () => {
    renderRoute(true, ['ROLE_ADMIN']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders protected content for ROLE_MANAGER user', () => {
    renderRoute(true, ['ROLE_MANAGER']);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /unauthorized when authenticated user lacks required role', () => {
    render(
      <Provider store={buildStore(true, ['ROLE_EMPLOYEE'])}>
        <MemoryRouter initialEntries={['/admin-only']}>
          <Routes>
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
            <Route
              path="/admin-only"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <div>Admin Only Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });
});
