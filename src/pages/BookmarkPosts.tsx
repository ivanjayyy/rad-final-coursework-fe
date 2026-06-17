// import { useEffect, useState } from "react";
// import { getBookmarkPosts, removeBookmark } from "../service/post";

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

// const parseContactList = (data: any): string[] => {
//   if (!data) return [];
//   if (Array.isArray(data)) return data;
//   try {
//     return JSON.parse(data);
//   } catch {
//     return [data.toString()];
//   }
// };

// // ── Detail Modal ──────────────────────────────────────────────────────────────
// const PostDetailModal = ({
//   post,
//   onClose,
// }: {
//   post: PetPost;
//   onClose: () => void;
// }) => {
//   const parsedPhones = parseContactList(post.contactPhone);
//   const parsedEmails = parseContactList(post.contactEmail);
//   const isLost = post.status === "LOST";

//   useEffect(() => {
//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 z-10 text-white bg-black/40 hover:bg-black/60 transition-colors p-1.5 rounded-full"
//           aria-label="Close"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2.5}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M6 18L18 6M6 6l12 12"
//             />
//           </svg>
//         </button>

//         <div className="bg-gray-100 flex items-center justify-center w-full">
//           <img
//             src={
//               post.imageURL ||
//               "https://via.placeholder.com/600x400?text=No+Image"
//             }
//             alt={post.petName || "Pet"}
//             className="w-full object-contain max-h-72"
//           />
//         </div>

//         <div className="overflow-y-auto p-6 flex flex-col gap-5">
//           <div className="flex items-start justify-between gap-3">
//             <div>
//               <h2 className="text-xl font-bold text-gray-900 capitalize leading-tight">
//                 {post.petName || "Unnamed Pet"}
//               </h2>
//               <span className="text-xs font-mono text-gray-400">
//                 #{(post._id || "").toString().slice(-6)}
//               </span>
//             </div>
//             <div className="flex flex-col items-end gap-1.5 shrink-0">
//               <span
//                 className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${isLost ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
//               >
//                 {post.status}
//               </span>
//               {post.reward && (
//                 <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
//                   🏆 Reward: ${post.reward}
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
//             <DetailField label="Breed" value={post.breed} />
//             <DetailField label="Color" value={post.color} />
//             <div className="col-span-2">
//               <DetailField
//                 label="Last Seen Location"
//                 value={post.lastSeenLocation}
//               />
//             </div>
//             <DetailField
//               label="Last Seen Date"
//               value={
//                 post.lastSeenDate
//                   ? new Date(post.lastSeenDate).toLocaleDateString("en-US", {
//                       month: "long",
//                       day: "numeric",
//                       year: "numeric",
//                     })
//                   : undefined
//               }
//             />
//             <DetailField
//               label="Reward"
//               value={post.reward ? `$${post.reward}` : "None offered"}
//             />
//           </div>

//           <div className="border-t border-gray-100" />

//           <div className="space-y-2">
//             <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
//               Contact
//             </p>
//             {parsedPhones.map((phone, i) => (
//               <div key={i} className="flex items-center gap-2 text-sm">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-3.5 w-3.5 text-gray-400 shrink-0"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
//                   />
//                 </svg>
//                 <a
//                   href={`tel:${phone}`}
//                   className="text-blue-600 hover:underline font-medium"
//                 >
//                   {phone}
//                 </a>
//               </div>
//             ))}
//             {parsedEmails.map((email, i) => (
//               <div key={i} className="flex items-center gap-2 text-sm">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-3.5 w-3.5 text-gray-400 shrink-0"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                   />
//                 </svg>
//                 <a
//                   href={`mailto:${email}`}
//                   className="text-blue-600 hover:underline font-medium break-all"
//                 >
//                   {email}
//                 </a>
//               </div>
//             ))}
//             {parsedPhones.length === 0 && parsedEmails.length === 0 && (
//               <p className="text-xs text-gray-400 italic">
//                 No contact info provided.
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const DetailField = ({ label, value }: { label: string; value?: string }) => (
//   <div>
//     <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
//       {label}
//     </span>
//     <p className="font-medium text-gray-800 mt-0.5">{value || "—"}</p>
//   </div>
// );

// // ── Bookmarks Page ────────────────────────────────────────────────────────────
// const BookmarksPage = () => {
//   const [posts, setPosts] = useState<PetPost[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPageCount, setTotalPageCount] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);
//   const [removing, setRemoving] = useState<string | null>(null);

//   const fetchData = async (pageNumber = 1) => {
//     setIsLoading(true);
//     try {
//       const res = await getBookmarkPosts(pageNumber, 6);
//       setPosts(res?.data || []);
//       setPage(pageNumber);
//       setTotalPageCount(res?.pagination.totalPages || 0);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = selectedPost ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [selectedPost]);

//   const handleRemoveBookmark = async (e: React.MouseEvent, postId: string) => {
//     e.stopPropagation();
//     if (removing === postId) return;
//     setRemoving(postId);
//     try {
//       await removeBookmark(postId);
//       // Optimistically remove from list
//       setPosts((prev) => prev.filter((p) => p._id !== postId));
//     } catch (error) {
//       console.error("Failed to remove bookmark:", error);
//     } finally {
//       setRemoving(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200 px-8 py-6">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//               Bookmarks
//             </h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               Posts you've saved for later
//             </p>
//           </div>
//           {!isLoading && posts.length > 0 && (
//             <span className="text-sm text-gray-500">
//               {posts.length} saved post{posts.length !== 1 ? "s" : ""} on this
//               page
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-8 py-8">
//         {/* Loading skeleton */}
//         {isLoading && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse"
//               >
//                 <div className="bg-gray-200 aspect-video w-full" />
//                 <div className="p-4 flex flex-col gap-3">
//                   <div className="h-4 bg-gray-200 rounded w-2/3" />
//                   <div className="h-3 bg-gray-100 rounded w-1/2" />
//                   <div className="h-3 bg-gray-100 rounded w-3/4" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty state */}
//         {!isLoading && posts.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-28 text-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 text-gray-300"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={1.5}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//                 />
//               </svg>
//             </div>
//             <p className="text-gray-500 font-medium">No bookmarks yet</p>
//             <p className="text-gray-400 text-sm mt-1">
//               Save posts by clicking the bookmark icon on any listing.
//             </p>
//           </div>
//         )}

//         {/* Posts grid */}
//         {!isLoading && posts.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {posts.map((post, index) => {
//               const isLost = post.status === "LOST";
//               const isRemoving = removing === post._id;

//               return (
//                 <div key={post._id || index} className="group relative">
//                   {/* Remove bookmark button */}
//                   <button
//                     onClick={(e) => handleRemoveBookmark(e, post._id)}
//                     title="Remove bookmark"
//                     disabled={isRemoving}
//                     className={`absolute top-2 right-2 z-10 p-2 rounded-full shadow-md border transition-all duration-150
//                       opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed
//                       bg-blue-600 border-blue-600 text-white hover:bg-red-500 hover:border-red-500`}
//                   >
//                     {isRemoving ? (
//                       <svg
//                         className="animate-spin h-4 w-4"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         />
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v8H4z"
//                         />
//                       </svg>
//                     ) : (
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-4 w-4"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth={2}
//                         fill="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
//                         />
//                       </svg>
//                     )}
//                   </button>

//                   {/* Card */}
//                   <button
//                     onClick={() => setSelectedPost(post)}
//                     className={`w-full text-left bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isRemoving ? "opacity-50 pointer-events-none" : ""}`}
//                   >
//                     {/* Image */}
//                     <div className="relative bg-gray-100 aspect-video w-full overflow-hidden">
//                       <img
//                         src={
//                           post.imageURL ||
//                           "https://via.placeholder.com/400x225?text=No+Image"
//                         }
//                         alt={post.petName || "Pet"}
//                         className="w-full h-full object-cover"
//                       />
//                       <span
//                         className={`absolute top-3 left-3 text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm ${isLost ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}
//                       >
//                         {post.status || "N/A"}
//                       </span>
//                       {post.reward && (
//                         <span className="absolute bottom-3 left-3 text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full shadow-sm">
//                           🏆 ${post.reward}
//                         </span>
//                       )}
//                     </div>

//                     {/* Body */}
//                     <div className="p-4 flex flex-col gap-2">
//                       <div className="flex items-center justify-between gap-2">
//                         <h2 className="text-base font-bold text-gray-900 capitalize leading-tight truncate">
//                           {post.petName || "Unnamed Pet"}
//                         </h2>
//                         <span className="text-[10px] font-mono text-gray-400 shrink-0">
//                           #{(post._id || index).toString().slice(-6)}
//                         </span>
//                       </div>

//                       <p className="text-sm text-gray-500 truncate">
//                         <span className="font-medium text-gray-700">
//                           {post.breed || "Unknown breed"}
//                         </span>
//                         {post.color ? ` · ${post.color}` : ""}
//                       </p>

//                       <p className="text-xs text-gray-400 truncate flex items-center gap-1">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-3 w-3 shrink-0"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                         {post.lastSeenLocation || "Location unknown"}
//                       </p>

//                       <p className="text-xs text-gray-400">
//                         {post.lastSeenDate
//                           ? new Date(post.lastSeenDate).toLocaleDateString(
//                               "en-US",
//                               {
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                               },
//                             )
//                           : "Date unknown"}
//                       </p>

//                       <p className="text-xs text-blue-500 font-medium mt-1">
//                         Tap for full details →
//                       </p>
//                     </div>
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Pagination */}
//         {!isLoading && totalPageCount > 1 && (
//           <div className="flex items-center justify-center gap-2 mt-10">
//             <button
//               onClick={() => fetchData(page - 1)}
//               disabled={page <= 1}
//               className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//               Previous
//             </button>

//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPageCount }, (_, i) => i + 1).map(
//                 (p) => (
//                   <button
//                     key={p}
//                     onClick={() => fetchData(p)}
//                     className={`w-9 h-9 text-sm font-medium rounded-lg transition ${
//                       p === page
//                         ? "bg-blue-600 text-white shadow-sm"
//                         : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
//                     }`}
//                   >
//                     {p}
//                   </button>
//                 ),
//               )}
//             </div>

//             <button
//               onClick={() => fetchData(page + 1)}
//               disabled={page >= totalPageCount}
//               className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
//             >
//               Next
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Detail Modal */}
//       {selectedPost && (
//         <PostDetailModal
//           post={selectedPost}
//           onClose={() => setSelectedPost(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default BookmarksPage;

import { useEffect, useState } from "react";
import { getBookmarkPosts, removeBookmark } from "../service/post";

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

// ── Detail Modal ──────────────────────────────────────────────────────────────
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-yellow-50 border-4 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden transform rotate-[-0.5deg]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-black bg-white hover:bg-red-400 border-2 border-black transition-colors p-1.5 shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 stroke-[3]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="bg-white border-b-4 border-black flex items-center justify-center w-full relative">
          <img
            src={
              post.imageURL ||
              "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={post.petName || "Pet"}
            className="w-full object-contain max-h-72"
          />
        </div>

        <div className="overflow-y-auto p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3 bg-white p-3 border-2 border-black shadow-[4px_4px_0px_0px_#000]">
            <div>
              <h2 className="text-2xl font-black text-black tracking-tight uppercase">
                {post.petName || "Unnamed Pet"}
              </h2>
              <span className="text-xs font-black tracking-wider text-gray-500 uppercase bg-gray-100 px-1.5 py-0.5 border border-black rounded mt-1 inline-block">
                #{(post._id || "").toString().slice(-6)}
              </span>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={`text-xs font-black tracking-wider uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
                  isLost ? "bg-red-400 text-black" : "bg-emerald-400 text-black"
                }`}
              >
                {post.status}
              </span>
              {post.reward && (
                <span className="text-xs font-black bg-amber-400 text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  🏆 REWARD: ${post.reward}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm font-bold">
            <DetailField
              label="Breed"
              value={post.breed}
              bgClass="bg-blue-100"
            />
            <DetailField
              label="Color"
              value={post.color}
              bgClass="bg-purple-100"
            />
            <div className="col-span-2">
              <DetailField
                label="Last Seen Location"
                value={post.lastSeenLocation}
                bgClass="bg-orange-100"
              />
            </div>
            <div className="col-span-2">
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
                bgClass="bg-pink-100"
              />
            </div>
          </div>

          <div className="border-t-4 border-dashed border-black my-1" />

          <div className="bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_#000] space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-black bg-cyan-300 px-2 py-0.5 border border-black inline-block">
              CONTACT LIST
            </p>
            <div className="space-y-2">
              {parsedPhones.map((phone, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="bg-black text-white p-1 font-black text-xs rounded">
                    TEL
                  </span>
                  <a
                    href={`tel:${phone}`}
                    className="text-black font-black underline decoration-2 hover:text-blue-600 break-all"
                  >
                    {phone}
                  </a>
                </div>
              ))}
              {parsedEmails.map((email, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="bg-black text-white p-1 font-black text-xs rounded">
                    MAIL
                  </span>
                  <a
                    href={`mailto:${email}`}
                    className="text-black font-black underline decoration-2 hover:text-blue-600 break-all"
                  >
                    {email}
                  </a>
                </div>
              ))}
              {parsedPhones.length === 0 && parsedEmails.length === 0 && (
                <p className="text-xs text-gray-500 font-bold italic">
                  No contact info provided.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({
  label,
  value,
  bgClass = "bg-white",
}: {
  label: string;
  value?: string;
  bgClass?: string;
}) => (
  <div
    className={`${bgClass} p-3 border-2 border-black shadow-[3px_3px_0px_0px_#000] flex flex-col`}
  >
    <span className="text-[10px] font-black uppercase tracking-wider text-black/60">
      {label}
    </span>
    <p className="font-black text-black mt-0.5 text-base truncate">
      {value || "—"}
    </p>
  </div>
);

// ── Bookmarks Page ────────────────────────────────────────────────────────────
const BookmarksPage = () => {
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LOST" | "FOUND">(
    "ALL",
  );

  const fetchData = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await getBookmarkPosts(pageNumber, 6);
      setPosts(res?.data || []);
      setPage(pageNumber);
      setTotalPageCount(res?.pagination.totalPages || 0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPost ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPost]);

  const handleRemoveBookmark = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (removing === postId) return;
    setRemoving(postId);
    try {
      await removeBookmark(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (error) {
      console.error("Failed to remove bookmark:", error);
    } finally {
      setRemoving(null);
    }
  };

  // Client-side quick filter logic for bookmarks
  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === "ALL" || post.status === statusFilter;
    const matchesSearch =
      post.petName?.toLowerCase().includes(search.toLowerCase()) ||
      post.breed?.toLowerCase().includes(search.toLowerCase()) ||
      post.lastSeenLocation?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-orange-50 font-mono antialiased text-black p-4 md:p-8 selection:bg-yellow-300">
      <div className="max-w-7xl mx-auto">
        {/* Comic Filter Panel Control Shelf */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-cyan-300 border-4 border-black p-4 shadow-[5px_5px_0px_0px_#000]">
          {/* Search Bar Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="SEARCH BOOKMARKS (NAME, BREED, SITE)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-black font-black uppercase text-xs placeholder:text-black/40 border-2 border-black p-3 pr-10 focus:outline-none focus:bg-yellow-50 shadow-[2px_2px_0px_0px_#000] focus:shadow-none transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-black pointer-events-none">
              🔍
            </span>
          </div>

          {/* Filter Action Status Toggles */}
          <div className="flex bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_#000] shrink-0">
            {(["ALL", "LOST", "FOUND"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-xs font-black uppercase transition-all ${
                  statusFilter === status
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-yellow-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border-4 border-black rounded-none overflow-hidden shadow-[4px_4px_0px_0px_#000]"
              >
                <div className="bg-gray-200 aspect-video w-full border-b-4 border-black animate-pulse" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-5 bg-gray-200 rounded-none w-2/3 border border-black animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded-none w-1/2 border border-black animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center bg-white border-4 border-black py-20 px-4 text-center shadow-[6px_6px_0px_0px_#000] max-w-xl mx-auto my-12 transform rotate-[0.5deg]">
            <div className="w-20 h-20 bg-yellow-300 border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#000]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-black stroke-[2.5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <p className="text-xl font-black uppercase tracking-tight text-black">
              NO DOSSIERS MATCH
            </p>
            <p className="text-sm font-bold text-gray-700 mt-2 max-w-sm uppercase">
              No bookmarked logs match your current query parameter filters.
              Adjust search entries.
            </p>
          </div>
        )}

        {/* Posts grid */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => {
              const isLost = post.status === "LOST";
              const isRemoving = removing === post._id;

              return (
                <div
                  key={post._id || index}
                  className="group relative transform hover:rotate-[-0.5deg] transition-transform duration-150"
                >
                  {/* Remove bookmark button */}
                  <button
                    onClick={(e) => handleRemoveBookmark(e, post._id)}
                    title="Remove bookmark"
                    disabled={isRemoving}
                    className="absolute top-3 right-3 z-20 p-2.5 rounded-none border-2 border-black transition-all duration-150 shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed text-white bg-blue-600 hover:bg-red-500 hover:text-white"
                  >
                    {isRemoving ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 stroke-[2.5]"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        fill="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                        />
                      </svg>
                    )}
                  </button>

                  {/* Card Container */}
                  <button
                    onClick={() => setSelectedPost(post)}
                    className={`w-full text-left bg-white border-4 border-black rounded-none overflow-hidden flex flex-col shadow-[4px_4px_0px_0px_#000] hover:shadow-[8px_8px_0px_0px_#000] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-black ${
                      isRemoving ? "opacity-40 pointer-events-none" : ""
                    }`}
                  >
                    {/* Image Area */}
                    <div className="relative bg-yellow-100 aspect-video w-full overflow-hidden border-b-4 border-black">
                      <img
                        src={
                          post.imageURL ||
                          "https://via.placeholder.com/400x225?text=No+Image"
                        }
                        alt={post.petName || "Pet"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <span
                        className={`absolute top-3 left-3 text-xs font-black tracking-widest uppercase px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000] ${
                          isLost
                            ? "bg-red-400 text-black"
                            : "bg-emerald-400 text-black"
                        }`}
                      >
                        {post.status || "N/A"}
                      </span>
                      {post.reward && (
                        <span className="absolute bottom-3 left-3 text-xs font-black bg-amber-400 text-black px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                          🏆 ${post.reward}
                        </span>
                      )}
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 flex flex-col gap-2 bg-white grow">
                      <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-1.5">
                        <h2 className="text-xl font-black text-black capitalize tracking-tight truncate">
                          {post.petName || "Unnamed Pet"}
                        </h2>
                        <span className="text-xs font-black tracking-wider text-black/50 bg-gray-100 px-1 border border-black rounded">
                          #{(post._id || index).toString().slice(-6)}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-black truncate mt-1">
                        <span className="bg-purple-100 px-1.5 py-0.5 border border-black text-xs font-black mr-1 uppercase">
                          BREED
                        </span>
                        {post.breed || "Unknown breed"}
                        {post.color ? ` · ${post.color}` : ""}
                      </p>

                      <p className="text-xs font-bold text-gray-700 truncate flex items-center gap-1 mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-black shrink-0 stroke-[2.5]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="truncate">
                          {post.lastSeenLocation || "Location unknown"}
                        </span>
                      </p>

                      <p className="text-[11px] font-black uppercase text-black/60 tracking-wider mt-0.5">
                        🗓️{" "}
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

                      <div className="mt-3 pt-2 border-t-2 border-dashed border-black/20 flex items-center justify-between text-xs font-black uppercase tracking-wider text-blue-600 group-hover:text-black transition-colors">
                        <span>OPEN DOSSIER</span>
                        <span>→</span>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!isLoading && totalPageCount > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#000] max-w-md mx-auto">
            <button
              onClick={() => fetchData(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase border-2 border-black bg-white hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition"
            >
              ◄ PREV
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPageCount }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => fetchData(p)}
                    className={`w-8 h-8 text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition ${
                      p === page
                        ? "bg-black text-white shadow-none translate-x-0.5 translate-y-0.5"
                        : "bg-white text-black hover:bg-yellow-300"
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
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-black uppercase border-2 border-black bg-white hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition"
            >
              NEXT ►
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal Anchor */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default BookmarksPage;