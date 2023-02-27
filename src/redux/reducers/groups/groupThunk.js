
// query
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';
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
  tagTypes: ['Groups', 'User'],
  reducerPath: 'groupApi',
  endpoints: build => ({
    getAllGroups: build.query({
      query: () => `/api/group`,
      providesTags: ['Groups', 'User'],
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
        },
      }),
      invalidatesTags: ['Groups'],
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
      invalidatesTags: ['Groups'],
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
      invalidatesTags: ['Groups'],
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
      providesTags:['Groups']
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useAddGroupMutation,
  useDeleteGroupForUserMutation,
  useAddUserToGroupMutation,
  useUpdateGroupInfoMutation
} = groupApi;

// end query
