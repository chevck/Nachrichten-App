import { put, takeEvery, call, select } from "@redux-saga/core/effects";
import axios from "axios";
import {
  fetch_guardian_news,
  fetch_news_error,
  fetch_news_org,
  fetch_news_success,
  fetch_ny_news,
  fetch_world_news,
} from "./reducer";
import { newsData } from "./selector";
import { NewsOrgParams, NewsState } from "../utils/types";
import {
  NEWS_ORG,
  GUARDIAN_NEWS,
  NEW_YORK_NEWS,
  WORLD_NEWS,
} from "../utils/constants";
import { toast } from "react-toastify";

const defaultImageLink =
  "https://img.freepik.com/free-photo/3d-rendering-illustration-letter-blocks-forming-word-news-white-background_181624-60840.jpg?semt=ais_hybrid";

function restructure(news) {
  return news.map((el) => ({
    ...el,
    title: el?.title || el?.headline?.main || el?.webTitle,
    summary: el?.summary || el?.content?.split("...")[0] || el?.lead_paragraph,
    image: el?.image || el?.urlToImage || defaultImageLink,
    publishedDate:
      el?.publishedDate ||
      el?.webPublicationDate ||
      el?.publishedAt ||
      new Date(),
    id: el?.id ?? Math.floor(Math.random() * 2302010201) + 1,
    author: el?.author || el?.byline?.original || "Author Jane",
    url: el?.url || el?.webUrl || el?.web_url,
  }));
}

const newsOrgCall = ({
  category,
  searchText,
  pagination: { perPage, page },
}) => {
  const params: Partial<NewsOrgParams> = {
    apiKey: process.env.REACT_APP_NEWS_API,
    pageSize: perPage,
    page: page,
  };
  if (category && category !== "all") params.category = category;
  if (searchText) params.q = searchText;
  const queryString = new URLSearchParams(params).toString();
  return axios.get(
    `https://newsapi.org/v2/top-headlines?country=us&${queryString}`
  );
};

function* fetchNewsOrg() {
  try {
    const {
      selectedCategory: category,
      searchText,
      pagination,
    }: NewsState = yield select(newsData);
    const {
      data: { articles, totalResults },
    } = yield call(newsOrgCall, { category, searchText, pagination });
    yield put({
      type: fetch_news_success.type,
      payload: {
        caller: NEWS_ORG,
        totalResultsLength: totalResults,
        data: restructure(articles),
      },
    });
  } catch (err) {
    yield put({ type: fetch_news_error.type });
    return toast.error(
      "Something went wrong fetching news org data. Please try again later."
    );
  }
}

const newYorkNewsCall = ({ searchText, category, pagination: { page } }) => {
  const params: {
    "api-key": string;
    page: string;
    q?: string;
    category?: string;
    perPage?: string;
  } = {
    "api-key": process.env.REACT_APP_NEW_YORK_NEWS_API,
    page,
    perPage: "5",
  };
  if (searchText) params.q = searchText;
  if (category && category !== "all") params.category = category;
  const queryString = new URLSearchParams(params).toString();
  return axios.get(
    `https://api.nytimes.com/svc/search/v2/articlesearch.json?${queryString}`
  );
};

function* fetchNewYorkNews() {
  try {
    const {
      selectedCategory: category,
      searchText,
      pagination,
    }: NewsState = yield select(newsData);
    const {
      data: {
        response: {
          docs,
          meta: { hits },
        },
      },
    } = yield call(newYorkNewsCall, {
      category,
      searchText,
      pagination,
    });
    yield put({
      type: fetch_news_success.type,
      payload: {
        caller: NEW_YORK_NEWS,
        totalResultsLength: hits,
        data: restructure(
          docs.map((el) => ({
            ...el,
            image: `https://www.nytimes.com/${el?.multimedia[0]?.url}`,
          }))
        ),
      },
    });
  } catch (error) {
    console.error("Error fetching news org data:", error);
    yield put({ type: fetch_news_error.type });
    return toast.error(
      "Something went wrong fetching new york news. Please try again later."
    );
  }
}

const guardianNewsCall = ({
  category,
  searchText,
  pagination: { page, perPage },
}) => {
  const params: {
    "api-key": string;
    page: string;
    q?: string;
    section?: string;
    "page-size": string;
  } = {
    "api-key": process.env.REACT_APP_GUARDIAN_NEWS_API,
    page: page + 1, // guardian pagination starts at 1
    "page-size": perPage,
  };
  if (searchText) params.q = searchText;
  if (category && category !== "all") params.section = category;
  const queryString = new URLSearchParams(params).toString();
  return axios.get(`https://content.guardianapis.com/search?${queryString}`);
};

function* fetchGuardianNews() {
  try {
    const {
      selectedCategory: category,
      searchText,
      pagination,
    }: NewsState = yield select(newsData);
    const {
      data: {
        response: { results, total },
      },
    } = yield call(guardianNewsCall, {
      category,
      searchText,
      pagination,
    });
    yield put({
      type: fetch_news_success.type,
      payload: {
        caller: GUARDIAN_NEWS,
        totalResultsLength: total,
        data: restructure(results),
      },
    });
  } catch (error) {
    console.error("Error fetching news org data:", error);
    yield put({ type: fetch_news_error.type });
    return toast.error(
      "Something went wrong fetching guardian news. Please try again later."
    );
  }
}

const worldNewsCall = ({
  searchText,
  category,
  pagination: { page, perPage },
}) => {
  const params: {
    "api-key": string;
    offset: string;
    text?: string;
    categories?: string;
    number: string;
    language: string;
  } = {
    "api-key": process.env.REACT_APP_WORLD_NEWS_API,
    number: perPage,
    offset: (page * perPage).toString(),
    language: "en",
  };
  if (searchText) params.text = searchText;
  if (category && category !== "all") params.categories = category;
  const queryString = new URLSearchParams(params).toString();
  return axios.get(`https://api.worldnewsapi.com/search-news?${queryString}`);
};

function* fetchWorldNews() {
  try {
    const {
      selectedCategory: category,
      searchText,
      pagination,
    }: NewsState = yield select(newsData);
    const {
      data: { available, news },
    } = yield call(worldNewsCall, {
      searchText,
      category,
      pagination,
    });
    yield put({
      type: fetch_news_success.type,
      payload: {
        caller: WORLD_NEWS,
        totalResultsLength: available,
        data: restructure(news),
      },
    });
  } catch (error) {
    console.error("Error fetching world news data:", error);
    yield put({ type: fetch_news_error.type });
    return toast.error(
      "Something went wrong fetching world news. Please try again later."
    );
  }
}

function* newsSaga() {
  yield takeEvery(fetch_news_org.type, fetchNewsOrg);
  yield takeEvery(fetch_ny_news.type, fetchNewYorkNews);
  yield takeEvery(fetch_guardian_news.type, fetchGuardianNews);
  yield takeEvery(fetch_world_news.type, fetchWorldNews);
}

export default newsSaga;
