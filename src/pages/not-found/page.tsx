import { FileEmpty02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { Typography } from "@/components/typography";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";

import { NotFoundSearch } from "./components/search";

export default function NotFoundPage() {
  return (
    <Empty className="py-20">
      <EmptyHeader className="max-w-lg">
        <div className="bg-primary/10 mb-3 flex size-12 items-center justify-center rounded-lg">
          <HugeiconsIcon
            icon={FileEmpty02Icon}
            size={24}
            className="text-primary"
          />
        </div>

        <span className="text-muted-foreground text-sm font-medium uppercase">
          Error 404
        </span>

        <Typography variant="h3" className="mt-2 tracking-tight">
          Page not found
        </Typography>

        <EmptyDescription className="mt-2 max-w-md text-sm">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved or no longer exists.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="w-full max-w-xs">
        <NotFoundSearch />

        <p className="text-muted-foreground mt-3 text-sm">
          Need help?{" "}
          <Link
            to="/support"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Contact support
          </Link>
        </p>
      </EmptyContent>
    </Empty>
  );
}
