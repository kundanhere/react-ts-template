/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import * as React from "react";

import {
  Calendar01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  FilterIcon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Column, Table } from "@tanstack/react-table";
import { useQueryState } from "nuqs";

import { DataTableRangeFilter } from "@/components/data-table/data-table-range-filter";
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
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { getDefaultFilterOperator, getFilterOperators } from "@/lib/data-table";
import { formatDate } from "@/lib/format";
import { generateId } from "@/lib/id";
import { getFiltersStateParser } from "@/lib/parsers";
import { cn } from "@/lib/utils";
import type { FilterOperator, IExtendedColumnFilter } from "@/types/data-table";

const DEBOUNCE_MS = 300;
const THROTTLE_MS = 50;
const FILTER_SHORTCUT_KEY = "f";
const REMOVE_FILTER_SHORTCUTS = ["backspace", "delete"];

export interface IDataTableFilterMenuProps<TData> extends React.ComponentProps<
  typeof PopoverContent
> {
  table: Table<TData>;
  debounceMs?: number;
  throttleMs?: number;
  shallow?: boolean;
  disabled?: boolean;
}
export function DataTableFilterMenu<TData>({
  table,
  debounceMs = DEBOUNCE_MS,
  throttleMs = THROTTLE_MS,
  shallow = true,
  disabled,
  className,
  ...props
}: IDataTableFilterMenuProps<TData>) {
  const id = React.useId();

  const columns = React.useMemo(
    () =>
      table
        .getAllColumns()
        .filter((column) => column.columnDef.enableColumnFilter),
    [table]
  );

  const [open, setOpen] = React.useState(false);
  const [selectedColumn, setSelectedColumn] =
    React.useState<Column<TData> | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onOpenChange = React.useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      setTimeout(() => {
        setSelectedColumn(null);
        setInputValue("");
      }, 100);
    }
  }, []);

  const onInputKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        REMOVE_FILTER_SHORTCUTS.includes(event.key.toLowerCase()) &&
        !inputValue &&
        selectedColumn
      ) {
        event.preventDefault();
        setSelectedColumn(null);
      }
    },
    [inputValue, selectedColumn]
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

  const onFilterAdd = React.useCallback(
    (column: Column<TData>, value: string) => {
      if (!value.trim() && column.columnDef.meta?.variant !== "boolean") {
        return;
      }

      const filterValue =
        column.columnDef.meta?.variant === "multiSelect" ? [value] : value;

      const newFilter: IExtendedColumnFilter<TData> = {
        id: column.id as Extract<keyof TData, string>,
        value: filterValue,
        variant: column.columnDef.meta?.variant ?? "text",
        operator: getDefaultFilterOperator(
          column.columnDef.meta?.variant ?? "text"
        ),
        filterId: generateId({ length: 8 }),
      };

      debouncedSetFilters([...filters, newFilter]);
      setOpen(false);

      setTimeout(() => {
        setSelectedColumn(null);
        setInputValue("");
      }, 100);
    },
    [filters, debouncedSetFilters]
  );

  const onFilterRemove = React.useCallback(
    (filterId: string) => {
      const updatedFilters = filters.filter(
        (filter) => filter.filterId !== filterId
      );
      debouncedSetFilters(updatedFilters);
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    },
    [filters, debouncedSetFilters]
  );

  const onFilterUpdate = React.useCallback(
    (
      filterId: string,
      updates: Partial<Omit<IExtendedColumnFilter<TData>, "filterId">>
    ) => {
      debouncedSetFilters((prevFilters) => {
        const updatedFilters = prevFilters.map((filter) => {
          if (filter.filterId === filterId) {
            return { ...filter, ...updates } as IExtendedColumnFilter<TData>;
          }
          return filter;
        });
        return updatedFilters;
      });
    },
    [debouncedSetFilters]
  );

  const onFiltersReset = React.useCallback(() => {
    debouncedSetFilters([]);
  }, [debouncedSetFilters]);

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
    <div role="list" className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <DataTableFilterItem
          key={filter.filterId}
          filter={filter}
          filterItemId={`${id}-filter-${filter.filterId}`}
          columns={columns}
          onFilterUpdate={onFilterUpdate}
          onFilterRemove={onFilterRemove}
        />
      ))}
      {filters.length > 0 && (
        <Button
          aria-label="Reset all filters"
          variant="outline"
          size="icon"
          className="size-8"
          onClick={onFiltersReset}
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
        </Button>
      )}
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            aria-label="Open filter command menu"
            variant="outline"
            size={filters.length > 0 ? "icon" : "sm"}
            className={cn(filters.length > 0 && "size-8", "h-8 font-normal")}
            ref={triggerRef}
            onKeyDown={onTriggerKeyDown}
            disabled={disabled}
          >
            <HugeiconsIcon
              icon={FilterIcon}
              strokeWidth={2}
              className="text-muted-foreground"
            />
            {filters.length > 0 ? null : "Filter"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-full max-w-(--radix-popover-content-available-width) p-0",
            className
          )}
          {...props}
        >
          <Command loop className="[&_[cmdk-input-wrapper]_svg]:hidden">
            <CommandInput
              ref={inputRef}
              placeholder={
                selectedColumn
                  ? (selectedColumn.columnDef.meta?.label ?? selectedColumn.id)
                  : "Search fields..."
              }
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={onInputKeyDown}
            />
            <CommandList>
              {selectedColumn ? (
                <>
                  {selectedColumn.columnDef.meta?.options && (
                    <CommandEmpty>No options found.</CommandEmpty>
                  )}
                  <FilterValueSelector
                    column={selectedColumn}
                    value={inputValue}
                    onSelect={(value) => onFilterAdd(selectedColumn, value)}
                  />
                </>
              ) : (
                <>
                  <CommandEmpty>No fields found.</CommandEmpty>
                  <CommandGroup>
                    {columns.map((column) => (
                      <CommandItem
                        key={column.id}
                        value={column.id}
                        onSelect={() => {
                          setSelectedColumn(column);
                          setInputValue("");
                          requestAnimationFrame(() => {
                            inputRef.current?.focus();
                          });
                        }}
                      >
                        {column.columnDef.meta?.icon && (
                          <column.columnDef.meta.icon />
                        )}
                        <span className="truncate">
                          {column.columnDef.meta?.label ?? column.id}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export interface IDataTableFilterItemProps<TData> {
  filter: IExtendedColumnFilter<TData>;
  filterItemId: string;
  columns: Column<TData>[];
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<IExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  onFilterRemove: (filterId: string) => void;
}

function DataTableFilterItem<TData>({
  filter,
  filterItemId,
  columns,
  onFilterUpdate,
  onFilterRemove,
}: IDataTableFilterItemProps<TData>) {
  const [showFieldSelector, setShowFieldSelector] = React.useState(false);
  const [showOperatorSelector, setShowOperatorSelector] = React.useState(false);
  const [showValueSelector, setShowValueSelector] = React.useState(false);

  const column = columns.find((column) => column.id === filter.id);

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

  return (
    <div
      key={filter.filterId}
      role="group"
      id={filterItemId}
      className="bg-background flex h-8 items-center rounded-md"
      onKeyDown={onItemKeyDown}
    >
      <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="border-input dark:bg-input/30 rounded-none rounded-l-md border border-r-0 font-normal"
          >
            {columnMeta?.icon && (
              <columnMeta.icon className="text-muted-foreground" />
            )}
            {columnMeta?.label ?? column.id}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-0">
          <Command loop>
            <CommandInput placeholder="Search fields..." />
            <CommandList>
              <CommandEmpty>No fields found.</CommandEmpty>
              <CommandGroup>
                {columns.map((column) => (
                  <CommandItem
                    key={column.id}
                    value={column.id}
                    data-checked={column.id === filter.id}
                    onSelect={() => {
                      onFilterUpdate(filter.filterId, {
                        id: column.id as Extract<keyof TData, string>,
                        variant: column.columnDef.meta?.variant ?? "text",
                        operator: getDefaultFilterOperator(
                          column.columnDef.meta?.variant ?? "text"
                        ),
                        value: "",
                      });

                      setShowFieldSelector(false);
                    }}
                  >
                    {column.columnDef.meta?.icon && (
                      <column.columnDef.meta.icon />
                    )}
                    <span className="truncate">
                      {column.columnDef.meta?.label ?? column.id}
                    </span>
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
          className="h-8 rounded-none border-r-0 px-2.5 lowercase data-size:h-8 [&_svg]:hidden"
        >
          <SelectValue placeholder={filter.operator} />
        </SelectTrigger>
        <SelectContent id={operatorListboxId}>
          <SelectGroup>
            {filterOperators.map((operator) => (
              <SelectItem
                key={operator.value}
                className="lowercase"
                value={operator.value}
              >
                {operator.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {onFilterInputRender({
        filter,
        column,
        inputId,
        onFilterUpdate,
        showValueSelector,
        setShowValueSelector,
      })}
      <Button
        aria-controls={filterItemId}
        variant="ghost"
        className="border-input dark:bg-input/30 h-full rounded-none rounded-r-md border border-l-0 px-1.5 font-normal"
        onClick={() => onFilterRemove(filter.filterId)}
      >
        <HugeiconsIcon
          icon={Cancel01Icon}
          strokeWidth={2}
          className="size-3.5"
        />
      </Button>
    </div>
  );
}

export interface IFilterValueSelectorProps<TData> {
  column: Column<TData>;
  value: string;
  onSelect: (value: string) => void;
}
function FilterValueSelector<TData>({
  column,
  value,
  onSelect,
}: IFilterValueSelectorProps<TData>) {
  const variant = column.columnDef.meta?.variant ?? "text";

  switch (variant) {
    case "boolean":
      return (
        <CommandGroup>
          <CommandItem value="true" onSelect={() => onSelect("true")}>
            True
          </CommandItem>
          <CommandItem value="false" onSelect={() => onSelect("false")}>
            False
          </CommandItem>
        </CommandGroup>
      );

    case "select":
    case "multiSelect":
      return (
        <CommandGroup>
          {column.columnDef.meta?.options?.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              className="[&>svg:last-child]:hidden"
              onSelect={() => onSelect(option.value)}
            >
              {option.icon && <option.icon />}
              <span className="truncate">{option.label}</span>
              {option.count !== undefined && (
                <span className="ml-auto font-mono text-xs">
                  {option.count}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      );

    case "date":
    case "dateRange":
      return (
        <Calendar
          autoFocus
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={(date) => onSelect(date?.getTime().toString() ?? "")}
        />
      );

    default: {
      const isEmpty = !value.trim();

      return (
        <CommandGroup>
          <CommandItem
            value={value}
            onSelect={() => onSelect(value)}
            disabled={isEmpty}
          >
            {isEmpty ? (
              <>
                <HugeiconsIcon icon={TextFontIcon} strokeWidth={2} />
                <span>Type to add filter...</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={CheckmarkBadge01Icon} strokeWidth={2} />
                <span className="truncate">Filter by &quot;{value}&quot;</span>
              </>
            )}
          </CommandItem>
        </CommandGroup>
      );
    }
  }
}

function onFilterInputRender<TData>({
  filter,
  column,
  inputId,
  onFilterUpdate,
  showValueSelector,
  setShowValueSelector,
}: {
  filter: IExtendedColumnFilter<TData>;
  column: Column<TData>;
  inputId: string;
  onFilterUpdate: (
    filterId: string,
    updates: Partial<Omit<IExtendedColumnFilter<TData>, "filterId">>
  ) => void;
  showValueSelector: boolean;
  setShowValueSelector: (value: boolean) => void;
}) {
  if (filter.operator === "isEmpty" || filter.operator === "isNotEmpty") {
    return (
      <div
        id={inputId}
        role="status"
        aria-label={`${column.columnDef.meta?.label} filter is ${
          filter.operator === "isEmpty" ? "empty" : "not empty"
        }`}
        aria-live="polite"
        className="border-input text-muted-foreground dark:bg-input/30 h-full w-16 rounded-none border bg-transparent px-1.5 py-0.5"
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
            className="h-full min-w-52.5 gap-2 [&_input]:rounded-md [&_input]:px-2.5"
          />
        );
      }

      const isNumber =
        filter.variant === "number" || filter.variant === "range";

      return (
        <Input
          id={inputId}
          type={isNumber ? "number" : "text"}
          inputMode={isNumber ? "numeric" : undefined}
          placeholder={column.columnDef.meta?.placeholder ?? "Enter value..."}
          className="h-full w-24 rounded-none px-1.5"
          defaultValue={typeof filter.value === "string" ? filter.value : ""}
          onChange={(event) =>
            onFilterUpdate(filter.filterId, { value: event.target.value })
          }
        />
      );
    }

    case "boolean": {
      const inputListboxId = `${inputId}-listbox`;

      return (
        <Select
          open={showValueSelector}
          onOpenChange={setShowValueSelector}
          value={typeof filter.value === "string" ? filter.value : "true"}
          onValueChange={(value) => {
            if (value) {
              onFilterUpdate(filter.filterId, { value });
            }
          }}
        >
          <SelectTrigger
            id={inputId}
            aria-controls={inputListboxId}
            className="rounded-none bg-transparent px-1.5 py-0.5 [&_svg]:hidden"
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

      const options = column.columnDef.meta?.options ?? [];
      const isMultiSelect = filter.variant === "multiSelect";
      let selectedValues: string[] = [];
      if (Array.isArray(filter.value)) {
        selectedValues = filter.value;
      } else if (typeof filter.value === "string") {
        selectedValues = [filter.value];
      }

      const selectedOptions = options.filter((option) =>
        selectedValues.includes(option.value)
      );

      let placeholderText = "Select option...";
      if (isMultiSelect) {
        placeholderText = "Select options...";
      }

      return (
        <Popover open={showValueSelector} onOpenChange={setShowValueSelector}>
          <PopoverTrigger asChild>
            <Button
              id={inputId}
              aria-controls={inputListboxId}
              variant="ghost"
              className="border-input dark:bg-input/30 h-full min-w-16 rounded-none border px-1.5 font-normal"
            >
              {selectedOptions.length === 0 ? (
                placeholderText
              ) : (
                <>
                  <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                    {selectedOptions.map((option) => (
                      <span
                        key={option.value}
                        className="bg-background flex size-4 items-center justify-center rounded-full border border-dashed"
                      >
                        {option.icon && (
                          <option.icon className="text-muted-foreground size-2.5" />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="truncate">
                    {selectedOptions.length === 1
                      ? selectedOptions[0]?.label
                      : `${selectedOptions.length} selected`}
                  </span>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={inputListboxId}
            align="start"
            className="w-44 p-0"
          >
            <Command>
              <CommandInput placeholder={column.columnDef.meta?.label} />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);

                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        data-checked={isMultiSelect ? isSelected : undefined}
                        onSelect={() => {
                          let value: string[] | string;
                          if (isMultiSelect) {
                            value = isSelected
                              ? selectedValues.filter((v) => v !== option.value)
                              : [...selectedValues, option.value];
                          } else {
                            value = option.value;
                          }
                          onFilterUpdate(filter.filterId, { value });
                        }}
                      >
                        {option.icon && <option.icon />}
                        <span className="truncate">{option.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    case "date":
    case "dateRange": {
      const inputListboxId = `${inputId}-listbox`;

      let dateValue: string[] = [];
      if (Array.isArray(filter.value)) {
        dateValue = filter.value;
      } else if (typeof filter.value === "string") {
        dateValue = [filter.value];
      }

      const startDate = dateValue[0]
        ? new Date(Number(dateValue[0]))
        : undefined;
      const endDate = dateValue[1] ? new Date(Number(dateValue[1])) : undefined;

      const isSameDate =
        startDate &&
        endDate &&
        startDate.toDateString() === endDate.toDateString();

      let displayValue = "Pick date...";
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
              variant="ghost"
              className={cn(
                "border-input dark:bg-input/30 h-full min-w-37.5 justify-start gap-2 rounded-md border px-2.5 text-left font-normal",
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
