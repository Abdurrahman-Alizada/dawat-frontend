import {createAsyncThunk} from '@reduxjs/toolkit';
import {instance} from '../../axios';

// query
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';
export const groupApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dawat-backend.herokuapp.com',
    prepareHeaders: async (headers, {getState}) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Groups'],
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
          users: group.members,
        },
      }),
      invalidatesTags: ['Groups'],
    }),

    deleteGroupForUser: build.mutation({
      query: group => ({
        url: `/api/group/groupremove`,
        method: 'PUT',
        body: {
          chatId: group.groupId,
          userId: group.userId,
        },
      }),
      invalidatesTags: ['Groups'],
    }),
  }),
});

export const {
  useGetAllGroupsQuery,
  useAddGroupMutation,
  useDeleteGroupForUserMutation,
} = groupApi;

// end query


export const allInvitations = createAsyncThunk(
  'group/allInvitations',
  async token => {
    const data = await instance
      .get('api/group/invitations/6314a23ffd34b28f7cc98c7f', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // console.log("response is", response.data)
        return response.data;
      })
      .catch(e => {
        console.log('error in allInvitations is', e);
      });
    if (data.length > 0) {
      return data;
    } else {
      return [];
    }
  },
);
