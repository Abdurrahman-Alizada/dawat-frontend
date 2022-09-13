import {createAsyncThunk} from '@reduxjs/toolkit';

// return fetch('http://192.168.23.212:8000/api/group/addNewGroup/62fb751bc32b5a340888c625', {
export const addNewMessage = createAsyncThunk(
  'group/addNewMessage',
  async message => {
    return fetch(
      'https://dawat-backend.herokuapp.com/api/group/message',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',    
          'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMDM2NzcwNThjMDM3MjhmYzBhNTU0ZiIsImlhdCI6MTY2MTE2NzQ3MywiZXhwIjoxNjYzNzU5NDczfQ.KHDR-Tv1tFYMyDR1DWah9PbXV0ES89pmhASPvNJpC-I"
        },
        body: JSON.stringify({
          content: message.content,
          chatId : "63037595b8bf573b00bd8444",
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

export const allMessages = createAsyncThunk('group/allMessagess', async () => {
  // const { data } = await instance.get("/api/group/allposts")
   return fetch(`https://dawat-backend.herokuapp.com/api/group/message/6314a23ffd34b28f7cc98c7f`, {
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
