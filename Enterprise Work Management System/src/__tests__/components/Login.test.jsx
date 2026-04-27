import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/Login';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import api from '../../api/axios';

jest.mock('../../api/axios');

const mockStore = configureStore([]);
const store = mockStore({ auth: { user: null, isLoading: false, error: null } });

const renderLogin = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders the Sign In heading', () => {
    renderLogin();
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders email and password input fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders a Sign In button', () => {
    renderLogin();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('allows user to type into email and password fields', () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email address/i);
    const passInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'admin@test.com' } });
    fireEvent.change(passInput, { target: { value: 'admin123' } });
    expect(emailInput.value).toBe('admin@test.com');
    expect(passInput.value).toBe('admin123');
  });

  it('has a link to the Sign Up page', () => {
    renderLogin();
    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
  });
});
