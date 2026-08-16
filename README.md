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
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI & Layout components
│   │   ├── ui/             # Primitive UI components (Button, etc.)
│   │   ├── ErrorBoundary   # Global error boundary component
│   │   ├── layout          # Layout wrapper
│   │   ├── providers       # Global Providers (Redux, React Query, nuqs)
│   │   ├── theme-toggle    # Light / Dark mode toggle
│   │   └── typography      # Typography component
│   ├── env/                # Zod-validated environment variables schema
│   ├── hooks/              # Custom hooks (theme, mobile detection, routing)
│   ├── lib/                # Shared utilities (cn helper)
│   ├── pages/              # Page components (Home, NotFound, etc.)
│   ├── routes/             # Route configurations & RouteRenderer component
│   ├── store/              # Redux Toolkit store, slices, and custom hooks
│   ├── styles/             # Global CSS and Tailwind v4 theme variables
│   ├── types/              # Global TypeScript interfaces & types
│   ├── utils/              # Helper utilities (logger, toast, sleep)
│   ├── App.tsx             # Root Application component
│   └── main.tsx            # Application entry point
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

## 🧱 Architecture & Patterns

### 1. Global Providers

All root application context providers are centralized in `src/components/providers.tsx`:

- **Redux Provider** — Global state management
- **QueryClientProvider** — TanStack React Query client (`staleTime: 5m`, no window focus refetch)
- **NuqsAdapter** — URL state synchronization via React Router v6

### 2. Path Aliases

Path alias `@/` is configured in `tsconfig.json` and `vite.config.ts` pointing directly to `./src/*`:

```tsx
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/store/hooks";
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

This project is licensed under the [MIT License](LICENSE).
