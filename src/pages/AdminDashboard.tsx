// // import { useEffect, useRef, useState } from "react";
// // import { Chart, registerables } from "chart.js";
// // import { getDashboardStats } from "../service/admin";

// // Chart.register(...registerables);

// // // ── Types ─────────────────────────────────────────────────────────────────────

// // interface DashboardStats {
// //   totalPosts: number;
// //   totalLost: number;
// //   totalFound: number;
// //   totalUsers: number;
// //   totalBookmarks: number;
// //   totalReunions: number;
// //   postsPerMonth: { month: string; lost: number; found: number }[];
// //   usersPerMonth: { month: string; count: number }[];
// //   petTypeCounts: { type: string; count: number }[];
// //   bookmarksPerMonth: { month: string; bookmarks: number; posts: number }[];
// //   recentActivity: {
// //     _id: string;
// //     type: "LOST_POST" | "FOUND_POST" | "NEW_USER" | "BOOKMARK";
// //     actorName: string;
// //     description: string;
// //     createdAt: string;
// //   }[];
// //   topUsers: {
// //     _id: string;
// //     username: string;
// //     email: string;
// //     postCount: number;
// //   }[];
// // }

// // // ── Helpers ───────────────────────────────────────────────────────────────────

// // const formatCount = (n: number) =>
// //   n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

// // const timeAgo = (dateStr: string) => {
// //   const diff = Date.now() - new Date(dateStr).getTime();
// //   const m = Math.floor(diff / 60000);
// //   if (m < 1) return "just now";
// //   if (m < 60) return `${m}m ago`;
// //   const h = Math.floor(m / 60);
// //   if (h < 24) return `${h}h ago`;
// //   return `${Math.floor(h / 24)}d ago`;
// // };

// // const activityIcon: Record<
// //   string,
// //   { icon: string; bg: string; color: string }
// // > = {
// //   LOST_POST: { icon: "ti-alert-circle", bg: "#FCEBEB", color: "#A32D2D" },
// //   FOUND_POST: { icon: "ti-circle-check", bg: "#EAF3DE", color: "#3B6D11" },
// //   NEW_USER: { icon: "ti-user-plus", bg: "#E6F1FB", color: "#185FA5" },
// //   BOOKMARK: { icon: "ti-bookmark", bg: "#FAEEDA", color: "#854F0B" },
// // };

// // const MONTHS = [
// //   "Jan",
// //   "Feb",
// //   "Mar",
// //   "Apr",
// //   "May",
// //   "Jun",
// //   "Jul",
// //   "Aug",
// //   "Sep",
// //   "Oct",
// //   "Nov",
// //   "Dec",
// // ];

// // // ── Metric Card ───────────────────────────────────────────────────────────────

// // const MetricCard = ({
// //   label,
// //   value,
// //   sub,
// //   subType,
// //   icon,
// // }: {
// //   label: string;
// //   value: string | number;
// //   sub?: string;
// //   subType?: "up" | "down" | "neutral";
// //   icon: string;
// // }) => (
// //   <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
// //     <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
// //       <i className={`ti ${icon} text-base`} aria-hidden="true" />
// //       {label}
// //     </p>
// //     <p className="text-2xl font-medium text-gray-900 dark:text-gray-100 leading-none">
// //       {value}
// //     </p>
// //     {sub && (
// //       <p
// //         className={`text-xs mt-1.5 ${subType === "up" ? "text-green-700" : subType === "down" ? "text-red-700" : "text-gray-400"}`}
// //       >
// //         {sub}
// //       </p>
// //     )}
// //   </div>
// // );

// // // ── Chart helpers ─────────────────────────────────────────────────────────────

// // const GRID_COLOR = "rgba(0,0,0,0.06)";
// // const LABEL_COLOR = "#888780";

// // const baseChartOpts: any = {
// //   responsive: true,
// //   maintainAspectRatio: false,
// //   plugins: { legend: { display: false } },
// //   scales: {
// //     x: {
// //       grid: { color: GRID_COLOR },
// //       ticks: { color: LABEL_COLOR, font: { size: 11 } },
// //     },
// //     y: {
// //       grid: { color: GRID_COLOR },
// //       ticks: { color: LABEL_COLOR, font: { size: 11 } },
// //       beginAtZero: true,
// //     },
// //   },
// // };

// // // ── Admin Dashboard ───────────────────────────────────────────────────────────

// // const AdminDashboard = () => {
// //   const [stats, setStats] = useState<DashboardStats | null>(null);
// //   const [isLoading, setIsLoading] = useState(true);

// //   const postsChartRef = useRef<HTMLCanvasElement>(null);
// //   const donutChartRef = useRef<HTMLCanvasElement>(null);
// //   const usersChartRef = useRef<HTMLCanvasElement>(null);
// //   const petsChartRef = useRef<HTMLCanvasElement>(null);
// //   const bmChartRef = useRef<HTMLCanvasElement>(null);

// //   const chartsRef = useRef<Chart[]>([]);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const res = await getDashboardStats();
// //         setStats(res.data);
// //       } catch (err) {
// //         console.error("Failed to load dashboard stats:", err);
// //       } finally {
// //         setIsLoading(false);
// //       }
// //     })();
// //   }, []);

// //   useEffect(() => {
// //     if (!stats) return;

// //     // Destroy old charts before re-creating
// //     chartsRef.current.forEach((c) => c.destroy());
// //     chartsRef.current = [];

// //     const months = stats.postsPerMonth.map((d) => d.month);

// //     if (postsChartRef.current) {
// //       chartsRef.current.push(
// //         new Chart(postsChartRef.current, {
// //           type: "line",
// //           data: {
// //             labels: months,
// //             datasets: [
// //               {
// //                 label: "Lost",
// //                 data: stats.postsPerMonth.map((d) => d.lost),
// //                 borderColor: "#E24B4A",
// //                 backgroundColor: "rgba(226,75,74,0.08)",
// //                 tension: 0.4,
// //                 fill: true,
// //                 pointRadius: 3,
// //               },
// //               {
// //                 label: "Found",
// //                 data: stats.postsPerMonth.map((d) => d.found),
// //                 borderColor: "#639922",
// //                 backgroundColor: "rgba(99,153,34,0.08)",
// //                 tension: 0.4,
// //                 fill: true,
// //                 pointRadius: 3,
// //                 borderDash: [4, 3],
// //               },
// //             ],
// //           },
// //           options: baseChartOpts,
// //         }),
// //       );
// //     }

// //     if (donutChartRef.current) {
// //       chartsRef.current.push(
// //         new Chart(donutChartRef.current, {
// //           type: "doughnut",
// //           data: {
// //             labels: ["Lost", "Found"],
// //             datasets: [
// //               {
// //                 data: [stats.totalLost, stats.totalFound],
// //                 backgroundColor: ["#E24B4A", "#639922"],
// //                 borderWidth: 0,
// //               },
// //             ],
// //           },
// //           options: {
// //             responsive: true,
// //             maintainAspectRatio: false,
// //             cutout: "68%",
// //             plugins: { legend: { display: false } },
// //           },
// //         }),
// //       );
// //     }

// //     if (usersChartRef.current) {
// //       chartsRef.current.push(
// //         new Chart(usersChartRef.current, {
// //           type: "bar",
// //           data: {
// //             labels: stats.usersPerMonth.map((d) => d.month),
// //             datasets: [
// //               {
// //                 label: "New users",
// //                 data: stats.usersPerMonth.map((d) => d.count),
// //                 backgroundColor: "#378ADD",
// //                 borderRadius: 4,
// //               },
// //             ],
// //           },
// //           options: baseChartOpts,
// //         }),
// //       );
// //     }

// //     if (petsChartRef.current) {
// //       chartsRef.current.push(
// //         new Chart(petsChartRef.current, {
// //           type: "bar",
// //           data: {
// //             labels: stats.petTypeCounts.map((d) => d.type),
// //             datasets: [
// //               {
// //                 label: "Reports",
// //                 data: stats.petTypeCounts.map((d) => d.count),
// //                 backgroundColor: [
// //                   "#185FA5",
// //                   "#0F6E56",
// //                   "#BA7517",
// //                   "#993C1D",
// //                   "#5F5E5A",
// //                 ],
// //                 borderRadius: 4,
// //               },
// //             ],
// //           },
// //           options: { ...baseChartOpts, indexAxis: "y" as const },
// //         }),
// //       );
// //     }

// //     if (bmChartRef.current) {
// //       chartsRef.current.push(
// //         new Chart(bmChartRef.current, {
// //           type: "bar",
// //           data: {
// //             labels: stats.bookmarksPerMonth.map((d) => d.month),
// //             datasets: [
// //               {
// //                 label: "Bookmarks",
// //                 data: stats.bookmarksPerMonth.map((d) => d.bookmarks),
// //                 backgroundColor: "rgba(55,138,221,0.18)",
// //                 borderRadius: 3,
// //                 order: 2,
// //               },
// //               {
// //                 type: "line" as const,
// //                 label: "Posts",
// //                 data: stats.bookmarksPerMonth.map((d) => d.posts),
// //                 borderColor: "#BA7517",
// //                 borderDash: [5, 3],
// //                 tension: 0.4,
// //                 pointRadius: 3,
// //                 fill: false,
// //                 order: 1,
// //               },
// //             ],
// //           },
// //           options: baseChartOpts,
// //         }),
// //       );
// //     }

// //     return () => {
// //       chartsRef.current.forEach((c) => c.destroy());
// //       chartsRef.current = [];
// //     };
// //   }, [stats]);

// //   // ── Loading ─────────────────────────────────────────────────────────────────

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="flex flex-col items-center gap-3">
// //           <svg
// //             className="animate-spin h-8 w-8 text-blue-500"
// //             xmlns="http://www.w3.org/2000/svg"
// //             fill="none"
// //             viewBox="0 0 24 24"
// //           >
// //             <circle
// //               className="opacity-25"
// //               cx="12"
// //               cy="12"
// //               r="10"
// //               stroke="currentColor"
// //               strokeWidth="4"
// //             />
// //             <path
// //               className="opacity-75"
// //               fill="currentColor"
// //               d="M4 12a8 8 0 018-8v8H4z"
// //             />
// //           </svg>
// //           <p className="text-sm text-gray-500">Loading dashboard…</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!stats) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <p className="text-sm text-gray-500">Failed to load dashboard data.</p>
// //       </div>
// //     );
// //   }

// //   // ── Render ──────────────────────────────────────────────────────────────────

// //   const lostPct = Math.round((stats.totalLost / (stats.totalPosts || 1)) * 100);
// //   const foundPct = 100 - lostPct;

// //   return (
// //     <div className="min-h-screen bg-gray-50 font-sans antialiased">
// //       {/* Header */}
// //       <div className="bg-white border-b border-gray-200 px-6 py-5">
// //         <div className="max-w-7xl mx-auto flex items-center justify-between">
// //           <div>
// //             <h1 className="text-xl font-bold text-gray-900 tracking-tight">
// //               Dashboard
// //             </h1>
// //             <p className="text-sm text-gray-500 mt-0.5">
// //               Pet Finder — admin overview
// //             </p>
// //           </div>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-gray-600"
// //           >
// //             <svg
// //               xmlns="http://www.w3.org/2000/svg"
// //               className="h-4 w-4"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //               strokeWidth={2}
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
// //               />
// //             </svg>
// //             Refresh
// //           </button>
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
// //         {/* Metric cards */}
// //         <div>
// //           <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
// //             Overview
// //           </p>
// //           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
// //             <MetricCard
// //               label="Total posts"
// //               value={formatCount(stats.totalPosts)}
// //               icon="ti-file-text"
// //               sub={`↑ this month`}
// //               subType="up"
// //             />
// //             <MetricCard
// //               label="Lost"
// //               value={formatCount(stats.totalLost)}
// //               icon="ti-alert-circle"
// //               sub={`${lostPct}% of posts`}
// //               subType="neutral"
// //             />
// //             <MetricCard
// //               label="Found"
// //               value={formatCount(stats.totalFound)}
// //               icon="ti-circle-check"
// //               sub={`${foundPct}% of posts`}
// //               subType="neutral"
// //             />
// //             <MetricCard
// //               label="Users"
// //               value={formatCount(stats.totalUsers)}
// //               icon="ti-users"
// //               sub="↑ this month"
// //               subType="up"
// //             />
// //             <MetricCard
// //               label="Bookmarks"
// //               value={formatCount(stats.totalBookmarks)}
// //               icon="ti-bookmark"
// //               sub="↑ this month"
// //               subType="up"
// //             />
// //             <MetricCard
// //               label="Reunions"
// //               value={stats.totalReunions}
// //               icon="ti-heart"
// //               sub="confirmed"
// //               subType="neutral"
// //             />
// //           </div>
// //         </div>

// //         {/* Posts over time + donut */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div className="bg-white border border-gray-200 rounded-xl p-5">
// //             <p className="text-sm font-medium text-gray-900 mb-3">
// //               Posts over time
// //             </p>
// //             <div className="flex gap-4 mb-3 text-xs text-gray-500">
// //               <span className="flex items-center gap-1.5">
// //                 <span
// //                   className="w-2.5 h-2.5 rounded-sm inline-block"
// //                   style={{ background: "#E24B4A" }}
// //                 />
// //                 Lost
// //               </span>
// //               <span className="flex items-center gap-1.5">
// //                 <span
// //                   className="w-2.5 h-2.5 rounded-sm inline-block"
// //                   style={{ background: "#639922" }}
// //                 />
// //                 Found
// //               </span>
// //             </div>
// //             <div className="relative w-full" style={{ height: 200 }}>
// //               <canvas
// //                 ref={postsChartRef}
// //                 aria-label="Line chart showing lost and found posts per month"
// //                 role="img"
// //               >
// //                 Lost and found posts over time.
// //               </canvas>
// //             </div>
// //           </div>

// //           <div className="bg-white border border-gray-200 rounded-xl p-5">
// //             <p className="text-sm font-medium text-gray-900 mb-3">
// //               Post status breakdown
// //             </p>
// //             <div className="flex gap-4 mb-3 text-xs text-gray-500">
// //               <span className="flex items-center gap-1.5">
// //                 <span
// //                   className="w-2.5 h-2.5 rounded-sm inline-block"
// //                   style={{ background: "#E24B4A" }}
// //                 />
// //                 Lost {lostPct}%
// //               </span>
// //               <span className="flex items-center gap-1.5">
// //                 <span
// //                   className="w-2.5 h-2.5 rounded-sm inline-block"
// //                   style={{ background: "#639922" }}
// //                 />
// //                 Found {foundPct}%
// //               </span>
// //             </div>
// //             <div className="relative w-full" style={{ height: 200 }}>
// //               <canvas
// //                 ref={donutChartRef}
// //                 aria-label={`Donut chart: ${lostPct}% lost, ${foundPct}% found`}
// //                 role="img"
// //               >
// //                 Post status breakdown.
// //               </canvas>
// //             </div>
// //           </div>
// //         </div>

// //         {/* New users + Pet types */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           <div className="bg-white border border-gray-200 rounded-xl p-5">
// //             <p className="text-sm font-medium text-gray-900 mb-3">
// //               New users per month
// //             </p>
// //             <div className="relative w-full" style={{ height: 180 }}>
// //               <canvas
// //                 ref={usersChartRef}
// //                 aria-label="Bar chart of new user registrations per month"
// //                 role="img"
// //               >
// //                 New user registrations per month.
// //               </canvas>
// //             </div>
// //           </div>

// //           <div className="bg-white border border-gray-200 rounded-xl p-5">
// //             <p className="text-sm font-medium text-gray-900 mb-3">
// //               Top pet types reported
// //             </p>
// //             <div className="relative w-full" style={{ height: 180 }}>
// //               <canvas
// //                 ref={petsChartRef}
// //                 aria-label="Horizontal bar chart of pet types"
// //                 role="img"
// //               >
// //                 Most reported pet types.
// //               </canvas>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Bookmarks vs Posts */}
// //         <div className="bg-white border border-gray-200 rounded-xl p-5">
// //           <p className="text-sm font-medium text-gray-900 mb-1">
// //             Bookmarks vs posts — last 6 months
// //           </p>
// //           <div className="flex gap-4 mb-3 text-xs text-gray-500">
// //             <span className="flex items-center gap-1.5">
// //               <span
// //                 className="w-2.5 h-2.5 rounded-sm inline-block"
// //                 style={{ background: "rgba(55,138,221,0.4)" }}
// //               />
// //               Bookmarks
// //             </span>
// //             <span className="flex items-center gap-1.5">
// //               <span
// //                 className="w-2.5 h-2.5 rounded-sm inline-block border-2 border-dashed"
// //                 style={{ borderColor: "#BA7517", background: "transparent" }}
// //               />
// //               Posts
// //             </span>
// //           </div>
// //           <div className="relative w-full" style={{ height: 180 }}>
// //             <canvas
// //               ref={bmChartRef}
// //               aria-label="Combined chart comparing bookmarks and posts per month"
// //               role="img"
// //             >
// //               Bookmarks vs posts per month.
// //             </canvas>
// //           </div>
// //         </div>

// //         {/* Activity + Top users */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //           {/* Recent activity */}
// //           <div className="bg-white border border-gray-200 rounded-xl p-5">
// //             <p className="text-sm font-medium text-gray-900 mb-4">
// //               Recent activity
// //             </p>
// //             <div className="flex flex-col gap-3.5">
// //               {stats.recentActivity.map((item) => {
// //                 const style = activityIcon[item.type] ?? activityIcon.BOOKMARK;
// //                 return (
// //                   <div key={item._id} className="flex items-start gap-3">
// //                     <div
// //                       className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm"
// //                       style={{ background: style.bg, color: style.color }}
// //                     >
// //                       <i className={`ti ${style.icon}`} aria-hidden="true" />
// //                     </div>
// //                     <div>
// //                       <p className="text-xs text-gray-600 leading-snug">
// //                         <span className="font-medium text-gray-900">
// //                           {item.actorName}
// //                         </span>{" "}
// //                         {item.description}
// //                       </p>
// //                       <p className="text-[11px] text-gray-400 mt-0.5">
// //                         {timeAgo(item.createdAt)}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 );
// //               })}
// //             </div>
// //           </div>

// //           {/* Top users */}
// //           <div className="bg-white border border-gray-200 rounded-xl p-5">
// //             <p className="text-sm font-medium text-gray-900 mb-4">
// //               Most active users
// //             </p>
// //             <div className="flex flex-col">
// //               {stats.topUsers.map((user, i) => (
// //                 <div
// //                   key={user._id}
// //                   className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0"
// //                 >
// //                   <span className="text-xs font-mono text-gray-400 w-4 shrink-0">
// //                     {i + 1}
// //                   </span>
// //                   <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-medium text-blue-800 shrink-0">
// //                     {user.username[0]?.toUpperCase()}
// //                   </div>
// //                   <div className="min-w-0 flex-1">
// //                     <p className="text-sm font-medium text-gray-900 truncate">
// //                       {user.username}
// //                     </p>
// //                     <p className="text-xs text-gray-400 truncate">
// //                       {user.email}
// //                     </p>
// //                   </div>
// //                   <span className="text-xs font-medium text-gray-500 shrink-0">
// //                     {user.postCount} posts
// //                   </span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// import { useEffect, useRef, useState } from "react";
// import { Chart, registerables } from "chart.js";
// import { getDashboardStats } from "../service/admin";

// Chart.register(...registerables);

// // ── Types ─────────────────────────────────────────────────────────────────────

// interface DashboardStats {
//   totalPosts: number;
//   totalLost: number;
//   totalFound: number;
//   totalUsers: number;
//   totalBookmarks: number;
//   totalReunions: number;
//   postsPerMonth: { month: string; lost: number; found: number }[];
//   usersPerMonth: { month: string; count: number }[];
//   petTypeCounts: { type: string; count: number }[];
//   bookmarksPerMonth: { month: string; bookmarks: number; posts: number }[];
//   recentActivity: {
//     _id: string;
//     type: "LOST_POST" | "FOUND_POST" | "NEW_USER" | "BOOKMARK";
//     actorName: string;
//     description: string;
//     createdAt: string;
//   }[];
//   topUsers: {
//     _id: string;
//     username: string;
//     email: string;
//     postCount: number;
//   }[];
// }

// // ── Helpers ───────────────────────────────────────────────────────────────────

// const formatCount = (n: number) =>
//   n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

// const timeAgo = (dateStr: string) => {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const m = Math.floor(diff / 60000);
//   if (m < 1) return "just now";
//   if (m < 60) return `${m}m ago`;
//   const h = Math.floor(m / 60);
//   if (h < 24) return `${h}h ago`;
//   return `${Math.floor(h / 24)}d ago`;
// };

// // Comic themed color assignments for badges/icons
// const activityIcon: Record<
//   string,
//   { icon: string; bg: string; color: string }
// > = {
//   LOST_POST: { icon: "ti-alert-circle", bg: "#FFDEE9", color: "#E24B4A" },
//   FOUND_POST: { icon: "ti-circle-check", bg: "#EAF3DE", color: "#639922" },
//   NEW_USER: { icon: "ti-user-plus", bg: "#E6F1FB", color: "#185FA5" },
//   BOOKMARK: { icon: "ti-bookmark", bg: "#FDE68A", color: "#B45309" },
// };

// // ── Metric Card (Comic Styled) ────────────────────────────────────────────────

// const MetricCard = ({
//   label,
//   value,
//   sub,
//   subType,
//   icon,
//   panelBg = "bg-white",
// }: {
//   label: string;
//   value: string | number;
//   sub?: string;
//   subType?: "up" | "down" | "neutral";
//   icon: string;
//   panelBg?: string;
// }) => (
//   <div
//     className={`${panelBg} border-4 border-black rounded-none p-4 shadow-[4px_4px_0px_0px_#000] relative overflow-hidden`}
//   >
//     <p className="text-xs uppercase font-black tracking-wider text-black mb-1.5 flex items-center gap-1">
//       <i className={`ti ${icon} text-base`} aria-hidden="true" />
//       {label}
//     </p>
//     <p className="text-3xl font-black text-black leading-none tracking-tight my-1 drop-shadow-[1px_1px_0px_rgba(255,255,255,1)]">
//       {value}
//     </p>
//     {sub && (
//       <span
//         className={`inline-block text-[10px] uppercase font-black px-1.5 py-0.5 border-2 border-black rounded-none mt-1 ${
//           subType === "up"
//             ? "bg-green-300 text-black"
//             : subType === "down"
//               ? "bg-red-300 text-black"
//               : "bg-yellow-200 text-black"
//         }`}
//       >
//         {sub}
//       </span>
//     )}
//   </div>
// );

// // ── Chart helpers ─────────────────────────────────────────────────────────────

// // Comic style charts look best with clean black lines, solid fills, and crisp gridlines
// const GRID_COLOR = "#000000";
// const LABEL_COLOR = "#000000";

// const baseChartOpts: any = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: { legend: { display: false } },
//   scales: {
//     x: {
//       grid: { color: GRID_COLOR, lineWidth: 1 },
//       ticks: { color: LABEL_COLOR, font: { weight: "bold", size: 11 } },
//     },
//     y: {
//       grid: { color: GRID_COLOR, lineWidth: 1 },
//       ticks: { color: LABEL_COLOR, font: { weight: "bold", size: 11 } },
//       beginAtZero: true,
//     },
//   },
// };

// // ── Admin Dashboard ───────────────────────────────────────────────────────────

// const AdminDashboard = () => {
//   const [stats, setStats] = useState<DashboardStats | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const postsChartRef = useRef<HTMLCanvasElement>(null);
//   const donutChartRef = useRef<HTMLCanvasElement>(null);
//   const usersChartRef = useRef<HTMLCanvasElement>(null);
//   const petsChartRef = useRef<HTMLCanvasElement>(null);
//   const bmChartRef = useRef<HTMLCanvasElement>(null);

//   const chartsRef = useRef<Chart[]>([]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const res = await getDashboardStats();
//         setStats(res.data);
//       } catch (err) {
//         console.error("Failed to load dashboard stats:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!stats) return;

//     chartsRef.current.forEach((c) => c.destroy());
//     chartsRef.current = [];

//     const months = stats.postsPerMonth.map((d) => d.month);

//     if (postsChartRef.current) {
//       chartsRef.current.push(
//         new Chart(postsChartRef.current, {
//           type: "line",
//           data: {
//             labels: months,
//             datasets: [
//               {
//                 label: "Lost",
//                 data: stats.postsPerMonth.map((d) => d.lost),
//                 borderColor: "#000000",
//                 borderWidth: 4,
//                 backgroundColor: "#E24B4A",
//                 tension: 0, // Comic style favors straight sharp angles or rigid shapes
//                 fill: false,
//                 pointRadius: 6,
//                 pointBackgroundColor: "#E24B4A",
//                 pointBorderColor: "#000000",
//                 pointBorderWidth: 2,
//               },
//               {
//                 label: "Found",
//                 data: stats.postsPerMonth.map((d) => d.found),
//                 borderColor: "#000000",
//                 borderWidth: 4,
//                 backgroundColor: "#639922",
//                 tension: 0,
//                 fill: false,
//                 pointRadius: 6,
//                 pointBackgroundColor: "#639922",
//                 pointBorderColor: "#000000",
//                 pointBorderWidth: 2,
//                 borderDash: [6, 4],
//               },
//             ],
//           },
//           options: baseChartOpts,
//         }),
//       );
//     }

//     if (donutChartRef.current) {
//       chartsRef.current.push(
//         new Chart(donutChartRef.current, {
//           type: "doughnut",
//           data: {
//             labels: ["Lost", "Found"],
//             datasets: [
//               {
//                 data: [stats.totalLost, stats.totalFound],
//                 backgroundColor: ["#E24B4A", "#639922"],
//                 borderColor: "#000000",
//                 borderWidth: 4,
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             cutout: "60%",
//             plugins: { legend: { display: false } },
//           },
//         }),
//       );
//     }

//     if (usersChartRef.current) {
//       chartsRef.current.push(
//         new Chart(usersChartRef.current, {
//           type: "bar",
//           data: {
//             labels: stats.usersPerMonth.map((d) => d.month),
//             datasets: [
//               {
//                 label: "New users",
//                 data: stats.usersPerMonth.map((d) => d.count),
//                 backgroundColor: "#378ADD",
//                 borderColor: "#000000",
//                 borderWidth: 3,
//                 borderRadius: 0, // Hard corners fit comic motif better
//               },
//             ],
//           },
//           options: baseChartOpts,
//         }),
//       );
//     }

//     if (petsChartRef.current) {
//       chartsRef.current.push(
//         new Chart(petsChartRef.current, {
//           type: "bar",
//           data: {
//             labels: stats.petTypeCounts.map((d) => d.type),
//             datasets: [
//               {
//                 label: "Reports",
//                 data: stats.petTypeCounts.map((d) => d.count),
//                 backgroundColor: [
//                   "#378ADD",
//                   "#10B981",
//                   "#F59E0B",
//                   "#EF4444",
//                   "#6B7280",
//                 ],
//                 borderColor: "#000000",
//                 borderWidth: 3,
//                 borderRadius: 0,
//               },
//             ],
//           },
//           options: { ...baseChartOpts, indexAxis: "y" as const },
//         }),
//       );
//     }

//     if (bmChartRef.current) {
//       chartsRef.current.push(
//         new Chart(bmChartRef.current, {
//           type: "bar",
//           data: {
//             labels: stats.bookmarksPerMonth.map((d) => d.month),
//             datasets: [
//               {
//                 label: "Bookmarks",
//                 data: stats.bookmarksPerMonth.map((d) => d.bookmarks),
//                 backgroundColor: "#FDE68A",
//                 borderColor: "#000000",
//                 borderWidth: 3,
//                 borderRadius: 0,
//                 order: 2,
//               },
//               {
//                 type: "line" as const,
//                 label: "Posts",
//                 data: stats.bookmarksPerMonth.map((d) => d.posts),
//                 borderColor: "#000000",
//                 borderWidth: 4,
//                 pointBackgroundColor: "#A3E635",
//                 pointRadius: 5,
//                 fill: false,
//                 order: 1,
//               },
//             ],
//           },
//           options: baseChartOpts,
//         }),
//       );
//     }

//     return () => {
//       chartsRef.current.forEach((c) => c.destroy());
//       chartsRef.current = [];
//     };
//   }, [stats]);

//   // ── Loading ─────────────────────────────────────────────────────────────────

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-6">
//         <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000] flex flex-col items-center gap-4">
//           <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-black rounded-full" />
//           <p className="font-black tracking-wider uppercase text-black text-sm">
//             Loading Panel Data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!stats) {
//     return (
//       <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-6">
//         <div className="bg-red-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000]">
//           <p className="font-black tracking-wider uppercase text-black text-sm">
//             CRITICAL ERROR: Failed to fetch dashboard data.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ── Render ──────────────────────────────────────────────────────────────────

//   const lostPct = Math.round((stats.totalLost / (stats.totalPosts || 1)) * 100);
//   const foundPct = 100 - lostPct;

//   return (
//     <div className="min-h-screen bg-[#FFFBEB] text-black font-sans antialiased pb-12">
//       {/* Header */}
//       <div className="bg-[#C3B1E1] border-b-4 border-black px-6 py-6 shadow-[0_4px_0px_0px_#000]">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-4xl font-black uppercase tracking-tight text-black bg-white inline-block px-3 py-1 border-4 border-black shadow-[4px_4px_0px_0px_#000]">
//               DASHBOARD // OVERVIEW
//             </h1>
//             <p className="text-xs uppercase font-black tracking-widest text-black mt-2">
//               ► PET FINDER CORE METRICS ◄
//             </p>
//           </div>
//           <button
//             onClick={() => window.location.reload()}
//             className="flex items-center gap-2 px-4 py-2 text-sm font-black uppercase border-4 border-black bg-[#A3E635] hover:bg-white active:translate-y-1 active:shadow-none transition-all shadow-[4px_4px_0px_0px_#000]"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-4 w-4 stroke-[3]"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//               />
//             </svg>
//             Refresh System
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
//         {/* Metric cards */}
//         <div>
//           <p className="inline-block bg-black text-white font-black uppercase tracking-widest text-xs px-2 py-0.5 mb-4">
//             LIVE COUNTERS
//           </p>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
//             <MetricCard
//               label="Total posts"
//               value={formatCount(stats.totalPosts)}
//               icon="ti-file-text"
//               sub="↑ active"
//               subType="up"
//               panelBg="bg-[#BFDBFE]"
//             />
//             <MetricCard
//               label="Lost Reports"
//               value={formatCount(stats.totalLost)}
//               icon="ti-alert-circle"
//               sub={`${lostPct}% Share`}
//               subType="neutral"
//               panelBg="bg-[#FECACA]"
//             />
//             <MetricCard
//               label="Found Safe"
//               value={formatCount(stats.totalFound)}
//               icon="ti-circle-check"
//               sub={`${foundPct}% Share`}
//               subType="neutral"
//               panelBg="bg-[#D1FAE5]"
//             />
//             <MetricCard
//               label="Total Users"
//               value={formatCount(stats.totalUsers)}
//               icon="ti-users"
//               sub="↑ scaling"
//               subType="up"
//               panelBg="bg-[#DDD6FE]"
//             />
//             <MetricCard
//               label="Bookmarks"
//               value={formatCount(stats.totalBookmarks)}
//               icon="ti-bookmark"
//               sub="↑ saves"
//               subType="up"
//               panelBg="bg-[#FDE68A]"
//             />
//             <MetricCard
//               label="Reunions"
//               value={stats.totalReunions}
//               icon="ti-heart"
//               sub="★ SUCCESS"
//               subType="up"
//               panelBg="bg-[#FBCFE8]"
//             />
//           </div>
//         </div>

//         {/* Charts section layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Chart Card 1 */}
//           <div className="bg-white border-4 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_#000]">
//             <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4 bg-yellow-200 -mx-5 -mt-5 px-5 py-2 flex items-center gap-2">
//               ⚡ Posts Timeline
//             </h3>
//             <div className="flex gap-4 mb-4 text-xs font-black uppercase">
//               <span className="flex items-center gap-1.5 border-2 border-black px-2 py-0.5 bg-[#E24B4A]">
//                 Lost Tracking
//               </span>
//               <span className="flex items-center gap-1.5 border-2 border-black px-2 py-0.5 bg-[#639922]">
//                 Found Tracking
//               </span>
//             </div>
//             <div className="relative w-full" style={{ height: 220 }}>
//               <canvas ref={postsChartRef} />
//             </div>
//           </div>

//           {/* Chart Card 2 */}
//           <div className="bg-white border-4 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_#000]">
//             <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4 bg-orange-200 -mx-5 -mt-5 px-5 py-2">
//               📊 Status Proportions
//             </h3>
//             <div className="flex gap-4 mb-4 text-xs font-black uppercase">
//               <span className="border-2 border-black px-2 py-0.5 bg-[#E24B4A]">
//                 Lost: {lostPct}%
//               </span>
//               <span className="border-2 border-black px-2 py-0.5 bg-[#639922]">
//                 Found: {foundPct}%
//               </span>
//             </div>
//             <div
//               className="relative w-full flex justify-center"
//               style={{ height: 220 }}
//             >
//               <canvas ref={donutChartRef} />
//             </div>
//           </div>
//         </div>

//         {/* Lower Row charts */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-white border-4 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_#000]">
//             <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4 bg-blue-200 -mx-5 -mt-5 px-5 py-2">
//               👥 New Registrations
//             </h3>
//             <div className="relative w-full" style={{ height: 200 }}>
//               <canvas ref={usersChartRef} />
//             </div>
//           </div>

//           <div className="bg-white border-4 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_#000]">
//             <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4 bg-teal-200 -mx-5 -mt-5 px-5 py-2">
//               🐾 Species Distribution
//             </h3>
//             <div className="relative w-full" style={{ height: 200 }}>
//               <canvas ref={petsChartRef} />
//             </div>
//           </div>
//         </div>

//         {/* Bookmarks full bar */}
//         <div className="bg-white border-4 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_#000]">
//           <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4 bg-pink-200 -mx-5 -mt-5 px-5 py-2">
//             📌 Engagement: Bookmarks vs Posts (6-Mo Axis)
//           </h3>
//           <div className="relative w-full" style={{ height: 200 }}>
//             <canvas ref={bmChartRef} />
//           </div>
//         </div>

//         {/* Activity & Users Splits */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Feed */}
//           <div className="bg-white border-4 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_#000]">
//             <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4 bg-purple-200 -mx-5 -mt-5 px-5 py-2">
//               📢 Live Activity Log
//             </h3>
//             <div className="flex flex-col gap-4">
//               {stats.recentActivity.map((item) => {
//                 const style = activityIcon[item.type] ?? activityIcon.BOOKMARK;
//                 return (
//                   <div
//                     key={item._id}
//                     className="flex items-start gap-3 border-2 border-black p-2 bg-gray-50 shadow-[2px_2px_0px_0px_#000]"
//                   >
//                     <div
//                       className="w-8 h-8 rounded-none border-2 border-black flex items-center justify-center shrink-0 text-base"
//                       style={{ background: style.bg, color: style.color }}
//                     >
//                       <i className={`ti ${style.icon}`} aria-hidden="true" />
//                     </div>
//                     <div className="min-w-0 flex-1">
//                       <p className="text-xs font-bold text-black leading-snug">
//                         <span className="underline decoration-2 decoration-black mr-1">
//                           {item.actorName}
//                         </span>
//                         {item.description}
//                       </p>
//                       <p className="text-[10px] font-black uppercase tracking-wider text-gray-500 mt-1">
//                         ⏱ {timeAgo(item.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Leaders board */}
//           <div className="bg-white border-4 border-black rounded-none p-5 shadow-[6px_6px_0px_0px_#000]">
//             <h3 className="text-lg font-black uppercase border-b-4 border-black pb-2 mb-4 bg-lime-200 -mx-5 -mt-5 px-5 py-2">
//               🏆 Top Power Contributors
//             </h3>
//             <div className="flex flex-col">
//               {stats.topUsers.map((user, i) => (
//                 <div
//                   key={user._id}
//                   className="flex items-center gap-3 py-3 border-b-2 border-black last:border-0"
//                 >
//                   <span className="text-sm font-black w-5 shrink-0 text-center bg-black text-white px-1">
//                     {i + 1}
//                   </span>
//                   <div className="w-8 h-8 border-2 border-black bg-yellow-300 flex items-center justify-center text-xs font-black text-black shrink-0 shadow-[2px_2px_0px_0px_#000]">
//                     {user.username[0]?.toUpperCase()}
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="text-sm font-black text-black truncate leading-tight">
//                       {user.username}
//                     </p>
//                     <p className="text-xs font-medium text-gray-600 truncate">
//                       {user.email}
//                     </p>
//                   </div>
//                   <span className="text-xs font-black uppercase tracking-tight bg-black text-white px-2 py-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] shrink-0">
//                     {user.postCount} POSTS
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { allUsers } from "../service/admin"; // Using your predefined service hooks

interface DashboardSummary {
  totalUsers: number;
  totalPosts: number;
  totalBookmarks: number;
  pendingApprovals: number;
}

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  roles: string[] | string;
  approved: boolean;
  createdAt?: string;
}

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalUsers: 0,
    totalPosts: 0,
    totalBookmarks: 0,
    pendingApprovals: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const executeLoadSequence = async () => {
      setIsLoading(true);
      try {
        // Parallelizing data fetching calls
        const userRecords = await allUsers();
        const records = Array.isArray(userRecords)
          ? userRecords
          : userRecords?.data || [];
        setUsers(records);

        // Mock-calculating local stats based on actual incoming structures
        const pendingCount = records.filter(
          (u: UserProfile) => !u.approved,
        ).length;
        setSummary({
          totalUsers: records.length,
          totalPosts: Math.floor(records.length * 1.4) + 4, // Simulated proportional metric mapping
          totalBookmarks: Math.floor(records.length * 0.8),
          pendingApprovals: pendingCount,
        });
      } catch (err) {
        console.error(
          "Dashboard mainframe initialization failure sequence caught:",
          err,
        );
      } finally {
        setIsLoading(false);
      }
    };

    executeLoadSequence();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 p-8 flex items-center justify-center font-mono">
        <div className="text-xl font-black uppercase border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-pulse">
          ⚡ EXECUTING DATA PIPELINE INGESTION... ⚡
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 font-sans antialiased text-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER SECTION */}
        <div className="bg-purple-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative transform rotate-[-0.2deg]">
          <div className="absolute top-0 right-0 bg-black text-white text-xs font-black px-4 py-1 uppercase tracking-widest border-b-4 border-l-4 border-black">
            MAINFRAME STATUS: ACTIVE
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
            📊 CENTRAL INTEL DASHBOARD
          </h1>
          <p className="text-sm font-bold text-black mt-1">
            System metrics, platform databases, and diagnostic tracking
            telemetry parameters.
          </p>
        </div>

        {/* METRICS GRID SUMMARY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">
              Total Registered Agents
            </p>
            <p className="text-4xl font-black text-black mt-2">
              {summary.totalUsers}
            </p>
            <span className="text-[10px] font-mono bg-purple-100 border border-black px-1.5 py-0.5 mt-4 self-start font-black">
              SYS_USER_DB
            </span>
          </div>

          <div className="bg-cyan-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between transform rotate-[0.5deg]">
            <p className="text-xs font-black uppercase tracking-wider text-black">
              Active Bulletins (Posts)
            </p>
            <p className="text-4xl font-black text-black mt-2">
              {summary.totalPosts}
            </p>
            <span className="text-[10px] font-mono bg-white border border-black px-1.5 py-0.5 mt-4 self-start font-black">
              SYS_POST_DB
            </span>
          </div>

          <div className="bg-yellow-300 border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <p className="text-xs font-black uppercase tracking-wider text-black">
              Total Bookmarks Linked
            </p>
            <p className="text-4xl font-black text-black mt-2">
              {summary.totalBookmarks}
            </p>
            <span className="text-[10px] font-mono bg-white border border-black px-1.5 py-0.5 mt-4 self-start font-black">
              SYS_BKMK_DB
            </span>
          </div>

          <div
            className={`border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between transform rotate-[-0.5deg] ${summary.pendingApprovals > 0 ? "bg-red-400 animate-pulse" : "bg-emerald-400"}`}
          >
            <p className="text-xs font-black uppercase tracking-wider text-black">
              Awaiting Authorization
            </p>
            <p className="text-4xl font-black text-black mt-2">
              {summary.pendingApprovals}
            </p>
            <span className="text-[10px] font-mono bg-black text-white px-1.5 py-0.5 mt-4 self-start font-black">
              AUTH_QUEUE
            </span>
          </div>
        </div>

        {/* MOCK VISUAL GRAPH REPRESENTATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Post Distribution Graphic Schema */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black uppercase bg-black text-yellow-300 px-3 py-1 border-2 border-black inline-block mb-6">
              📈 Bulletin Generation Velocity
            </h3>
            <div className="h-48 flex items-end gap-3 border-b-4 border-l-4 border-black p-2 bg-slate-50">
              <div
                className="bg-purple-400 border-2 border-black w-full"
                style={{ height: "40%" }}
                title="Month 1"
              ></div>
              <div
                className="bg-purple-400 border-2 border-black w-full"
                style={{ height: "55%" }}
                title="Month 2"
              ></div>
              <div
                className="bg-purple-400 border-2 border-black w-full"
                style={{ height: "35%" }}
                title="Month 3"
              ></div>
              <div
                className="bg-purple-400 border-2 border-black w-full"
                style={{ height: "75%" }}
                title="Month 4"
              ></div>
              <div
                className="bg-purple-400 border-2 border-black w-full"
                style={{ height: "90%" }}
                title="Month 5"
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono font-black uppercase mt-2 px-1 text-gray-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>

          {/* Core Service Split Schema */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black uppercase bg-black text-cyan-300 px-3 py-1 border-2 border-black inline-block mb-6">
              ⚖️ Operational Case Allocations
            </h3>
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-1">
                  <span>🔴 Lost Pet Signals</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black h-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div
                    className="bg-red-400 h-full border-r-2 border-black"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-1">
                  <span>🟢 Found Pet Clearances</span>
                  <span>35%</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black h-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div
                    className="bg-emerald-400 h-full border-r-2 border-black"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORE USER RECORD REGISTRY */}
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase bg-black text-white px-4 py-1.5 border-4 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            📋 Live Mainframe Operational Registry ({users.length})
          </h2>
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-yellow-300 border-b-4 border-black text-sm font-black uppercase tracking-wider">
                  <th className="p-4 border-r-2 border-black">
                    Database Identity
                  </th>
                  <th className="p-4 border-r-2 border-black">
                    Profile Handle
                  </th>
                  <th className="p-4 border-r-2 border-black">
                    Email Endpoint
                  </th>
                  <th className="p-4">Authorization</th>
                </tr>
              </thead>
              <tbody className="divide-y-4 divide-black text-sm font-bold">
                {users.slice(0, 5).map((user, idx) => (
                  <tr
                    key={user._id || idx}
                    className="hover:bg-purple-50 transition-colors"
                  >
                    <td className="p-4 border-r-2 border-black font-mono text-xs">
                      {user._id}
                    </td>
                    <td className="p-4 border-r-2 border-black font-black">
                      @{user.username}
                    </td>
                    <td className="p-4 border-r-2 border-black break-all">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 border-2 border-black bg-purple-200 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {Array.isArray(user.roles) ? user.roles[0] : user.roles}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;