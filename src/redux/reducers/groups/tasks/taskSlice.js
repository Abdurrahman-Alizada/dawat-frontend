import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  currentViewingTask :{}
};

export const invitationSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    handleCurrentViewingTask: (state, action) => {
      state.currentViewingTask = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { handleCurrentViewingTask} = invitationSlice.actions;

export default invitationSlice.reducer;
