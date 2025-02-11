import { createSlice } from "@reduxjs/toolkit";

export const newsSlice = createSlice({
  name: "news",
  initialState: {
    loading: true,
    selectedFilter: "",
    searchText: "",
    newsSources: [],
    newsPerSource: null,
    selectedSource: "",
    selectedCategory: "all",
    selectedLanguage: "en",
  },
  reducers: {
    set_loading: (state, { payload }) => {
      console.log({ payload });
      state.loading = payload;
    },
    set_category: (state, { payload }) => {
      state.loading = true;
      state.selectedCategory = payload?.toLowerCase();
    },
    set_searchText: (state, { payload }) => {
      state.loading = true;
      state.searchText = payload?.toLowerCase();
    },
    fetch_news: (state) => {
      state.loading = true;
    },
    fetch_news_error: (state) => {
      state.loading = false;
    },
    fetch_news_success: (state, { payload }) => {
      state.newsPerSource = payload;
      state.loading = false;
    },
  },
});

export const {
  set_loading,
  set_searchText,
  fetch_news,
  fetch_news_error,
  fetch_news_success,
  set_category,
} = newsSlice.actions;

export default newsSlice.reducer;
