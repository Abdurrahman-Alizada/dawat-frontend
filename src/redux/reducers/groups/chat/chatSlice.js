import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  isMessagesSelected: false,
  isConfirmDialogVisible: false,
  selectedMessageIds: [],
  selectedMessages: [],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addChat: (state, action) => {
      const newchat = {
        addedBy: action.payload.addedBy,
        content: action.payload.content,
        groupId: action.groupId,
      };
      state.messages.push(newchat);
    },
    messagesHandler: (state, action) => {
      state.messages = action.payload;
    },
    isMessagesSelectedHandler: (state, action) => {
      state.isMessagesSelected = action.payload;
    },
    addToselectedMessageIdsHandler: (state, action) => {
      const include = state.selectedMessageIds.includes(action.payload._id);
      if (include) {
       
        state.selectedMessageIds = state.selectedMessageIds.filter(
          userId => userId !== action.payload._id,
        );

        state.selectedMessages = state.selectedMessages.filter(
          message => message._id !== action.payload._id,
        );
      
      } else {
        state.selectedMessageIds = [...state.selectedMessageIds, action.payload._id];
        state.selectedMessages = [...state.selectedMessages, action.payload];
      }
      if (state.selectedMessageIds.length < 1) {
        state.isMessagesSelected = false;
        state.selectedMessageIds = [];
        state.selectedMessages = [];
      }
    },

    selectedMessageIdsClearHandler: (state, action) => {
      state.isMessagesSelected = false;
      state.selectedMessageIds = [];
      state.selectedMessages = [];
    },

    deleteselectedMessageIds: (state, action) => {
      let i = 0;
      for (i = 0; i < state.selectedMessageIds.length; i++) {
          state.messages = state.messages.filter(
            message => message._id !== state.selectedMessageIds[i],
          );
      }

      state.isConfirmDialogVisible = false
      state.isMessagesSelected = false;
      state.selectedMessageIds = []
      state.selectedMessages = []
    },
    
    removeDeletedMessagesFromArray : (state,action) =>{
      state.messages = state.messages.filter(
        message => message._id !== action.payload
      );
    },

    isConfirmDialogVisibleHandler: (state, action) => {
      state.isConfirmDialogVisible = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addChat,
  messagesHandler,
  addToselectedMessageIdsHandler,
  isMessagesSelectedHandler,
  deleteselectedMessageIds,
  selectedMessageIdsClearHandler,
  isConfirmDialogVisibleHandler,
  removeDeletedMessagesFromArray
} = chatSlice.actions;

export default chatSlice.reducer;
