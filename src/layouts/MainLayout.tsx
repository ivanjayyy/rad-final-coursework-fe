import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { RequireAuth } from "../components/RequireAuth";
// import Footer from "../components/Footer"; // Optional

function MainLayout() {
  return (
    <div className="app-layout">
      {/* Navbar stays fixed at the top */}
      <Navbar />

      {/* Inside <main> is where Home, Products, etc., will swap in */}
      <main className="content-container">
        <RequireAuth roles={["USER"]}>
          <Outlet />
        </RequireAuth>
      </main>

      {/* <Footer /> */}
    </div>
  );
}

export default MainLayout;
