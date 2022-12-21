import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
};

export const invitationSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = invitationSlice.actions;

export default invitationSlice.reducer;
