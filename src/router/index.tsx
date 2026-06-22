import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// pages
const Home = lazy(() => import("../pages/Home"));
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/Profile"));
const Start = lazy(() => import("../pages/Start"));
const PostPage = lazy(() => import("../pages/PostsPage"));
const MyPosts = lazy(() => import("../pages/MyPostsPage"));
const BookmarksPage = lazy(() => import("../pages/BookmarkPosts"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminPostsPage = lazy(() => import("../pages/AdminPosts"));
const ForgotPassword = lazy(() => import("../pages/ForgetPassword"));
const AdminUsersPage = lazy(() => import("../pages/UserManage"));

// router
const Router = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/posts" element={<PostPage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
            <Route path="/my-posts" element={<MyPosts />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/posts" element={<AdminPostsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<Start />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
