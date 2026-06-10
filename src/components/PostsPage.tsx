// import { useEffect, useState } from "react";
// // import { useAuth } from "../hooks/useAuth";
// import { getAllPosts } from "../service/post";

// interface PetPost {
//   _id: string;
//   status: "LOST" | "FOUND";
//   petName: string;
//   breed: string;
//   color: string;
//   lastSeenLocation: string;
//   lastSeenDate: string;
//   reward?: string;
//   contactPhone: string[] | string;
//   contactEmail: string[] | string;
//   imageURL?: string;
// }

// const PostPage = () => {
//   const [posts, setPosts] = useState<PetPost[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPageCount, setTotalPageCount] = useState(0);

//   const fetchData = async (pageNumber = 1) => {
//     const res = await getAllPosts(pageNumber, 3);
//     setPosts(res?.data || []);
//     setPage(pageNumber);
//     setTotalPageCount(res?.pagination.totalPages || 0);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const parseContactList = (data: any): string[] => {
//     if (!data) return [];
//     if (Array.isArray(data)) return data;
//     try {
//       return JSON.parse(data);
//     } catch {
//       return [data.toString()];
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 font-sans antialiased text-gray-900">
//       {/* Posts Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
//         {posts.map((post: PetPost, index) => {
//           const parsedPhones = parseContactList(post.contactPhone);
//           const parsedEmails = parseContactList(post.contactEmail);

//           return (
//             <div
//               key={post._id || index}
//               className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col"
//             >
//               {/* Pet Image */}
//               <div className="bg-gray-100 aspect-video w-full overflow-hidden border-b border-gray-100">
//                 <img
//                   src={
//                     post?.imageURL ||
//                     "https://via.placeholder.com/400x225?text=No+Image+Available"
//                   }
//                   alt={post?.petName || "Pet"}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               {/* Post Data Content */}
//               <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
//                 <div>
//                   {/* Status Badge & Name */}
//                   <div className="flex items-center justify-between mb-2">
//                     <span
//                       className={`text-xs font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded ${
//                         post.status === "LOST"
//                           ? "bg-red-50 text-red-700"
//                           : "bg-green-50 text-green-700"
//                       }`}
//                     >
//                       {post.status || "N/A"}
//                     </span>
//                     <span className="text-xs font-mono text-gray-400">
//                       ID: {(post._id || index).toString().slice(-6)}
//                     </span>
//                   </div>

//                   <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
//                     {post?.petName || "Unnamed Pet"}
//                   </h2>

//                   {/* Core Fields */}
//                   <div className="space-y-2 text-sm">
//                     <p>
//                       <span className="text-gray-500">Breed:</span>{" "}
//                       <span className="font-medium">
//                         {post?.breed || "N/A"}
//                       </span>
//                     </p>
//                     <p>
//                       <span className="text-gray-500">Color:</span>{" "}
//                       <span className="font-medium">
//                         {post?.color || "N/A"}
//                       </span>
//                     </p>
//                     <p>
//                       <span className="text-gray-500">Last Seen:</span>{" "}
//                       <span className="font-medium">
//                         {post?.lastSeenLocation || "N/A"}
//                       </span>
//                     </p>
//                     <p>
//                       <span className="text-gray-500">Date:</span>{" "}
//                       <span className="font-medium">
//                         {post.lastSeenDate
//                           ? new Date(post.lastSeenDate).toLocaleDateString()
//                           : "N/A"}
//                       </span>
//                     </p>
//                     <p>
//                       <span className="text-gray-500">Reward:</span>{" "}
//                       <span className="font-medium text-amber-600">
//                         {post.reward ? `$${post.reward}` : "None"}
//                       </span>
//                     </p>
//                   </div>
//                 </div>

//                 {/* Contact Sub-section */}
//                 <div className="pt-4 border-t border-gray-100 text-xs space-y-2 text-gray-600">
//                   <div className="font-semibold text-gray-900 uppercase tracking-wider text-[10px]">
//                     Contact Information
//                   </div>

//                   {parsedPhones.length > 0 && (
//                     <p>
//                       Phone:{" "}
//                       <span className="font-medium text-gray-900">
//                         {parsedPhones.join(", ")}
//                       </span>
//                     </p>
//                   )}

//                   {parsedEmails.length > 0 && (
//                     <p className="break-all">
//                       Email:{" "}
//                       <span className="font-medium text-gray-900">
//                         {parsedEmails.join(", ")}
//                       </span>
//                     </p>
//                   )}

//                   {parsedPhones.length === 0 && parsedEmails.length === 0 && (
//                     <p className="text-gray-400 italic">
//                       No contact info provided.
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Simplified Pagination */}
//       <div className="flex items-center justify-center gap-6 mt-12 text-sm">
//         <button
//           onClick={() => fetchData(page - 1)}
//           disabled={page <= 1}
//           className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
//         >
//           Previous
//         </button>
//         <span className="text-gray-600">
//           Page <strong className="text-gray-900">{page}</strong> of{" "}
//           {totalPageCount}
//         </span>
//         <button
//           onClick={() => fetchData(page + 1)}
//           disabled={page >= totalPageCount}
//           className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostPage;

import { useEffect, useState } from "react";
// import { useAuth } from "../hooks/useAuth";
import { getAllPosts } from "../service/post";
import AddPost from "./AddNewPost";

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

const parseContactList = (data: any): string[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    return JSON.parse(data);
  } catch {
    return [data.toString()];
  }
};

// ── Detail Modal ────────────────────────────────────────────────────────────
const PostDetailModal = ({
  post,
  onClose,
}: {
  post: PetPost;
  onClose: () => void;
}) => {
  const parsedPhones = parseContactList(post.contactPhone);
  const parsedEmails = parseContactList(post.contactEmail);
  const isLost = post.status === "LOST";

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-white bg-black/40 hover:bg-black/60 transition-colors p-1.5 rounded-full"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Full image (not cropped) */}
        <div className="bg-gray-100 flex items-center justify-center w-full">
          <img
            src={
              post.imageURL ||
              "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={post.petName || "Pet"}
            className="w-full object-contain max-h-72"
          />
        </div>

        {/* Scrollable details */}
        <div className="overflow-y-auto p-6 flex flex-col gap-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 capitalize leading-tight">
                {post.petName || "Unnamed Pet"}
              </h2>
              <span className="text-xs font-mono text-gray-400">
                #{(post._id || "").toString().slice(-6)}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span
                className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                  isLost
                    ? "bg-red-100 text-red-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {post.status}
              </span>
              {post.reward && (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                  🏆 Reward: ${post.reward}
                </span>
              )}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <DetailField label="Breed" value={post.breed} />
            <DetailField label="Color" value={post.color} />
            <div className="col-span-2">
              <DetailField
                label="Last Seen Location"
                value={post.lastSeenLocation}
              />
            </div>
            <DetailField
              label="Last Seen Date"
              value={
                post.lastSeenDate
                  ? new Date(post.lastSeenDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : undefined
              }
            />
            <DetailField
              label="Reward"
              value={post.reward ? `$${post.reward}` : "None offered"}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Contact info */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </p>
            {parsedPhones.map((phone, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${phone}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {phone}
                </a>
              </div>
            ))}
            {parsedEmails.map((email, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-gray-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:underline font-medium break-all"
                >
                  {email}
                </a>
              </div>
            ))}
            {parsedPhones.length === 0 && parsedEmails.length === 0 && (
              <p className="text-xs text-gray-400 italic">
                No contact info provided.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper for a labeled field
const DetailField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
      {label}
    </span>
    <p className="font-medium text-gray-800 mt-0.5">{value || "—"}</p>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────
const PostPage = () => {
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);

  const fetchData = async (pageNumber = 1) => {
    const res = await getAllPosts(pageNumber, 3);
    setPosts(res?.data || []);
    setPage(pageNumber);
    setTotalPageCount(res?.pagination.totalPages || 0);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lock body scroll when any modal is open
  useEffect(() => {
    document.body.style.overflow =
      isAddModalOpen || selectedPost ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAddModalOpen, selectedPost]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Lost & Found Pets
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Help reunite pets with their families
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {posts.length} post{posts.length !== 1 ? "s" : ""} on this page
            </span>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Empty State */}
        {posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No posts yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Be the first to add a lost or found pet.
            </p>
          </div>
        )}

        {/* Posts Grid — compact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: PetPost, index) => {
            const isLost = post.status === "LOST";

            return (
              <button
                key={post._id || index}
                onClick={() => setSelectedPost(post)}
                className="text-left bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {/* Pet Image */}
                <div className="relative bg-gray-100 aspect-video w-full overflow-hidden">
                  <img
                    src={
                      post.imageURL ||
                      "https://via.placeholder.com/400x225?text=No+Image"
                    }
                    alt={post.petName || "Pet"}
                    className="w-full h-full object-cover"
                  />
                  <span
                    className={`absolute top-3 left-3 text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm ${
                      isLost
                        ? "bg-red-500 text-white"
                        : "bg-emerald-500 text-white"
                    }`}
                  >
                    {post.status || "N/A"}
                  </span>
                  {post.reward && (
                    <span className="absolute top-3 right-3 text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full shadow-sm">
                      🏆 ${post.reward}
                    </span>
                  )}
                </div>

                {/* Compact Card Body — mandatory fields only */}
                <div className="p-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-bold text-gray-900 capitalize leading-tight truncate">
                      {post.petName || "Unnamed Pet"}
                    </h2>
                    <span className="text-[10px] font-mono text-gray-400 shrink-0">
                      #{(post._id || index).toString().slice(-6)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 truncate">
                    <span className="font-medium text-gray-700">
                      {post.breed || "Unknown breed"}
                    </span>
                    {post.color ? ` · ${post.color}` : ""}
                  </p>

                  <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {post.lastSeenLocation || "Location unknown"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {post.lastSeenDate
                      ? new Date(post.lastSeenDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "Date unknown"}
                  </p>

                  <p className="text-xs text-blue-500 font-medium mt-1">
                    Tap for full details →
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => fetchData(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPageCount }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => fetchData(p)}
                    className={`w-9 h-9 text-sm font-medium rounded-lg transition ${
                      p === page
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => fetchData(page + 1)}
              disabled={page >= totalPageCount}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Post Button (mobile) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 md:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Post
      </button>

      {/* Add Post Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Add New Post
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Fill in the details to report a lost or found pet
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <AddPost />
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default PostPage;