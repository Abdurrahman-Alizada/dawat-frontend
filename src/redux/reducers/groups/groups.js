import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  pinGroup: {},
  isSearch: false,
  groupsFlag : false,
  currentTab: 'Invitations',
  totalgroups: [],
  pinGroupFlag:true,
  groupSearchText :"",
  pinGroupLoading:false,
  currentViewingGroup: {},
  selectedGroupLength:0,
  currentBackgroundImgSrcId : 1,
  pinGroupId:null
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
    handleCurrentBackgroundImgSrcId: (state, action) => {
      state.currentBackgroundImgSrcId = action.payload;
    },
    handlePinGroupId: (state, action) => {
      state.pinGroupId = action.payload;
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
  handleSelectedGroupLength,
  handleCurrentBackgroundImgSrcId,
  handlePinGroupId
} = groupSlice.actions;

export default groupSlice.reducer;
