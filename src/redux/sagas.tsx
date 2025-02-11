import { put, takeEvery, call, select, all } from "@redux-saga/core/effects";

import axios from "axios";
import { fetch_news, fetch_news_success } from "./reducer";
import { newsData } from "./selector";
import { NewsState } from "utils/types";

const defaultImageLink =
  "https://img.freepik.com/free-photo/3d-rendering-illustration-letter-blocks-forming-word-news-white-background_181624-60840.jpg?semt=ais_hybrid";

function restructure(news) {
  return news.map((el) => ({
    ...el,
    image: el?.image || el?.urlToImage || defaultImageLink,
  }));
}

const fetchNewsOrgApi = ({ category, searchText }) =>
  axios.get(
    `https://newsapi.org/v2/top-headlines?country=us&category=${
      category === "all" ? "" : category
    }&apiKey=6c57e118ca124b998ef9367fed6f479a`
  );

const fetchWorldNewsApi = ({ category, searchText }) =>
  axios.get(
    "https://api.worldnewsapi.com/search-news?api-key=502bbe2c821b4594a70dbab2d62d58ea&source-country=us&language=en"
  );

function* fetchAllNews() {
  const { selectedCategory: category, searchText }: NewsState = yield select(
    newsData
  );
  console.log({ category, searchText });
  return;
  const [newsOrgRes, worldNewsApi] = yield all([
    call(fetchNewsOrgApi, { category, searchText }),
    call(fetchWorldNewsApi, { category, searchText }),
  ]);
  const {
    data: { articles },
  } = newsOrgRes;
  const {
    data: { news },
  } = worldNewsApi;
  yield put({
    type: fetch_news_success.type,
    payload: {
      "World News": restructure(news),
      "News Org": restructure(articles),
    },
  });
}

function* newsSaga() {
  yield takeEvery(fetch_news.type, fetchAllNews);
}

export default newsSaga;
