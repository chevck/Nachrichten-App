import { createSlice } from "@reduxjs/toolkit";
import { GUARDIAN_NEWS, NEW_YORK_NEWS, NEWS_ORG } from "utils/constants";

export const newsSlice = createSlice({
  name: "news",
  initialState: {
    loading: true,
    selectedFilter: "",
    searchText: "",
    guardianNews: [],
    newsOrgNews: [],
    newYorkNews: [],
    newsSources: [],
    newsPerSource: null,
    selectedSource: NEWS_ORG,
    selectedCategory: "all",
    selectedLanguage: "en",
    hasError: false,
    pagination: {
      page: 0,
      perPage: 5,
      pages: 0,
    },
  },
  reducers: {
    set_loading: (state, { payload }) => {
      console.log({ payload });
      state.loading = payload;
    },
    set_category: (state, { payload }) => {
      state.loading = true;
      state.selectedCategory = payload?.toLowerCase();
      state.pagination.page = 0;
    },
    set_searchText: (state, { payload }) => {
      state.loading = true;
      state.searchText = payload?.toLowerCase();
    },
    set_filter: (state, { payload }) => {
      console.log({ payload }, "filter payload");
      if (payload["limit"]) state.pagination.perPage = Number(payload.limit);
      if (payload["page"]) state.pagination.page = Number(payload.page);
    },
    fetch_news_org: (state) => {
      state.loading = true;
      state.pagination = { ...state.pagination, perPage: 5 };
      // state.selectedFilter = NEWS_ORG;
      // state.newsOrgNews = [];
    },
    fetch_ny_news: (state) => {
      state.loading = true;
    },
    fetch_guardian_news: (state) => {
      state.loading = true;
    },
    fetch_news: (state) => {
      state.loading = true;
    },
    fetch_news_error: (state) => {
      state.loading = false;
      state.hasError = true;
    },
    fetch_news_success: (state, { payload }) => {
      console.log({ payload });
      if (payload.caller === NEWS_ORG) state.newsOrgNews = payload.data;
      if (payload.caller === NEW_YORK_NEWS) state.newYorkNews = payload.data;
      if (payload.caller === GUARDIAN_NEWS) state.guardianNews = payload.data;
      state.pagination.pages = Math.ceil(
        payload.totalResultsLength / state.pagination.perPage
      );
      state.loading = false;
    },
    set_news_source: (state, { payload }) => {
      state.loading = true;
      state.selectedSource = payload;
      state.selectedCategory = "all";
      state.pagination.page = 0;
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
  set_news_source,
  fetch_news_org,
  fetch_ny_news,
  fetch_guardian_news,
  set_filter,
} = newsSlice.actions;

export default newsSlice.reducer;
