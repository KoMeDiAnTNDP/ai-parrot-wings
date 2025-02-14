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
      query: (filter) => ({
        url: '/api/protected/users/list',
        method: 'POST',
        body: { filter },
        headers: { Authorization: `Bearer ${filter.token}` },
      }),
    }),
    createTransaction: builder.mutation({
      query: (transactionData) => ({
        url: '/api/protected/transactions',
        method: 'POST',
        body: transactionData,
        headers: { Authorization: `Bearer ${transactionData.token}` },
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
  useGetUsersMutation,
  useCreateTransactionMutation,
  useGetTransactionsQuery,
} = api;
