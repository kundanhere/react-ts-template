import { ArrowLeft01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Typography } from "@/components/typography";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center gap-8 px-4 py-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-destructive/10 mb-2 inline-flex h-20 w-20 items-center justify-center rounded-full">
          <HugeiconsIcon
            icon={Home01Icon}
            size={48}
            className="text-destructive"
          />
        </div>

        <Typography variant="h1" className="text-foreground text-6xl font-bold">
          404
        </Typography>

        <Typography
          variant="h2"
          className="text-muted-foreground text-2xl font-semibold"
        >
          Page Not Found
        </Typography>

        <Typography variant="p" className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </Typography>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="bg-primary text-primary-foreground hover:bg-primary/80 flex items-center gap-2 rounded px-6 py-3 shadow transition"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Home
        </Link>
        <Link
          to="/blog/hello-world"
          className="border-primary bg-background text-primary hover:bg-accent rounded border px-6 py-3 shadow transition"
        >
          View Blog
        </Link>
      </div>

      <Typography variant="p" className="text-muted-foreground mt-8 text-sm">
        If you believe this is an error, please contact support.
      </Typography>
    </section>
  );
}
