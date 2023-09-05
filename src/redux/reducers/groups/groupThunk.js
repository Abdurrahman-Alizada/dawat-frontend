
// query
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseURL } from '../../axios';

export const groupApi = createApi({

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
  tagTypes: ['Groups','GroupLogs'],
  reducerPath: 'groupApi',
  endpoints: build => ({
    getAllGroups: build.query({
      query: () => `/api/group`,
      providesTags: ['Groups'],
    }),
    addGroup: build.mutation({
      query: group => ({
        url: `/api/group/group`,
        method: 'POST',
        body: {
          groupName: group.groupName,
          groupDescription:group.groupDescription,
          imageURL:group.imageURL,
          isChat:group.isChat,
          isTasks:group.isTasks,
          isInvitations:group.isInvitations,
          isMute:group.isMute,
          users: group.members,
          time: group.time
        },
      }),
      invalidatesTags: ['Groups','GroupLogs'],
    }),

    updateGroupInfo: build.mutation({
      query: group => ({
        url: `/api/group/rename`,
        method: 'PUT',
        body: {
          chatId: group.groupId,
          groupName: group.groupName,
          groupDescription : group.groupDescription,
          imageURL:group.imageURL
        },
      }),
      invalidatesTags: ['Groups','GroupLogs'],
    }),

    updateGroupName: build.mutation({
      query: group => ({
        url: `/api/group/${group.groupId}/updateName`,
        method: 'PUT',
        body: {
          newGroupName: group.newGroupName,
          previousGroupName : group.previousGroupName,
        },
      }),
      invalidatesTags: ['Groups','GroupLogs'],
    }),

    updateGroupDescription: build.mutation({
      query: group => ({
        url: `/api/group/${group.groupId}/updateDescription`,
        method: 'PUT',
        body: {
          groupDescription: group.groupDescription,
        },
      }),
      invalidatesTags: ['Groups','GroupLogs'],
    }),

    updateImageURL: build.mutation({
      query: group => ({
        url: `/api/group/${group.groupId}/updateImageURL`,
        method: 'PUT',
        body: {
          imageURL: group.imageURL,
        },
      }),
      invalidatesTags: ['Groups','GroupLogs'],
    }),

    deleteGroupForUser: build.mutation({
      query: group => ({
        url: `/api/group/groupremove`,
        method: 'PUT',
        body: {
          chatId: group.chatId,
          userId: group.userId,
        },
      }),
      invalidatesTags: ['Groups','GroupLogs'],
    }),
    addUserToGroup: build.mutation({
      query: group => ({
        url: `/api/group/groupadd`,
        method: 'PUT',
        body: {
          chatId: group.chatId,
          userId: group.userId,
        },
      }),
      invalidatesTags: ['Groups'],
      providesTags:['Groups','GroupLogs']
    }),

    allLogsForGroup: build.query({
      query: ({groupId}) => `/api/group/logs/${groupId}`,
      providesTags: ['GroupLogs'],
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useAddGroupMutation,
  useDeleteGroupForUserMutation,
  useAddUserToGroupMutation,
  useUpdateGroupInfoMutation,
  useAllLogsForGroupQuery,
  useUpdateGroupNameMutation,
  useUpdateGroupDescriptionMutation,
  useUpdateImageURLMutation
} = groupApi;

// end query
