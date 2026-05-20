import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllPosts } from "../service/post";

const Posts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const fetchData = async (pageNumber = 1) => {
    const res = await getAllPosts(pageNumber, 3);

    setPosts(res?.data || []);
    setPage(pageNumber);
    setTotalPageCount(res?.pagination.totalPages || 0);
  };

  useEffect(() => {
    fetchData();
  });
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lost and Found</h1>

        <div className="mt-3">
          <h2 className="text-lg font-semibold text-blue-600">
            {user?.username || ""}
          </h2>

          <p className="text-gray-500">Welcome back 👋</p>
        </div>
      </div>

      {/* Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
          >
            <img
              src={post?.imageURL}
              alt={post?.title}
              className="w-full h-56 object-cover"
            />

            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-800 mb-2">
                {post?.title}
              </h1>

              <p className="text-gray-600 line-clamp-3">{post?.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={() => fetchData(page - 1)}
          disabled={page <= 1}
          className="px-5 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-lg font-medium text-gray-700">
          Page {page} of {totalPageCount}
        </span>

        <button
          onClick={() => fetchData(page + 1)}
          disabled={page >= totalPageCount}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Posts;
