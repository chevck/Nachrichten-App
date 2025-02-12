import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { newsData } from "../redux/selector";
import { CATEGORIES, GUARDIAN_NEWS, NEW_YORK_NEWS } from "utils/constants";
import { set_category, set_searchText } from "../redux/reducer";
import axios from "axios";

export function Categories() {
  const dispatch = useDispatch();
  const { selectedSource, selectedCategory } = useSelector(newsData);
  const [guardianNewsCategories, setGuardianNewsCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState("");

  const handleCloseOffcanvas = () => {
    const closeElem = document.getElementById("close-offcanvas");
    closeElem.click();
  };

  const handleFetchGuardianNewsCategories = async () => {
    try {
      const {
        data: {
          response: { results },
        },
      } = await axios.get(
        `https://content.guardianapis.com/sections?api-key=876931f9-c7d8-4f02-a5be-1ec1f2f347ee`
      );
      setGuardianNewsCategories(
        results.map((el) => ({
          id: el.id,
          title: el.webTitle,
        }))
      );
    } catch (error) {
      console.log("guardian news categories err", error);
    }
  };

  useEffect(() => {
    if (selectedSource === GUARDIAN_NEWS) handleFetchGuardianNewsCategories();
  }, [selectedSource]);

  // guardian news has an api to get sections/categories
  // the new-york times does not so the way to get it in is through the search
  // the news org, they use really basic terms for their categories

  const handleFindCustomCategory = async () => {
    if (!categorySearch) return;
    try {
      dispatch(set_category(categorySearch));
      dispatch(set_searchText(categorySearch));
      handleCloseOffcanvas();
    } catch (error) {
      console.log("error custom category", error);
    }
  };

  return (
    <div className='categories-section _categories'>
      {selectedSource === GUARDIAN_NEWS ? (
        <>
          <h4 className='title'>Select Preferred Category</h4>
          <ul>
            {guardianNewsCategories.slice(0, 5).map((el) => (
              <li
                key={el.id}
                onClick={() => {
                  dispatch(set_category(el.id));
                  handleCloseOffcanvas();
                }}
                className={
                  selectedCategory.toLowerCase() === el.id.toLowerCase()
                    ? "active"
                    : ""
                }
              >
                {el?.title}
              </li>
            ))}
            <select
              className='form-select'
              disabled={!guardianNewsCategories.length}
              onChange={({ target: { value } }) => {
                dispatch(set_category(value));
                handleCloseOffcanvas();
              }}
            >
              <option disabled selected>
                See More
              </option>
              {guardianNewsCategories.slice(5).map((el) => (
                <option id={el?.id} value={el?.id} key={el?.id}>
                  {el?.title}
                </option>
              ))}
            </select>
          </ul>
        </>
      ) : selectedSource === NEW_YORK_NEWS ? (
        <div className='search-categories'>
          <h6>Search Categories</h6>
          <input
            className='form-control'
            placeholder='Find Categories...'
            onChange={({ target: { value } }) => setCategorySearch(value)}
          />
          <button onClick={handleFindCustomCategory}>
            <i className='bi bi-search'></i>Find Category
          </button>
        </div>
      ) : (
        <ul>
          {CATEGORIES.map((el) => (
            <li
              key={el}
              onClick={() => {
                dispatch(set_category(el));
                handleCloseOffcanvas();
              }}
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
      )}
    </div>
  );
}
