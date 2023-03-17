import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  totalgroups: [],
  currentViewingGroup : {},
  currentTab : "Invitations"
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    handleCurrentViewingGroup: (state, action) => {
      state.currentViewingGroup = action.payload;
    },
    handleCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {handleCurrentViewingGroup, handleCurrentTab} = groupSlice.actions;

export default groupSlice.reducer;
