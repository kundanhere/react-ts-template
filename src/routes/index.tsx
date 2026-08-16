import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Index route - renders when parent route matches exactly */}
        <Route index element={<Home />} />

        {/* Catch all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
