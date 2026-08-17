import { Typography } from "@/components/typography";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t px-8 py-2 text-center">
      <Typography variant="p" className="text-muted-foreground text-xs">
        &copy; {new Date().getFullYear()} Sentry IAM. All rights reserved.
      </Typography>
    </footer>
  );
}
