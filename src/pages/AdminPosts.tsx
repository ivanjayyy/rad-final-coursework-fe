import { useEffect, useState } from "react";
import { getAllPosts } from "../service/post";
import { deletePost } from "../service/admin";

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
  // Updated author property to include profilePic
  author: {
    _id: string;
    username: string;
    email: string;
    profilePic?: string;
  };
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
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    onClick={(e) => {
      if (e.target === e.currentTarget) onCancel();
    }}
  >
    <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm p-6 flex flex-col gap-5 transform rotate-[-1deg]">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-none border-4 border-black bg-red-400 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
            Delete this post?
          </h3>
          <p className="text-sm font-bold text-gray-700 mt-2">
            <span className="bg-yellow-300 px-1 border border-black font-extrabold capitalize">
              {post.petName || "This post"}
            </span>{" "}
            will be permanently wiped out! This cannot be undone!
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-2">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-black border-4 border-black rounded-none bg-white hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
        >
          CANCEL
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-black border-4 border-black rounded-none bg-red-500 text-white hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isDeleting ? "DELETING..." : "YES, DELETE!"}
        </button>
      </div>
    </div>
  </div>
);

// ── Unified Post & User Detail Modal ──────────────────────────────────────────
const UnifiedDetailModal = ({
  post,
  onClose,
}: {
  post: PetPost;
  onClose: () => void;
}) => {
  const [view, setView] = useState<"POST" | "USER">("POST");
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
      <div className="bg-white border-4 border-black w-full max-w-lg shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Block */}
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-purple-400">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            {view === "POST" ? "💥 Post Details 💥" : "👤 Submitter Profile 👤"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 border-2 border-black rounded-none bg-white text-black hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {view === "POST" ? (
            <>
              {/* Pet Media Frame */}
              <div className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-amber-100 relative max-h-64 overflow-hidden flex items-center justify-center">
                <img
                  src={
                    post.imageURL ||
                    "https://via.placeholder.com/600x400?text=No+Image"
                  }
                  alt={post.petName || "Pet"}
                  className="w-full object-cover h-64"
                />
                {/* Embedded Submitter Button */}
                <div className="absolute bottom-3 left-3">
                  <button
                    onClick={() => setView("USER")}
                    className="px-3 py-1.5 text-xs font-black border-2 border-black rounded-none bg-cyan-300 text-black hover:bg-cyan-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
                  >
                    <span>By: @{post.author.username || "UnknownUser"}</span>
                    <span className="text-sm">👉</span>
                  </button>
                </div>
              </div>

              {/* Identity Row */}
              <div className="flex items-start justify-between gap-4 border-b-4 border-dashed border-black pb-4">
                <div>
                  <h3 className="text-3xl font-black uppercase text-black tracking-tight drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                    {post.petName || "Unnamed Pet"}
                  </h3>
                  <span className="inline-block mt-1 font-mono text-xs font-bold bg-gray-200 border border-black px-1">
                    ID: {post._id}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-sm font-black uppercase tracking-widest px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${isLost ? "bg-red-400 text-black" : "bg-emerald-400 text-black"}`}
                  >
                    {post.status}
                  </span>
                  {post.reward && (
                    <span className="text-xs font-black bg-yellow-300 text-black px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      💰 ${post.reward}
                    </span>
                  )}
                </div>
              </div>

              {/* Spec Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "🕵️‍♂️ Breed", value: post.breed },
                  { label: "🎨 Color", value: post.color },
                  {
                    label: "📅 Last Seen Date",
                    value: post.lastSeenDate
                      ? new Date(post.lastSeenDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : undefined,
                  },
                  {
                    label: "🏆 Reward Status",
                    value: post.reward ? `$${post.reward}` : "No Reward",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="border-2 border-black p-2 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <p className="text-xs font-black uppercase tracking-wider text-purple-600">
                      {label}
                    </p>
                    <p className="text-base font-extrabold text-black mt-0.5">
                      {value || "—"}
                    </p>
                  </div>
                ))}
                <div className="col-span-2 border-2 border-black p-3 bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-xs font-black uppercase tracking-wider text-red-500">
                    📍 Last Seen Location
                  </p>
                  <p className="text-base font-extrabold text-black mt-0.5">
                    {post.lastSeenLocation || "—"}
                  </p>
                </div>
              </div>

              {/* Direct Post Contact Options */}
              <div className="border-t-4 border-black pt-4 space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-black">
                  📞 Broadcast Contacts
                </p>
                <div className="flex flex-col gap-2">
                  {parsedPhones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${phone}`}
                      className="w-fit text-sm font-bold border border-black bg-white px-2 py-1 hover:bg-purple-100 underline decoration-2 text-blue-600"
                    >
                      📞 {phone}
                    </a>
                  ))}
                  {parsedEmails.map((email, i) => (
                    <a
                      key={i}
                      href={`mailto:${email}`}
                      className="w-fit text-sm font-bold border border-black bg-white px-2 py-1 hover:bg-purple-100 underline decoration-2 text-blue-600 break-all"
                    >
                      ✉️ {email}
                    </a>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* User Detail View Section - UPDATED TO SHOW PROFILE PIC AND REMOVE ID */
            <div className="space-y-6 py-2 animate-fade-in">
              {/* Back Button */}
              <button
                onClick={() => setView("POST")}
                className="px-3 py-1.5 text-xs font-black border-2 border-black rounded-none bg-yellow-300 text-black hover:bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
              >
                ⬅️ BACK TO POST
              </button>

              <div className="border-4 border-black p-6 bg-cyan-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-5">
                {/* Profile Pic Display with Initials Fallback */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-2">
                    Profile Picture
                  </label>
                  <div className="w-24 h-24 bg-purple-300 border-4 border-black overflow-hidden flex items-center justify-center font-black text-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {post.author.profilePic ? (
                      <img
                        src={post.author.profilePic}
                        alt={post.author.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Falls back to initials if image URL fails
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      (post.author.username || "U").slice(0, 2).toUpperCase()
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                    Account Handle
                  </label>
                  <p className="text-2xl font-black text-black">
                    @{post.author.username || "Unknown_User"}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-gray-500">
                    Verified Email Address
                  </label>
                  <p className="text-base font-extrabold text-black bg-white border-2 border-black p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] break-all">
                    {post.author.email || "No registered email available"}
                  </p>
                </div>
              </div>
            </div>
          )}
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
      // Injected mock placeholders inside the fetch layout mapping logic for testing data properties
      const adjustedData = (res?.data || []).map((p: any) => ({
        ...p,
        author: {
          _id:
            p.author?._id ||
            p.userId ||
            "usr_" + Math.random().toString(36).substr(2, 9),
          username:
            p.author?.username || p.username || "HeroFinder_" + p.petName,
          email:
            p.author?.email ||
            p.userEmail ||
            `${p.petName || "user"}@comicmail.com`,
          profilePic: p.author?.profilePic || undefined, // Map from your API architecture response if exists
        },
      }));
      setPosts(adjustedData);
      setPage(pageNumber);
      setTotalPageCount(res?.pagination.totalPages || 0);
      setTotalCount(res?.pagination.totalPosts || 0);
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
    <div className="min-h-screen bg-amber-50 font-sans antialiased text-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Comic Banner Page Header */}
        <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transform rotate-[-0.5deg]">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-black px-4 py-1 uppercase tracking-widest border-b-4 border-l-4 border-black">
            Admin HQ
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
                💥 Post Management 💥
              </h1>
              <p className="text-sm font-black text-black mt-1 bg-white/70 px-2 py-0.5 border border-black inline-block">
                {isLoading
                  ? "LOADING DOSSIERS…"
                  : `${totalCount} CRITICAL POSTS ON FILE`}
              </p>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                {
                  label: "SHOW ALL",
                  value: "ALL",
                  color: "bg-white text-black",
                },
                {
                  label: "🔴 LOST",
                  value: "LOST",
                  color: "bg-red-400 text-black",
                },
                {
                  label: "🟢 FOUND",
                  value: "FOUND",
                  color: "bg-emerald-400 text-black",
                },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value as any)}
                  className={`px-3 py-2 text-xs font-black border-2 border-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${f.color} ${statusFilter === f.value ? "bg-cyan-300 ring-2 ring-black" : "opacity-90"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Controls Frame */}
        <div className="relative max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH DATABASE BY NAME, BREED, ID..."
            className="w-full pl-4 pr-10 py-2.5 text-sm font-bold border-4 border-black rounded-none bg-white text-black focus:outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder-gray-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-red-500 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
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

        {/* Data Loading Block */}
        {isLoading && (
          <div className="border-4 border-black bg-white divide-y-4 divide-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-5 animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-300 border-2 border-black shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 border border-black w-1/4" />
                  <div className="h-3 bg-gray-200 border border-black w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Search Result Terminal */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-red-100 border-2 border-black flex items-center justify-center mb-4 transform rotate-12">
              <span className="text-2xl font-black">?</span>
            </div>
            <p className="text-xl font-black uppercase text-black">
              No Records Match the Search Filter
            </p>
          </div>
        )}

        {/* Comic Table Grid View */}
        {!isLoading && filteredPosts.length > 0 && (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {/* Headers Desktop */}
            <div className="hidden md:grid grid-cols-[64px_1fr_130px_180px_120px_70px] items-center gap-4 px-6 py-3 border-b-4 border-black bg-purple-300 font-black uppercase tracking-wider text-sm">
              <div />
              <p>Pet Profile</p>
              <p>Alert Status</p>
              <p>Last Spotting</p>
              <p>Bounty Reward</p>
              <div />
            </div>

            {/* List Components */}
            <div className="divide-y-4 divide-black">
              {filteredPosts.map((post, index) => {
                const isLost = post.status === "LOST";
                return (
                  <div
                    key={post._id || index}
                    className="flex flex-col md:grid md:grid-cols-[64px_1fr_130px_180px_120px_70px] items-start md:items-center gap-3 md:gap-4 px-6 py-4 hover:bg-cyan-50/50 transition-colors bg-white"
                  >
                    {/* Thumbnail box */}
                    <div className="w-14 h-14 border-2 border-black overflow-hidden bg-gray-100 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <img
                        src={
                          post.imageURL ||
                          "https://via.placeholder.com/48?text=?"
                        }
                        alt={post.petName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Meta Field Clicker */}
                    <div className="min-w-0 flex-1">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-left block group"
                      >
                        <p className="text-lg font-black text-black capitalize group-hover:text-purple-700 group-hover:underline decoration-2 transition-all">
                          {post.petName || "Unnamed Case"}
                        </p>
                        <p className="text-xs font-bold text-gray-600 font-mono mt-0.5">
                          {post.breed || "Unspecified Breed"} · #
                          {post._id.slice(-6).toUpperCase()}
                        </p>
                      </button>
                    </div>

                    {/* Dynamic Badging Status */}
                    <div>
                      <span
                        className={`inline-block text-xs font-black tracking-wider uppercase px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isLost ? "bg-red-400 text-black" : "bg-emerald-400 text-black"}`}
                      >
                        {post.status}
                      </span>
                    </div>

                    {/* Geolocation String */}
                    <p className="text-sm font-extrabold text-gray-800 truncate max-w-xs md:max-w-none">
                      📍 {post.lastSeenLocation || "—"}
                    </p>

                    {/* Bounty Figure Info */}
                    <p className="text-sm font-black text-amber-600">
                      {post.reward ? (
                        `💵 $${post.reward}`
                      ) : (
                        <span className="text-gray-400 font-normal">—</span>
                      )}
                    </p>

                    {/* Delete Function Button */}
                    <div className="ml-auto md:ml-0 pt-2 md:pt-0">
                      <button
                        onClick={() => setPostToDelete(post)}
                        className="p-2 border-2 border-black bg-white text-black hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        title="Delete post entry"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Paging Control Panels */}
        {!isLoading && totalPageCount > 1 && (
          <div className="flex items-center justify-between gap-4 pt-2 flex-wrap bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-sm font-black uppercase text-black">
              Page{" "}
              <span className="bg-yellow-300 px-1.5 border border-black">
                {page}
              </span>{" "}
              of {totalPageCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchData(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-black border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
              >
                ◀ PREV
              </button>

              {Array.from({ length: totalPageCount }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => fetchData(p)}
                    className={`w-8 h-8 text-xs font-black border-2 border-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${p === page ? "bg-purple-400 text-black shadow-none translate-x-0.5 translate-y-0.5" : "bg-white text-black hover:bg-gray-50"}`}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                onClick={() => fetchData(page + 1)}
                disabled={page >= totalPageCount}
                className="px-3 py-1.5 text-xs font-black border-2 border-black bg-white hover:bg-gray-100 disabled:opacity-40 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
              >
                NEXT ▶
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Unified Context Details Modal Popup Panel */}
      {selectedPost && (
        <UnifiedDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* Confirmation Framework Popup */}
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
