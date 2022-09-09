import {createAsyncThunk} from '@reduxjs/toolkit';
import {instance} from '../../axios';

// return fetch('http://192.168.23.212:8000/api/group/addNewGroup/62fb751bc32b5a340888c625', {
export const addNewGroup = createAsyncThunk(
  'group/addNewGroup',
  async group => {
    return fetch(
      'https://dawat-backend.herokuapp.com/api/group/addNewGroup/62fb751bc32b5a340888c625',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: group.id,
          groupName: group.groupName,
          totalMembers: group.totalMembers,
        }),
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

export const allGroups = createAsyncThunk('group/allGroups', async () => {
  // const { data } = await instance.get("/api/group/allposts")
   return fetch(`https://dawat-backend.herokuapp.com/api/group`, {
    method: "GET",
    headers: {
      'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDM2NzcwNThjMDM3MjhmYzBhNTU0ZiIsImlhdCI6MTY2MTE2NzQ3MywiZXhwIjoxNjYzNzU5NDczfQ.KHDR-Tv1tFYMyDR1DWah9PbXV0ES89pmhASPvNJpC-I"
    }
  })
    .then(response => response.json())
    .then(json => {
      // console.log(json)
      return json;
    })
    .catch(error => {
      console.error(error);
    });
});

// return fetch(`https://dawat-backend.herokuapp.com/api/group/invitations/allInvitations`)
// export const allInvitations = createAsyncThunk(

export const allInvitations = createAsyncThunk(
  'group/allInvitations',
  async () => {
    return fetch(`https://dawat-backend.herokuapp.com/api/group/invitations/6314a23ffd34b28f7cc98c7f`, {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDM2NzcwNThjMDM3MjhmYzBhNTU0ZiIsImlhdCI6MTY2MTE2NzQ3MywiZXhwIjoxNjYzNzU5NDczfQ.KHDR-Tv1tFYMyDR1DWah9PbXV0ES89pmhASPvNJpC-I"
      }
    }
    )
      .then(response => response.json())
      .then(json => {
        // console.log(json)
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
);
