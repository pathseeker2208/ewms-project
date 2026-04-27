import reducer, { login, logout } from '../../store/slices/authSlice';

describe('authSlice Reducer', () => {
  const initialState = {
    isLoggedIn: false,
    user: null,
  };

  const mockUser = { id: 1, name: 'Test Admin', email: 'admin@test.com', roles: ['ROLE_ADMIN'] };

  it('returns the correct initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('sets isLoggedIn to true and stores user on login.fulfilled', () => {
    const state = reducer(initialState, {
      type: login.fulfilled.type,
      payload: { user: mockUser },
    });
    expect(state.isLoggedIn).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it('resets to initial state on login.rejected', () => {
    const loggedInState = { isLoggedIn: true, user: mockUser };
    const state = reducer(loggedInState, { type: login.rejected.type });
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
  });

  it('resets to initial state on logout.fulfilled', () => {
    const loggedInState = { isLoggedIn: true, user: mockUser };
    const state = reducer(loggedInState, { type: logout.fulfilled.type });
    expect(state.isLoggedIn).toBe(false);
    expect(state.user).toBeNull();
  });

  it('does not mutate state for unknown actions', () => {
    const current = { isLoggedIn: true, user: mockUser };
    const state = reducer(current, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(current);
  });
});
