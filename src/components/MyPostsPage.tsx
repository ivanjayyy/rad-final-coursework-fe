// import { useEffect, useState } from "react";
// import { getMyPosts } from "../service/post";
// import AddPost from "./AddNewPost";

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

// // ── Detail Modal ─────────────────────────────────────────────────────────────
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

//   const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (e.target === e.currentTarget) onClose();
//   };

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
//       onClick={handleBackdrop}
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

// // ── My Posts Page ─────────────────────────────────────────────────────────────
// const MyPostsPage = () => {
//   const [posts, setPosts] = useState<PetPost[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPageCount, setTotalPageCount] = useState(0);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchData = async (pageNumber = 1) => {
//     setIsLoading(true);
//     try {
//       const res = await getMyPosts(pageNumber, 3);
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
//     document.body.style.overflow =
//       isAddModalOpen || selectedPost ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [isAddModalOpen, selectedPost]);

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
//       {/* Page Header */}
//       <div className="bg-white border-b border-gray-200 px-8 py-6">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
//               My Posts
//             </h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               Manage your lost & found pet reports
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             {!isLoading && (
//               <span className="text-sm text-gray-500">
//                 {posts.length} post{posts.length !== 1 ? "s" : ""} on this page
//               </span>
//             )}
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-150"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2.5}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               Add Post
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-8 py-8">
//         {/* Loading skeleton */}
//         {isLoading && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((i) => (
//               <div
//                 key={i}
//                 className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse"
//               >
//                 <div className="bg-gray-200 aspect-video w-full" />
//                 <div className="p-4 flex flex-col gap-3">
//                   <div className="h-4 bg-gray-200 rounded w-2/3" />
//                   <div className="h-3 bg-gray-100 rounded w-1/2" />
//                   <div className="h-3 bg-gray-100 rounded w-3/4" />
//                   <div className="h-3 bg-gray-100 rounded w-1/3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty State */}
//         {!isLoading && posts.length === 0 && (
//           <div className="flex flex-col items-center justify-center py-24 text-center">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={1.5}
//                   d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                 />
//               </svg>
//             </div>
//             <p className="text-gray-500 font-medium">No posts yet</p>
//             <p className="text-gray-400 text-sm mt-1 mb-4">
//               You haven't reported any lost or found pets.
//             </p>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-4 w-4"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={2.5}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               Create your first post
//             </button>
//           </div>
//         )}

//         {/* Posts Grid */}
//         {!isLoading && posts.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {posts.map((post: PetPost, index) => {
//               const isLost = post.status === "LOST";
//               return (
//                 <button
//                   key={post._id || index}
//                   onClick={() => setSelectedPost(post)}
//                   className="text-left bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                 >
//                   {/* Image */}
//                   <div className="relative bg-gray-100 aspect-video w-full overflow-hidden">
//                     <img
//                       src={
//                         post.imageURL ||
//                         "https://via.placeholder.com/400x225?text=No+Image"
//                       }
//                       alt={post.petName || "Pet"}
//                       className="w-full h-full object-cover"
//                     />
//                     <span
//                       className={`absolute top-3 left-3 text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm ${isLost ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}
//                     >
//                       {post.status || "N/A"}
//                     </span>
//                     {post.reward && (
//                       <span className="absolute top-3 right-3 text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full shadow-sm">
//                         🏆 ${post.reward}
//                       </span>
//                     )}
//                   </div>

//                   {/* Compact body */}
//                   <div className="p-4 flex flex-col gap-2">
//                     <div className="flex items-center justify-between gap-2">
//                       <h2 className="text-base font-bold text-gray-900 capitalize leading-tight truncate">
//                         {post.petName || "Unnamed Pet"}
//                       </h2>
//                       <span className="text-[10px] font-mono text-gray-400 shrink-0">
//                         #{(post._id || index).toString().slice(-6)}
//                       </span>
//                     </div>

//                     <p className="text-sm text-gray-500 truncate">
//                       <span className="font-medium text-gray-700">
//                         {post.breed || "Unknown breed"}
//                       </span>
//                       {post.color ? ` · ${post.color}` : ""}
//                     </p>

//                     <p className="text-xs text-gray-400 truncate flex items-center gap-1">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-3 w-3 shrink-0"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                       {post.lastSeenLocation || "Location unknown"}
//                     </p>

//                     <p className="text-xs text-gray-400">
//                       {post.lastSeenDate
//                         ? new Date(post.lastSeenDate).toLocaleDateString(
//                             "en-US",
//                             { month: "short", day: "numeric", year: "numeric" },
//                           )
//                         : "Date unknown"}
//                     </p>

//                     <p className="text-xs text-blue-500 font-medium mt-1">
//                       Tap for full details →
//                     </p>
//                   </div>
//                 </button>
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

//       {/* Floating Add Button (mobile) */}
//       <button
//         onClick={() => setIsAddModalOpen(true)}
//         className="fixed bottom-8 right-8 z-40 md:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-4 w-4"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2.5}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M12 4v16m8-8H4"
//           />
//         </svg>
//         Add Post
//       </button>

//       {/* Add Post Modal */}
//       {isAddModalOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) setIsAddModalOpen(false);
//           }}
//         >
//           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//               <div>
//                 <h2 className="text-lg font-bold text-gray-900">
//                   Add New Post
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   Fill in the details to report a lost or found pet
//                 </p>
//               </div>
//               <button
//                 onClick={() => setIsAddModalOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
//                 aria-label="Close modal"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   strokeWidth={2}
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <div className="overflow-y-auto p-6">
//               <AddPost />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Post Detail Modal */}
//       {selectedPost && (
//         <PostDetailModal
//           post={selectedPost}
//           onClose={() => setSelectedPost(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default MyPostsPage;

import { useEffect, useState } from "react";
import { getMyPosts, deletePost } from "../service/post";
import AddPost from "./AddNewPost";
import UpdatePost from "./UpdatePost.tsx";

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

// ── Detail Modal ─────────────────────────────────────────────────────────────
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

  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

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
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-white bg-black/40 hover:bg-black/60 transition-colors p-1.5 rounded-full"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="bg-gray-100 flex items-center justify-center w-full">
          <img
            src={post.imageURL || "https://via.placeholder.com/600x400?text=No+Image"}
            alt={post.petName || "Pet"}
            className="w-full object-contain max-h-72"
          />
        </div>

        <div className="overflow-y-auto p-6 flex flex-col gap-5">
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
              <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${isLost ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                {post.status}
              </span>
              {post.reward && (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                  🏆 Reward: ${post.reward}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <DetailField label="Breed" value={post.breed} />
            <DetailField label="Color" value={post.color} />
            <div className="col-span-2">
              <DetailField label="Last Seen Location" value={post.lastSeenLocation} />
            </div>
            <DetailField
              label="Last Seen Date"
              value={
                post.lastSeenDate
                  ? new Date(post.lastSeenDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                  : undefined
              }
            />
            <DetailField label="Reward" value={post.reward ? `$${post.reward}` : "None offered"} />
          </div>

          <div className="border-t border-gray-100" />

          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Contact</p>
            {parsedPhones.map((phone, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${phone}`} className="text-blue-600 hover:underline font-medium">{phone}</a>
              </div>
            ))}
            {parsedEmails.map((email, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline font-medium break-all">{email}</a>
              </div>
            ))}
            {parsedPhones.length === 0 && parsedEmails.length === 0 && (
              <p className="text-xs text-gray-400 italic">No contact info provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
    <p className="font-medium text-gray-800 mt-0.5">{value || "—"}</p>
  </div>
);

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteConfirmModal = ({
  post,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  post: PetPost;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Delete this post?</h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700 capitalize">{post.petName || "This post"}</span> will be permanently removed. This can't be undone.
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition flex items-center gap-2"
        >
          {isDeleting && (
            <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          )}
          {isDeleting ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Update Post Modal ─────────────────────────────────────────────────────────
const UpdatePostModal = ({
  post,
  onClose,
}: {
  post: PetPost;
  onClose: () => void;
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Update Post</h2>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">
              Editing: {post.petName || "Unnamed Pet"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-6">
          <UpdatePost post={post} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

// ── My Posts Page ─────────────────────────────────────────────────────────────
const MyPostsPage = () => {
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postToUpdate, setPostToUpdate] = useState<PetPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<PetPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await getMyPosts(pageNumber, 3);
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

  const handleDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await deletePost(postToDelete._id);
      setPostToDelete(null);
      fetchData(page);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow =
      isAddModalOpen || selectedPost || postToUpdate || postToDelete ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isAddModalOpen, selectedPost, postToUpdate, postToDelete]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Posts</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your lost & found pet reports</p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && (
              <span className="text-sm text-gray-500">
                {posts.length} post{posts.length !== 1 ? "s" : ""} on this page
              </span>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm animate-pulse">
                <div className="bg-gray-200 aspect-video w-full" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No posts yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">You haven't reported any lost or found pets.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Create your first post
            </button>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: PetPost, index) => {
              const isLost = post.status === "LOST";
              return (
              <div
                key={post._id || index}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                {/* Hover action buttons */}
                <div className="absolute top-2 right-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={(e) => { e.stopPropagation(); setPostToUpdate(post); }}
                    className="flex items-center gap-1 bg-white/90 hover:bg-white text-gray-700 hover:text-blue-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md border border-gray-200 transition-colors"
                    aria-label="Update post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setPostToDelete(post); }}
                    className="flex items-center gap-1 bg-white/90 hover:bg-white text-gray-700 hover:text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-md border border-gray-200 transition-colors"
                    aria-label="Delete post"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>

                {/* Image */}
                <div className="relative bg-gray-100 aspect-video w-full overflow-hidden">
                  <img
                    src={post.imageURL || "https://via.placeholder.com/400x225?text=No+Image"}
                    alt={post.petName || "Pet"}
                    className="w-full h-full object-cover"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shadow-sm ${isLost ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
                    {post.status || "N/A"}
                  </span>
                  {post.reward && (
                    <span className="absolute bottom-3 left-3 text-xs font-bold bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full shadow-sm">
                      🏆 ${post.reward}
                    </span>
                  )}
                </div>

                {/* Compact body */}
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
                    <span className="font-medium text-gray-700">{post.breed || "Unknown breed"}</span>
                    {post.color ? ` · ${post.color}` : ""}
                  </p>

                  <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {post.lastSeenLocation || "Location unknown"}
                  </p>

                  <p className="text-xs text-gray-400">
                    {post.lastSeenDate
                      ? new Date(post.lastSeenDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Date unknown"}
                  </p>

                  <p className="text-xs text-blue-500 font-medium mt-1">Tap for full details →</p>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPageCount > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => fetchData(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPageCount }, (_, i) => i + 1).map((p) => (
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
              ))}
            </div>

            <button
              onClick={() => fetchData(page + 1)}
              disabled={page >= totalPageCount}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Button (mobile) */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 z-40 md:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Post
      </button>

      {/* Add Post Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Add New Post</h2>
                <p className="text-xs text-gray-500 mt-0.5">Fill in the details to report a lost or found pet</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {/* Update Post Modal */}
      {postToUpdate && (
        <UpdatePostModal post={postToUpdate} onClose={() => { setPostToUpdate(null); fetchData(page); }} />
      )}

      {/* Delete Confirm Modal */}
      {postToDelete && (
        <DeleteConfirmModal
          post={postToDelete}
          onConfirm={handleDelete}
          onCancel={() => setPostToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default MyPostsPage;