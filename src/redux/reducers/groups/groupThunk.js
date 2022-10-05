import {createAsyncThunk} from '@reduxjs/toolkit';
import {instance} from '../../axios';

export const addNewGroup = createAsyncThunk(
  'group/addNewGroup',
  async group => {
    return fetch('https://dawat-backend.herokuapp.com/api/group/group', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + group.token,
      },
      body: JSON.stringify({
        // id: group.id,
        groupName: group.groupName,
        users: group.members,
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log("adlfkj",json)
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
);

export const deleteGroupForUser = createAsyncThunk(
  'group/deleteGroupForUser',
  async group => {
    return fetch('https://dawat-backend.herokuapp.com/api/group/groupremove', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + group.token,
      },
      body: JSON.stringify({
        chatId: group.groupId,
        userId: group.userId,
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

export const allGroups = createAsyncThunk(
  'group/allGroups',
  async ({token}) => {
    const data = await instance
      .get('/api/group', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        // console.log("response is", response.data)
        return response.data;
      })
      .catch(e => {
        console.log('error in group is', e);
      });
    if (data.length > 0) {
      return data;
    } else {
      return [];
    }
  },
);

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
