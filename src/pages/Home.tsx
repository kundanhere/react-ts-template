import { Sun } from "lucide-react";
import { Link } from "react-router-dom";

import { Typography } from "@/components/typography";

export default function Home() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 py-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="bg-primary/10 mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full">
          <Sun size={48} className="text-primary" />
        </span>

        <Typography variant="h1">Welcome to React TS Template</Typography>

        <Typography variant="p" className="text-muted-foreground max-w-xl">
          A modern, scalable starter with TypeScript, Zustand, react-hot-toast,
          shadcn/ui, Roboto, and more. Built for rapid development and best
          practices.
        </Typography>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link
          to="/blog/hello-world"
          className="bg-primary text-primary-foreground hover:bg-primary/80 rounded px-6 py-3 shadow transition"
        >
          View Blog Example
        </Link>
        <Link
          to="/user/1"
          className="bg-accent text-accent-foreground hover:bg-accent/80 rounded px-6 py-3 shadow transition"
        >
          View User Example
        </Link>
        <Link
          to="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="border-primary bg-background text-primary hover:bg-accent rounded border px-6 py-3 shadow transition"
        >
          GitHub
        </Link>
      </div>

      <Typography variant="p" className="text-muted-foreground mt-8">
        Edit <code>src/pages/Home.tsx</code> to get started.
      </Typography>
    </section>
  );
}
