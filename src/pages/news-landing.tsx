/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import { LoadingScreen } from "components/loading-screen";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetch_news, set_category, set_searchText } from "../redux/reducer";
import { newsData } from "../redux/selector";

export function NewsLanding() {
  const dispatch = useDispatch();
  const WORLD_NEWS = "world-news";
  const NEWS_ORG = "news-org";
  const [selectedNewsSource, setSelectedNewsSource] = useState(WORLD_NEWS);
  const [allArticles, setAllArticles] = useState(null);
  const [selectedTab, setSelectedTab] = useState("for-you");
  const {
    loading,
    newsPerSource = {},
    selectedCategory,
    searchText,
  } = useSelector(newsData);

  console.log({ loading, newsPerSource, selectedCategory, searchText });

  const defaultImageLink =
    "https://img.freepik.com/free-photo/3d-rendering-illustration-letter-blocks-forming-word-news-white-background_181624-60840.jpg?semt=ais_hybrid";

  console.log({ allArticles });

  useEffect(() => {
    // this calls onMount of the page
    // handleFetchNews();
    dispatch(fetch_news());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, searchText]);

  const handleSearch = ({ target: { value } }) => {
    const fetchNewsTimeout = setTimeout(() => {
      dispatch(set_searchText(value));
    }, 1500);
    return () => clearTimeout(fetchNewsTimeout);
  };

  // useEffect(() => {
  //   // this calls when searchText changes
  //   if (!searchText) return;
  //   setLoading(true);
  // const fetchNewsTimeout = setTimeout(() => {
  //   handleFetchNews();
  // }, 1500);
  // return () => clearTimeout(fetchNewsTimeout);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchText]);

  const handleFetchWorldNews = async () => {
    try {
      const {
        data: { news },
      } = await axios.get(
        "https://api.worldnewsapi.com/search-news?api-key=502bbe2c821b4594a70dbab2d62d58ea&source-country=us&language=en"
      );
      return news;
    } catch (error) {
      console.log("sds", error);
    }
  };

  const handleFetchNewsAPI = async () => {
    try {
      const {
        data: { articles },
      } = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6c57e118ca124b998ef9367fed6f479a&q=${""}`
      );
      console.log("newsapi ----", { articles });
      return articles;
    } catch (error) {}
  };

  const handleFetchNews = async () => {
    // setLoading(true);
    try {
      const [newsOrg, worldNews] = await Promise.all([
        handleFetchNewsAPI(),
        handleFetchWorldNews(),
      ]);
      setAllArticles({ newsOrg, worldNews });
    } catch (error) {
      // setLoading(false);
    }
  };

  // console.log({ searchText });

  const articles = useMemo(() => {
    if (!allArticles) return [];
    if (selectedNewsSource === WORLD_NEWS) return allArticles.worldNews;
    if (selectedNewsSource === NEWS_ORG)
      return allArticles.newsOrg.map((el) => ({
        ...el,
        image: el?.urlToImage ?? defaultImageLink,
        summary: el?.description,
      }));
  }, [allArticles, selectedNewsSource]);

  const categories = useMemo(() => {
    return articles.map((el) => el.category || el.categories);
  }, [articles]);

  console.log({ articles });

  console.log({ categories });

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
                {["World News", "News API"].map((el) => (
                  <li key={el}>{el}</li>
                ))}
              </ul>
            </div>
            <div className='_categories'>
              <ul>
                {["All", "Politics", "Entertainment"].map((el) => (
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
            {[1, 3, 4, 5].map((el, key) => (
              <div className='news-content' key={key}>
                <div className='details'>
                  <p>
                    The Guardian <i className='bi bi-dot'></i> Jul. 15
                  </p>
                  <h5>
                    The new space race: How it all began in the racing game
                  </h5>
                  <h6>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </h6>
                  <button>
                    Read more <i className='bi bi-box-arrow-in-up-right'></i>
                  </button>
                </div>
                <img
                  src={defaultImageLink}
                  alt='news-pic'
                  className='img-fluid'
                />
              </div>
            ))}
            <div className='row footer'>
              <div />
              <div className='pagination'></div>
              <select>
                {[10, 20, 30, 40].map((el) => (
                  <option key={el}>{el}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className='news-landing-container'>
  //     <div className='landing-header'>
  //       <div className='section _one'>
  //         <p className='app-text-logo'>Nachrichten App 🗞️</p>
  //         <p>Sign up for more content from our news blog</p>
  //         <div>
  //           <button>Subscribe</button>
  //         </div>
  //       </div>
  //       <div className='section _two'>
  //         <div className='sources-filter'>
  //           <p
  //             className={`${selectedNewsSource === WORLD_NEWS ? "active" : ""}`}
  //             onClick={() => setSelectedNewsSource(WORLD_NEWS)}
  //           >
  //             World News
  //           </p>
  //           <p
  //             className={`${selectedNewsSource === NEWS_ORG ? "active" : ""}`}
  //             onClick={() => setSelectedNewsSource(NEWS_ORG)}
  //           >
  //             News Org
  //           </p>
  //         </div>
  //         <ul className='categories'>
  //           {["Politics", "Sports", "Business", "Nature"].map((el) => (
  //             <li key={el}>
  //               <a href='#'>{el}</a>
  //             </li>
  //           ))}
  //           <li>
  //             <div className='dropdown'>
  //               <p
  //                 className='dropdown-toggle'
  //                 data-bs-toggle='dropdown'
  //                 aria-expanded='false'
  //               >
  //                 More
  //               </p>
  //               <ul className='dropdown-menu'>
  //                 <li>
  //                   <button className='dropdown-item' type='button'>
  //                     Action
  //                   </button>
  //                 </li>
  //                 <li>
  //                   <button className='dropdown-item' type='button'>
  //                     Another action
  //                   </button>
  //                 </li>
  //                 <li>
  //                   <button className='dropdown-item' type='button'>
  //                     Something else here
  //                   </button>
  //                 </li>
  //               </ul>
  //             </div>
  //           </li>
  //         </ul>
  //         <div className='search'>
  //           <input
  //             className='form-control'
  //             placeholder='Search Articles...'
  //             onChange={({ target: { value } }) => setSearchText(value)}
  //           />
  //         </div>
  //       </div>
  //     </div>

  //     <div className='news-body container-fluid'>
  //       {loading ? (
  //         <LoadingScreen />
  //       ) : (
  //         <div className='row'>
  //           <div className='col-6 top-news'>
  //             <a href={articles?.[0]?.url} target='_blank' rel='noreferrer'>
  //               <div className='author-col'>
  //                 {/* <img
  //             src={articles?.[0]?.image}
  //             alt='author-img'
  //             className='img-fluid'
  //           /> */}
  //                 <div>
  //                   <h5>{articles?.[0]?.author}</h5>
  //                   <h6>Author</h6>
  //                 </div>
  //               </div>
  //               <h3>{articles?.[0]?.title}</h3>
  //               <p>6 mins read</p>
  //               <img
  //                 src={articles?.[0]?.image}
  //                 alt='article-pres'
  //                 className='img-fluid blog-pic'
  //               />
  //             </a>
  //           </div>
  //           <div className='col-6'>
  //             {articles.slice(1, 4)?.map((article) => (
  //               <a
  //                 key={article?.id}
  //                 href={article?.url}
  //                 target='_blank'
  //                 rel='noreferrer'
  //                 className='news-container'
  //               >
  //                 <div>
  //                   <h4>{article?.title}</h4>
  //                   <p className='summary'>{article?.summary}</p>
  //                   <p className='read-time'>6 mins read</p>
  //                 </div>
  //                 <img
  //                   src={article?.image}
  //                   alt='article-pic'
  //                   className='img-fluid'
  //                 />
  //               </a>
  //             ))}
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
}
