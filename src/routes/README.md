# Routing System Documentation

This project implements a modern React Router setup with outlet routes, nested routing, error boundaries, and route guards, following best practices for scalable applications.

## Architecture Overview

### 1. Layout Component (`src/components/layout.tsx`)

- Uses React Router's `Outlet` component to render nested routes
- Provides consistent header, footer, and breadcrumb navigation
- Wraps all pages in a common layout structure

### 2. Route Configuration (`src/routes/routes.config.tsx`)

- Centralized route definitions with TypeScript interfaces
- Supports nested routes for sections like `/blog` and `/blog/:slug`
- Lazy loading for better performance
- Route metadata (title, description) for SEO and navigation
- Helper functions for route management

### 3. Route Renderer (`src/routes/RouteRenderer.tsx`)

- Converts route configuration objects to React Router components
- Handles Suspense boundaries for lazy-loaded components
- Provides loading states during component loading

### 4. Custom Hooks (`src/hooks/useRoutes.ts`)

- Provides navigation utilities
- Route information and path checking
- Centralized routing logic

### 5. Error Boundaries (`src/components/ErrorBoundary.tsx`)

- Catch and display errors for individual components or routes
- Customizable fallback UI

### 6. Route Guards (`src/components/route-guard.tsx`)

- Protect routes based on authentication (checks for `APP_TOKEN` in localStorage by default)
- Redirects unauthenticated users

## File Structure

```
src/
├── components/
│   ├── layout.tsx          # Main layout with Outlet
│   ├── breadcrumb.tsx      # Navigation breadcrumbs
│   ├── route-guard.tsx     # Route protection
│   ├── ErrorBoundary.tsx   # Error boundary utility
│   └── header.tsx          # Updated with active states
├── routes/
│   ├── index.tsx           # Simple route definitions
│   ├── routes.config.tsx   # Advanced route configuration (nested)
│   ├── RouteRenderer.tsx   # Route rendering logic
│   └── README.md           # This documentation
├── hooks/
│   └── useRoutes.ts        # Routing utilities
└── pages/
    ├── Home.tsx
    ├── BlogIndex.tsx       # Blog index page
    ├── BlogPost.tsx        # Blog post page
    ├── UserProfile.tsx
    ├── Dashboard.tsx       # Protected dashboard page
    └── NotFound.tsx        # 404 page
```

## Usage Examples

### Nested Blog Routes Example

```tsx
// src/routes/routes.config.tsx
{
  path: "blog",
  children: [
    { index: true, element: <BlogIndex />, title: "Blog", description: "Blog index page" },
    { path: ":slug", element: <BlogPost />, title: "Blog Post", description: "Blog post details" }
  ]
}
```

- `/blog` renders the blog index
- `/blog/:slug` renders a blog post

### Adding a New Route

1. **Create the page component:**

```tsx
// src/pages/About.tsx
export default function About() {
  return <div>About Page</div>;
}
```

2. **Add to route configuration:**

```tsx
// src/routes/routes.config.tsx
{
  path: "about",
  element: <About />, // JSX element
  title: "About",
  description: "About our company"
}
```

### Using Route Guards

```tsx
// Protect a route
{
  path: "dashboard",
  element: <DashboardProtected />,
  title: "Dashboard",
  description: "Protected dashboard page"
}

// DashboardProtected example
const DashboardProtected = () => (
  <ErrorBoundary>
    <RouteGuard requireAuth={true} redirectTo="/">
      <Dashboard />
    </RouteGuard>
  </ErrorBoundary>
);
```

### Using the useRoutes Hook

```tsx
import { useRoutes } from "@/hooks/useRoutes";

function MyComponent() {
  const { currentPath, goTo, isPathActive } = useRoutes();

  return (
    <div>
      <p>Current path: {currentPath}</p>
      <button onClick={() => goTo("/about")}>Go to About</button>
      {isPathActive("/blog") && <p>You're in the blog section</p>}
    </div>
  );
}
```

## Best Practices

1. **Lazy Loading**: All page components are lazy-loaded for better performance
2. **Type Safety**: Full TypeScript support with proper interfaces
3. **Centralized Configuration**: All routes defined in one place
4. **Consistent Layout**: All pages use the same layout structure
5. **Error Handling**: 404 page for unmatched routes
6. **Navigation States**: Active states in navigation components
7. **Breadcrumbs**: Automatic breadcrumb generation
8. **Route Guards**: Protection for authenticated routes
9. **Error Boundaries**: Catch errors at the component or route level
10. **Nested Routing**: Use nested routes for sections and detail pages

## Features

- ✅ Nested routing with Outlet
- ✅ Lazy loading for performance
- ✅ TypeScript support
- ✅ 404 page handling
- ✅ Breadcrumb navigation
- ✅ Active navigation states
- ✅ Route guards for protection
- ✅ Centralized route configuration
- ✅ Custom routing hooks
- ✅ Error boundaries for robust error handling
- ✅ SEO-friendly route metadata

## Migration from Old System

- Layout component uses `Outlet`
- Centralized, nested route configuration
- Error boundaries and route guards for robust UX
- Enhanced navigation features
