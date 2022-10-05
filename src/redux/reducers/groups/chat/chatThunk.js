import {createAsyncThunk} from '@reduxjs/toolkit';
import { instance } from '../../../axios';
// return fetch('http://192.168.23.212:8000/api/group/addNewGroup/62fb751bc32b5a340888c625', {
export const addNewMessage = createAsyncThunk(
  'group/addNewMessage',
  async message => {
    return fetch('https://dawat-backend.herokuapp.com/api/group/message', {
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
