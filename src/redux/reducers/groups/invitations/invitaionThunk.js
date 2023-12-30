import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseURL} from '../../../axios';
export const InvitaionsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async headers => {
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
          lastStatus: message.lastStatus,
          groupId: message.groupId,
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
    addMultipleInviti: build.mutation({
      query: data => ({
        url: `/api/group/invitations/addMultiple`,
        method: 'POST',
        body: {
          invities: data.invities,
          groupId: data.groupId,
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
          invitiImageURL: inviti.invitiImageURL,
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
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        try {
         dispatch(
            InvitaionsApi.util.updateQueryData('getAllInvitations', undefined, draft => {
              return draft.filter(invitation => invitation._id !== arg?.invitiId);
            }),
          );
          // console.log("first",aa)
        } catch (err) {
          console.log('error in delete query', err);
        }
      },
      invalidatesTags: ['Invitations'],
    }),
    deleteMultipleInviti: build.mutation({
      query: inviti => ({
        url: `/api/group/invitations/deleteMultiple`,
        method: 'DELETE',
        body: {
          invities: inviti.invities,

          groupId: inviti.groupId,
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
    updateInvitiStatus: build.mutation({
      query: inviti => ({
        url: `/api/group/invitations/${inviti.id}/updateInviteStatus`,
        method: 'PATCH',
        body: {
          lastStatus: inviti.lastStatus,
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
    updateStatusOfMultipleInvities: build.mutation({
      query: data => ({
        url: `/api/group/invitations/updateStatusOfMultipleInvities`,
        method: 'PATCH',
        body: {
          invities: data.invities,
          lastStatus: data.lastStatus,
          groupId: data.groupId,
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
    getInvitationsSummary: build.query({
      query: ({groupId}) => `api/group/invitations/${groupId}/invitiesSummary`,
      providesTags: ['Invitations'],
    }),
  }),
});

export const {
  useGetAllInvitationsQuery,
  useAddInvitiMutation,
  useUpdateInvitiMutation,
  useDeleteInvitiMutation,
  useUpdateInvitiStatusMutation,
  useAddMultipleInvitiMutation,
  useDeleteMultipleInvitiMutation,
  useUpdateStatusOfMultipleInvitiesMutation,
  useGetInvitationsSummaryQuery,
} = InvitaionsApi;
