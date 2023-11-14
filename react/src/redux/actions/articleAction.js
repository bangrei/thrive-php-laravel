import { createSlice } from "@reduxjs/toolkit";

const articleSlice = createSlice({
    name: "article",
    initialState: {
        list: [],
        pageIndex: 1,
        pageRows: 5,
    },
    reducers: {
        createArticle(state, action) {
            const findItem = state.list.find(
                (item) => item.id == action.payload.article.id
            );
            if (!findItem) {
                state.list.push(action.payload.article);
            }
        },
        updateArticle(state, action) {
            const findItem = state.list.findIndex(
                (item) => item.id == action.payload.id
            );
            if (findItem > -1) {
                state.list[findItem] = action.payload;
            }
        },
        removeArticle(state, action) {
            const findItem = state.list.findIndex(
                (item) => item.id == action.payload.id
            );
            if (findItem > -1) {
                state.list.splice(findItem, 1);
            }
        },
        setArticleList(state, action) {
            state.list = action.payload;
        },
        setArticlesPageIndex(state, action) {
            state.pageIndex = action.payload.index;
        },
    },
});

export const {
    createArticle,
    updateArticle,
    removeArticle,
    setArticleList,
    setArticlesPageIndex,
} = articleSlice.actions;
export default articleSlice.reducer;
