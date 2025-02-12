/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import { LoadingScreen } from "components/loading-screen";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetch_guardian_news,
  fetch_news_org,
  fetch_ny_news,
  set_category,
  set_filter,
  set_loading,
  set_news_source,
  set_searchText,
} from "../redux/reducer";
import { newsData } from "../redux/selector";
import { CustomPagination } from "components/pagination";
import {
  GUARDIAN_NEWS,
  NEW_YORK_NEWS,
  NEWS_ORG,
  WORLD_NEWS,
} from "utils/constants";
import { EmptyState } from "components/empty";

export function NewsLanding() {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("for-you");
  const {
    loading,
    newsPerSource = {},
    selectedCategory,
    searchText,
    selectedSource: selectedNewsSource,
    hasError,
    newYorkNews,
    newsOrgNews,
    pagination,
    guardianNews,
  } = useSelector(newsData);

  console.log({
    loading,
    newYorkNews,
    newsOrgNews,
    guardianNews,
    selectedCategory,
    searchText,
    pagination,
  });

  useEffect(() => {
    console.log({ selectedNewsSource });
    if (selectedNewsSource === NEWS_ORG) dispatch(fetch_news_org());
    if (selectedNewsSource === NEW_YORK_NEWS) dispatch(fetch_ny_news());
    if (selectedNewsSource === GUARDIAN_NEWS) dispatch(fetch_guardian_news());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedNewsSource,
    searchText,
    pagination.perPage,
    pagination.page,
    selectedCategory,
  ]);

  const handleSearch = ({ target: { value } }) => {
    const fetchNewsTimeout = setTimeout(() => {
      dispatch(set_searchText(value));
    }, 1500);
    return () => clearTimeout(fetchNewsTimeout);
  };

  const articles = useMemo(() => {
    if (selectedNewsSource === NEWS_ORG) return newsOrgNews;
    if (selectedNewsSource === NEW_YORK_NEWS) return newYorkNews;
    if (selectedNewsSource === GUARDIAN_NEWS) return guardianNews;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    guardianNews,
    newYorkNews,
    newsOrgNews,
    selectedNewsSource,
    // newYorkNews.length,
    // newsOrgNews.length,
    // guardianNews.length,
  ]);

  console.log({ articles });

  return (
    <div className='news-landing-container'>
      <div className='_header'>
        <div className='logo-section'>
          <p className='app-text-logo'>📰 Nachrichten</p>
          <input
            className='form-control'
            placeholder='Search'
            onChange={handleSearch}
          />
        </div>
        <div className='subscribe-section'>
          <div>
            <i className='bi bi-globe'></i>
          </div>
          <button>Subscribe</button>
        </div>
      </div>
      <div className='_news-body container-fluid'>
        <div className='row'>
          <div className='col-3'>
            <div className='_sources'>
              <h4>Sources</h4>
              <ul>
                {[
                  // { text: "World News", key: WORLD_NEWS },
                  { text: "News Org.", key: NEWS_ORG },
                  { text: "New York News", key: NEW_YORK_NEWS },
                  { text: "Guardian News", key: GUARDIAN_NEWS },
                ].map((el) => (
                  <li
                    key={el.key}
                    onClick={() => {
                      dispatch(set_news_source(el.key));
                      setTimeout(() => dispatch(set_loading(false)), 2000);
                    }}
                    className={
                      el?.key?.toLowerCase() ===
                      selectedNewsSource?.toLowerCase()
                        ? "active"
                        : ""
                    }
                  >
                    {el.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className='_categories'>
              <ul>
                {[
                  "All",
                  "Politics",
                  "Entertainment",
                  "Business",
                  "Health",
                  "Sports",
                  "Technology",
                  "Science",
                ].map((el) => (
                  <li
                    key={el}
                    onClick={() => dispatch(set_category(el))}
                    className={
                      selectedCategory.toLowerCase() === el.toLowerCase()
                        ? "active"
                        : ""
                    }
                  >
                    {el}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='col-9'>
            <ul className='nav nav-underline filter-headers'>
              <li className='nav-item'>
                <a
                  className={`nav-link ${
                    selectedTab === "for-you" ? "active" : ""
                  }`}
                  aria-current='page'
                  href='#'
                  onClick={() => setSelectedTab("for-you")}
                >
                  For You
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link ${
                    selectedTab === "top-stories" ? "active" : ""
                  }`}
                  href='#'
                  onClick={() => setSelectedTab("top-stories")}
                >
                  Top Stories
                </a>
              </li>
              <li className='nav-item'>
                <a
                  className={`nav-link ${
                    selectedTab === "bookmarked" ? "active" : ""
                  }`}
                  href='#'
                  onClick={() => setSelectedTab("bookmarked")}
                >
                  Bookmarked
                </a>
              </li>
            </ul>
            {(hasError || !articles.length) && !loading ? (
              <EmptyState
                text={
                  !articles.length
                    ? "There are no articles for this news source."
                    : ""
                }
              />
            ) : null}
            {loading ? (
              <LoadingScreen />
            ) : (
              articles.map((article) => (
                <div className='news-content' key={article.id}>
                  <div className='details'>
                    <p>
                      {article?.author} <i className='bi bi-dot'></i> Jul. 15{" "}
                      {article?.publish_date}
                    </p>
                    <h5>{article?.title}</h5>
                    <h6>{article?.summary}</h6>
                    <a href={article?.url} target='_blank' rel='noreferrer'>
                      Read more <i className='bi bi-box-arrow-in-up-right'></i>
                    </a>
                  </div>
                  <img
                    src={article?.image}
                    alt='news-pic'
                    className='img-fluid'
                  />
                </div>
              ))
            )}
            {!hasError && articles.length ? (
              <div className='row footer'>
                <div />
                <CustomPagination />
                <select
                  className='form-control'
                  onChange={({ target: { value } }) =>
                    dispatch(set_filter({ limit: value }))
                  }
                  value={pagination.perPage}
                >
                  {[2, 5, 10, 20, 30, 40].map((el) => (
                    <option key={el}>{el}</option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
