import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IDocument } from '@models/IDocument';
import { RootState } from '../store';

export const documentsAPI = createApi({
  reducerPath: 'documentsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_BASE_URL as string,
    prepareHeaders: (headers, { getState }) => {
      const { auth0AccessToken, csrfToken } = (getState() as RootState).authorization;
      if (auth0AccessToken) headers.set('Authorization', `Bearer ${auth0AccessToken}`);
      if (csrfToken) headers.set('x-csrf-token', csrfToken);
      return headers;
    },
    credentials: 'include',
    mode: 'cors'
  }),
  tagTypes: ['Documents'],
  endpoints: (build) => ({
    fetchDocuments: build.query<{ data: IDocument[]; isSuccess: boolean; error?: string },
      null>({
      query: () => ({
        url: `/document`,
      }),
      providesTags: (result) => ['Documents'],
    }),
    createDocument: build.mutation<{ isSuccess: boolean; message?: string; error?: string },
      FormData>({
      query: (document) => ({
        url: `/document`,
        method: `POST`,
        body: document,
      }),
      invalidatesTags: (result) => ['Documents'],
    }),
    deleteDocument: build.mutation<{ isSuccess: boolean; message?: string; error?: string },
      string>({
      query: (docId) => ({
        url: `/document/${docId}`,
        method: `DELETE`,
      }),
      invalidatesTags: (result) => ['Documents'],
    }),
    updateDocument: build.mutation<{isSuccess: boolean, message?: string, error?: string}, IDocument>({
      query: (doc) => ({
        url: `/document/${doc._id}`,
        method: `PATCH`,
        body: doc,
      }),
      invalidatesTags: (result) => ['Documents'],
    }),
  }),
});
