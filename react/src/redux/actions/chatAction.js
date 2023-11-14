import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        messages: [],
        mappedMessages: [],
        receiver: null
    },
    reducers: {
        createMessage(state, action) {
            const findItem = state.messages.find(it => it.id == action.payload.id);
            if(!findItem) state.messages.push(action.payload);
        },
        removeMessage(state, action) {
            const findItem = state.messages.findIndex(
                (item) =>
                    item.message == action.payload.message &&
                    item.username == action.payload.username
            );
            if (findItem > -1) {
                state.messages.splice(findItem, 1);
            }
        },
        initMessages(state, action) {
            state.messages = action.payload || [];
        },
        setReceiver(state, action) {
            state.receiver = action.payload;
        }
    },
});

export const { createMessage, removeMessage, initMessages, setReceiver } =
    chatSlice.actions;
export default chatSlice.reducer;
