# React TypeScript Dashboard & Starter Template

A modern, production-ready React starter template built with **TypeScript**, **Vite**, **Tailwind CSS v4**, **Redux Toolkit**, **TanStack React Query**, **nuqs**, and **Airbnb ESLint + Prettier**.

---

## ⚡ Tech Stack

### Core

- **[React 18](https://react.dev/)** — UI Library
- **[TypeScript](https://www.typescriptlang.org/)** — Type Safety
- **[Vite 5](https://vitejs.dev/)** — Lightning-fast Bundler & Dev Server
- **[React Router v6](https://reactrouter.com/)** — Declarative Client-Side Routing with dynamic rendering

### State & Data Fetching

- **[Redux Toolkit](https://redux-toolkit.js.org/)** — Global state management with slice-based architecture
- **[TanStack React Query v5](https://tanstack.com/query/latest)** — Async server-state management, caching & data fetching
- **[nuqs](https://nuqs.47ng.com/)** — Type-safe URL search params state management (wired with React Router v6 adapter)

### Styling & UI

- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first CSS framework via `@tailwindcss/vite`
- **[Base UI](https://base-ui.com/)** — Unstyled headless UI primitives (`@base-ui/react`)
- **[Hugeicons](https://hugeicons.com/)** — Modern SVG icon library (`@hugeicons/react` & `@hugeicons/core-free-icons`)
- **[Inter Variable Font](https://fontsource.org/fonts/inter)** — Typography via `@fontsource-variable/inter`
- **[tw-animate-css](https://github.com/jamiebrittain/tw-animate-css)** — Utility animations for Tailwind CSS
- **[cva](https://cva.style/docs)** + **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** — Component variant styling & class merging

### Code Quality & Developer Experience

- **[ESLint](https://eslint.org/)** — Configured with **Airbnb Style Guide** (`eslint-config-airbnb-typescript`) & TypeScript integration
- **[Prettier](https://prettier.io/)** — Formatter with `@trivago/prettier-plugin-sort-imports` & `prettier-plugin-tailwindcss`
- **[Zod](https://zod.dev/)** — Schema validation for forms and environment variables

---

## 📁 Project Structure

```text
├── public/                 # Static assets & icons
├── src/
│   ├── api/                # API client modules
│   │   └── iam/            # IAM endpoints (users, roles, policies, modules)
│   ├── app/                # Root providers and error boundaries
│   │   ├── error-boundary.tsx
│   │   ├── index.tsx       # Root entry render wrapper
│   │   └── providers.tsx   # Redux, React Query, and URL param providers
│   ├── components/         # Shared visual components
│   │   ├── data-table/     # Fully featured server-side data tables
│   │   ├── empty/          # Empty states
│   │   ├── ui/             # Radix / Base UI primitives
│   │   ├── page-wrapper.tsx# Page layout wrapper
│   │   ├── theme-toggle.tsx# Theme toggle component
│   │   └── typography.tsx  # Typography primitives
│   ├── config/             # Config files (data table filters, feature flags)
│   ├── constants/          # Global application constants
│   ├── env/                # Zod-validated environment variables schema
│   ├── hooks/              # Reusable React hooks
│   ├── layout/             # Master app sidebar and layout shell
│   ├── lib/                # Shared utility functions and formatting libraries
│   ├── pages/              # Domain pages (IAM, dashboard, settings, inbox, etc.)
│   │   ├── iam/            # Access control management pages (users, roles, etc.)
│   │   └── settings/       # Settings tabs (profile, appearance, security)
│   ├── routes/             # Client-side router configuration & RouteRenderer
│   ├── store/              # Redux Toolkit global store state & app-slice
│   ├── styles/             # Global CSS styles (Tailwind CSS v4)
│   ├── types/              # Domain-specific TypeScript declarations
│   ├── utils/              # Core utility modules (apiClient, queryClient, logger)
│   ├── main.tsx            # Vite entry-point script
│   └── vite-env.d.ts       # Vite TypeScript env types
├── .eslintrc.json          # ESLint config (Airbnb + TS + Prettier)
├── .prettierrc.json        # Prettier config (Import sorting + Tailwind)
├── components.json         # shadcn UI registry configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration with Tailwind plugin & path aliases
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>=18.0.0`
- **npm** `>=9.0.0`

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

---

## 🛠️ Available Scripts

| Script             | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `npm run dev`      | Starts the Vite development server                                   |
| `npm run build`    | Runs TypeScript type-checks (`tsc`) and builds the production bundle |
| `npm run preview`  | Previews the production build locally                                |
| `npm run lint`     | Lints source files (`src/`) with ESLint (Airbnb rules)               |
| `npm run lint:fix` | Automatically fixes auto-fixable ESLint issues                       |
| `npm run format`   | Formats all files using Prettier                                     |

---

## 🛠️ Redux Toolkit & React Query Development Utilities

### 1. TanStack React Query Utilities (`@/utils/query-client`)

#### **`apiFetcher<T>(url, options)`**

Type-safe `fetch` wrapper designed for React Query `queryFn` and `mutationFn`. Automatically handles JSON parsing, non-2xx HTTP errors via `ApiError`, and 204 No Content responses.

```tsx
import { useQuery } from "@tanstack/react-query";

import { apiFetcher } from "@/utils/query-client";

interface UserProfile {
  id: string;
  name: string;
}

function ProfileComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", "123"],
    queryFn: () => apiFetcher<UserProfile>("/api/users/123"),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading profile!</p>;

  return <div>Welcome, {data?.name}</div>;
}
```

#### **`queryHelpers`**

Programmatic cache helpers for use in event handlers, Redux actions, or outside React components:

```tsx
import { queryHelpers } from "@/utils/query-client";

// Invalidate queries after mutation or event
await queryHelpers.invalidate(["user", "123"]);

// Prefetch query data on mouse hover or route change
queryHelpers.prefetch(["user", "123"], () => apiFetcher("/api/users/123"));

// Manually update cache data
queryHelpers.setData(["user", "123"], (old) => ({
  ...old,
  name: "Updated Name",
}));

// Clear all query cache on logout
queryHelpers.clear();
```

#### **React Query Devtools**

Enabled by default in dev mode (`<ReactQueryDevtools initialIsOpen={false} />` in `Providers`), allowing visual inspection of query cache, stale timers, and refetches at the bottom-right of your screen.

---

### 2. Redux Toolkit Utilities (`@/utils/redux-helpers` & `@/store`)

#### **`createAsyncState<T>(initialValue)`**

Standardizes slice state initialization across your application (`data`, `status: 'idle' | 'loading' | 'succeeded' | 'failed'`, `error`):

```ts
import { createSlice } from "@reduxjs/toolkit";

import { AsyncState, createAsyncState } from "@/utils/redux-helpers";

interface ProductState extends AsyncState<Product[]> {
  category: string;
}

const initialState: ProductState = {
  ...createAsyncState<Product[]>([]),
  category: "all",
};
```

#### **`addAsyncCases(builder, asyncThunk, onSuccess)`**

Eliminates boilerplate when handling `createAsyncThunk` pending/fulfilled/rejected states inside slice `extraReducers`:

```ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { addAsyncCases, createAsyncState } from "@/utils/redux-helpers";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  return apiFetcher<Product[]>("/api/products");
});

export const productsSlice = createSlice({
  name: "products",
  initialState: createAsyncState<Product[]>([]),
  reducers: {},
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchProducts, (state, payload) => {
      state.data = payload; // Executed only on fulfilled
    });
  },
});
```

#### **`useAppStore()` Custom Hook**

Provides clean access to application store state and dispatchers without importing separate hooks:

```tsx
import { useAppStore } from "@/store/use-app-store";

function UserWidget() {
  const { user, isLoading, fetchUser, clearUser } = useAppStore();

  return (
    <div>
      {isLoading ? <p>Loading...</p> : <p>User: {user?.name}</p>}
      <button onClick={() => fetchUser("123")}>Load User</button>
      <button onClick={clearUser}>Logout</button>
    </div>
  );
}
```

---

## 🧱 Architecture & Patterns

### 1. Global Providers

All root application context providers are centralized in `src/app/providers.tsx`:

- **Redux Provider** — Global state management
- **QueryClientProvider** — TanStack React Query client with `ReactQueryDevtools`
- **NuqsAdapter** — URL state synchronization via React Router v6

### 2. Path Aliases

Path alias `@/` is configured in `tsconfig.json` and `vite.config.ts` pointing directly to `./src/*`:

```tsx
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
import { apiFetcher } from "@/utils/query-client";
```

### 3. Icon Usage (Hugeicons)

Icons are imported using the modern Hugeicons API (`@hugeicons/core-free-icons` + `HugeiconsIcon` component):

```tsx
import { Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

<HugeiconsIcon icon={Sun01Icon} size={20} className="h-5 w-5" />;
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
