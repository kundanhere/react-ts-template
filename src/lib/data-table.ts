import type { Column, Row, Table } from "@tanstack/react-table";

import { dataTableConfig } from "@/config/data-table";
import type {
  FilterOperator,
  FilterVariant,
  IExtendedColumnFilter,
} from "@/types/data-table";

export function getColumnPinningStyle<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>;
  withBorder?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");

  let boxShadow: string | undefined;
  if (withBorder) {
    if (isLastLeftPinnedColumn) {
      boxShadow = "-0.25rem 0 0.25rem -0.25rem var(--border) inset";
    } else if (isFirstRightPinnedColumn) {
      boxShadow = "0.25rem 0 0.25rem -0.25rem var(--border) inset";
    }
  }

  return {
    boxShadow,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : "relative",
    background: isPinned ? "var(--background)" : "var(--background)",
    width: column.getSize(),
    zIndex: isPinned ? 1 : undefined,
  };
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  };

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators;
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant);

  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq");
}

export function getValidFilters<TData>(
  filters: IExtendedColumnFilter<TData>[]
): IExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
          filter.value !== null &&
          filter.value !== undefined)
  );
}

export function getSelectedTableRows<TData>(table: Table<TData>): Row<TData>[] {
  const selection = table.getState().rowSelection;
  if (!selection) return [];
  const selectedIds = Object.keys(selection).filter((id) => selection[id]);
  if (selectedIds.length === 0) return [];

  const selectedRows: Row<TData>[] = [];
  for (const id of selectedIds) {
    try {
      const row = table.getRow(id);
      if (row) selectedRows.push(row);
    } catch {
      // ignore rows that might not be found
    }
  }
  return selectedRows;
}
