
import { createSlice } from '@reduxjs/toolkit'

const initialState = [    
    {
        user: 0,
        time: "11:04",
        content: "Salam",
    },
    {
        user: 1,
        time: "12:05",
        content: "What's up",
    },
    {
        user: 1,
        time: "12:07",
        content: "How is it going?",
    },
    {
        user: 0,
        time: "12:09",
        content: "things are going great",
    },
    {
        user: 0,
        time: "12:00",
        content: "Good :)",
    },
    {
        user: 1,
        time: "12:05",
        content: "Should we hang out tomorrow? I was thinking of going somewhere which has drinks",
    },
    {
        user: 0,
        time: "12:07",
        content: "Sure",
    },
    {
        user: 1,
        time: "12:09",
        content: "Great",
    },
    {
        user: 0,
        time: "12:07",
        content: "7 o'clock?",
    },
    {
        user: 1,
        time: "12:09",
        content: "Sounds good",
    },

]

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (state, action) =>{
    //   console.log(action.payload)
      const newchat = {
        user : action.payload.user,
        time:action.payload.time,
        content : action.payload.content,
      }
      state.push(newchat)
    },
  },
})

// Action creators are generated for each case reducer function
export const { addChat } = chatSlice.actions

export default chatSlice.reducer