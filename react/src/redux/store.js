import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./actions/articleAction";
import userReducer from "./actions/userAction";
import chatReducer from './actions/chatAction';

const store = configureStore({
    reducer: {
        user: userReducer,
        article: articleReducer,
        chat: chatReducer,
    },
});

console.log("INIT STATE: ", store.getState());

store.subscribe(() => {
    console.log("STATE CHANGE: ", store.getState());
});

export default store;
