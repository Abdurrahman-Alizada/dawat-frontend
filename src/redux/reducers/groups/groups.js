import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  totalgroups: [],
  currentViewingGroup: {},
  isSearch: false,
  currentTab: 'Invitations',
  pinGroup: {},
  groupsFlag : false,
  groupSearchText :"",
  pinGroupFlag:true,
  pinGroupLoading:false,
  selectedGroupLength:0
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
    handlePinGroupFlag: (state, action) => {
      state.pinGroup = action.payload;
    },
    handlePinGroupLoading: (state, action) => {
      state.pinGroupLoading = action.payload;
    },
    handleGroupsFlag: (state, action) => {
      state.groupsFlag = action.payload;
    },
    handleGroupsSearchText: (state, action) => {
      state.groupSearchText = action.payload;
    },
    handleSelectedGroupLength: (state, action) => {
      state.selectedGroupLength = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  handlePinGroup,
  handlePinGroupFlag,
  handlePinGroupLoading,
  handleCurrentViewingGroup,
  handleCurrentTab,
  handleIsSearch,
  handleGroupsFlag,
  handleGroupsSearchText,
  handleSelectedGroupLength
} = groupSlice.actions;

export default groupSlice.reducer;
