"use client";

import * as React from "react";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Column, Table } from "@tanstack/react-table";

import { useDataTableContext } from "@/components/data-table/data-table";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableSliderFilter } from "@/components/data-table/data-table-slider-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import {
  type DataTableViewMode,
  DataTableViewToggle,
} from "@/components/data-table/data-table-view-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface IDataTableToolbarProps<
  TData,
> extends React.ComponentProps<"div"> {
  table: Table<TData>;
  viewMode?: DataTableViewMode;
  onViewModeChange?: (mode: DataTableViewMode) => void;
  enableViewToggle?: boolean;
}
export function DataTableToolbar<TData>({
  table,
  viewMode: propViewMode,
  onViewModeChange: propOnViewModeChange,
  enableViewToggle: propEnableViewToggle,
  children,
  className,
  ...props
}: IDataTableToolbarProps<TData>) {
  const context = useDataTableContext();

  const viewMode = propViewMode ?? context?.viewMode ?? "list";
  const onViewModeChange =
    propOnViewModeChange ?? context?.setViewMode ?? (() => {});
  const enableViewToggle =
    propEnableViewToggle ?? context?.enableViewToggle ?? false;

  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = React.useMemo(
    () => table.getAllColumns().filter((column) => column.getCanFilter()),
    [table]
  );

  const onReset = React.useCallback(() => {
    table.resetColumnFilters();
  }, [table]);

  return (
    <div
      role="toolbar"
      aria-orientation="horizontal"
      className={cn(
        "flex w-full items-start justify-between gap-2 p-1",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="outline"
            className="border-dashed"
            onClick={onReset}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
            Reset
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        {children}
        {enableViewToggle && (
          <DataTableViewToggle
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        )}
        <DataTableViewOptions table={table} align="end" />
      </div>
    </div>
  );
}

export interface IDataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}
function DataTableToolbarFilter<TData>({
  column,
}: IDataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case "text":
        return (
          <Input
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className="w-40 lg:w-56"
          />
        );

      case "number":
        return (
          <div className="relative">
            <Input
              type="number"
              inputMode="numeric"
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(event) => column.setFilterValue(event.target.value)}
              className={cn("h-8 w-30", columnMeta.unit && "pr-8")}
            />
            {columnMeta.unit && (
              <span className="bg-accent text-muted-foreground absolute top-0 right-0 bottom-0 flex items-center rounded-r-md px-2 text-sm">
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case "range":
        return (
          <DataTableSliderFilter
            column={column}
            title={columnMeta.label ?? column.id}
          />
        );

      case "date":
      case "dateRange":
        return (
          <DataTableDateFilter
            column={column}
            title={columnMeta.label ?? column.id}
            multiple={columnMeta.variant === "dateRange"}
          />
        );

      case "select":
      case "multiSelect":
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === "multiSelect"}
          />
        );

      default:
        return null;
    }
  }, [column, columnMeta]);

  return onFilterRender();
}
