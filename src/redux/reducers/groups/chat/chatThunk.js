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
          'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJuYW1lIjoiS2hhbiAiLCJlbWFpbCI6InN1ZGRhaXNoYWgyMDE3QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA4JG5ZOC5lZUFWTElhbDk5a0lUcmNyV3Uzc0hhWnZrcE50c0ZYQ0hZMS9ycDJWWVJqNTQ2M3dlIiwiaXNBZG1pbiI6ZmFsc2UsImdyb3VwcyI6W10sIl9pZCI6IjYzMmI2MjdlNTRiNjBmMTFlYjEyMTRmYyIsImNyZWF0ZWRBdCI6IjIwMjItMDktMjFUMTk6MTQ6MDYuNTQxWiIsInVwZGF0ZWRBdCI6IjIwMjItMDktMjFUMTk6MTQ6MDYuNTQxWiIsIl9fdiI6MH0sImlhdCI6MTY2Mzc4NzY0NiwiZXhwIjoxNjY2Mzc5NjQ2fQ.aJJGTTQOwSU62tAyN4NEPR4zERpoJsJLY0JiZLeYSio"
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
      'Authorization': 'Bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6eyJuYW1lIjoiS2hhbiAiLCJlbWFpbCI6InN1ZGRhaXNoYWgyMDE3QGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiJDJhJDA4JG5ZOC5lZUFWTElhbDk5a0lUcmNyV3Uzc0hhWnZrcE50c0ZYQ0hZMS9ycDJWWVJqNTQ2M3dlIiwiaXNBZG1pbiI6ZmFsc2UsImdyb3VwcyI6W10sIl9pZCI6IjYzMmI2MjdlNTRiNjBmMTFlYjEyMTRmYyIsImNyZWF0ZWRBdCI6IjIwMjItMDktMjFUMTk6MTQ6MDYuNTQxWiIsInVwZGF0ZWRBdCI6IjIwMjItMDktMjFUMTk6MTQ6MDYuNTQxWiIsIl9fdiI6MH0sImlhdCI6MTY2Mzc4NzY0NiwiZXhwIjoxNjY2Mzc5NjQ2fQ.aJJGTTQOwSU62tAyN4NEPR4zERpoJsJLY0JiZLeYSio"
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
