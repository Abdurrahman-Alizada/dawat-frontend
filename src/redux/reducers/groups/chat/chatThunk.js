import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';
import { baseURL } from '../../../axios';


export const ChatApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:baseURL,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Messages'],
  reducerPath: 'ChatApi',
  endpoints: build => ({
    getAllMessages: build.query({
      query: ({groupId}) => `/api/group/message/${groupId}`,
      providesTags: ['Messages'],
    }),
    addNewMessage: build.mutation({
      query: message => ({
        url: `/api/group/message`,
        method: 'POST',
        body: {
          content: message.content,
          groupId: message.groupId,
          addedBy : message.addedBy
        },
      }),
      invalidatesTags: ['Messages'],
    }),

  }),
});

export const {
  useGetAllMessagesQuery,
  useAddNewMessageMutation,
} = ChatApi;

