import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { newsData } from "../redux/selector";
import { set_filter } from "../redux/reducer";

export function CustomPagination() {
  const dispatch = useDispatch();
  const {
    pagination: { pages = 0 },
  } = useSelector(newsData);

  const handlePageClick = ({ selected }) => {
    dispatch(set_filter({ page: Number(selected) + 1 }));
  };

  return (
    <div className='custom-pagination'>
      <ReactPaginate
        breakLabel='...'
        nextLabel='>'
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pages}
        previousLabel='<'
        renderOnZeroPageCount={null}
      />
    </div>
  );
}
