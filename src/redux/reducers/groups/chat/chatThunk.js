import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';

import {createAsyncThunk} from '@reduxjs/toolkit';
import { instance } from '../../../axios';


export const ChatApi = createApi({
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







export const addNewMessage = createAsyncThunk(
  'group/addNewMessage',
  async message => {
    return fetch('https://dawat-backend.onrender.com/api/group/message', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + message.token
      },
      body: JSON.stringify({
        content: message.content,
        groupId: message.groupId,
        addedBy : message.addedBy
      }),
    })
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
);

export const allMessages = createAsyncThunk(
  'group/allMessagess',
  async ({groupId, token}) => {
    const data = await instance
      .get(`/api/group/message/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // console.log("response is", response.data)
        return response.data;
      })
      .catch(e => {
        console.log('error in allMessages is', e);
      });
    if (data.length > 0) {
      return data;
    } else {
      return [];
    }
  },
);

