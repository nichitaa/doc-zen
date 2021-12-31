import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthorizationState {
  auth0AccessToken: string | null;
}

const initialState: AuthorizationState = {
  auth0AccessToken: null,
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
  },
});

export const { setToken, clearToken } = authorizationSlice.actions;
export default authorizationSlice.reducer;



