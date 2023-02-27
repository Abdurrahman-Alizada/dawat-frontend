import { createSlice } from '@reduxjs/toolkit'

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

})

// Action creators are generated for each case reducer function
export const { addChat } = chatSlice.actions

export default chatSlice.reducer