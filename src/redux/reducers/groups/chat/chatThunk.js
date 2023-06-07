import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

    deleteMessages: build.mutation({
      query: data => ({
        url: `/api/group/message/delete`,
        method: 'DELETE',
        body: {
          groupId: data.groupId,
          userId : data.userId, 
          messages : data.messages
        },
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetAllMessagesQuery,
  useAddNewMessageMutation,
  useDeleteMessagesMutation
} = ChatApi;

