import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  requested : [],
  accepted : [],
  suggestions : [],
  all: [],
};

export const FriendshipSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    handleFriends: (state, action) => {
      console.log("hello handle",action.payload)
    },
  },

});

// Action creators are generated for each case reducer function
export const {handleFriends} = FriendshipSlice.actions;

export default FriendshipSlice.reducer;
