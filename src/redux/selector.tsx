import { createSelector } from "@reduxjs/toolkit";

interface StateData {
  loading: boolean;
  newsPerSource: {
    [key: string]: any;
  };
  selectedCategory: string;
  searchText: string;
  selectedSource: string;
  hasError: boolean;
  newsOrgNews: [];
  newYorkNews: [];
  guardianNews: [];
  pagination: {
    page: number;
    perPage: number;
    pages: number;
  };
}

const newsState = (state = { news: {} }) => state?.news || {};

export const newsData = createSelector(
  newsState,
  (newsState: StateData) => newsState
);
