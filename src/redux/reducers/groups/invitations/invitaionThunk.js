import {createAsyncThunk} from '@reduxjs/toolkit';
// query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  reducerPath: 'pokemonApi',
  endpoints: (build) => ({
    getPokemonByName: build.query({
      query: (name) => `pokemon/${name}`,
    }),
  }),
})

export const { useGetPokemonByNameQuery } = api
//end query

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
