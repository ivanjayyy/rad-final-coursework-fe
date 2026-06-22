import React, { useEffect, useState } from "react";
import {
  allUsers,
  getDashboardSummary,
  getPostVelocityMetrics,
  getCaseAllocations,
} from "../service/admin";

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

interface VelocityMetric {
  month: string;
  percentageHeight: string; // e.g., "40%"
}

interface CaseAllocation {
  lostPetPercentage: number;
  foundPetPercentage: number;
}

const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalUsers: 0,
    totalPosts: 0,
    totalBookmarks: 0,
    pendingApprovals: 0,
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [velocity, setVelocity] = useState<VelocityMetric[]>([]);
  const [allocations, setAllocations] = useState<CaseAllocation>({
    lostPetPercentage: 50, // balanced defaults fallback
    foundPetPercentage: 50,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const executeLoadSequence = async () => {
      setIsLoading(true);
      try {
        // Executing all real platform data streams concurrently
        const [usersRes, summaryRes, velocityRes, allocationRes] =
          await Promise.all([
            allUsers(),
            getDashboardSummary(),
            getPostVelocityMetrics(),
            getCaseAllocations(),
          ]);

        // Process User Records
        const records = Array.isArray(usersRes)
          ? usersRes
          : usersRes?.data || [];
        setUsers(records);

        // Process Real Summary Metrics
        if (summaryRes) setSummary(summaryRes);

        // Process Real Graph Visualizations
        if (Array.isArray(velocityRes)) setVelocity(velocityRes);
        if (allocationRes) setAllocations(allocationRes);
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

        {/* VISUAL GRAPH REPRESENTATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Post Distribution Graph */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-lg font-black uppercase bg-black text-yellow-300 px-3 py-1 border-2 border-black inline-block mb-6">
              📈 Bulletin Generation Velocity
            </h3>
            <div className="h-48 flex items-end gap-3 border-b-4 border-l-4 border-black p-2 bg-slate-50">
              {velocity.map((v, i) => (
                <div
                  key={i}
                  className="bg-purple-400 border-2 border-black w-full"
                  style={{ height: v.percentageHeight }}
                  title={`${v.month} Metric`}
                ></div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-mono font-black uppercase mt-2 px-1 text-gray-500">
              {velocity.map((v, i) => (
                <span key={i}>{v.month}</span>
              ))}
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
                  <span>{allocations.lostPetPercentage}%</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black h-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div
                    className="bg-red-400 h-full border-r-2 border-black"
                    style={{ width: `${allocations.lostPetPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-black uppercase mb-1">
                  <span>🟢 Found Pet Clearances</span>
                  <span>{allocations.foundPetPercentage}%</span>
                </div>
                <div className="w-full bg-gray-100 border-2 border-black h-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div
                    className="bg-emerald-400 h-full border-r-2 border-black"
                    style={{ width: `${allocations.foundPetPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* USER RECORD REGISTRY */}
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
                {users.map((user, idx) => (
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
