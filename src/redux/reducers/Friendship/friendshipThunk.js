import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { baseURL } from '../../axios';
export const friendshipApi = createApi({

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
  tagTypes: ['Friend'],
  reducerPath: 'friendshipApi',
  endpoints: build => ({
    
    sendFriendRequest : build.mutation({
      query: ({userA, userB}) => ({
        url: `/api/friendship/sendRequest`,
        method: 'POST',
        body: {
          userA : userA,
          userB : userB
        },
      }),
      invalidatesTags: ['Friend'],
    }),

    acceptFriendRequest : build.mutation({
      query: ({userA, userB}) => ({
        url: `/api/friendship/acceptRequest`,
        method: 'POST',
        body: {
          userA : userA,
          userB : userB,
        },
      }),
      invalidatesTags: ['Friend'],
    }),

    declineFriendRequest : build.mutation({
      query: ({userA, userB}) => ({
        url: `/api/friendship/declineRequest`,
        method: 'POST',
        body: {
          userA : userA,
          userB : userB,
        },
      }),
      invalidatesTags: ['Friend'],
    }),
    getAllFriends: build.query({
      query: (userId) => `/api/friendship/getFriends/${userId}`,
      providesTags: ['Friend'],
    }),
  }),
});

export const {
 useAcceptFriendRequestMutation,
 useDeclineFriendRequestMutation,
 useGetAllFriendsQuery,
 useGetFriendsSuggestionMutation,
 useGetRequestesOfFriendsMutation,
 useSendFriendRequestMutation
} = friendshipApi;

