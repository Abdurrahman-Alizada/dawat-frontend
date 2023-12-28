import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  totalgroups: [],
  currentViewingGroup: {},
  isSearch: false,
  currentTab: 'Invitations',
  pinGroup: {},
  groupsFlag : false,
  groupSearchText :""
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
    handleIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    handlePinGroup: (state, action) => {
      state.pinGroup = action.payload;
    },
    handleGroupsFlag: (state, action) => {
      state.groupsFlag = action.payload;
    },
    handleGroupsSearchText: (state, action) => {
      state.groupSearchText = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  handlePinGroup,
  handleCurrentViewingGroup,
  handleCurrentTab,
  handleIsSearch,
  handleGroupsFlag,
  handleGroupsSearchText
} = groupSlice.actions;

export default groupSlice.reducer;
