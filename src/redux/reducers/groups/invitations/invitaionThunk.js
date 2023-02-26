import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';

export const InvitaionsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dawat-backend.onrender.com',
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Invitations'],
  reducerPath: 'InvitationsApi',
  endpoints: build => ({
    getAllInvitations: build.query({
      query: ({groupId}) => `/api/group/invitations/${groupId}`,
      providesTags: ['Invitations'],
    }),
    addInviti: build.mutation({
      query: message => ({
        url: `/api/group/invitations`,
        method: 'POST',
        body: {
          invitiName: message.invitiName,
          invitiDescription: message.invitiDescription,
          invitiImageURL: message.invitiImageURL,
          lastStatus : message.lastStatus,
          groupId: message.groupId,
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
    updateInviti: build.mutation({
      query: inviti => ({
        url: `/api/group/invitations/update`,
        method: 'PUT',
        body: {
          invitiId: inviti.invitiId,
          invitiName: inviti.invitiName,
          invitiDescription: inviti.invitiDescription,
          lastStatus: inviti.lastStatus,
          invitiImageURL: inviti.invitiImageURL
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
    deleteInviti: build.mutation({
      query: inviti => ({
        url: `/api/group/invitations/delete`,
        method: 'DELETE',
        body: {
          invitiId: inviti.invitiId,
          groupId: inviti.groupId,
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
  }),
});

export const {
  useGetAllInvitationsQuery,
  useAddInvitiMutation,
  useUpdateInvitiMutation,
  useDeleteInvitiMutation
} = InvitaionsApi;


