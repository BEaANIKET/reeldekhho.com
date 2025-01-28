import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  _id: string;
  senderId: string;
  content: string;
  isOwn: boolean;
  timestamp: string;
}

interface Chat {
  _id: string;
  profilePicture?: string;
  fullName: string;
}

interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  selectedChat: Chat | null;
  unSeenCount: Record<string, number>; // Update to a Record type
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  selectedChat: null,
  unSeenCount: {}, // Initialize as an empty object
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      const { chatId, messages } = action.payload;
      state.messages[chatId] = messages;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    setUnseenCount: (state, action: PayloadAction<{ userId: string; unseenCount: number }>) => {
      const { userId, unseenCount } = action.payload;
      state.unSeenCount[userId] = unseenCount; // Safely update unseen count
    },
    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload;
    },
    addCharts: (state, action: PayloadAction<Chat>) => {
      const user = action.payload;
      if (!state.chats.some(chat => chat._id === user._id)) {
        state.chats.push({ _id: user._id, fullName: user.fullName, profilePicture: user.profilePicture });
      }
    }
  },
});

export const { setChats, setMessages, addMessage, setSelectedChat, setUnseenCount, addCharts } = chatSlice.actions;
export default chatSlice.reducer;
