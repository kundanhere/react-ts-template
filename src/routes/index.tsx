import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout";
import HomePage from "@/pages/Home";
import NotFoundPage from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Index route - renders when parent route matches exactly */}
        <Route index element={<HomePage />} />

        {/* Catch all route for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
