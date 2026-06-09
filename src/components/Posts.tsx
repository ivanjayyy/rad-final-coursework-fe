import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getAllPosts } from "../service/post";

// Define a type mapping to matches your MERN payload structure
interface PetPost {
  _id: string;
  status: string;
  petName: string;
  breed: string;
  color: string;
  lastSeenLocation: string;
  latitude: string;
  longitude: string;
  lastSeenDate: string;
  reward?: string;
  contactPhone: string[] | string; // Handled safely if stored as a stringified array or array
  contactEmail: string[] | string;
  imageURL?: string;
}

const Posts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);

  const fetchData = async (pageNumber = 1) => {
    const res = await getAllPosts(pageNumber, 3);
    setPosts(res?.data || []);
    setPage(pageNumber);
    setTotalPageCount(res?.pagination.totalPages || 0);
  };

  // FIX: Added empty dependency array [] to prevent infinite API re-fetches
  useEffect(() => {
    fetchData();
  }, []);

  // Safe JSON parser helper for contact information arrays
  const parseContactList = (data: any): string[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    try {
      return JSON.parse(data);
    } catch {
      return [data.toString()];
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lost and Found Hub</h1>
        <div className="mt-3">
          <h2 className="text-lg font-semibold text-indigo-600">
            {user?.username ? `Hello, ${user.username}` : "Welcome!"}
          </h2>
          <p className="text-gray-500">
            Help reunite missing pets with their families 👋
          </p>
        </div>
      </div>

      {/* Posts Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: PetPost, index) => {
          const parsedPhones = parseContactList(post.contactPhone);
          const parsedEmails = parseContactList(post.contactEmail);
          const isLost = post.status === "Lost";

          return (
            <div
              key={post._id || index}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between border border-gray-100"
            >
              {/* Image & Status Badge Layer */}
              <div className="relative">
                <img
                  src={
                    post?.imageURL ||
                    "https://via.placeholder.com/400x300?text=No+Pet+Image"
                  }
                  alt={post?.petName || "Pet Status"}
                  className="w-full h-60 object-cover"
                />
                <span
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                    isLost ? "bg-red-500" : "bg-emerald-500"
                  }`}
                >
                  {post.status || "Unknown"}
                </span>

                {/* Reward Banner */}
                {post.reward && Number(post.reward) > 0 && (
                  <span className="absolute bottom-4 left-4 bg-amber-500 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-md animate-pulse">
                    Reward: ${post.reward}
                  </span>
                )}
              </div>

              {/* Dynamic Content Details */}
              <div className="p-5 flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 capitalize">
                    {post?.petName || "Unnamed Pet"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Logged Date:{" "}
                    {post.lastSeenDate
                      ? new Date(post.lastSeenDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Characteristics Grid */}
                <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="block text-xs text-gray-400 font-medium">
                      Breed
                    </span>
                    <span className="font-semibold text-gray-700 truncate block">
                      {post?.breed || "Unknown"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 font-medium">
                      Color
                    </span>
                    <span className="font-semibold text-gray-700 truncate block">
                      {post?.color || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Location Box with dynamic External Map Redirect link */}
                <div className="text-sm">
                  <span className="block text-xs text-gray-400 font-medium mb-1">
                    Last Seen At:
                  </span>
                  <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/50 flex items-start gap-2">
                    <span className="mt-0.5">📍</span>
                    <div className="flex-1">
                      <p className="text-gray-700 leading-tight text-xs line-clamp-2">
                        {post?.lastSeenLocation || "No address details available"}
                      </p>
                      {post.latitude && post.longitude && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${post.latitude},${post.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs text-indigo-600 hover:underline font-semibold mt-1"
                        >
                          View Map Directions →
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Multi-Contact Information Lists */}
                <div className="space-y-2">
                  <span className="block text-xs text-gray-400 font-medium">
                    Owner Contact Info:
                  </span>

                  {parsedPhones.length > 0 && (
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <span className="font-medium text-gray-800">
                        📞 Phone:
                      </span>
                      {parsedPhones.map((phone, i) => (
                        <p key={i} className="pl-4">
                          {phone}
                        </p>
                      ))}
                    </div>
                  )}

                  {parsedEmails.length > 0 && (
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <span className="font-medium text-gray-800">
                        ✉️ Email:
                      </span>
                      {parsedEmails.map((email, i) => (
                        <p key={i} className="pl-4 break-all">
                          {email}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Navigation */}
      <div className="flex items-center justify-center gap-4 mt-10">
        <button
          onClick={() => fetchData(page - 1)}
          disabled={page <= 1}
          className="px-5 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-xl shadow-sm border">
          Page <strong className="text-indigo-600">{page}</strong> of{" "}
          {totalPageCount}
        </span>

        <button
          onClick={() => fetchData(page + 1)}
          disabled={page >= totalPageCount}
          className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Posts;
