import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseURL} from '../../axios';
// register new user

export const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers, {getState}) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Groups', 'CurrentLoginUser'],
  reducerPath: 'userApi',
  endpoints: build => ({
    registerUser: build.mutation({
      query: user => ({
        url: `/api/account/user/register`,
        method: 'POST',
        body: {
          name: user.name,
          email: user.email,
          password: user.password,
          passwordConfirmation: user.passwordConfirmation,
        },
      }),
      invalidatesTags: ['User'],
    }),

    loginUser: build.mutation({
      query: user => ({
        url: `/api/account/user/login`,
        method: 'POST',
        body: {
          email: user.email,
          password: user.password,
        },
      }),
      invalidatesTags: ['User', 'Groups'],
    }),
    getCurrentLoginUser: build.query({
      query: id => `/api/account/users/${id}`,
      providesTags: ['User'],
    }),
    // update user information - start
    updateName: build.mutation({
      query: user => ({
        url: `/api/account/users/${user.id}/updateName`,
        method: 'PATCH',
        body: {
          name: user.name,
        },
      }),
      invalidatesTags: ['User', 'Groups'],
    }),
    updateEmail: build.mutation({
      query: user => ({
        url: `/api/account/users/${user.id}/updateEmail`,
        method: 'PATCH',
        body: {
          email: user.email,
        },
      }),
      invalidatesTags: ['User', 'Groups'],
    }),
    updatePassword: build.mutation({
      query: user => ({
        url: `/api/account/users/${user.id}/updatePassword`,
        method: 'PATCH',
        body: {
          oldPassword: user.oldPassword,
          newPassword: user.newPassword,
        },
      }),
      invalidatesTags: ['User', 'Groups'],
    }),
    resetPassword: build.mutation({
      query: user => ({
        url: `/api/account/user/${user.id}/resetPassword`,
        method: 'PATCH',
        body: {
          newPassword: user.newPassword,
        },
      }),
      invalidatesTags: ['User', 'Groups'],
    }),
    updateImageURL: build.mutation({
      query: user => ({
        url: `/api/account/users/${user.id}/updateImageURL`,
        method: 'PATCH',
        body: {
          imageURL: user.imageURL,
        },
      }),
      invalidatesTags: ['User'],
    }),
    // delete user by itself
    deleteUserByItself: build.mutation({
      query: id => ({
        url: `/api/account/users/${id}/deleleUserByItSelf`,
        method: 'DELETE',
        body: {
          reson: 'Reason will be here',
        },
      }),
      invalidatesTags: ['User'],
    }),

    // forgot password
    forgotPassword: build.mutation({
      query: email => ({
        url: `/api/account/user/forgotPassword`,
        method: 'POST',
        body: {
          email: email,
        },
      }),
      invalidatesTags: ['User'],
    }),
    // Verification of OTP For Password Recovery
    VerifyOTPForPasswordRecovery: build.mutation({
      query: ({email, OTP}) => ({
        url: `/api/account/user/VerifyOTPForPasswordRecovery`,
        method: 'POST',
        body: {
          email: email,
          OTP: OTP,
        },
      }),
      invalidatesTags: ['User'],
    }),
    // Resend email for registering new user
    resendEmailForUserRegistration: build.mutation({
      query: ({email}) => ({
        url: `/api/account/user/register/resendEmailForUserRegistration`,
        method: 'POST',
        body: {
          email: email,
        },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateNameMutation,
  useGetCurrentLoginUserQuery,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateImageURLMutation,
  useDeleteUserByItselfMutation,
  useForgotPasswordMutation,
  useVerifyOTPForPasswordRecoveryMutation,
  useResetPasswordMutation,
  useResendEmailForUserRegistrationMutation
} = userApi;
