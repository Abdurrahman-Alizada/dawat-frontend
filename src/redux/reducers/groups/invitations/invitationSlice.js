import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  invitations: [],
  invitationsCopyForSearch: [],
  invitationRefetch: false,
  isExportBanner: false,
  currentInviti: {},
  isInvitaionSearch: false,
  invitationSearchQuery : '',
  isInvitaionSummaryOpen : false,
};

export const invitationSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    handleIsExportBanner: (state, action) => {
      state.isExportBanner = action.payload;
    },
    handleCurrentInviti: (state, action) => {
      state.currentInviti = action.payload;
    },
    handleIsInvitationSearch: (state, action) => {
      state.isInvitaionSearch = action.payload;
    },
    handleInvitions: (state, action) => {
      state.invitations = action.payload;
      state.invitationsCopyForSearch = action.payload
    },
    handleInvitationSearch: (state, action) => {
      state.invitationSearchQuery = action.payload;

      if (action.payload) {
        const newData = state.invitationsCopyForSearch?.filter(item => {
          const itemData = item.invitiName
            ? item.invitiName.toUpperCase()
            : ''.toUpperCase();
          const textData = action.payload?.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        state.invitations = newData;
      } else {
        state.invitations = [];
      }
    },
    handleIsInvitaionSummaryOpen: (state, action) => {
      state.isInvitaionSummaryOpen = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  handleIsExportBanner,
  handleCurrentInviti,
  handleIsInvitationSearch,
  handleInvitions,
  handleInvitationSearch,
  handleIsInvitaionSummaryOpen
} = invitationSlice.actions;

export default invitationSlice.reducer;
