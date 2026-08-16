import { Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Typography } from "@/components/typography";

export default function Home() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 py-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="bg-primary/10 mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full">
          <HugeiconsIcon icon={Sun01Icon} size={48} className="text-primary" />
        </span>

        <Typography variant="h1">Welcome to React TS Template</Typography>

        <Typography variant="p" className="text-muted-foreground max-w-xl">
          A modern, scalable starter with TypeScript, Redux Toolkit & Thunk,
          shadcn/ui toast & alerts, Hugeicons, Roboto, and more. Built for rapid
          development and best practices.
        </Typography>
      </div>

      <Typography variant="p" className="text-muted-foreground mt-8">
        Edit <code>src/pages/Home.tsx</code> to get started.
      </Typography>
    </section>
  );
}
