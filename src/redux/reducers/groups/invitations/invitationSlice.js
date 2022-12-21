import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  invitations: [],
  invitationRefetch : false
};

export const invitationSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {},
  
});

// Action creators are generated for each case reducer function
export const {} = invitationSlice.actions;

export default invitationSlice.reducer;
