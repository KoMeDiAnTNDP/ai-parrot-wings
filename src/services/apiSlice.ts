import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://0.0.0.0:3001' }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/sessions/create',
        method: 'POST',
        body: credentials,
      }),
    }),
    getUserInfo: builder.query({
      query: (token) => ({
        url: '/api/protected/user-info',
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getUsers: builder.mutation({
      query: ({ filter, token }) => ({
        url: '/api/protected/users/list',
        method: 'POST',
        body: { filter }, // ✅ Fixed body structure
        headers: { Authorization: `Bearer ${token}` }, // ✅ Fixed headers
      }),
    }),
    createTransaction: builder.mutation({
      query: ({ name, amount, token }) => ({
        url: '/api/protected/transactions',
        method: 'POST',
        body: { name, amount },
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
    getTransactions: builder.query({
      query: (token) => ({
        url: '/api/protected/transactions',
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUserInfoQuery,
  useGetUsersMutation, // ✅ Ensure hook export
  useCreateTransactionMutation,
  useGetTransactionsQuery,
} = api;
