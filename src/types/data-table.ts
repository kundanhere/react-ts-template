import type { ColumnSort, Row, RowData } from "@tanstack/react-table";

import type { DataTableConfig } from "@/config/data-table";
import type { FilterItemSchema } from "@/lib/parsers";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  interface TableMeta<TData extends RowData> {
    queryKeys?: IQueryKeys;
    enableNestedRows?: boolean;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/naming-convention
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    placeholder?: string;
    variant?: FilterVariant;
    options?: IOption[];
    range?: [number, number];
    unit?: string;
    icon?: React.ComponentType<React.ComponentProps<"svg">>;
  }
}

export interface IQueryKeys {
  page: string;
  perPage: string;
  sort: string;
  filters: string;
  joinOperator: string;
}
export type QueryKeys = IQueryKeys;

export interface IOption {
  label: string;
  value: string;
  count?: number;
  icon?: React.ComponentType<React.ComponentProps<"svg">>;
}
export type Option = IOption;

export type FilterOperator = DataTableConfig["operators"][number];
export type FilterVariant = DataTableConfig["filterVariants"][number];
export type JoinOperator = DataTableConfig["joinOperators"][number];

export interface IExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>;
}
export type ExtendedColumnSort<TData> = IExtendedColumnSort<TData>;

export interface IExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>;
}
export type ExtendedColumnFilter<TData> = IExtendedColumnFilter<TData>;

export interface IDataTableRowAction<TData> {
  row: Row<TData>;
  variant: "update" | "delete";
}
export type DataTableRowAction<TData> = IDataTableRowAction<TData>;
