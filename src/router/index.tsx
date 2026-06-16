import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";

// pages
const Home = lazy(() => import("../pages/Home"));
const Register = lazy(() => import("../pages/Register"));
const Login = lazy(() => import("../pages/Login"));
const Profile = lazy(() => import("../pages/Profile"));
const Start = lazy(() => import("../pages/Start"));
const AddPost = lazy(() => import("../components/AddPost"));
const Posts = lazy(() => import("../components/Posts"));
const AddNewPost = lazy(() => import("../components/AddNewPost"));
const MyPosts = lazy(() => import("../components/MyPostsPage"));
const BookmarksPage = lazy(() => import("../pages/BookmarkPosts"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminPostsPage = lazy(() => import("../pages/AdminPosts"));

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
          <Route path="/" element={<Home />} />
          {/* <Route path="/create" element={<AddNewPost />} /> */}
          <Route path="/posts" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/bookmarks" element={<BookmarksPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/posts" element={<AdminPostsPage />} />
          {/* <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/posts-manage" element={<PostsManage />} />
          <Route path="/user-manage" element={<UserManage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
