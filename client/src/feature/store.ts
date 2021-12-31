import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authorizationReducer from './authorization/authorization-slice';
import { documentsAPI } from './documents/documents-api-slice';

const rootReducer = combineReducers({
  authorization: authorizationReducer,
  [documentsAPI.reducerPath]: documentsAPI.reducer,
});

export const setupStore = () => {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(documentsAPI.middleware),
    reducer: rootReducer,
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
