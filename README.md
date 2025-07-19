# React TypeScript Template

A clean, modern starter template for React with TypeScript, TailwindCSS, Zustand, react-hot-toast, shadcn/ui, Zod, Lucide, custom theme system, Roboto, Prettier, and ESLint.

## Features

- React 18 with TypeScript
- Vite for fast development and building
- React Router for client-side routing
- TailwindCSS (with centralized styles in `src/styles/`)
- Zustand for global state management
- react-hot-toast for global, reusable notifications
- shadcn/ui components
- Zod for validation
- Lucide for icons
- Custom theme system for dark mode
- Roboto font (all weights) globally
- Prettier & ESLint
- Robust featured-fetch utility
- Global styles, components, hooks, utils, types, constants
- Common layout, error, loading, and typography components
- Easy environment variable management with Zod
- Dynamic routes with React Router
- Single Responsibility Principle (SRP) structure

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env` and update values as needed.
3. **Run the development server:**
   ```bash
   npm run dev
   ```

## Project Structure

- `src/pages/` - Page components (Home, BlogPost, UserProfile)
- `src/components/` - Global components (Typography, Header, Footer, Providers, etc.)
- `src/hooks/` - Global hooks (theme, localStorage, react-hot-toast, etc.)
- `src/store/` - Zustand global state store
- `src/utils/` - Utilities (featured-fetch, logger, localStorage, react-hot-toast, etc.)
- `src/types/` - Global types
- `src/constants/` - Global constants
- `src/styles/` - Centralized global styles (Tailwind, fonts)
- `public/` - Static assets

## Customization

- Add your own components, hooks, and utilities as needed.
- Use shadcn/ui components as required. Notifications are handled globally with react-hot-toast utilities and hooks.
- Use Zustand for global state, and the provided hooks/utils for localStorage and notifications.
- Use Zod for form and API validation.
- Add new routes in `src/App.tsx` and create corresponding page components in `src/pages/`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier
