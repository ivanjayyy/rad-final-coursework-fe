import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/nav/AdminNavbar";
import { RequireAuth } from "../components/auth/RequireAuth";
// import Footer from "../components/Footer"; // Optional

function AdminLayout() {
  return (
    <div className="app-layout">
      {/* Navbar stays fixed at the top */}
      <AdminNavbar />

      {/* Inside <main> is where Home, Products, etc., will swap in */}
      <main className="content-container">
        <RequireAuth roles={["MODERATOR", "ADMIN"]}>
          <Outlet />
        </RequireAuth>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default AdminLayout;
