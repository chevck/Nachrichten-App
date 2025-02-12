import Skeleton from "react-loading-skeleton";

export function LoadingScreen() {
  return (
    <div>
      {[1, 2, 3, 4].map((el) => (
        <div className='loading-screen' key={el}>
          <div>
            <Skeleton height={20} width={250} />
            <Skeleton height={30} width={750} />
            <Skeleton height={100} width={800} />
            <Skeleton height={45} width={150} />
          </div>
          <div>
            <Skeleton height={250} width={400} />
          </div>
        </div>
      ))}
    </div>
  );
}
