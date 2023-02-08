import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  totalgroups: [],
  currentViewingGroup : {} 
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    handleCurrentViewingGroup: (state, action) => {
      state.currentViewingGroup = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {handleCurrentViewingGroup} = groupSlice.actions;

export default groupSlice.reducer;
