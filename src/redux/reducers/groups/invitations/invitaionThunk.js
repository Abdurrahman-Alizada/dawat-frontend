import {createAsyncThunk} from '@reduxjs/toolkit';
import {instance} from '../../axios';

// query
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-community/async-storage';

export const InvitaionsApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dawat-backend.herokuapp.com',
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
          groupId: message.groupId,
        },
      }),
      invalidatesTags: ['Invitations'],
    }),
  }),
});

export const {
  useGetAllInvitationsQuery,
  useAddInvitiMutation,
} = InvitaionsApi;

export const addNewInviti = createAsyncThunk(
  'group/inviti/addNewInviti',
  async message => {
    return fetch('https://dawat-backend.herokuapp.com/api/group/invitations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + message.token,
      },
      body: JSON.stringify({
        invitiName: message.invitiName,
        invitiDescription: message.invitiDescription,
        groupId: message.groupId,
      }),
    })
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error("error in addNewInviti",error);
      });
  },
);

export const allInvitations = createAsyncThunk(
  'group/invitations/allInvitations',
  async ({token, groupId}) => {
    return fetch(
      `https://dawat-backend.herokuapp.com/api/group/invitations/${groupId}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    )
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
);
