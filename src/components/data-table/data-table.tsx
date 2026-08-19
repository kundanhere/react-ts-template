import * as React from "react";

import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type Row,
  type Table as TanstackTable,
  flexRender,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
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

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  actionBar?: React.ReactNode;
  enableNestedRows?: boolean;
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
  children,
  className,
  ...props
}: DataTableProps<TData>) {
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
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto", className)}
      {...props}
    >
      {children}
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
                            ...getColumnPinningStyle({ column: cell.column }),
                          }}
                        >
                          <div
                            className="flex items-center gap-1.5"
                            style={{ paddingLeft: `${row.depth * 1.25}rem` }}
                          >
                            {renderTreeExpander(row, showSpacer)}
                            <div className="min-w-0 flex-1">{cellContent}</div>
                          </div>
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={cell.id}
                        style={{
                          ...getColumnPinningStyle({ column: cell.column }),
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
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {actionBar && getSelectedTableRows(table).length > 0 && actionBar}
      </div>
    </div>
  );
}
