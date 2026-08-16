import { Typography } from "@/components/typography";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t px-8 py-3 text-center">
      <Typography variant="p" className="text-muted-foreground mb-2 text-sm">
        &copy; {new Date().getFullYear()} ReactStarter. All rights reserved.
      </Typography>
    </footer>
  );
}
