import { createSlice } from "@reduxjs/toolkit";
import { Navigate } from "react-router-dom";


const userSlice = createSlice({
    name: "user",
    initialState: {
        token: localStorage.getItem("TOKEN") || "",
        data: {},
        list: [],
        pageIndex: 1,
        pageRows: 5,
    },
    reducers: {
        setToken(state, action) {
            state.token = action.payload.token;
            localStorage.setItem("TOKEN", action.payload.token);
        },
        setUser(state, action) {
            state.data = action.payload.user;
        },
        createUser(state, action) {
            const findItem = state.list.find(
                (item) => item.id == action.payload.user.id
            );
            if (!findItem) {
                state.list.push(action.payload.user);
            }
        },
        updateUser(state, action) {
            const findItem = state.list.findIndex(
                (item) => item.id == action.payload.id
            );
            if (findItem > -1) {
                state.list[findItem] = action.payload;
            }
        },
        removeUser(state, action) {
            const findItem = state.list.findIndex(
                (item) => item.id == action.payload.id
            );
            if (findItem > -1) {
                state.list.splice(findItem, 1);
            }
        },
        logout(state, action) {
            state.token = "";
            state.data = null;
            localStorage.removeItem("TOKEN");
        },
        setUserList(state, action) {
            state.list = action.payload;
        },
        setUsersPageIndex(state, action) {
            state.pageIndex = action.payload.index;
        }
    },
});

export const {
    setToken,
    setUser,
    createUser,
    updateUser,
    removeUser,
    logout,
    setUserList,
    setUsersPageIndex,
} = userSlice.actions;
export default userSlice.reducer;
