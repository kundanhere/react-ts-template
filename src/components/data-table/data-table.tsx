import * as React from "react";

import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type Row,
  type Table as TanstackTable,
  flexRender,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { type DataTableViewMode } from "@/components/data-table/data-table-view-toggle";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumnPinningStyle, getSelectedTableRows } from "@/lib/data-table";
import { cn } from "@/lib/utils";

export interface DataTableContextValue {
  viewMode: DataTableViewMode;
  setViewMode: (mode: DataTableViewMode) => void;
  enableViewToggle: boolean;
}

export const DataTableContext =
  React.createContext<DataTableContextValue | null>(null);

export function useDataTableContext() {
  return React.useContext(DataTableContext);
}

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  enableNestedRows?: boolean;
  defaultViewMode?: DataTableViewMode;
  viewMode?: DataTableViewMode;
  onViewModeChange?: (mode: DataTableViewMode) => void;
  enableViewToggle?: boolean;
  renderCard?: (row: Row<TData>) => React.ReactNode;
}

function renderTreeExpander<TData>(row: Row<TData>, showSpacer: boolean) {
  if (row.getCanExpand()) {
    const isExpanded = row.getIsExpanded();
    return (
      <Button
        variant="ghost"
        size="icon-xs"
        className="hover:bg-muted text-muted-foreground size-5 shrink-0 p-0"
        onClick={(e) => {
          e.stopPropagation();
          row.toggleExpanded();
        }}
        aria-label={isExpanded ? "Collapse row" : "Expand row"}
      >
        <HugeiconsIcon
          icon={isExpanded ? ArrowDown01Icon : ArrowRight01Icon}
          strokeWidth={2}
          className="size-3.5 transition-transform"
        />
      </Button>
    );
  }

  if (showSpacer) {
    return <span className="size-5 shrink-0" />;
  }

  return null;
}

export function DataTable<TData>({
  table,
  actionBar,
  enableNestedRows,
  defaultViewMode = "list",
  viewMode: controlledViewMode,
  onViewModeChange: controlledOnViewModeChange,
  enableViewToggle = false,
  renderCard,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  const [internalViewMode, setInternalViewMode] =
    React.useState<DataTableViewMode>(defaultViewMode);

  const viewMode = controlledViewMode ?? internalViewMode;
  const setViewMode = React.useCallback(
    (mode: DataTableViewMode) => {
      setInternalViewMode(mode);
      controlledOnViewModeChange?.(mode);
    },
    [controlledOnViewModeChange]
  );

  const contextValue = React.useMemo<DataTableContextValue>(
    () => ({
      viewMode,
      setViewMode,
      enableViewToggle,
    }),
    [viewMode, setViewMode, enableViewToggle]
  );

  const isNestedEnabled =
    enableNestedRows ??
    table.options.meta?.enableNestedRows ??
    table.getCanSomeRowsExpand();

  const rows = isNestedEnabled
    ? table.getExpandedRowModel().rows
    : table.getRowModel().rows;

  const firstContentColumnId = React.useMemo(() => {
    const visibleCols = table.getVisibleFlatColumns();
    return (
      visibleCols.find((col) => col.id !== "select")?.id ?? visibleCols[0]?.id
    );
  }, [table]);

  return (
    <DataTableContext.Provider value={contextValue}>
      <div
        className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
        {...props}
      >
        {children}

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-4 p-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows?.length ? (
              rows.map((row) => {
                if (renderCard) {
                  return (
                    <React.Fragment key={row.id}>
                      {renderCard(row)}
                    </React.Fragment>
                  );
                }

                const selectCell = row
                  .getVisibleCells()
                  .find((c) => c.column.id === "select");
                const actionCell = row
                  .getVisibleCells()
                  .find((c) => c.column.id === "actions");
                const firstCell = row
                  .getVisibleCells()
                  .find((c) => c.column.id === firstContentColumnId);
                const otherCells = row
                  .getVisibleCells()
                  .filter(
                    (c) =>
                      c.column.id !== "select" &&
                      c.column.id !== "actions" &&
                      c.column.id !== firstContentColumnId
                  );

                const isTreeColumn = isNestedEnabled && !!firstCell;
                const showSpacer =
                  isNestedEnabled &&
                  (table.getCanSomeRowsExpand() || row.depth > 0);

                return (
                  <div
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    data-depth={row.depth}
                    className={cn(
                      "bg-card text-card-foreground hover:border-primary/40 flex flex-col justify-between rounded-xl border p-4 shadow-2xs transition-all",
                      row.getIsSelected() &&
                        "border-primary bg-accent/30 ring-primary/30 ring-1"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 border-b pb-3">
                      <div className="flex min-w-0 items-center gap-2">
                        {selectCell &&
                          flexRender(
                            selectCell.column.columnDef.cell,
                            selectCell.getContext()
                          )}
                        {isTreeColumn && renderTreeExpander(row, showSpacer)}
                        <div className="min-w-0 font-medium">
                          {firstCell &&
                            flexRender(
                              firstCell.column.columnDef.cell,
                              firstCell.getContext()
                            )}
                        </div>
                      </div>
                      {actionCell && (
                        <div className="shrink-0">
                          {flexRender(
                            actionCell.column.columnDef.cell,
                            actionCell.getContext()
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-3 text-xs">
                      {otherCells.map((cell) => {
                        const label =
                          cell.column.columnDef.meta?.label ?? cell.column.id;
                        return (
                          <div
                            key={cell.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <span className="text-muted-foreground shrink-0 font-medium">
                              {label}:
                            </span>
                            <div className="truncate text-right">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-muted-foreground col-span-full rounded-md border p-8 text-center text-sm">
                No results.
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          ...getColumnPinningStyle({ column: header.column }),
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rows?.length ? (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      data-depth={row.depth}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const isTreeColumn =
                          isNestedEnabled &&
                          cell.column.id === firstContentColumnId;
                        const showSpacer =
                          isNestedEnabled &&
                          (table.getCanSomeRowsExpand() || row.depth > 0);

                        const cellContent = flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        );

                        if (isTreeColumn) {
                          return (
                            <TableCell
                              key={cell.id}
                              style={{
                                ...getColumnPinningStyle({
                                  column: cell.column,
                                }),
                              }}
                            >
                              <div
                                className="flex items-center gap-1.5"
                                style={{
                                  paddingLeft: `${row.depth * 1.25}rem`,
                                }}
                              >
                                {renderTreeExpander(row, showSpacer)}
                                <div className="min-w-0 flex-1">
                                  {cellContent}
                                </div>
                              </div>
                            </TableCell>
                          );
                        }

                        return (
                          <TableCell
                            key={cell.id}
                            style={{
                              ...getColumnPinningStyle({
                                column: cell.column,
                              }),
                            }}
                          >
                            {cellContent}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <DataTablePagination table={table} />
          {actionBar && getSelectedTableRows(table).length > 0 && actionBar}
        </div>
      </div>
    </DataTableContext.Provider>
  );
}
