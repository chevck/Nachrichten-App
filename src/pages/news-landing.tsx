/* eslint-disable jsx-a11y/anchor-is-valid */
import { LoadingScreen } from "components/loading-screen";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetch_guardian_news,
  fetch_news_org,
  fetch_ny_news,
  fetch_world_news,
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
import { Categories } from "components/categories";

export function NewsLanding() {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("for-you");
  const [search, setSearch] = useState("");
  const {
    loading,
    selectedCategory,
    searchText,
    selectedSource: selectedNewsSource,
    hasError,
    newYorkNews,
    newsOrgNews,
    pagination,
    guardianNews,
    worldNews,
  } = useSelector(newsData);

  useEffect(() => {
    if (selectedNewsSource === NEWS_ORG) dispatch(fetch_news_org());
    if (selectedNewsSource === NEW_YORK_NEWS) dispatch(fetch_ny_news());
    if (selectedNewsSource === GUARDIAN_NEWS) dispatch(fetch_guardian_news());
    if (selectedNewsSource === WORLD_NEWS) dispatch(fetch_world_news());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedNewsSource,
    searchText,
    pagination.perPage,
    pagination.page,
    selectedCategory,
  ]);

  useEffect(() => {
    if (!search) return;
    const fetchNewsTimeout = setTimeout(() => {
      dispatch(set_searchText(search));
      dispatch(set_loading(false));
    }, 1500);
    return () => clearTimeout(fetchNewsTimeout);
  }, [dispatch, search]);

  const articles = useMemo(() => {
    if (selectedNewsSource === NEWS_ORG) return newsOrgNews;
    if (selectedNewsSource === NEW_YORK_NEWS) return newYorkNews;
    if (selectedNewsSource === GUARDIAN_NEWS) return guardianNews;
    if (selectedNewsSource === WORLD_NEWS) return worldNews;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guardianNews, newYorkNews, newsOrgNews, selectedNewsSource, worldNews]);

  return (
    <div className='news-landing-container'>
      <div className='_header'>
        <div className='logo-section'>
          <p className='app-text-logo'>📰 Nachrichten</p>
          <input
            className='form-control'
            placeholder='Search'
            onChange={({ target: { value } }) => setSearch(value)}
          />
        </div>
        <div className='subscribe-section'>
          <div>
            <i className='bi bi-globe'></i>
          </div>
          <button>Subscribe</button>
        </div>
      </div>
      <div className='mobile-search'>
        <input
          className='form-control'
          placeholder='Search'
          onChange={({ target: { value } }) => setSearch(value)}
        />
        <div className=''>
          <button
            data-bs-toggle='offcanvas'
            data-bs-target='#staticBackdrop'
            aria-controls='staticBackdrop'
            className='filter-btn'
          >
            <i class='bi bi-filter'></i>
            {selectedCategory && selectedCategory !== "all" ? (
              <span className='selected-category'>{selectedCategory}</span>
            ) : (
              "Filter Category"
            )}
          </button>
          <div
            class='offcanvas offcanvas-end offcanvas-categories'
            data-bs-backdrop='static'
            tabindex='-1'
            id='staticBackdrop'
            aria-labelledby='staticBackdropLabel'
          >
            <div class='offcanvas-header'>
              <h5 class='offcanvas-title' id='staticBackdropLabel'>
                Select Section/Category
              </h5>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='offcanvas'
                aria-label='Close'
                id='close-offcanvas'
              ></button>
            </div>
            <div class='offcanvas-body'>
              <Categories />
            </div>
          </div>
        </div>
      </div>
      <div className='_news-body container-fluid'>
        <div className='row'>
          <div className='col-md-2 col-12'>
            <div className='_sources'>
              <h4>Sources</h4>
              <ul>
                {[
                  { text: "News Org.", key: NEWS_ORG },
                  { text: "New York News", key: NEW_YORK_NEWS },
                  { text: "Guardian News", key: GUARDIAN_NEWS },
                  { text: "World News", key: WORLD_NEWS },
                ].map((el) => (
                  <li
                    key={el.key}
                    onClick={() => {
                      dispatch(set_news_source(el.key));
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
            <Categories />
          </div>
          <div className='col-md-10 col-12'>
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
                  <a
                    className='mobile-read-link-button'
                    href={article?.url}
                    target='_blank'
                    rel='noreferrer'
                  >
                    Read more <i className='bi bi-box-arrow-in-up-right'></i>
                  </a>
                </div>
              ))
            )}
            {!hasError && articles.length ? (
              <div className='row footer'>
                <div />
                <CustomPagination />
                <div>
                  <p>Page Limit</p>
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
