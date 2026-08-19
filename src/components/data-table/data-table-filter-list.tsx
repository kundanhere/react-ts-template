/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from "react";

import {
  Calendar01Icon,
  Delete02Icon,
  DragDropVerticalIcon,
  FilterIcon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Column, ColumnMeta, Table } from "@tanstack/react-table";
import { parseAsStringEnum, useQueryState } from "nuqs";

import { DataTableRangeFilter } from "@/components/data-table/data-table-range-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Faceted,
  FacetedBadgeList,
  FacetedContent,
  FacetedEmpty,
  FacetedGroup,
  FacetedInput,
  FacetedItem,
  FacetedList,
  FacetedTrigger,
} from "@/components/ui/faceted";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sortable,
  SortableContent,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/ui/sortable";
import { dataTableConfig } from "@/config/data-table";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getDefaultFilterOperator, getFilterOperators } from "@/lib/data-table";
import { formatDate } from "@/lib/format";
import { generateId } from "@/lib/id";
import { getFiltersStateParser } from "@/lib/parsers";
import { cn } from "@/lib/utils";
import type {
  ExtendedColumnFilter,
  FilterOperator,
  JoinOperator,
} from "@/types/data-table";

const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;
const FILTER_SHORTCUT_KEY = "f";
const REMOVE_FILTER_SHORTCUTS = ["backspace", "delete"];

interface DataTableFilterListProps<TData> extends React.ComponentProps<
  typeof PopoverContent
> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  shallow?: boolean;
  disabled?: boolean;
}

export function DataTableFilterList<TData>({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
  disabled,
  ...props
}: DataTableFilterListProps<TData>) {
  const id = React.useId();
  const labelId = React.useId();
  const descriptionId = React.useId();
  const [open, setOpen] = React.useState(false);
  const addButtonRef = React.useRef<HTMLButtonElement>(null);

  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => column.columnDef.enableColumnFilter),
    [table]
  );

  const [filters, setFilters] = useQueryState(
    table.options.meta?.queryKeys?.filters ?? "filters",
    getFiltersStateParser<TData>(columns.map((field) => field.id))
      .withDefault([])
      .withOptions({
        clearOnDefault: true,
        shallow,
        throttleMs,
      })
  );
  const debouncedSetFilters = useDebouncedCallback(setFilters, debounceMs);

  const [joinOperator, setJoinOperator] = useQueryState(
    table.options.meta?.queryKeys?.joinOperator ?? "joinOperator",
    parseAsStringEnum(["and", "or"]).withDefault("and").withOptions({
      clearOnDefault: true,
      shallow,
    })
  );

  const onFilterAdd = React.useCallback(() => {
    const column = columns[0];

    if (!column) return;

    debouncedSetFilters([
      ...filters,
      {
        id: column.id as Extract<keyof TData, string>,
        value: "",
        variant: column.columnDef.meta?.variant ?? "text",
        operator: getDefaultFilterOperator(
          column.columnDef.meta?.variant ?? "text"
        ),
        filterId: generateId({ length: 8 }),
      },
    ]);
  }, [columns, filters, debouncedSetFilters]);

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
    ) => {
      debouncedSetFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) => {
          if (filter.filterId === filterId) {
            return { ...filter, ...updates } as ExtendedColumnFilter<TData>;
          }
          return filter;
        });
        return updatedFilters;
      });
    },
    [debouncedSetFilters]
  );

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter(
        (filter) => filter.filterId !== filterId
      );
      setFilters(updatedFilters);
      requestAnimationFrame(() => {
        addButtonRef.current?.focus();
      });
    },
    [filters, setFilters]
  );

  const onFiltersReset = React.useCallback(() => {
    setFilters(null);
    setJoinOperator("and");
  }, [setFilters, setJoinOperator]);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLElement &&
          event.target.contentEditable === "true")
      ) {
        return;
      }

      if (
        event.key.toLowerCase() === FILTER_SHORTCUT_KEY &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey
      ) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase()) &&
        filters.length > 0
      ) {
        event.preventDefault();
        onFilterRemove(filters[filters.length - 1]?.filterId ?? "");
      }
    },
    [filters, onFilterRemove]
  );

  return (
    <Sortable
      value={filters}
      onValueChange={setFilters}
      getItemValue={(item) => item.filterId}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="font-normal"
            onKeyDown={onTriggerKeyDown}
            disabled={disabled}
          >
            <HugeiconsIcon
              icon={FilterIcon}
              strokeWidth={2}
              className="text-muted-foreground"
            />
            Filter
            {filters.length > 0 && (
              <Badge
                variant="secondary"
                className="h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono text-[10.4px] font-normal"
              >
                {filters.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          aria-describedby={descriptionId}
          aria-labelledby={labelId}
          className="flex w-full max-w-(--radix-popover-content-available-width) flex-col gap-3.5 p-4 sm:min-w-[380px]"
          {...props}
        >
          <div className="flex flex-col gap-1">
            <h4 id={labelId} className="leading-none font-medium">
              {filters.length > 0 ? "Filters" : "No filters applied"}
            </h4>
            <p
              id={descriptionId}
              className={cn(
                "text-muted-foreground text-sm",
                filters.length > 0 && "sr-only"
              )}
            >
              {filters.length > 0
                ? "Modify filters to refine your rows."
                : "Add filters to refine your rows."}
            </p>
          </div>
          {filters.length > 0 ? (
            <SortableContent asChild>
              <div
                role="list"
                className="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-1"
              >
                {filters.map((filter, index) => (
                  <DataTableFilterItem<TData>
                    key={filter.filterId}
                    filter={filter}
                    index={index}
                    filterItemId={`${id}-filter-${filter.filterId}`}
                    joinOperator={joinOperator}
                    setJoinOperator={setJoinOperator}
                    columns={columns}
                    onFilterUpdate={onFilterUpdate}
                    onFilterRemove={onFilterRemove}
                  />
                ))}
              </div>
            </SortableContent>
          ) : null}
          <div className="flex w-full items-center gap-2">
            <Button
              className="rounded"
              ref={addButtonRef}
              onClick={onFilterAdd}
            >
              Add filter
            </Button>
            {filters.length > 0 ? (
              <Button
                variant="outline"
                className="rounded"
                onClick={onFiltersReset}
              >
                Reset filters
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 h-8 min-w-[72px] rounded-sm" />
          <div className="bg-primary/10 h-8 w-32 rounded-sm" />
          <div className="bg-primary/10 h-8 w-32 rounded-sm" />
          <div className="bg-primary/10 h-8 min-w-36 flex-1 rounded-sm" />
          <div className="bg-primary/10 size-8 shrink-0 rounded-sm" />
          <div className="bg-primary/10 size-8 shrink-0 rounded-sm" />
        </div>
      </SortableOverlay>
    </Sortable>
  );
}

interface DataTableFilterItemProps<TData> {
  filter: ExtendedColumnFilter<TData>;
  index: number;
  filterItemId: string;
  joinOperator: JoinOperator;
  setJoinOperator: (value: JoinOperator) => void;
  columns: Column<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function DataTableFilterItem<TData>({
  filter,
  index,
  filterItemId,
  joinOperator,
  setJoinOperator,
  columns,
  onFilterUpdate,
  onFilterRemove,
}: DataTableFilterItemProps<TData>) {
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = React.useState(false);
  const [showValueSelector, setShowValueSelector] = React.useState(false);

  const column = columns.find((column) => column.id === filter.id);

  const joinOperatorListboxId = `${filterItemId}-join-operator-listbox`;
  const fieldListboxId = `${filterItemId}-field-listbox`;
  const operatorListboxId = `${filterItemId}-operator-listbox`;
  const inputId = `${filterItemId}-input`;

  const columnMeta = column?.columnDef.meta;
  const filterOperators = getFilterOperators(filter.variant);

  const onItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (showFieldSelector || showOperatorSelector || showValueSelector) {
        return;
      }

      if (REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase())) {
        event.preventDefault();
        onFilterRemove(filter.filterId);
      }
    },
    [
      filter.filterId,
      showFieldSelector,
      showOperatorSelector,
      showValueSelector,
      onFilterRemove,
    ]
  );

  if (!column) return null;

  let joinOperatorContent: React.ReactNode;
  if (index === 0) {
    joinOperatorContent = (
      <span className="text-muted-foreground text-sm">Where</span>
    );
  } else if (index === 1) {
    joinOperatorContent = (
      <Select
        value={joinOperator}
        onValueChange={(value) => {
          if (value) setJoinOperator(value as JoinOperator);
        }}
      >
        <SelectTrigger
          aria-label="Select join operator"
          aria-controls={joinOperatorListboxId}
          className="rounded lowercase"
        >
          <SelectValue placeholder={joinOperator} />
        </SelectTrigger>
        <SelectContent
          id={joinOperatorListboxId}
          className="min-w-(--radix-select-trigger-width) lowercase"
        >
          <SelectGroup>
            {dataTableConfig.joinOperators.map((operator) => (
              <SelectItem key={operator} value={operator}>
                {operator}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  } else {
    joinOperatorContent = (
      <span className="text-muted-foreground text-sm">{joinOperator}</span>
    );
  }

  return (
    <SortableItem value={filter.filterId} asChild>
      <div
        role="group"
        id={filterItemId}
        tabIndex={-1}
        className="flex items-center gap-2"
        onKeyDown={onItemKeyDown}
      >
        <div className="min-w-[72px] text-center">{joinOperatorContent}</div>
        <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
          <PopoverTrigger asChild>
            <Button
              aria-controls={fieldListboxId}
              variant="outline"
              className="w-32 justify-between rounded font-normal"
            >
              <span className="truncate">
                {columns.find((column) => column.id === filter.id)?.columnDef
                  .meta?.label ?? "Select field"}
              </span>
              <HugeiconsIcon
                icon={UnfoldMoreIcon}
                strokeWidth={2}
                className="opacity-50"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={fieldListboxId}
            align="start"
            className="w-40 p-0"
          >
            <Command>
              <CommandInput placeholder="Search fields..." />
              <CommandList>
                <CommandEmpty>No fields found.</CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      value={column.id}
                      onSelect={(value) => {
                        onFilterUpdate(filter.filterId, {
                          id: value as Extract<keyof TData, string>,
                          variant: column.columnDef.meta?.variant ?? "text",
                          operator: getDefaultFilterOperator(
                            column.columnDef.meta?.variant ?? "text"
                          ),
                          value: "",
                        });

                        setShowFieldSelector(false);
                      }}
                    >
                      <span className="truncate">
                        {column.columnDef.meta?.label}
                      </span>
                      <HugeiconsIcon
                        icon={Tick02Icon}
                        strokeWidth={2}
                        className={cn(
                          "ml-auto",
                          column.id === filter.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          open={showOperatorSelector}
          onOpenChange={setShowOperatorSelector}
          value={filter.operator}
          onValueChange={(value) => {
            if (value) {
              onFilterUpdate(filter.filterId, {
                operator: value as FilterOperator,
                value:
                  value === "isEmpty" || value === "isNotEmpty"
                    ? ""
                    : filter.value,
              });
            }
          }}
        >
          <SelectTrigger
            aria-controls={operatorListboxId}
            className="w-32 rounded lowercase"
          >
            <div className="truncate">
              <SelectValue placeholder={filter.operator} />
            </div>
          </SelectTrigger>
          <SelectContent id={operatorListboxId}>
            <SelectGroup>
              {filterOperators.map((operator) => (
                <SelectItem
                  key={operator.value}
                  value={operator.value}
                  className="lowercase"
                >
                  {operator.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="max-w-60 min-w-36 flex-1">
          {onFilterInputRender({
            filter,
            inputId,
            column,
            columnMeta,
            onFilterUpdate,
            showValueSelector,
            setShowValueSelector,
          })}
        </div>
        <Button
          aria-controls={filterItemId}
          variant="outline"
          size="icon"
          className="size-8 rounded"
          onClick={() => onFilterRemove(filter.filterId)}
        >
          <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        </Button>
        <SortableItemHandle asChild>
          <Button variant="outline" size="icon" className="size-8 rounded">
            <HugeiconsIcon icon={DragDropVerticalIcon} strokeWidth={2} />
          </Button>
        </SortableItemHandle>
      </div>
    </SortableItem>
  );
}

function onFilterInputRender<TData>({
  filter,
  inputId,
  column,
  columnMeta,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}: {
  filter: ExtendedColumnFilter<TData>;
  inputId: string;
  column: Column<TData>;
  columnMeta?: ColumnMeta<TData, unknown>;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<ExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
}) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        id={inputId}
        role="status"
        aria-label={`${columnMeta?.label} filter is ${
          filter.operator === "isEmpty" ? "empty" : "not empty"
        }`}
        aria-live="polite"
        className="dark:bg-input/30 h-8 w-full rounded border bg-transparent"
      />
    );
  }

  switch (filter.variant) {
    case "text":
    case "number":
    case "range": {
      if (
        (filter.variant === "range" && filter.operator === "isBetween") ||
        filter.operator === "isBetween"
      ) {
        return (
          <DataTableRangeFilter
            filter={filter}
            column={column}
            inputId={inputId}
            onFilterUpdate={onFilterUpdate}
          />
        );
      }

      const isNumber =
        filter.variant === "number" || filter.variant === "range";

      return (
        <Input
          id={inputId}
          type={isNumber ? "number" : filter.variant}
          aria-label={`${columnMeta?.label} filter value`}
          aria-describedby={`${inputId}-description`}
          inputMode={isNumber ? "numeric" : undefined}
          placeholder={columnMeta?.placeholder ?? "Enter a value..."}
          className="h-8 w-full rounded"
          defaultValue={
            typeof filter.value === "string" ? filter.value : undefined
          }
          onChange={(event) =>
            onFilterUpdate(filter.filterId, {
              value: event.target.value,
            })
          }
        />
      );
    }

    case "boolean": {
      if (Array.isArray(filter.value)) return null;

      const inputListboxId = `${inputId}-listbox`;

      return (
        <Select
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={filter.value ?? undefined}
          onValueChange={(value) => {
            if (value) {
              onFilterUpdate(filter.filterId, {
                value,
              });
            }
          }}
        >
          <SelectTrigger
            id={inputId}
            aria-controls={inputListboxId}
            aria-label={`${columnMeta?.label} boolean filter`}
            className="w-full rounded"
          >
            <SelectValue placeholder={filter.value ? "True" : "False"} />
          </SelectTrigger>
          <SelectContent id={inputListboxId}>
            <SelectGroup>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }

    case "select":
    case "multiSelect": {
      const inputListboxId = `${inputId}-listbox`;

      const multiple = filter.variant === "multiSelect";
      let selectedValues: string[] | string | undefined;
      if (multiple) {
        selectedValues = Array.isArray(filter.value) ? filter.value : [];
      } else if (typeof filter.value === "string") {
        selectedValues = filter.value;
      } else {
        selectedValues = undefined;
      }

      return (
        <Faceted
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={selectedValues}
          onValueChange={(value) => {
            onFilterUpdate(filter.filterId, {
              value: value ?? "",
            });
          }}
          multiple={multiple}
        >
          <FacetedTrigger asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              aria-label={`${columnMeta?.label} filter value${multiple ? "s" : ""}`}
              variant="outline"
              className="w-full rounded font-normal"
            >
              <FacetedBadgeList
                options={columnMeta?.options}
                placeholder={
                  columnMeta?.placeholder ??
                  `Select option${multiple ? "s" : ""}...`
                }
              />
            </Button>
          </FacetedTrigger>
          <FacetedContent id={inputListboxId} className="w-[200px]">
            <FacetedInput
              aria-label={`Search ${columnMeta?.label} options`}
              placeholder={columnMeta?.placeholder ?? "Search options..."}
            />
            <FacetedList>
              <FacetedEmpty>No options found.</FacetedEmpty>
              <FacetedGroup>
                {columnMeta?.options?.map((option) => (
                  <FacetedItem key={option.value} value={option.value}>
                    {option.icon && <option.icon />}
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className="ml-auto font-mono text-xs">
                        {option.count}
                      </span>
                    )}
                  </FacetedItem>
                ))}
              </FacetedGroup>
            </FacetedList>
          </FacetedContent>
        </Faceted>
      );
    }

    case "date":
    case "dateRange": {
      const inputListboxId = `${inputId}-listbox`;

      const dateValue = Array.isArray(filter.value)
        ? filter.value.filter(Boolean)
        : [filter.value, filter.value].filter(Boolean);

      const startDate = dateValue[0]
        ? new Date(Number(dateValue[0]))
        : undefined;
      const endDate = dateValue[1] ? new Date(Number(dateValue[1])) : undefined;

      const isSameDate =
        startDate &&
        endDate &&
        startDate.toDateString() === endDate.toDateString();

      let displayValue = "Pick a date";
      if (
        filter.operator === "isBetween" &&
        dateValue.length === 2 &&
        !isSameDate
      ) {
        displayValue = `${formatDate(startDate, { month: "short" })} - ${formatDate(endDate, { month: "short" })}`;
      } else if (startDate) {
        displayValue = formatDate(startDate, { month: "short" });
      }

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              aria-label={`${columnMeta?.label} date filter`}
              variant="outline"
              className={cn(
                "h-8 w-full justify-start gap-2 rounded-md px-2.5 text-left font-normal",
                !filter.value && "text-muted-foreground"
              )}
            >
              <HugeiconsIcon
                icon={Calendar01Icon}
                strokeWidth={2}
                className="text-muted-foreground size-3.5 shrink-0"
              />
              <span className="truncate">{displayValue}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={inputListboxId}
            align="start"
            className="w-auto p-0"
          >
            {filter.operator === "isBetween" ? (
              <Calendar
                aria-label={`Select ${columnMeta?.label} date range`}
                autoFocus
                mode="range"
                selected={
                  dateValue.length === 2
                    ? {
                        from: new Date(Number(dateValue[0])),
                        to: new Date(Number(dateValue[1])),
                      }
                    : {
                        from: new Date(),
                        to: new Date(),
                      }
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date
                      ? [
                          date.from?.getTime().toString() ?? "",
                          date.to?.getTime().toString() ?? "",
                        ]
                      : [],
                  });
                }}
              />
            ) : (
              <Calendar
                aria-label={`Select ${columnMeta?.label} date`}
                autoFocus
                mode="single"
                selected={
                  dateValue[0] ? new Date(Number(dateValue[0])) : undefined
                }
                onSelect={(date) => {
                  onFilterUpdate(filter.filterId, {
                    value: date?.getTime().toString() ?? "",
                  });
                }}
              />
            )}
          </PopoverContent>
        </Popover>
      );
    }

    default:
      return null;
  }
}
