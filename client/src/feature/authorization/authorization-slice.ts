import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthorizationState {
  auth0AccessToken: string | null;
  csrfToken: string | null;
}

const initialState: AuthorizationState = {
  auth0AccessToken: null,
  csrfToken: null
};

const authorizationSlice = createSlice({
  name: 'authorization',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.auth0AccessToken = action.payload;
    },
    clearToken(state) {
      state.auth0AccessToken = null;
    },
    setCSRFToken(state, action: PayloadAction<string>) {
      state.csrfToken = action.payload;
    },
    clearCSRFToken(state) {
      state.csrfToken = null;
    }
  },
});

export const { setToken, clearToken, setCSRFToken, clearCSRFToken } = authorizationSlice.actions;
export default authorizationSlice.reducer;



