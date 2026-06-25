import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAllPosts, addBookmark, removeBookmark } from "../../service/post";
import AddPost from "../../components/post/AddNewPost";
import { alert } from "../../utils/alerts";

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
  bookmark?: string[];
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className="relative bg-white border-4 border-slate-950 rounded-none shadow-[12px_12px_0px_0px_rgba(2,6,23,1)] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden transform scale-100 transition-all">
        {/* Comic Header/Close Banner */}
        <div className="bg-cyan-400 border-b-4 border-slate-950 p-4 flex justify-between items-center relative">
          <h3 className="text-xl font-black uppercase tracking-wider text-slate-950 skew-x-[-6deg]">
            💥 FILE: #{(post._id || "").toString().slice(-6)}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-950 bg-red-500 hover:bg-red-600 border-2 border-slate-950 font-black p-1.5 transition-transform hover:scale-110 active:scale-95 shadow-[2px_2px_0px_0px_rgba(2,6,23,1)]"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={4}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Image Frame */}
        <div className="bg-yellow-100 border-b-4 border-slate-950 flex items-center justify-center w-full p-4 relative">
          <img
            src={
              post.imageURL ||
              "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={post.petName || "Pet"}
            className="w-full object-contain max-h-72 border-4 border-slate-950 bg-white shadow-[4px_4px_0px_0px_rgba(2,6,23,1)]"
          />
        </div>

        {/* Details Wrapper */}
        <div className="overflow-y-auto p-6 flex flex-col gap-5 bg-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black text-slate-950 uppercase tracking-tight skew-x-[-4deg] drop-shadow-[2px_2px_0px_rgba(251,191,36,1)]">
                {post.petName || "Unnamed Pet"}
              </h2>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span
                className={`text-sm font-black tracking-widest uppercase px-4 py-1.5 border-2 border-slate-950 shadow-[3px_3px_0px_0px_rgba(2,6,23,1)] ${isLost ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}
              >
                {post.status}
              </span>
              {post.reward && (
                <span className="text-xs font-black bg-yellow-400 border-2 border-slate-950 text-slate-950 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(2,6,23,1)] uppercase tracking-wider rotate-2">
                  💰 REWARD: ${post.reward}
                </span>
              )}
            </div>
          </div>

          {/* Specs panel */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(2,6,23,1)] relative before:absolute before:inset-0 before:bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] before:[background-size:16px_16px] before:opacity-30">
            <div className="relative z-10">
              <DetailField label="BREED" value={post.breed} />
            </div>
            <div className="relative z-10">
              <DetailField label="COLOR" value={post.color} />
            </div>
            <div className="col-span-2 relative z-10">
              <DetailField
                label="LAST SEEN LOCATION"
                value={post.lastSeenLocation}
              />
            </div>
            <div className="col-span-2 relative z-10">
              <DetailField
                label="LAST SEEN DATE"
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
            </div>
          </div>

          <div className="border-t-4 border-dashed border-slate-950 my-1" />

          {/* Contact Actions */}
          <div className="space-y-3">
            <p className="text-sm font-black uppercase tracking-widest text-orange-600 bg-orange-100 border-2 border-orange-400 px-2 py-0.5 max-w-max skew-x-[-10deg]">
              📞 INTEL CHANNELS
            </p>
            {parsedPhones.map((phone, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-3 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(2,6,23,1)] hover:bg-yellow-50 transition-colors"
              >
                <span className="text-xl">📞</span>
                <a
                  href={`tel:${phone}`}
                  className="text-slate-950 font-black hover:underline tracking-wide"
                >
                  {phone}
                </a>
              </div>
            ))}
            {parsedEmails.map((email, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white p-3 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(2,6,23,1)] hover:bg-cyan-50 transition-colors"
              >
                <span className="text-xl">✉️</span>
                <a
                  href={`mailto:${email}`}
                  className="text-slate-950 font-black hover:underline break-all tracking-wide"
                >
                  {email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
      {label}
    </span>
    <p className="text-base font-black text-slate-950 mt-0.5 uppercase tracking-wide">
      {value || "—"}
    </p>
  </div>
);

// ── Main Page ────────────────────────────────────────────────────────────────
const PostPage = () => {
  const { user } = useAuth();
  const currentUserId = user?.id || user?._id;

  const [posts, setPosts] = useState<PetPost[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PetPost | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [bookmarking, setBookmarking] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<"ALL" | "LOST" | "FOUND">(
    "ALL",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [isNearMeActive, setIsNearMeActive] = useState(false);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const handleBookmark = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (bookmarking === postId) return;

    const isCurrentlyBookmarked = bookmarked.has(postId);
    setBookmarking(postId);

    try {
      if (isCurrentlyBookmarked) {
        await removeBookmark(postId);
        setBookmarked((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });

        alert.fire({
          title: "Removed from bookmarks",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        await addBookmark(postId);
        setBookmarked((prev) => new Set(prev).add(postId));

        alert.fire({
          title: "Bookmarked!",
          icon: "success",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } catch (error: any) {
      console.error("Failed to bookmark post:", error);

      const msg = error.response?.data?.message || "Something went wrong!";
      alert.fire({
        title: "ERROR!",
        text: `${msg}`,
        icon: "error",
        confirmButtonText: "Fix it",
      });
    } finally {
      setBookmarking(null);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getAllPosts(1, 200);
      const fetchedPosts: PetPost[] = res?.data || [];
      setPosts(fetchedPosts);

      if (currentUserId) {
        const initialBookmarked = new Set<string>();
        fetchedPosts.forEach((post) => {
          if (post.bookmark?.includes(currentUserId)) {
            initialBookmarked.add(post._id);
          }
        });
        setBookmarked(initialBookmarked);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      alert.fire({
        title: "ERROR!",
        text: "Failed to fetch posts",
        icon: "error",
        confirmButtonText: "Fix it",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUserId]);

  useEffect(() => {
    document.body.style.overflow =
      isAddModalOpen || selectedPost ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAddModalOpen, selectedPost]);

  const toggleNearMeFilter = () => {
    if (isNearMeActive) {
      setIsNearMeActive(false);
      return;
    }
    if (userCity) {
      setIsNearMeActive(true);
      return;
    }
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`,
          );
          const data = await response.json();
          const addr = data.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.municipality ||
            addr.county ||
            addr.state_district;

          let fallbackCity = city;
          if (!fallbackCity && data.display_name) {
            const segments = data.display_name.split(",");
            fallbackCity = segments[0]?.trim();
            if (fallbackCity && !isNaN(Number(fallbackCity)) && segments[1]) {
              fallbackCity = segments[1].trim();
            }
          }

          if (fallbackCity) {
            setUserCity(fallbackCity);
            setIsNearMeActive(true);
          } else {
            alert("Could not accurately determine your city name.");
          }
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          alert("Failed to resolve your location string.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(`Location access denied: ${error.message}`);
        setIsLocating(false);
      },
    );
  };

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === "ALL" || post.status === statusFilter;
    const matchesSearch =
      post.petName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.lastSeenLocation?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation =
      !isNearMeActive ||
      (userCity &&
        post.lastSeenLocation?.toLowerCase().includes(userCity.toLowerCase()));

    return matchesStatus && matchesSearch && matchesLocation;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery, isNearMeActive]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentDisplayedPosts = filteredPosts.slice(
    indexOfFirstPost,
    indexOfLastPost,
  );
  const totalPageCount = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    // Background styled with a comic-style light dotted pattern grid
    <div className="min-h-screen bg-orange-50 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:24px_24px] font-sans antialiased text-slate-900 p-6 md:p-12 relative pb-28">
      <div className="max-w-7xl mx-auto">
        {/* Filter Toolbar Controls: Pop-art Block Layout */}
        <div className="mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between bg-white border-4 border-slate-950 p-5 rounded-none shadow-[8px_8px_0px_0px_rgba(2,6,23,1)]">
          <div className="relative w-full lg:max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-950"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="SEARCH CASE FILES..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-4 border-slate-950 rounded-none font-black text-sm tracking-wide uppercase focus:outline-none focus:bg-yellow-50 placeholder-slate-400 transition"
            />
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-4 w-full lg:w-auto items-center">
            {/* Status filters */}
            <div className="flex gap-1 bg-slate-950 p-1.5 border-2 border-slate-950">
              {(["ALL", "LOST", "FOUND"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2 font-black text-xs tracking-widest uppercase transition-transform ${
                    statusFilter === status
                      ? "bg-yellow-400 text-slate-950 border-2 border-white scale-105"
                      : "text-white hover:text-yellow-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Near Me Toggle Button */}
            <button
              onClick={toggleNearMeFilter}
              disabled={isLocating}
              className={`flex items-center gap-2 px-5 py-3 border-4 border-slate-950 font-black text-xs tracking-widest uppercase transition-all whitespace-nowrap w-full md:w-auto justify-center shadow-[4px_4px_0px_0px_rgba(2,6,23,1)] active:translate-x-1 active:translate-y-1 active:shadow-none ${
                isNearMeActive
                  ? "bg-cyan-400 text-slate-950"
                  : "bg-white text-slate-950 hover:bg-slate-100"
              } ${isLocating ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLocating ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-slate-950"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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
                  RADAR SCANNING...
                </>
              ) : (
                <>
                  <span>📍</span>
                  {isNearMeActive && userCity ? `NEAR: ${userCity}` : "NEAR ME"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Empty State */}
        {currentDisplayedPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border-4 border-slate-950 p-12 shadow-[8px_8px_0px_0px_rgba(2,6,23,1)] max-w-xl mx-auto rotate-1">
            <div className="w-20 h-20 bg-amber-400 border-4 border-slate-950 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(2,6,23,1)]">
              <span className="text-4xl">❓</span>
            </div>
            <p className="text-slate-950 font-black text-3xl uppercase tracking-tight skew-x-[-4deg]">
              NO INTEL MATCHES!
            </p>
            <p className="text-slate-700 text-sm mt-3 max-w-sm font-bold uppercase tracking-wide">
              Adjust lookup parameters or switch location radars off.
            </p>
          </div>
        )}

        {/* Posts Grid - Styled with hard 3D layered offset elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {currentDisplayedPosts.map((post: PetPost, index) => {
            const isLost = post.status === "LOST";

            return (
              <div
                key={post._id || index}
                className="group relative transition-transform duration-200 hover:-translate-y-2"
              >
                {/* Comic Style Bookmark Ribbon */}
                <button
                  onClick={(e) => handleBookmark(e, post._id)}
                  title={
                    bookmarked.has(post._id) ? "Remove bookmark" : "Save post"
                  }
                  className={`absolute -top-3 -right-3 z-20 p-3 rounded-none border-4 border-slate-950 transition-all active:scale-90 shadow-[3px_3px_0px_0px_rgba(2,6,23,1)]
                    ${
                      bookmarked.has(post._id)
                        ? "bg-yellow-400 text-slate-950 scale-105"
                        : "bg-white text-slate-700 hover:bg-yellow-400 hover:text-slate-950"
                    }`}
                >
                  {bookmarking === post._id ? (
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
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                      fill={bookmarked.has(post._id) ? "currentColor" : "none"}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  )}
                </button>

                {/* Main 3D Card Structure */}
                <button
                  onClick={() => setSelectedPost(post)}
                  className="w-full text-left bg-white border-4 border-slate-950 rounded-none overflow-hidden flex flex-col shadow-[8px_8px_0px_0px_rgba(2,6,23,1)] group-hover:shadow-[14px_14px_0px_0px_rgba(2,6,23,1)] transition-all duration-200 focus:outline-none -rotate-1 group-hover:rotate-0"
                >
                  {/* Comic Frame Container */}
                  <div className="relative bg-yellow-50 aspect-[16/10] w-full overflow-hidden p-3 border-b-4 border-slate-950">
                    <img
                      src={
                        post.imageURL ||
                        "https://via.placeholder.com/400x225?text=No+Image"
                      }
                      alt={post.petName || "Pet"}
                      className="w-full h-full object-cover border-2 border-slate-950 shadow-inner filter contrast-125"
                    />

                    {/* Status Badge Burst */}
                    <span
                      className={`absolute top-5 left-5 text-xs font-black tracking-widest uppercase px-3 py-1.5 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(2,6,23,1)] skew-x-[-6deg] ${
                        isLost
                          ? "bg-red-500 text-white"
                          : "bg-emerald-500 text-white"
                      }`}
                    >
                      {post.status || "N/A"}
                    </span>

                    {post.reward && (
                      <span className="absolute bottom-5 right-5 text-xs font-black bg-yellow-400 text-slate-950 border-2 border-slate-950 px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(2,6,23,1)] rotate-3">
                        💥 ${post.reward}
                      </span>
                    )}
                  </div>

                  {/* Card Content Block */}
                  <div className="p-5 flex flex-col gap-2.5 bg-white w-full relative">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight truncate skew-x-[-2deg]">
                        {post.petName || "Unnamed Pet"}
                      </h2>
                      <span className="text-xs font-black text-white bg-slate-950 border-2 border-slate-950 px-2 py-0.5 shrink-0 transform -rotate-2">
                        #{(post._id || index).toString().slice(-4)}
                      </span>
                    </div>

                    <p className="text-sm font-black text-slate-500 uppercase tracking-wide truncate">
                      <span>{post.breed || "Unknown breed"}</span>
                      {post.color ? ` // ${post.color}` : ""}
                    </p>

                    <p className="text-xs font-bold text-slate-950 truncate flex items-center gap-1.5 bg-cyan-100 p-2.5 border-2 border-slate-950 mt-1 uppercase tracking-wide">
                      <span className="text-sm">📍</span>
                      {post.lastSeenLocation || "Location unknown"}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t-2 border-dashed border-slate-300">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-950 bg-yellow-400 border-2 border-slate-950 px-2.5 py-1 shadow-[2px_2px_0px_0px_rgba(2,6,23,1)] transition-colors group-hover:bg-cyan-400">
                        DETAILS →
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Pagination: Block style layout controls */}
        {totalPageCount > 1 && (
          <div className="flex items-center justify-center gap-4 mt-20 bg-white border-4 border-slate-950 p-3 rounded-none max-w-max mx-auto shadow-[6px_6px_0px_0px_rgba(2,6,23,1)]">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-sm font-black uppercase tracking-wider border-2 border-slate-950 bg-slate-50 hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition active:translate-y-0.5"
            >
              PREV
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPageCount }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-10 h-10 text-sm font-black border-2 transition ${
                      p === currentPage
                        ? "bg-slate-950 text-white border-slate-950 transform -rotate-3 scale-105"
                        : "bg-white border-slate-300 text-slate-950 hover:bg-yellow-100"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPageCount))
              }
              disabled={currentPage >= totalPageCount}
              className="px-4 py-2 text-sm font-black uppercase tracking-wider border-2 border-slate-950 bg-slate-50 hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition active:translate-y-0.5"
            >
              NEXT
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Post Action Button (FAB) - Comic "POW!" Burst look */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-none shadow-[4px_4px_0px_0px_rgba(2,6,23,1)] border-4 border-slate-950 transition-all hover:scale-110 active:scale-95 hover:rotate-12"
        title="Add new post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={4}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Add Post Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div className="relative bg-white border-4 border-slate-950 rounded-none shadow-[12px_12px_0px_0px_rgba(2,6,23,1)] w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b-4 border-slate-950 bg-yellow-300">
              <div>
                <h2 className="text-2xl font-black text-slate-950 uppercase tracking-tight skew-x-[-4deg]">
                  💥 FILE NEW REPORT
                </h2>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700 mt-0.5">
                  Input descriptive details for matching protocols
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white bg-slate-950 hover:bg-red-600 transition-colors p-2 border-2 border-slate-950 shadow-[2px_2px_0px_0px_rgba(2,6,23,1)]"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/xl"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={4}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto p-6 bg-white">
              <AddPost
                onPostAdded={() => {
                  fetchData(); // Refetches the backend data cleanly
                  setIsAddModalOpen(false); // Automatically closes the modal for a smooth UX
                }}
              />
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
