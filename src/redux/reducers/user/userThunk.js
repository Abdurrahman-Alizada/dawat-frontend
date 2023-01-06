import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// register new user

export const userApi = createApi({

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dawat-backend.onrender.com',
    prepareHeaders: async (headers, {getState}) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User','Groups', 'CurrentLoginUser'],
  reducerPath: 'userApi',
  endpoints: build => ({
    
    registerUser : build.mutation({
      query: user => ({
        url: `/api/account/register`,
        method: 'POST',
        body: {
          name : user.name,
          email : user.email,
          password : user.password,
          passwordConfirmation : user.passwordConfirmation,
        },
      }),
      invalidatesTags: ['User'],
    }),

    loginUser : build.mutation({
      query: user => ({
        url: `/api/account/login`,
        method: 'POST',
        body: {
          email : user.email,
          password : user.password,
        },
      }),
      invalidatesTags: ['User','Groups'],
    }),
    getCurrentLoginUser: build.query({
      query: (id) => `/api/account/users/${id}`,
      providesTags: ['User'],
    }),
    // update user information - start
    updateName : build.mutation({
      query: user => ({
        url: `/api/account/users/${user.id}/updateName`,
        method: 'PATCH',
        body: {
          name : user.name,
        },
      }),
      invalidatesTags: ['User','Groups'],
    }),
    updateEmail : build.mutation({
      query: user => ({
        url: `/api/account/users/${user.id}/updateEmail`,
        method: 'PATCH',
        body: {
          email : user.email,
        },
      }),
      invalidatesTags: ['User','Groups'],
    }),
    updatePassword : build.mutation({
      query: user => ({
        url: `/api/account/users/${user.id}/updatePassword`,
        method: 'PATCH',
        body: {
          oldPassword : user.oldPassword,
          newPassword : user.newPassword
        },
      }),
      invalidatesTags: ['User','Groups'],
    }),
  }),
});

export const {
 useLoginUserMutation,
 useRegisterUserMutation,
 useUpdateNameMutation,
 useGetCurrentLoginUserQuery,
 useUpdateEmailMutation,
 useUpdatePasswordMutation
} = userApi;

