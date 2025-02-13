export const WORLD_NEWS = "world-news";
export const NEWS_ORG = "news-org";
export const GUARDIAN_NEWS = "guardian-news";
export const NEW_YORK_NEWS = "new-york-news";

export const CATEGORIES = [
  "All",
  "Politics",
  "Entertainment",
  "Business",
  "Health",
  "Sports",
  "Technology",
  "Science",
  "Football",
];

export const API_CONFIG = {
  NEWS_API: process.env.REACT_APP_NEWS_API,
  WORLD_NEWS_API: process.env.REACT_APP_WORLD_NEWS_API,
  GUARDIAN_API: process.env.REACT_APP_GUARDIAN_NEWS_API,
  NY_TIMES_API: process.env.REACT_APP_NEW_YORK_NEWS_API,
} as const;
