import { useEffect, useState } from "react";
// import { useAuth } from "../hooks/useAuth";
import { getAllPosts } from "../service/post";

interface PetPost {
  _id: string;
  status: "LOST" | "FOUND";
  petName: string;
  breed: string;
  color: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  reward?: string;
  contactPhone: string[] | string;
  contactEmail: string[] | string;
  imageURL?: string;
}

const PostPage = () => {
  const [posts, setPosts] = useState<PetPost[]>([]);
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
  }, []);

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
    <div className="min-h-screen bg-gray-50 p-8 font-sans antialiased text-gray-900">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {posts.map((post: PetPost, index) => {
          const parsedPhones = parseContactList(post.contactPhone);
          const parsedEmails = parseContactList(post.contactEmail);

          return (
            <div
              key={post._id || index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col"
            >
              {/* Pet Image */}
              <div className="bg-gray-100 aspect-video w-full overflow-hidden border-b border-gray-100">
                <img
                  src={
                    post?.imageURL ||
                    "https://via.placeholder.com/400x225?text=No+Image+Available"
                  }
                  alt={post?.petName || "Pet"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Post Data Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  {/* Status Badge & Name */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded ${
                        post.status === "LOST"
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {post.status || "N/A"}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                      ID: {(post._id || index).toString().slice(-6)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                    {post?.petName || "Unnamed Pet"}
                  </h2>

                  {/* Core Fields */}
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Breed:</span>{" "}
                      <span className="font-medium">
                        {post?.breed || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Color:</span>{" "}
                      <span className="font-medium">
                        {post?.color || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Last Seen:</span>{" "}
                      <span className="font-medium">
                        {post?.lastSeenLocation || "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Date:</span>{" "}
                      <span className="font-medium">
                        {post.lastSeenDate
                          ? new Date(post.lastSeenDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Reward:</span>{" "}
                      <span className="font-medium text-amber-600">
                        {post.reward ? `$${post.reward}` : "None"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Contact Sub-section */}
                <div className="pt-4 border-t border-gray-100 text-xs space-y-2 text-gray-600">
                  <div className="font-semibold text-gray-900 uppercase tracking-wider text-[10px]">
                    Contact Information
                  </div>

                  {parsedPhones.length > 0 && (
                    <p>
                      Phone:{" "}
                      <span className="font-medium text-gray-900">
                        {parsedPhones.join(", ")}
                      </span>
                    </p>
                  )}

                  {parsedEmails.length > 0 && (
                    <p className="break-all">
                      Email:{" "}
                      <span className="font-medium text-gray-900">
                        {parsedEmails.join(", ")}
                      </span>
                    </p>
                  )}

                  {parsedPhones.length === 0 && parsedEmails.length === 0 && (
                    <p className="text-gray-400 italic">
                      No contact info provided.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simplified Pagination */}
      <div className="flex items-center justify-center gap-6 mt-12 text-sm">
        <button
          onClick={() => fetchData(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page <strong className="text-gray-900">{page}</strong> of{" "}
          {totalPageCount}
        </span>
        <button
          onClick={() => fetchData(page + 1)}
          disabled={page >= totalPageCount}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostPage;
