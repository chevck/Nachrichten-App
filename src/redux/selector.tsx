import { createSelector } from "@reduxjs/toolkit";

interface StateData {
  loading: boolean;
  newsPerSource: {
    [key: string]: any;
  };
  selectedCategory: string;
  searchText: string;
}

const newsState = (state = { news: {} }) => state?.news || {};

export const newsData = createSelector(
  newsState,
  (newsState: StateData) => newsState
);
