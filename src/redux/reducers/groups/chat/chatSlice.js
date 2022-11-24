import { createSlice } from '@reduxjs/toolkit'
import {allMessages, addNewMessage} from './chatThunk';

const initialState = {   
    messages : [],
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (state, action) =>{
      console.log(action.payload)
      const newchat = {
        addedBy : action.payload.addedBy,
        content : action.payload.content,
        groupId : action.groupId
      }
      state.messages.push(newchat)
    },
  },
  extraReducers :{
    [allMessages.pending]: state => {
        console.log('pending');
        // state.groupLoader = true;
      },
      [allMessages.fulfilled]: (state, {payload}) => {
        // state.groupLoader = false
        state.messages = payload;
        // console.log("messages are,", payload)
      },
      [allMessages.rejected]: state => {
        // state.groupLoader = false
        console.log('rejected');
      },
      

      [addNewMessage.pending]: state => {
        console.log('pending');
        // state.groupLoader = true;
      },
      [addNewMessage.fulfilled]: (state, {payload}) => {
        // state.groupLoader = false
        // state.messages = payload;
        console.log("messages is,", payload)
        // const newchat = {
        //   addedBy : payload.addedBy,
        //   content : payload.content,
        //   groupId : payload.group._id
        // }
        // state.messages.push(newchat)
      },
      [addNewMessage.rejected]: state => {
        // state.groupLoader = false
        console.log('rejected');
      },
   
  }
})

// Action creators are generated for each case reducer function
export const { addChat } = chatSlice.actions

export default chatSlice.reducer