import { useEffect, useState } from "react";
import {
  deleteUser,
  getAllUsers,
  allUsers,
  changeRole,
  sendEmail,
} from "../service/admin";
import { useAuth } from "../hooks/useAuth";
import { alert } from "../utils/alerts";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  roles: string[] | string;
  createdAt?: string;
  status?: "ACTIVE" | "SUSPENDED";
}

const parseRolesList = (rolesData: any): string[] => {
  if (!rolesData) return ["USER"];
  if (Array.isArray(rolesData)) return rolesData;
  try {
    return JSON.parse(rolesData);
  } catch {
    return [rolesData.toString()];
  }
};

// ── User Delete Confirmation Modal ─────────────────────────────────────────────
const UserDeleteModal = ({
  user,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  user: UserProfile;
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
    <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm p-6 flex flex-col gap-5 transform rotate-[1deg]">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 border-4 border-black bg-red-400 flex items-center justify-center shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
            Terminate Agent?
          </h3>
          <p className="text-sm font-bold text-gray-700 mt-2">
            User Account{" "}
            <span className="bg-yellow-300 px-1 border border-black font-extrabold block my-1 text-center">
              @{user.username || "Unknown Submitter"}
            </span>{" "}
            and all corresponding records will be thoroughly purged!
          </p>
        </div>
      </div>
      <div className="flex gap-3 justify-end mt-2">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-black border-4 border-black rounded-none bg-white hover:bg-gray-100 active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
        >
          ABORT
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-4 py-2 text-sm font-black border-4 border-black rounded-none bg-red-500 text-white hover:bg-red-600 active:translate-x-0.5 active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none transition-all disabled:opacity-50"
        >
          {isDeleting ? "PURGING..." : "YES, EXILE!"}
        </button>
      </div>
    </div>
  </div>
);

// ── User Detailed Profile Inspector Modal ──────────────────────────────────────
const UserDetailInspectorModal = ({
  user,
  onClose,
}: {
  user: UserProfile;
  onClose: () => void;
}) => {
  const parsedRoles = parseRolesList(user.roles);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border-4 border-black w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-cyan-400">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            🕵️‍♂️ Core Dossier File 🕵️‍♂️
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

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-5 border-4 border-black p-4 bg-purple-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-20 h-20 bg-yellow-300 border-4 border-black overflow-hidden shrink-0 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-3xl">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                user.username.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-black uppercase bg-black text-white px-1.5 py-0.5 tracking-wider">
                HANDLE
              </span>
              <h3 className="text-2xl font-black text-black truncate mt-1">
                @{user.username}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
                Verified Email Terminal
              </label>
              <p className="text-base font-extrabold text-black bg-white border-2 border-black p-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] break-all">
                {user.email}
              </p>
            </div>

            <div>
              <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
                Dossier Clearance Permissions
              </label>
              <div className="flex flex-wrap gap-2">
                {parsedRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    ⚡ {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="border-2 border-black p-2 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Database ID
                </p>
                <p className="text-xs font-mono font-bold text-black mt-1 truncate">
                  {user._id}
                </p>
              </div>
              <div className="border-2 border-black p-2 bg-slate-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Account Status
                </p>
                <p className="text-xs font-black text-emerald-600 uppercase mt-1">
                  ● ACTIVE USER
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── User Email Dispatcher Modal Component ──────────────────────────────────────
const UserEmailModal = ({
  user,
  onCancel,
  onSend,
  isSending,
}: {
  user: UserProfile;
  onCancel: () => void;
  onSend: (subject: string, body: string) => void;
  isSending: boolean;
}) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    onSend(subject, body);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white border-4 border-black w-full max-w-md shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col transform rotate-[-0.5deg]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-yellow-300">
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            🚀 Dispatch Transmission 🚀
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 border-2 border-black bg-white text-black hover:bg-red-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
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

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
              Target Agent Terminal (To)
            </label>
            <p className="text-sm font-extrabold text-black bg-gray-100 border-2 border-black p-2.5 truncate shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              @{user.username} ({user.email})
            </p>
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
              Transmission Subject
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="ENTER ENCRYPTED TOPIC..."
              className="w-full px-3 py-2.5 text-sm font-bold border-4 border-black bg-white text-black focus:outline-none focus:bg-purple-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder-gray-400"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase tracking-wider text-gray-500 block mb-1">
              Message Intel Payload
            </label>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="WRITE COMMUNIQUE HERE..."
              className="w-full px-3 py-2.5 text-sm font-bold border-4 border-black bg-white text-black focus:outline-none focus:bg-purple-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end px-6 pb-6 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSending}
            className="px-4 py-2 text-sm font-black border-4 border-black bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            ABORT
          </button>
          <button
            type="submit"
            disabled={isSending}
            className="px-4 py-2 text-sm font-black border-4 border-black bg-cyan-400 text-black hover:bg-cyan-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50"
          >
            {isSending ? "LAUNCHING..." : "FIRE AWAY! 💥"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ── Admin User Management Page Layout Component ───────────────────────────────
const AdminUsersPage = () => {
  const { user } = useAuth();
  // 💡 TODO: Hook these up to your real auth hook or slice (e.g., useAuth())
  const [currentUserRoles, setCurrentUserRoles] = useState<string[]>(["ADMIN"]);
  const [currentUserId, setCurrentUserId] = useState<string>(
    "YOUR_LOGGED_IN_USER_ID",
  );

  useEffect(() => {
    setCurrentUserRoles(user.roles);
    setCurrentUserId(user.id);
  }, []);

  const isAdmin = currentUserRoles.includes("ADMIN");

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailTargetUser, setEmailTargetUser] = useState<UserProfile | null>(
    null,
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleSendEmailExecution = async (subject: string, body: string) => {
    if (!emailTargetUser) return;
    setIsSendingEmail(true);
    try {
      await sendEmail(emailTargetUser.email, subject, body);
      setEmailTargetUser(null);
    } catch (err: any) {
      console.error("Transmission sequence failed to execute", err);

      const msg = err.response?.data?.message || "Something went wrong!";
      alert.fire({
        title: "ERROR!",
        text: `${msg}`,
        icon: "error",
        confirmButtonText: "Fix it",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const fetchUsersList = async () => {
    setIsLoading(true);
    try {
      const res = isAdmin ? await allUsers() : await getAllUsers();
      const records = Array.isArray(res) ? res : res?.data || [];
      setUsers(records);
    } catch (err: any) {
      console.error("Failed executing user load sequence pipeline", err);

      const msg = err.response?.data?.message || "Something went wrong!";
      alert.fire({
        title: "ERROR!",
        text: `${msg}`,
        icon: "error",
        confirmButtonText: "Fix it",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
  }, [isAdmin]);

  useEffect(() => {
    document.body.style.overflow =
      selectedUser || userToDelete || emailTargetUser ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedUser, userToDelete, emailTargetUser]);

  const handleDeleteUserExecution = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete._id);
      setUserToDelete(null);
      await fetchUsersList();

      alert.fire({
        title: "User deleted successfully",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      console.error("Purge operations crashed", err);

      const msg = err.response?.data?.message || "Something went wrong!";
      alert.fire({
        title: "ERROR!",
        text: `${msg}`,
        icon: "error",
        confirmButtonText: "Fix it",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRoleToggleExecution = async (
    user: UserProfile,
    currentRoles: string[],
  ) => {
    if (!isAdmin) return;
    const isCurrentlyMod = currentRoles.includes("MODERATOR");
    const newAssignedRole = isCurrentlyMod ? "USER" : "MODERATOR";

    try {
      await changeRole(user._id, newAssignedRole);
      await fetchUsersList();

      alert.fire({
        title: "Role updated successfully",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } catch (err: any) {
      console.error(
        "Clearance authorization modification sequence terminated with errors",
        err,
      );

      const msg = err.response?.data?.message || "Something went wrong!";
      alert.fire({
        title: "ERROR!",
        text: `${msg}`,
        icon: "error",
        confirmButtonText: "Fix it",
      });
    }
  };

  // 🛡️ CRITICAL FILTRATION: Drops yourself AND any other ADMIN accounts entirely
  const filteredUsers = users.filter((u) => {
    const roles = parseRolesList(u.roles);
    const isSelf = u._id === currentUserId;
    const hasAdminRole = roles.includes("ADMIN");

    if (isSelf || hasAdminRole) return false;

    const query = search.toLowerCase();
    return (
      !query ||
      u.username?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u._id?.toLowerCase().includes(query)
    );
  });

  const moderatorRankedUsers = filteredUsers.filter((u) =>
    parseRolesList(u.roles).includes("MODERATOR"),
  );
  const regularRankedUsers = filteredUsers.filter(
    (u) =>
      parseRolesList(u.roles).includes("USER") &&
      !parseRolesList(u.roles).includes("MODERATOR"),
  );

  const renderUserTableLayout = (
    dataset: UserProfile[],
    sectionTitle?: string,
  ) => (
    <div className="space-y-3">
      {sectionTitle && (
        <h2 className="text-xl font-black uppercase bg-black text-yellow-300 px-3 py-1.5 border-4 border-black inline-block tracking-tight transform rotate-[-0.5deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {sectionTitle} ({dataset.length})
        </h2>
      )}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="hidden md:grid grid-cols-[74px_2fr_2fr_2fr_180px] items-center gap-4 px-6 py-3 border-b-4 border-black bg-yellow-300 font-black uppercase tracking-wider text-sm">
          <p className="text-center">Avatar</p>
          <p>Profile Handle</p>
          <p>Email Connection</p>
          <p>Clearance Roles</p>
          <div />
        </div>

        <div className="divide-y-4 divide-black">
          {dataset.map((user, idx) => {
            const rolesArray = parseRolesList(user.roles);
            return (
              <div
                key={user._id || idx}
                className="flex flex-col md:grid md:grid-cols-[74px_2fr_2fr_2fr_180px] items-start md:items-center gap-4 px-6 py-4 hover:bg-purple-50 transition-colors bg-white cursor-pointer group"
                onClick={() => setSelectedUser(user)}
              >
                <div
                  className="w-14 h-14 border-2 border-black bg-purple-300 shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center font-black text-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : user.username ? (
                    user.username.slice(0, 2).toUpperCase()
                  ) : (
                    "??"
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-lg font-black text-black capitalize group-hover:text-cyan-600 group-hover:underline decoration-2 transition-all truncate">
                    @{user.username || "Anonymous Agent"}
                  </p>
                  <span className="inline-block md:hidden font-mono text-[10px] bg-gray-100 border border-black px-1 mt-0.5">
                    ID:{" "}
                    {user._id ? user._id.slice(-6).toUpperCase() : "UNKNOWN"}
                  </span>
                </div>

                <p className="text-sm font-extrabold text-gray-700 break-all truncate max-w-xs md:max-w-none">
                  {user.email || "—"}
                </p>

                <div
                  className="flex flex-wrap gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {rolesArray.map((role, rIdx) => (
                    <span
                      key={rIdx}
                      className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 border-2 border-black bg-purple-200 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                <div
                  className="ml-auto md:ml-0 pt-2 md:pt-0 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isAdmin && (
                    <button
                      onClick={() =>
                        handleRoleToggleExecution(user, rolesArray)
                      }
                      className={`px-2 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all uppercase ${
                        rolesArray.includes("MODERATOR")
                          ? "bg-amber-400 hover:bg-amber-500 text-black"
                          : "bg-purple-400 hover:bg-purple-500 text-black"
                      }`}
                      title={
                        rolesArray.includes("MODERATOR")
                          ? "Demote Agent status to User"
                          : "Promote Agent status to Moderator"
                      }
                    >
                      {rolesArray.includes("MODERATOR")
                        ? "⬇️ DEMOTE"
                        : "⬆️ PROMOTE"}
                    </button>
                  )}

                  <button
                    onClick={() => setEmailTargetUser(user)}
                    className="p-2 border-2 border-black bg-white text-black hover:bg-cyan-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="Transmit operational message"
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => setUserToDelete(user)}
                    className="p-2 border-2 border-black bg-white text-black hover:bg-red-500 hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="Purge user entry file"
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
    </div>
  );

  return (
    <div className="min-h-screen bg-amber-50 font-sans antialiased text-black p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-cyan-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden transform rotate-[-0.3deg]">
          <div className="absolute top-0 right-0 bg-black text-white text-xs font-black px-4 py-1 uppercase tracking-widest border-b-4 border-l-4 border-black">
            HQ SECURITY ({isAdmin ? "ADMIN CONTROL" : "MOD MODE"})
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)]">
              👥 Agent Directory HQ 👥
            </h1>
            <p className="text-sm font-black text-black mt-1 bg-white/70 px-2 py-0.5 border border-black inline-block">
              {isLoading
                ? "POLLING ACTIVE DOSSIERS..."
                : `${filteredUsers.length} TARGET AGENTS SHOWN`}
            </p>
          </div>
        </div>

        <div className="relative max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SEARCH AGENTS BY HANDLE, EMAIL, ID..."
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

        {isLoading && (
          <div className="border-4 border-black bg-white divide-y-4 divide-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-5 animate-pulse"
              >
                <div className="w-14 h-14 bg-gray-300 border-2 border-black rounded-none shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 border border-black w-1/5" />
                  <div className="h-3 bg-gray-200 border border-black w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredUsers.length === 0 && (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 bg-yellow-300 border-2 border-black flex items-center justify-center mb-4 transform -rotate-12">
              <span className="text-2xl font-black">🛸</span>
            </div>
            <p className="text-xl font-black uppercase text-black">
              Zero Active Signatures Match Query Filter
            </p>
          </div>
        )}

        {!isLoading && filteredUsers.length > 0 && (
          <div className="space-y-8">
            {isAdmin ? (
              <>
                {moderatorRankedUsers.length > 0 &&
                  renderUserTableLayout(
                    moderatorRankedUsers,
                    "⚡ Moderator Clearance Records",
                  )}
                {regularRankedUsers.length > 0 &&
                  renderUserTableLayout(
                    regularRankedUsers,
                    "🛡️ Standard User Records",
                  )}
              </>
            ) : (
              renderUserTableLayout(filteredUsers)
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailInspectorModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {userToDelete && (
        <UserDeleteModal
          user={userToDelete}
          onConfirm={handleDeleteUserExecution}
          onCancel={() => setUserToDelete(null)}
          isDeleting={isDeleting}
        />
      )}

      {emailTargetUser && (
        <UserEmailModal
          user={emailTargetUser}
          onCancel={() => setEmailTargetUser(null)}
          onSend={handleSendEmailExecution}
          isSending={isSendingEmail}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
