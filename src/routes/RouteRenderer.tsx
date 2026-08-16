import { Suspense } from "react";

import { Route, Routes } from "react-router-dom";

import { routes } from "./routes.config";

// Loading component for Suspense fallback
function LoadingSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}

// Recursive function to render routes
function renderRoutes(routeList: typeof routes) {
  return routeList.map((route) => {
    const { element } = route;
    const key = route.path || "index";

    if (route.children) {
      return (
        <Route key={key} path={route.path} element={element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    return (
      <Route
        key={key}
        index={route.index}
        path={route.path}
        element={<Suspense fallback={<LoadingSpinner />}>{element}</Suspense>}
      />
    );
  });
}

export function RouteRenderer() {
  return <Routes>{renderRoutes(routes)}</Routes>;
}
