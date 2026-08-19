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
  /** Right-side element (button, text, dropdown, badge, form, etc.) */
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
  const hasHeader = Boolean(title) || Boolean(subtitle) || Boolean(action);

  return (
    <div className={cn(pageWrapperVariants({ variant, className }))} {...props}>
      {hasHeader && (
        <div
          className={cn(
            pageHeaderVariants({ headerAlign, headerBorder }),
            headerClassName
          )}
        >
          {(title || subtitle) && (
            <div className="flex min-w-0 flex-col gap-1">
              {typeof title === "string" ? (
                <Typography variant="h3" className="truncate">
                  {title}
                </Typography>
              ) : (
                title
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

          {action && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {action}
            </div>
          )}
        </div>
      )}

      {children && (
        <div className={cn("w-full flex-1", contentClassName)}>{children}</div>
      )}
    </div>
  );
}

export { pageWrapperVariants, pageHeaderVariants };
