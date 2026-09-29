import * as React from "react";

import {
  type ColumnFiltersState,
  type ExpandedState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  type VisibilityState,
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  type SingleParser,
  type UseQueryStateOptions,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";

import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getSortingStateParser } from "@/lib/parsers";
import type { IExtendedColumnSort, IQueryKeys } from "@/types/data-table";

const PAGE_KEY = "page";
const PER_PAGE_KEY = "perPage";
const SORT_KEY = "sort";
const FILTERS_KEY = "filters";
const JOIN_OPERATOR_KEY = "joinOperator";
const ARRAY_SEPARATOR = ",";
const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;

export interface IUseDataTableProps<TData> extends Omit<
  TableOptions<TData>,
  | "state"
  | "pageCount"
  | "getCoreRowModel"
  | "manualFiltering"
  | "manualPagination"
  | "manualSorting"
> {
  pageCount?: number;
  rowCount?: number;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  initialState?: Omit<Partial<TableState>, "sorting"> & {
    sorting?: IExtendedColumnSort<TData>[];
  };
  queryKeys?: Partial<IQueryKeys>;
  history?: "push" | "replace";
  debounceMs?: number;
  throttleMs?: number;
  clearOnDefault?: boolean;
  enableAdvancedFilter?: boolean;
  enableNestedRows?: boolean;
  getSubRows?: (originalRow: TData, index: number) => TData[] | undefined;
  scroll?: boolean;
  shallow?: boolean;
  startTransition?: React.TransitionStartFunction;
}

export function useDataTable<TData>(props: IUseDataTableProps<TData>) {
  const {
    columns,
    pageCount: propPageCount,
    rowCount: propRowCount,
    manualPagination = false,
    manualSorting = false,
    manualFiltering = false,
    initialState,
    queryKeys,
    history = "replace",
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    enableNestedRows = false,
    getSubRows,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props;
  const pageKey = queryKeys?.page ?? PAGE_KEY;
  const perPageKey = queryKeys?.perPage ?? PER_PAGE_KEY;
  const sortKey = queryKeys?.sort ?? SORT_KEY;
  const filtersKey = queryKeys?.filters ?? FILTERS_KEY;
  const joinOperatorKey = queryKeys?.joinOperator ?? JOIN_OPERATOR_KEY;

  const queryStateOptions = React.useMemo<
    Omit<UseQueryStateOptions<unknown>, "parse">
  >(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    }),
    [
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition,
    ]
  );

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    initialState?.rowSelection ?? {}
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialState?.columnVisibility ?? {});
  const [expanded, setExpanded] = React.useState<ExpandedState>(
    initialState?.expanded ?? {}
  );

  const getSubRowsFn = React.useCallback(
    (row: TData, index: number) => {
      if (getSubRows) return getSubRows(row, index);
      if ((tableProps as any).getSubRows)
        return (tableProps as any).getSubRows(row, index);
      return (row as any)?.children ?? (row as any)?.subRows;
    },
    [getSubRows, tableProps]
  );

  const validRowIds = React.useMemo(() => {
    const ids = new Set<string>();
    const getRowIdFn = props.getRowId;
    const collect = (items: TData[], parent?: any) => {
      if (!Array.isArray(items)) return;
      items.forEach((item, index) => {
        const id = getRowIdFn
          ? getRowIdFn(item, index, parent)
          : ((item as any)?.id ?? String(index));
        if (id !== undefined && id !== null) {
          ids.add(String(id));
        }
        const sub = getSubRowsFn(item, index);
        if (sub) {
          collect(sub, item);
        }
      });
    };
    collect(props.data);
    return ids;
  }, [props.data, props.getRowId, getSubRowsFn]);

  const sanitizedExpanded = React.useMemo(() => {
    if (typeof expanded === "boolean") return expanded;
    const next: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(expanded)) {
      if (value && validRowIds.has(key)) {
        next[key] = value;
      }
    }
    return next as ExpandedState;
  }, [expanded, validRowIds]);

  const sanitizedRowSelection = React.useMemo(() => {
    const next: RowSelectionState = {};
    for (const [key, value] of Object.entries(rowSelection)) {
      if (value && validRowIds.has(key)) {
        next[key] = value;
      }
    }
    return next;
  }, [rowSelection, validRowIds]);

  const [page, setPage] = useQueryState(
    pageKey,
    parseAsInteger.withOptions(queryStateOptions).withDefault(1)
  );
  const [perPage, setPerPage] = useQueryState(
    perPageKey,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? 10)
  );

  const pagination: PaginationState = React.useMemo(
    () => ({
      pageIndex: page - 1,
      pageSize: perPage,
    }),
    [page, perPage]
  );

  const onPaginationChange = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === "function") {
        const newPagination = updaterOrValue(pagination);
        setPage(newPagination.pageIndex + 1);
        setPerPage(newPagination.pageSize);
      } else {
        setPage(updaterOrValue.pageIndex + 1);
        setPerPage(updaterOrValue.pageSize);
      }
    },
    [pagination, setPage, setPerPage]
  );

  const columnIds = React.useMemo(
    () =>
      new Set(
        columns.map((column) => (column as any).id).filter(Boolean) as string[]
      ),
    [columns]
  );

  const [sorting, setSorting] = useQueryState(
    sortKey,
    getSortingStateParser<TData>(columnIds)
      .withDefault(initialState?.sorting ?? [])
      .withOptions(queryStateOptions)
  );

  const onSortingChange = React.useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === "function") {
        const newSorting = updaterOrValue(sorting ?? []);
        setSorting(newSorting as IExtendedColumnSort<TData>[]);
      } else {
        setSorting(updaterOrValue as IExtendedColumnSort<TData>[]);
      }
    },
    [sorting, setSorting]
  );

  const filterableColumns = React.useMemo(
    () =>
      columns.filter((column) => (column as any).enableColumnFilter !== false),
    [columns]
  );

  const filterParsers = React.useMemo(() => {
    if (enableAdvancedFilter) return {};

    return filterableColumns.reduce<
      Record<string, SingleParser<string> | SingleParser<string[]>>
    >((acc, column) => {
      const id = (column as any).id as string;
      if ((column as any).meta?.options) {
        acc[id] = parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withOptions(
          queryStateOptions
        );
      } else {
        acc[id] = parseAsString.withOptions(queryStateOptions);
      }
      return acc;
    }, {});
  }, [filterableColumns, queryStateOptions, enableAdvancedFilter]);

  const [filterValues, setFilterValues] = useQueryStates(filterParsers);

  const debouncedSetFilterValues = useDebouncedCallback(
    (values: typeof filterValues) => {
      setPage(1);
      setFilterValues(values);
    },
    debounceMs
  );

  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    if (enableAdvancedFilter) return [];

    return Object.entries(filterValues).reduce<ColumnFiltersState>(
      (filters, [key, value]) => {
        if (value !== null && value !== undefined) {
          const column = filterableColumns.find(
            (col) => (col as any).id === key
          );
          const isOptions = !!(column as any)?.meta?.options;

          let processedValue: unknown = value;
          if (isOptions && !Array.isArray(value)) {
            processedValue =
              typeof value === "string"
                ? value.split(ARRAY_SEPARATOR).filter(Boolean)
                : [value];
          }

          filters.push({
            id: key,
            value: processedValue,
          });
        }
        return filters;
      },
      []
    );
  }, [filterValues, enableAdvancedFilter, filterableColumns]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialColumnFilters);

  const onColumnFiltersChange = React.useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return;

      setColumnFilters((prev) => {
        const next =
          typeof updaterOrValue === "function"
            ? updaterOrValue(prev)
            : updaterOrValue;

        const filterUpdates = next.reduce<
          Record<string, string | string[] | null>
        >((acc, filter) => {
          if (
            filterableColumns.find((column) => (column as any).id === filter.id)
          ) {
            acc[filter.id] = filter.value as string | string[];
          }
          return acc;
        }, {});

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null;
          }
        }

        debouncedSetFilterValues(filterUpdates);
        return next;
      });
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter]
  );

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount: manualPagination ? (propPageCount ?? -1) : undefined,
    rowCount: propRowCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection: sanitizedRowSelection,
      columnFilters,
      expanded: sanitizedExpanded,
    },
    defaultColumn: {
      filterFn: (row, columnId, filterValue) => {
        if (
          filterValue == null ||
          filterValue === "" ||
          (Array.isArray(filterValue) && filterValue.length === 0)
        ) {
          return true;
        }
        const rowValue = row.getValue(columnId);
        if (rowValue == null) return false;

        if (Array.isArray(filterValue)) {
          // Number range check [min, max]
          if (
            filterValue.length === 2 &&
            typeof filterValue[0] === "number" &&
            typeof filterValue[1] === "number" &&
            typeof rowValue === "number"
          ) {
            return rowValue >= filterValue[0] && rowValue <= filterValue[1];
          }
          // Date range check
          if (
            filterValue.length === 2 &&
            (filterValue[0] instanceof Date ||
              typeof filterValue[0] === "string") &&
            (filterValue[1] instanceof Date ||
              typeof filterValue[1] === "string") &&
            (rowValue instanceof Date || !isNaN(Date.parse(String(rowValue))))
          ) {
            const rowTime = new Date(rowValue as any).getTime();
            const startTime = new Date(filterValue[0]).getTime();
            const endTime = new Date(filterValue[1]).getTime();
            if (!isNaN(startTime) && !isNaN(endTime)) {
              return rowTime >= startTime && rowTime <= endTime;
            }
          }
          // MultiSelect (includes any of the selected values)
          return filterValue.some(
            (val) =>
              String(rowValue).toLowerCase() === String(val).toLowerCase()
          );
        }

        return String(rowValue)
          .toLowerCase()
          .includes(String(filterValue).toLowerCase());
      },
      ...tableProps.defaultColumn,
      enableColumnFilter: false,
    },
    enableRowSelection: true,
    enableExpanding: true,
    getSubRows: getSubRowsFn,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination,
    manualSorting,
    manualFiltering,
    meta: {
      ...tableProps.meta,
      enableNestedRows,
      queryKeys: {
        page: pageKey,
        perPage: perPageKey,
        sort: sortKey,
        filters: filtersKey,
        joinOperator: joinOperatorKey,
      },
    },
  });

  React.useEffect(() => {
    if (!manualPagination) {
      const totalPages = table.getPageCount();
      if (totalPages > 0 && page > totalPages) {
        setPage(totalPages);
      }
    }
  }, [manualPagination, page, setPage, table]);

  return React.useMemo(
    () => ({ table, shallow, debounceMs, throttleMs }),
    [table, shallow, debounceMs, throttleMs]
  );
}
