# Routing System Documentation

This application uses a modular, type-safe routing architecture built on **React Router v6**, featuring central route configuration, lazy loading with `React.lazy` and `Suspense`, protected route guards, error boundaries, and custom routing hooks.

---

## 🏗️ Architecture Overview

### 1. Centralized Route Configuration (`src/routes/routes.config.tsx`)

- Defines application routes using a typed `RouteConfig` array.
- Supports nested routes, lazy-loaded components, and metadata (`title`, `description`).
- Includes helper utilities:
  - `getRouteByPath(path)` — Looks up route metadata by current path.
  - `getAllRoutePaths()` — Returns an array of all registered route paths.

### 2. Recursive Route Renderer (`src/routes/RouteRenderer.tsx`)

- Dynamically maps route objects into `<Route>` components.
- Recursively handles nested child routes (`route.children`).
- Wraps non-layout routes in `React.Suspense` with a custom `LoadingSpinner` fallback UI.

### 3. Route Guard (`src/components/route-guard.tsx`)

- Protects private routes (e.g. `/dashboard`).
- Checks for authentication tokens (or custom state) and redirects unauthenticated users to `/`.

### 4. Error Boundary Integration (`src/components/ErrorBoundary.tsx`)

- Wraps protected or critical routes to catch rendering errors gracefully without crashing the whole layout.

### 5. Layout Component (`src/components/layout.tsx`)

- Master layout with `<Header />`, `<Footer />`, and React Router's `<Outlet />` for rendering matched sub-routes.

### 6. Navigation Utility Hook (`src/hooks/use-routes.ts`)

- Custom hook exposing current path, active route info, path matching helpers (`isCurrentPath`, `isPathActive`), and navigation controls (`goTo`, `goBack`, `goHome`).

---

## 📁 File Structure

```text
src/
├── components/
│   ├── layout.tsx          # Main layout shell with <Outlet />
│   ├── route-guard.tsx     # Route protection logic
│   └── ErrorBoundary.tsx   # React Error Boundary
├── hooks/
│   └── use-routes.ts       # Navigation & route checking hook
├── pages/
│   ├── Home.tsx            # Home page (/)
│   ├── Dashboard.tsx       # Protected Dashboard page (/dashboard)
│   └── NotFound.tsx        # Fallback 404 page (*)
└── routes/
    ├── index.tsx           # Static routes fallback export (AppRoutes)
    ├── routes.config.tsx   # Central route configuration & helper functions
    ├── RouteRenderer.tsx   # Dynamic Suspense-enabled route renderer
    └── README.md           # This documentation
```

---

## 💡 Usage Examples

### 1. Adding a New Route

To add a new page (e.g. Settings):

1. **Create the lazy-loaded page component in `src/pages/Settings.tsx`**:

   ```tsx
   export default function Settings() {
     return <div>Settings Page</div>;
   }
   ```

2. **Add to `src/routes/routes.config.tsx`**:
   ```tsx
   const Settings = lazy(() => import("@/pages/Settings"));

   export const routes: RouteConfig[] = [
     {
       path: "/",
       element: <Layout />,
       children: [
         { index: true, element: <Home /> },
         { path: "settings", element: <Settings />, title: "Settings" },
         { path: "*", element: <NotFound /> },
       ],
     },
   ];
   ```

---

### 2. Protecting a Route

Wrap any page in `<RouteGuard>` and `<ErrorBoundary>`:

```tsx
const SettingsProtected = () => (
  <ErrorBoundary>
    <RouteGuard requireAuth redirectTo="/">
      <Settings />
    </RouteGuard>
  </ErrorBoundary>
);

// In routes.config.tsx:
{
  path: "settings",
  element: <SettingsProtected />,
  title: "Settings",
}
```

---

### 3. Using the `useRoutes` Hook in Components

```tsx
import { useRoutes } from "@/hooks/use-routes";

function NavigationMenu() {
  const { currentPath, goTo, isPathActive } = useRoutes();

  return (
    <nav>
      <button
        onClick={() => goTo("/")}
        className={isPathActive("/") ? "active" : ""}
      >
        Home
      </button>
      <button
        onClick={() => goTo("/dashboard")}
        className={isPathActive("/dashboard") ? "active" : ""}
      >
        Dashboard
      </button>
    </nav>
  );
}
```

---

## ✅ Best Practices Checklist

- ⚡ **Lazy Loading**: Use `React.lazy()` for all route components to minimize initial bundle size.
- 🛡️ **Type Safety**: Maintain `RouteConfig` interface when defining new routes.
- 🔒 **Route Protection**: Use `<RouteGuard>` for routes requiring authentication.
- 🎨 **Layout Shell**: Keep layout concerns (header, footer, sidebar) in `Layout.tsx` using `<Outlet />`.
