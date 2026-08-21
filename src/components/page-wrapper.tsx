import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

import { Typography } from "./typography";

const pageWrapperVariants = cva("flex flex-col w-full", {
  variants: {
    variant: {
      default: "gap-4 py-4",
      compact: "gap-3 py-2",
      spacious: "gap-8 py-6",
      bordered: "gap-6 py-4 border-b border-border mb-4",
      card: "gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const pageHeaderVariants = cva(
  "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
  {
    variants: {
      headerAlign: {
        between: "justify-between",
        start: "justify-start gap-4",
        end: "justify-end gap-4",
        center: "justify-center text-center",
      },
      headerBorder: {
        none: "",
        bottom: "pb-4 border-b border-border",
      },
    },
    defaultVariants: {
      headerAlign: "between",
      headerBorder: "none",
    },
  }
);

export interface PageWrapperProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof pageWrapperVariants>,
    VariantProps<typeof pageHeaderVariants> {
  /** Page title - string or custom ReactNode */
  title?: React.ReactNode;
  /** Subtitle or description - string or custom ReactNode */
  subtitle?: React.ReactNode;
  /** Optional badge element displayed next to title */
  badge?: React.ReactNode;
  /** Optional back button element displayed top of title */
  backButton?: React.ReactNode;
  /** Right-side element (button, text, dropdown, badge, form, etc.) */
  rightElement?: React.ReactNode;
  /** Alias for rightElement */
  action?: React.ReactNode;
  /** Main content of the page */
  children?: React.ReactNode;
  /** Custom CSS class for header container */
  headerClassName?: string;
  /** Custom CSS class for main content container */
  contentClassName?: string;
}

export function PageWrapper({
  title,
  subtitle,
  badge,
  backButton,
  rightElement,
  action,
  children,
  variant,
  headerAlign,
  headerBorder,
  className,
  headerClassName,
  contentClassName,
  ...props
}: PageWrapperProps) {
  const rightContent = rightElement ?? action;
  const hasHeader =
    Boolean(title) ||
    Boolean(subtitle) ||
    Boolean(badge) ||
    Boolean(backButton) ||
    Boolean(rightContent);

  return (
    <div className={cn(pageWrapperVariants({ variant, className }))} {...props}>
      {hasHeader && (
        <div className="flex flex-col gap-2 px-1">
          {backButton && <div className="w-full">{backButton}</div>}

          <div
            className={cn(
              pageHeaderVariants({ headerAlign, headerBorder }),
              headerClassName
            )}
          >
            {(title || subtitle || badge) && (
              <div className="flex min-w-0 flex-col gap-1">
                {(title || badge) && (
                  <div className="flex min-w-0 flex-wrap items-center gap-2 capitalize">
                    {typeof title === "string" ? (
                      <Typography variant="h3" className="truncate">
                        {title}
                      </Typography>
                    ) : (
                      title
                    )}
                    {badge}
                  </div>
                )}
                {typeof subtitle === "string" ? (
                  <Typography className="text-muted-foreground text-sm">
                    {subtitle}
                  </Typography>
                ) : (
                  subtitle
                )}
              </div>
            )}

            {rightContent && (
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {rightContent}
              </div>
            )}
          </div>
        </div>
      )}

      {children && (
        <div className={cn("w-full flex-1", contentClassName)}>{children}</div>
      )}
    </div>
  );
}

export { pageWrapperVariants, pageHeaderVariants };
