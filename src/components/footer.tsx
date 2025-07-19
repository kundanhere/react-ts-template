import { Link } from "react-router-dom";

import { Typography } from "@/components/typography";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t px-8 py-6 text-center">
      <Typography variant="p" className="text-muted-foreground mb-2 text-sm">
        &copy; {new Date().getFullYear()} ReactStarter. All rights reserved.
      </Typography>
      <Typography variant="p" className="text-sm">
        <Link
          to="https://github.com/your-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          GitHub
        </Link>
      </Typography>
    </footer>
  );
}
