"use client";

import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Cancel01Icon,
  UnfoldMoreIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Column } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.ComponentProps<typeof DropdownMenuTrigger> {
  column: Column<TData, TValue>;
  label: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  label,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{label}</div>;
  }

  const renderSortIcon = () => {
    const isSorted = column.getIsSorted();
    if (isSorted === "desc")
      return <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />;
    if (isSorted === "asc")
      return <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />;
    return <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "hover:bg-accent focus:ring-ring data-[state=open]:bg-accent [&_svg]:text-muted-foreground -ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0",
          className
        )}
        {...props}
      >
        {label}
        {column.getCanSort() && renderSortIcon()}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-28">
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === "asc"}
              onClick={() => column.toggleSorting(false)}
            >
              <HugeiconsIcon icon={ArrowUp01Icon} strokeWidth={2} />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
              checked={column.getIsSorted() === "desc"}
              onClick={() => column.toggleSorting(true)}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className="[&_svg]:text-muted-foreground pl-2"
                onClick={() => column.clearSorting()}
              >
                <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className="[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto"
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <HugeiconsIcon icon={ViewOffIcon} strokeWidth={2} />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
