import {createSlice} from '@reduxjs/toolkit';
import {
  allInvitations,
} from './groupThunk';

const initialState = {
  totalgroups: [],
  groupLoader: true,
  invitations: [],
  invitationsLoader: false,
  tasks: [
    {
      id: '0',
      name: 'Task Name',
      checked: true,
      date: new Date(),
      description: 'Some random text..',
      responsibleAvatars: [
        'https://bootdey.com/img/Content/avatar/avatar6.png',
        'https://bootdey.com/img/Content/avatar/avatar7.png',
        'https://bootdey.com/img/Content/avatar/avatar2.png',
      ],
    },
  ],
  chat: [],
  groupsToDelete: [],
};

export const groupSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroupToDelete: (state, action) => {
      console.log('hello group', action.payload);
    },
  },
  extraReducers: {
    //get all groups
    

    //get all invitations
    [allInvitations.pending]: state => {
      state.invitationsLoader = true;
      console.log('pending');
    },
    [allInvitations.fulfilled]: (state, {payload}) => {
      // console.log('invitaions ', payload);
      state.invitationsLoader = false;
      state.invitations = payload;
    },
    [allInvitations.rejected]: state => {
      state.invitationsLoader = false;
      console.log('rejected');
    },

  },
});

// Action creators are generated for each case reducer function
export const {addGroupToDelete} = groupSlice.actions;

export default groupSlice.reducer;
