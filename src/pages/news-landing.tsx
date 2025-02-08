import axios, { all } from "axios";
import React, { useEffect, useState, useMemo } from "react";

export function NewsLanding() {
  const WORLD_NEWS = "world-news";
  const NEWS_ORG = "news-org";
  const [selectedNewsSource, setSelectedNewsSource] = useState(WORLD_NEWS);
  const [allArticles, setAllArticles] = useState(null);

  console.log({ allArticles });

  useEffect(() => {
    handleFetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchWorldNews = async () => {
    try {
      const {
        data: { news },
      } = await axios.get(
        "https://api.worldnewsapi.com/search-news?api-key=502bbe2c821b4594a70dbab2d62d58ea&source-country=us&language=en"
      );
      return news;
    } catch (error) {}
  };

  const handleFetchNewsAPI = async () => {
    try {
      const {
        data: { articles },
      } = await axios.get(
        "https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=6c57e118ca124b998ef9367fed6f479a"
      );
      console.log("newsapi ----", { articles });
      return articles;
    } catch (error) {}
  };

  const handleFetchNews = async () => {
    try {
      const [newsOrg, worldNews] = await Promise.all([
        handleFetchNewsAPI(),
        handleFetchWorldNews(),
      ]);
      setAllArticles({ newsOrg, worldNews });
    } catch (error) {}
  };

  const articles = useMemo(() => {
    if (!allArticles) return [];
    if (selectedNewsSource === WORLD_NEWS) return allArticles.worldNews;
    if (selectedNewsSource === NEWS_ORG) return allArticles.newsOrg;
  }, [allArticles, selectedNewsSource]);

  console.log({ articles });

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
            {/* <li>
              <a>Politics</a>Politics
            </li>
            <li>Sports</li>
            <li>Business</li>
            <li>Nature</li> */}
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
            <input className='form-control' placeholder='Search Articles...' />
          </div>
        </div>
      </div>

      <div className='news-body container-fluid'>
        <div className='row'>
          <div className='col-5 top-news'>
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
          <div className='col-7'>
            {articles?.map((article) => (
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
      </div>
    </div>
  );
}
