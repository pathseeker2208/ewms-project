import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../api/auth.service';

const user = JSON.parse(localStorage.getItem('user'));

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await AuthService.login(email, password);
      localStorage.setItem('jwt_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      return { user: response.data };
    } catch (error) {
      const payload = error.response && error.response.data 
        ? error.response.data 
        : { message: 'Network Error: Cannot connect to backend server. Make sure Spring Boot is running.' };
      return thunkAPI.rejectWithValue(payload);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, role }, thunkAPI) => {
    try {
      const response = await AuthService.register(name, email, password, role);
      return response.data;
    } catch (error) {
      const payload = error.response && error.response.data 
        ? error.response.data 
        : { message: 'Network Error: Cannot connect to backend server. Make sure Spring Boot is running.' };
      return thunkAPI.rejectWithValue(payload);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  AuthService.logout();
});

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
