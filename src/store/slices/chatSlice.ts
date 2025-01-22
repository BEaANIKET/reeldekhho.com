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
}

const initialState: ChatState = {
  chats: [],
  messages: {},
  selectedChat: null,
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
    setSelectedChat: (state, action: PayloadAction<Chat | null>) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setChats, setMessages, addMessage, setSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;