"use client";

import { useEffect } from "react";

import { FileEmpty02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Typography } from "@/components/typography";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

export default function NotFoundPage() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // "/" key
      if (event.code !== "Slash") return;

      // Don't steal "/" when already typing in a field
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      event.preventDefault();

      const input = document.getElementById("404-search");

      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Empty className="py-20">
      <EmptyHeader className="max-w-lg">
        <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
          <HugeiconsIcon
            icon={FileEmpty02Icon}
            size={24}
            className="text-amber-600 dark:text-amber-400"
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

      <EmptyContent className="w-full max-w-md">
        <InputGroup className="sm:w-3/4">
          <InputGroupInput
            id="404-search"
            placeholder="Try searching for pages..."
          />
          <InputGroupAddon>
            <HugeiconsIcon
              icon={Search01Icon}
              size={18}
              className="text-muted-foreground"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>

        <p className="text-muted-foreground mt-3 text-sm">
          Need help?{" "}
          <a
            href="/"
            className="text-foreground font-medium underline underline-offset-4"
          >
            Contact support
          </a>
        </p>
      </EmptyContent>
    </Empty>
  );
}
