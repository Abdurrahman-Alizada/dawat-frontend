import {createAsyncThunk} from '@reduxjs/toolkit';

// return fetch('http://192.168.23.212:8000/api/group/addNewGroup/62fb751bc32b5a340888c625', {
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
