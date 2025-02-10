import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import Skeleton from "react-loading-skeleton";

export function NewsLanding() {
  const WORLD_NEWS = "world-news";
  const NEWS_ORG = "news-org";
  const [selectedNewsSource, setSelectedNewsSource] = useState(WORLD_NEWS);
  const [allArticles, setAllArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const defaultImageLink =
    "https://img.freepik.com/free-photo/3d-rendering-illustration-letter-blocks-forming-word-news-white-background_181624-60840.jpg?semt=ais_hybrid";

  console.log({ allArticles });

  useEffect(() => {
    // this calls onMount of the page
    handleFetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // this calls when searchText changes
    if (!searchText) return;
    setLoading(true);
    const fetchNewsTimeout = setTimeout(() => {
      handleFetchNews();
    }, 1500);
    return () => clearTimeout(fetchNewsTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

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
        `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6c57e118ca124b998ef9367fed6f479a&q=${searchText}`
      );
      console.log("newsapi ----", { articles });
      return articles;
    } catch (error) {}
  };

  const handleFetchNews = async () => {
    setLoading(true);
    try {
      const [newsOrg, worldNews] = await Promise.all([
        handleFetchNewsAPI(),
        handleFetchWorldNews(),
      ]);
      setAllArticles({ newsOrg, worldNews });
    } catch (error) {
      setLoading(false);
    }
  };

  console.log({ searchText });

  const articles = useMemo(() => {
    setLoading(false);
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

  const LoadingScreen = () => {
    return (
      <div className='loading-screen'>
        <div className='row'>
          <div className='col-6'>
            <div className='author-info'>
              <Skeleton width={90} />
              <Skeleton width={90} />
              <Skeleton width={150} />
              <Skeleton
                width={"100%"}
                height={70}
                style={{ marginBottom: "5px" }}
              />
              <Skeleton width={"100%"} height={500} />
            </div>
          </div>
          <div className='col-6'>
            <div className='articles-list'>
              {[1, 2, 3].map((el) => (
                <div
                  key={el}
                  style={{ display: "flex", gap: "10px", marginBottom: "30px" }}
                >
                  <div>
                    <Skeleton width={300} height={20} />
                    <Skeleton width={300} height={40} />
                    <Skeleton width={300} height={40} />
                    <Skeleton width={300} height={60} />
                    <Skeleton width={300} height={70} />
                  </div>
                  <div>
                    <Skeleton
                      width={500}
                      height={250}
                      style={{ borderRadius: "10px" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='news-landing-container'>
      <div className='landing-header'>
        <div className='section _one'>
          <p className='app-text-logo'>Nachrichten App 🗞️</p>
          <p>Sign up for more content from our news blog</p>
          <div>
            <button>Subscribe</button>
          </div>
        </div>
        <div className='section _two'>
          <div className='sources-filter'>
            <p
              className={`${selectedNewsSource === WORLD_NEWS ? "active" : ""}`}
              onClick={() => setSelectedNewsSource(WORLD_NEWS)}
            >
              World News
            </p>
            <p
              className={`${selectedNewsSource === NEWS_ORG ? "active" : ""}`}
              onClick={() => setSelectedNewsSource(NEWS_ORG)}
            >
              News Org
            </p>
          </div>
          <ul className='categories'>
            {["Politics", "Sports", "Business", "Nature"].map((el) => (
              <li key={el}>
                <a href='#'>{el}</a>
              </li>
            ))}
            <li>
              <div class='dropdown'>
                <p
                  className='dropdown-toggle'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  More
                </p>
                <ul class='dropdown-menu'>
                  <li>
                    <button class='dropdown-item' type='button'>
                      Action
                    </button>
                  </li>
                  <li>
                    <button class='dropdown-item' type='button'>
                      Another action
                    </button>
                  </li>
                  <li>
                    <button class='dropdown-item' type='button'>
                      Something else here
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div className='search'>
            <input
              className='form-control'
              placeholder='Search Articles...'
              onChange={({ target: { value } }) => setSearchText(value)}
            />
          </div>
        </div>
      </div>

      <div className='news-body container-fluid'>
        {loading ? (
          <LoadingScreen />
        ) : (
          <div className='row'>
            <div className='col-6 top-news'>
              <a href={articles?.[0]?.url} target='_blank' rel='noreferrer'>
                <div className='author-col'>
                  {/* <img
              src={articles?.[0]?.image}
              alt='author-img'
              className='img-fluid'
            /> */}
                  <div>
                    <h5>{articles?.[0]?.author}</h5>
                    <h6>Author</h6>
                  </div>
                </div>
                <h3>{articles?.[0]?.title}</h3>
                <p>6 mins read</p>
                <img
                  src={articles?.[0]?.image}
                  alt='article-pres'
                  className='img-fluid blog-pic'
                />
              </a>
            </div>
            <div className='col-6'>
              {articles.slice(1, 4)?.map((article) => (
                <a
                  key={article?.id}
                  href={article?.url}
                  target='_blank'
                  rel='noreferrer'
                  className='news-container'
                >
                  <div>
                    <h4>{article?.title}</h4>
                    <p className='summary'>{article?.summary}</p>
                    <p className='read-time'>6 mins read</p>
                  </div>
                  <img
                    src={article?.image}
                    alt='article-pic'
                    className='img-fluid'
                  />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
