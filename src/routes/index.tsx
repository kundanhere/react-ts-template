import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout";
import BlogPost from "@/pages/BlogPost";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import UserProfile from "@/pages/UserProfile";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Index route - renders when parent route matches exactly */}
        <Route index element={<Home />} />

        {/* Blog routes */}
        <Route path="blog/:slug" element={<BlogPost />} />

        {/* User routes */}
        <Route path="user/:id" element={<UserProfile />} />

        {/* Catch all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
