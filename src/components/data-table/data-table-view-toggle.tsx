import { Grid02Icon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export type DataTableViewMode = "list" | "grid";

export interface IDataTableViewToggleProps {
  viewMode: DataTableViewMode;
  onViewModeChange: (mode: DataTableViewMode) => void;
  className?: string;
}
export type DataTableViewToggleProps = IDataTableViewToggleProps;

export function DataTableViewToggle({
  viewMode,
  onViewModeChange,
  className,
}: DataTableViewToggleProps) {
  return (
    <div
      className={cn(
        "bg-muted/40 flex items-center rounded-lg border p-0.5 shadow-2xs",
        className
      )}
      role="group"
      aria-label="View mode toggle"
    >
      <Tooltip>
        <TooltipTrigger>
          <Button
            type="button"
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon-xs"
            className={cn(
              "size-6 rounded-md transition-all",
              viewMode === "list" &&
                "bg-background text-foreground font-medium shadow-xs"
            )}
            onClick={() => onViewModeChange("list")}
            aria-label="List view"
          >
            <HugeiconsIcon
              icon={Menu01Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>List View</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            type="button"
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon-xs"
            className={cn(
              "size-6 rounded-md transition-all",
              viewMode === "grid" &&
                "bg-background text-foreground font-medium shadow-xs"
            )}
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid view"
          >
            <HugeiconsIcon
              icon={Grid02Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Grid View</TooltipContent>
      </Tooltip>
    </div>
  );
}
