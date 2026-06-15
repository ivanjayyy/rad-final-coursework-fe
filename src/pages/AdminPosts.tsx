import { useEffect, useState } from "react";
import { getAllPosts, deletePost } from "../service/post";

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
    onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Delete this post?
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium text-gray-700 capitalize">
              {post.petName || "This post"}
            </span>{" "}
            will be permanently removed. This action cannot be undone.
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
            <svg
              className="animate-spin h-3.5 w-3.5"
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
          )}
          {isDeleting ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    </div>
  </div>
);

// ── Post Detail Drawer ────────────────────────────────────────────────────────
const PostDetailDrawer = ({
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
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-gray-900">Post Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
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

        {/* Image */}
        <div className="bg-gray-100 flex items-center justify-center w-full">
          <img
            src={
              post.imageURL ||
              "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={post.petName || "Pet"}
            className="w-full object-contain max-h-64"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5">
          {/* Title & status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 capitalize">
                {post.petName || "Unnamed Pet"}
              </h3>
              <span className="text-xs font-mono text-gray-400">
                ID: {post._id}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span
                className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${isLost ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}
              >
                {post.status}
              </span>
              {post.reward && (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                  🏆 ${post.reward}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: "Breed", value: post.breed },
              { label: "Color", value: post.color },
              {
                label: "Last Seen Date",
                value: post.lastSeenDate
                  ? new Date(post.lastSeenDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : undefined,
              },
              {
                label: "Reward",
                value: post.reward ? `$${post.reward}` : "None",
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <p className="font-medium text-gray-800 mt-0.5">
                  {value || "—"}
                </p>
              </div>
            ))}
            <div className="col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Last Seen Location
              </p>
              <p className="font-medium text-gray-800 mt-0.5">
                {post.lastSeenLocation || "—"}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Contact */}
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

// ── Admin Post Management Page ────────────────────────────────────────────────
const AdminPostsPage = () => {
  const [posts, setPosts] = useState<PetPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<PetPost | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LOST" | "FOUND">(
    "ALL",
  );
  const [search, setSearch] = useState("");

  const fetchData = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await getAllPosts(pageNumber, 10);
      setPosts(res?.data || []);
      setPage(pageNumber);
      setTotalPageCount(res?.pagination.totalPages || 0);
      setTotalCount(res?.pagination.total || 0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedPost || postToDelete ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPost, postToDelete]);

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

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === "ALL" || post.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      post.petName?.toLowerCase().includes(q) ||
      post.breed?.toLowerCase().includes(q) ||
      post.lastSeenLocation?.toLowerCase().includes(q) ||
      post._id?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Post Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? "Loading…" : `${totalCount} total posts`}
            </p>
          </div>

          {/* Stats chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              {
                label: "All",
                value: "ALL",
                color: "bg-gray-100 text-gray-700 border-gray-200",
              },
              {
                label: "Lost",
                value: "LOST",
                color: "bg-red-50 text-red-700 border-red-200",
              },
              {
                label: "Found",
                value: "FOUND",
                color: "bg-emerald-50 text-emerald-700 border-emerald-200",
              },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${f.color} ${statusFilter === f.value ? "ring-2 ring-offset-1 ring-blue-400" : "opacity-70 hover:opacity-100"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
        {/* Search bar */}
        <div className="relative max-w-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, breed, location, ID…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
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
          )}
        </div>

        {/* Loading skeleton */}
        {isLoading && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 animate-pulse"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
                <div className="h-8 w-8 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">No posts found</p>
            {search && (
              <p className="text-gray-400 text-xs mt-1">
                Try a different search term.
              </p>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[48px_1fr_120px_160px_100px_80px_56px] items-center gap-4 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <div />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Pet
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Status
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Location
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Date
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Reward
              </p>
              <div />
            </div>

            {/* Rows */}
            {filteredPosts.map((post, index) => {
              const isLost = post.status === "LOST";
              return (
                <div
                  key={post._id || index}
                  className="flex md:grid md:grid-cols-[48px_1fr_120px_160px_100px_80px_56px] items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={
                        post.imageURL || "https://via.placeholder.com/48?text=?"
                      }
                      alt={post.petName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name + ID */}
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="text-left group"
                    >
                      <p className="text-sm font-semibold text-gray-900 capitalize truncate group-hover:text-blue-600 transition-colors">
                        {post.petName || "Unnamed"}
                      </p>
                      <p className="text-xs text-gray-400 font-mono truncate">
                        {post.breed || "—"} · #{post._id.slice(-6)}
                      </p>
                    </button>
                  </div>

                  {/* Status */}
                  <div className="hidden md:block">
                    <span
                      className={`inline-flex text-xs font-bold tracking-wider uppercase px-2.5 py-1 rounded-full ${isLost ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}
                    >
                      {post.status}
                    </span>
                  </div>

                  {/* Location */}
                  <p className="hidden md:block text-sm text-gray-600 truncate">
                    {post.lastSeenLocation || "—"}
                  </p>

                  {/* Date */}
                  <p className="hidden md:block text-sm text-gray-600 whitespace-nowrap">
                    {post.lastSeenDate
                      ? new Date(post.lastSeenDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "—"}
                  </p>

                  {/* Reward */}
                  <p className="hidden md:block text-sm font-medium text-amber-600">
                    {post.reward ? (
                      `$${post.reward}`
                    ) : (
                      <span className="text-gray-400 font-normal">—</span>
                    )}
                  </p>

                  {/* Delete */}
                  <div className="shrink-0 ml-auto md:ml-0">
                    <button
                      onClick={() => setPostToDelete(post)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete post"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPageCount > 1 && (
          <div className="flex items-center justify-between gap-4 pt-2">
            <p className="text-sm text-gray-500">
              Page <span className="font-semibold text-gray-700">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700">
                {totalPageCount}
              </span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => fetchData(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
                Prev
              </button>

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

              <button
                onClick={() => fetchData(page + 1)}
                disabled={page >= totalPageCount}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
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
          </div>
        )}
      </div>

      {/* Post Detail Drawer */}
      {selectedPost && (
        <PostDetailDrawer
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
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

export default AdminPostsPage;
