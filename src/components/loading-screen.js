import Skeleton from "react-loading-skeleton";

export function LoadingScreen() {
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
}
