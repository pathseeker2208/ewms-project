import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import ProtectedRoute from '../../components/ProtectedRoute';

const mockStore = configureStore([]);

const renderWithRouterAndRedux = (ui, store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
          <Route path="/protected" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('ProtectedRoute', () => {
  it('redirects to /login if user is not logged in', () => {
    const store = mockStore({ auth: { isLoggedIn: false, user: null } });
    renderWithRouterAndRedux(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      store
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children if user is logged in and no specific role is required', () => {
    const store = mockStore({ auth: { isLoggedIn: true, user: { roles: ['ROLE_EMPLOYEE'] } } });
    renderWithRouterAndRedux(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>,
      store
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to /unauthorized if user lacks required role', () => {
    const store = mockStore({ auth: { isLoggedIn: true, user: { roles: ['ROLE_EMPLOYEE'] } } });
    renderWithRouterAndRedux(
      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      store
    );

    expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
  });

  it('renders children if user has required role', () => {
    const store = mockStore({ auth: { isLoggedIn: true, user: { roles: ['ROLE_ADMIN'] } } });
    renderWithRouterAndRedux(
      <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
        <div>Admin Content</div>
      </ProtectedRoute>,
      store
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
