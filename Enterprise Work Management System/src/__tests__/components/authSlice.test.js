import reducer, { login, logout } from '../../store/slices/authSlice';

describe('authSlice', () => {
  const initialState = {
    isLoggedIn: false,
    user: null,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle login.fulfilled', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@test.com', roles: ['ROLE_EMPLOYEE'] };
    const actual = reducer(initialState, {
      type: login.fulfilled.type,
      payload: { user: mockUser },
    });
    
    expect(actual.isLoggedIn).toEqual(true);
    expect(actual.user).toEqual(mockUser);
  });

  it('should handle login.rejected', () => {
    const actual = reducer(
      { isLoggedIn: true, user: { name: 'Test' } },
      { type: login.rejected.type }
    );
    
    expect(actual.isLoggedIn).toEqual(false);
    expect(actual.user).toEqual(null);
  });

  it('should handle logout.fulfilled', () => {
    const actual = reducer(
      { isLoggedIn: true, user: { name: 'Test' } },
      { type: logout.fulfilled.type }
    );
    
    expect(actual.isLoggedIn).toEqual(false);
    expect(actual.user).toEqual(null);
  });
});
