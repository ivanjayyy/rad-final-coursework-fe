import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import { getDashboardStats } from "../service/admin";

Chart.register(...registerables);

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalPosts: number;
  totalLost: number;
  totalFound: number;
  totalUsers: number;
  totalBookmarks: number;
  totalReunions: number;
  postsPerMonth: { month: string; lost: number; found: number }[];
  usersPerMonth: { month: string; count: number }[];
  petTypeCounts: { type: string; count: number }[];
  bookmarksPerMonth: { month: string; bookmarks: number; posts: number }[];
  recentActivity: {
    _id: string;
    type: "LOST_POST" | "FOUND_POST" | "NEW_USER" | "BOOKMARK";
    actorName: string;
    description: string;
    createdAt: string;
  }[];
  topUsers: {
    _id: string;
    username: string;
    email: string;
    postCount: number;
  }[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const activityIcon: Record<
  string,
  { icon: string; bg: string; color: string }
> = {
  LOST_POST: { icon: "ti-alert-circle", bg: "#FCEBEB", color: "#A32D2D" },
  FOUND_POST: { icon: "ti-circle-check", bg: "#EAF3DE", color: "#3B6D11" },
  NEW_USER: { icon: "ti-user-plus", bg: "#E6F1FB", color: "#185FA5" },
  BOOKMARK: { icon: "ti-bookmark", bg: "#FAEEDA", color: "#854F0B" },
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ── Metric Card ───────────────────────────────────────────────────────────────

const MetricCard = ({
  label,
  value,
  sub,
  subType,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  subType?: "up" | "down" | "neutral";
  icon: string;
}) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
    <p className="text-xs text-gray-500 mb-1.5 flex items-center gap-1">
      <i className={`ti ${icon} text-base`} aria-hidden="true" />
      {label}
    </p>
    <p className="text-2xl font-medium text-gray-900 dark:text-gray-100 leading-none">
      {value}
    </p>
    {sub && (
      <p
        className={`text-xs mt-1.5 ${subType === "up" ? "text-green-700" : subType === "down" ? "text-red-700" : "text-gray-400"}`}
      >
        {sub}
      </p>
    )}
  </div>
);

// ── Chart helpers ─────────────────────────────────────────────────────────────

const GRID_COLOR = "rgba(0,0,0,0.06)";
const LABEL_COLOR = "#888780";

const baseChartOpts: any = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: {
      grid: { color: GRID_COLOR },
      ticks: { color: LABEL_COLOR, font: { size: 11 } },
    },
    y: {
      grid: { color: GRID_COLOR },
      ticks: { color: LABEL_COLOR, font: { size: 11 } },
      beginAtZero: true,
    },
  },
};

// ── Admin Dashboard ───────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const postsChartRef = useRef<HTMLCanvasElement>(null);
  const donutChartRef = useRef<HTMLCanvasElement>(null);
  const usersChartRef = useRef<HTMLCanvasElement>(null);
  const petsChartRef = useRef<HTMLCanvasElement>(null);
  const bmChartRef = useRef<HTMLCanvasElement>(null);

  const chartsRef = useRef<Chart[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!stats) return;

    // Destroy old charts before re-creating
    chartsRef.current.forEach((c) => c.destroy());
    chartsRef.current = [];

    const months = stats.postsPerMonth.map((d) => d.month);

    if (postsChartRef.current) {
      chartsRef.current.push(
        new Chart(postsChartRef.current, {
          type: "line",
          data: {
            labels: months,
            datasets: [
              {
                label: "Lost",
                data: stats.postsPerMonth.map((d) => d.lost),
                borderColor: "#E24B4A",
                backgroundColor: "rgba(226,75,74,0.08)",
                tension: 0.4,
                fill: true,
                pointRadius: 3,
              },
              {
                label: "Found",
                data: stats.postsPerMonth.map((d) => d.found),
                borderColor: "#639922",
                backgroundColor: "rgba(99,153,34,0.08)",
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                borderDash: [4, 3],
              },
            ],
          },
          options: baseChartOpts,
        }),
      );
    }

    if (donutChartRef.current) {
      chartsRef.current.push(
        new Chart(donutChartRef.current, {
          type: "doughnut",
          data: {
            labels: ["Lost", "Found"],
            datasets: [
              {
                data: [stats.totalLost, stats.totalFound],
                backgroundColor: ["#E24B4A", "#639922"],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "68%",
            plugins: { legend: { display: false } },
          },
        }),
      );
    }

    if (usersChartRef.current) {
      chartsRef.current.push(
        new Chart(usersChartRef.current, {
          type: "bar",
          data: {
            labels: stats.usersPerMonth.map((d) => d.month),
            datasets: [
              {
                label: "New users",
                data: stats.usersPerMonth.map((d) => d.count),
                backgroundColor: "#378ADD",
                borderRadius: 4,
              },
            ],
          },
          options: baseChartOpts,
        }),
      );
    }

    if (petsChartRef.current) {
      chartsRef.current.push(
        new Chart(petsChartRef.current, {
          type: "bar",
          data: {
            labels: stats.petTypeCounts.map((d) => d.type),
            datasets: [
              {
                label: "Reports",
                data: stats.petTypeCounts.map((d) => d.count),
                backgroundColor: [
                  "#185FA5",
                  "#0F6E56",
                  "#BA7517",
                  "#993C1D",
                  "#5F5E5A",
                ],
                borderRadius: 4,
              },
            ],
          },
          options: { ...baseChartOpts, indexAxis: "y" as const },
        }),
      );
    }

    if (bmChartRef.current) {
      chartsRef.current.push(
        new Chart(bmChartRef.current, {
          type: "bar",
          data: {
            labels: stats.bookmarksPerMonth.map((d) => d.month),
            datasets: [
              {
                label: "Bookmarks",
                data: stats.bookmarksPerMonth.map((d) => d.bookmarks),
                backgroundColor: "rgba(55,138,221,0.18)",
                borderRadius: 3,
                order: 2,
              },
              {
                type: "line" as const,
                label: "Posts",
                data: stats.bookmarksPerMonth.map((d) => d.posts),
                borderColor: "#BA7517",
                borderDash: [5, 3],
                tension: 0.4,
                pointRadius: 3,
                fill: false,
                order: 1,
              },
            ],
          },
          options: baseChartOpts,
        }),
      );
    }

    return () => {
      chartsRef.current.forEach((c) => c.destroy());
      chartsRef.current = [];
    };
  }, [stats]);

  // ── Loading ─────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
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
          <p className="text-sm text-gray-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const lostPct = Math.round((stats.totalLost / (stats.totalPosts || 1)) * 100);
  const foundPct = 100 - lostPct;

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Pet Finder — admin overview
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-gray-600"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Metric cards */}
        <div>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
            Overview
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <MetricCard
              label="Total posts"
              value={formatCount(stats.totalPosts)}
              icon="ti-file-text"
              sub={`↑ this month`}
              subType="up"
            />
            <MetricCard
              label="Lost"
              value={formatCount(stats.totalLost)}
              icon="ti-alert-circle"
              sub={`${lostPct}% of posts`}
              subType="neutral"
            />
            <MetricCard
              label="Found"
              value={formatCount(stats.totalFound)}
              icon="ti-circle-check"
              sub={`${foundPct}% of posts`}
              subType="neutral"
            />
            <MetricCard
              label="Users"
              value={formatCount(stats.totalUsers)}
              icon="ti-users"
              sub="↑ this month"
              subType="up"
            />
            <MetricCard
              label="Bookmarks"
              value={formatCount(stats.totalBookmarks)}
              icon="ti-bookmark"
              sub="↑ this month"
              subType="up"
            />
            <MetricCard
              label="Reunions"
              value={stats.totalReunions}
              icon="ti-heart"
              sub="confirmed"
              subType="neutral"
            />
          </div>
        </div>

        {/* Posts over time + donut */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Posts over time
            </p>
            <div className="flex gap-4 mb-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: "#E24B4A" }}
                />
                Lost
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: "#639922" }}
                />
                Found
              </span>
            </div>
            <div className="relative w-full" style={{ height: 200 }}>
              <canvas
                ref={postsChartRef}
                aria-label="Line chart showing lost and found posts per month"
                role="img"
              >
                Lost and found posts over time.
              </canvas>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Post status breakdown
            </p>
            <div className="flex gap-4 mb-3 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: "#E24B4A" }}
                />
                Lost {lostPct}%
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: "#639922" }}
                />
                Found {foundPct}%
              </span>
            </div>
            <div className="relative w-full" style={{ height: 200 }}>
              <canvas
                ref={donutChartRef}
                aria-label={`Donut chart: ${lostPct}% lost, ${foundPct}% found`}
                role="img"
              >
                Post status breakdown.
              </canvas>
            </div>
          </div>
        </div>

        {/* New users + Pet types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-3">
              New users per month
            </p>
            <div className="relative w-full" style={{ height: 180 }}>
              <canvas
                ref={usersChartRef}
                aria-label="Bar chart of new user registrations per month"
                role="img"
              >
                New user registrations per month.
              </canvas>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Top pet types reported
            </p>
            <div className="relative w-full" style={{ height: 180 }}>
              <canvas
                ref={petsChartRef}
                aria-label="Horizontal bar chart of pet types"
                role="img"
              >
                Most reported pet types.
              </canvas>
            </div>
          </div>
        </div>

        {/* Bookmarks vs Posts */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-medium text-gray-900 mb-1">
            Bookmarks vs posts — last 6 months
          </p>
          <div className="flex gap-4 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ background: "rgba(55,138,221,0.4)" }}
              />
              Bookmarks
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block border-2 border-dashed"
                style={{ borderColor: "#BA7517", background: "transparent" }}
              />
              Posts
            </span>
          </div>
          <div className="relative w-full" style={{ height: 180 }}>
            <canvas
              ref={bmChartRef}
              aria-label="Combined chart comparing bookmarks and posts per month"
              role="img"
            >
              Bookmarks vs posts per month.
            </canvas>
          </div>
        </div>

        {/* Activity + Top users */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-4">
              Recent activity
            </p>
            <div className="flex flex-col gap-3.5">
              {stats.recentActivity.map((item) => {
                const style = activityIcon[item.type] ?? activityIcon.BOOKMARK;
                return (
                  <div key={item._id} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm"
                      style={{ background: style.bg, color: style.color }}
                    >
                      <i className={`ti ${style.icon}`} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 leading-snug">
                        <span className="font-medium text-gray-900">
                          {item.actorName}
                        </span>{" "}
                        {item.description}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {timeAgo(item.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top users */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-sm font-medium text-gray-900 mb-4">
              Most active users
            </p>
            <div className="flex flex-col">
              {stats.topUsers.map((user, i) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0"
                >
                  <span className="text-xs font-mono text-gray-400 w-4 shrink-0">
                    {i + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-medium text-blue-800 shrink-0">
                    {user.username[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 shrink-0">
                    {user.postCount} posts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
