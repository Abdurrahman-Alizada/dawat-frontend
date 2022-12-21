import {createSlice} from '@reduxjs/toolkit';

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
});

// Action creators are generated for each case reducer function
export const {addGroupToDelete} = groupSlice.actions;

export default groupSlice.reducer;
