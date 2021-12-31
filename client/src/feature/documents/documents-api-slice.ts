import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IDocument } from '@models/IDocument';
import { RootState } from '../store';

export const documentsAPI = createApi({
  reducerPath: 'documentsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_REACT_APP_API_BASE_URL as string,
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).authorization
        .auth0AccessToken;
      if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  }),
  tagTypes: ['Documents'],
  endpoints: (build) => ({
    fetchDocuments: build.query<
      { data: IDocument[]; isSuccess: boolean; error?: string },
      null
    >({
      query: () => ({
        url: `/document`,
      }),
      providesTags: (result) => ['Documents'],
    }),
    createDocument: build.mutation<
      { isSuccess: boolean; message?: string; error?: string },
      FormData
    >({
      query: (document) => ({
        url: `/document`,
        method: `POST`,
        body: document,
      }),
      invalidatesTags: (result) => ['Documents'],
    }),
    deleteDocument: build.mutation<
      { isSuccess: boolean; message?: string; error?: string },
      string
    >({
      query: (docId) => ({
        url: `/document/${docId}`,
        method: `DELETE`,
      }),
      invalidatesTags: (result) => ['Documents'],
    }),
    updateDocument: build.mutation<{}, IDocument>({
      query: (doc) => ({
        url: `/document/${doc._id}`,
        method: `PATCH`,
        body: doc,
      }),
      invalidatesTags: (result) => ['Documents'],
    }),
  }),
});
