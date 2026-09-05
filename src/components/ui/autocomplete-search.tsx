"use client";

import * as React from "react";

import { LoaderCircle } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { type VariantProps, cva } from "class-variance-authority";
import { motion } from "motion/react";

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/ui/autocomplete";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// --- CVA Variants ---
export const autocompleteSearchVariants = cva("flex w-full", {
  variants: {
    orientation: {
      vertical: "flex-col items-start gap-2",
      horizontal: "flex-row items-center gap-3",
    },
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    size: "default",
  },
});

export const autocompleteItemVariants = cva(
  "relative flex w-full cursor-pointer items-center transition-colors rounded-md select-none",
  {
    variants: {
      variant: {
        default: "gap-2 px-2.5 py-2 text-sm",
        user: "gap-3 px-2.5 py-2",
        compact: "gap-1.5 px-2 py-1 text-xs",
        detailed: "gap-3 px-3 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// --- Types ---
export interface IAutocompleteOption {
  id?: string;
  value: string;
  label: string;
  description?: string;
  avatar?: string;
  initials?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  [key: string]: unknown;
}

export type AutocompleteItemData = string | object;

export interface IAutocompleteSearchProps<
  T extends AutocompleteItemData = AutocompleteItemData,
>
  extends
    VariantProps<typeof autocompleteSearchVariants>,
    VariantProps<typeof autocompleteItemVariants> {
  id?: string;
  name?: string;
  className?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  contentClassName?: string;
  itemClassName?: string;

  // Label configuration
  label?: React.ReactNode;
  showLabel?: boolean;
  labelClassName?: string;

  // Input configuration
  placeholder?: string;
  showClear?: boolean;
  showTrigger?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  kbd?: React.ReactNode;
  disabled?: boolean;

  // Data & async query
  items?: T[];
  onSearch?: (query: string) => Promise<T[]> | T[];
  debounceMs?: number;

  // Selection & Values
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  onSelect?: (item: T | null) => void;
  inputValue?: string;
  onInputValueChange?: (query: string) => void;

  // Key extractors
  getValue?: (item: T) => string;
  getLabel?: (item: T) => string;
  getDescription?: (item: T) => string | undefined;
  getAvatar?: (item: T) => string | undefined;

  // Messages & Custom Rendering
  emptyMessage?: React.ReactNode;
  loadingMessage?: React.ReactNode;
  errorMessage?: React.ReactNode;
  showCountStatus?: boolean;
  animateItems?: boolean;
  renderItem?: (
    item: T,
    meta: {
      index: number;
      value: string;
      label: string;
    }
  ) => React.ReactNode;
}

const SPRING_TRANSITION = {
  type: "spring",
  bounce: 0.15,
  duration: 0.3,
} as const;

function normalizeOption<T extends AutocompleteItemData>(
  item: T,
  extractors?: {
    getValue?: (item: T) => string;
    getLabel?: (item: T) => string;
    getDescription?: (item: T) => string | undefined;
    getAvatar?: (item: T) => string | undefined;
  }
): IAutocompleteOption {
  if (typeof item === "string") {
    return {
      id: item,
      value: item,
      label: item,
    };
  }

  const record = item as Record<string, unknown>;

  const val =
    extractors?.getValue?.(item) ??
    (record.value as string | undefined) ??
    (record.id as string | undefined) ??
    (record.name as string | undefined) ??
    "";

  const lbl =
    extractors?.getLabel?.(item) ??
    (record.label as string | undefined) ??
    (record.name as string | undefined) ??
    (record.title as string | undefined) ??
    val;

  const desc =
    extractors?.getDescription?.(item) ??
    (record.description as string | undefined) ??
    (record.position as string | undefined) ??
    (record.subtitle as string | undefined) ??
    (record.email as string | undefined);

  const av =
    extractors?.getAvatar?.(item) ??
    (record.avatar as string | undefined) ??
    (record.image as string | undefined) ??
    (record.src as string | undefined);

  const init =
    (record.initials as string | undefined) ??
    lbl
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return {
    id: (record.id as string | undefined) ?? val,
    value: val,
    label: lbl,
    description: desc,
    avatar: av,
    initials: init,
    icon: record.icon as React.ReactNode,
    disabled: Boolean(record.disabled),
    ...record,
  };
}

export function AutocompleteSearch<
  T extends AutocompleteItemData = AutocompleteItemData,
>({
  id: propId,
  name,
  className,
  wrapperClassName,
  inputClassName,
  contentClassName,
  itemClassName,
  orientation = "vertical",
  size = "default",
  variant = "default",
  label,
  showLabel,
  labelClassName,
  placeholder = "Search...",
  showClear = true,
  showTrigger = false,
  showIcon = true,
  icon,
  kbd,
  disabled = false,
  items: staticItems,
  onSearch,
  debounceMs = 300,
  value,
  onValueChange,
  onSelect,
  inputValue: controlledInputValue,
  onInputValueChange,
  getValue,
  getLabel,
  getDescription,
  getAvatar,
  emptyMessage,
  loadingMessage,
  errorMessage,
  showCountStatus = false,
  animateItems = true,
  renderItem,
}: IAutocompleteSearchProps<T>) {
  const generatedId = React.useId();
  const id = propId ?? generatedId;

  const extractors = React.useMemo(
    () => ({ getValue, getLabel, getDescription, getAvatar }),
    [getValue, getLabel, getDescription, getAvatar]
  );

  const [uncontrolledQuery, setUncontrolledQuery] = React.useState("");
  const query = controlledInputValue ?? uncontrolledQuery;

  const [isLoading, setIsLoading] = React.useState(false);
  const [asyncResults, setAsyncResults] = React.useState<T[]>([]);
  const [searchError, setSearchError] = React.useState<string | null>(null);

  const shouldShowLabel = showLabel ?? Boolean(label);

  const handleQueryChange = React.useCallback(
    (newQuery: string) => {
      if (controlledInputValue === undefined) {
        setUncontrolledQuery(newQuery);
      }
      onInputValueChange?.(newQuery);
    },
    [controlledInputValue, onInputValueChange]
  );

  // Handle Async Search or Static Filtering
  React.useEffect(() => {
    if (!onSearch) return;

    if (!query.trim()) {
      setAsyncResults([]);
      setIsLoading(false);
      setSearchError(null);
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        const results = await onSearch(query);
        if (!cancelled) {
          setAsyncResults(results);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof Error ? err.message : "Failed to fetch results";
          setSearchError(msg);
          setAsyncResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, onSearch, debounceMs]);

  // Determine current active item list
  const currentItems = React.useMemo(() => {
    if (onSearch) {
      return asyncResults;
    }
    if (!staticItems) {
      return [];
    }
    if (!query.trim()) {
      return staticItems;
    }
    const lower = query.toLowerCase();
    return staticItems.filter((item) => {
      const opt = normalizeOption(item, extractors);
      const matchLabel = opt.label.toLowerCase().includes(lower);
      const matchDesc = opt.description?.toLowerCase().includes(lower);
      return matchLabel || matchDesc;
    });
  }, [onSearch, asyncResults, staticItems, query, extractors]);

  // Construct status message
  let statusNode: React.ReactNode = null;
  if (isLoading) {
    statusNode = loadingMessage ?? (
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          strokeWidth={1.5}
          size={14}
          icon={LoaderCircle}
          className="text-muted-foreground size-3.5 animate-spin"
        />
        <span>Searching...</span>
      </div>
    );
  } else if (searchError) {
    statusNode = errorMessage ?? (
      <span className="text-destructive">{searchError}</span>
    );
  } else if (query && currentItems.length === 0) {
    statusNode = emptyMessage ?? `No results found for "${query}"`;
  } else if (showCountStatus && currentItems.length > 0) {
    statusNode = `${currentItems.length} result${currentItems.length === 1 ? "" : "s"} found`;
  }

  const handleSelect = React.useCallback(
    (itemVal: string | null) => {
      onValueChange?.(itemVal);
      if (!itemVal) {
        onSelect?.(null);
        return;
      }
      const matched = currentItems.find((it) => {
        const opt = normalizeOption(it, extractors);
        return opt.value === itemVal;
      });
      onSelect?.(matched ?? null);
    },
    [currentItems, onSelect, onValueChange, extractors]
  );

  return (
    <div className={cn("w-full", wrapperClassName)}>
      <Autocomplete
        value={value}
        onValueChange={handleSelect}
        inputValue={query}
        onInputValueChange={handleQueryChange}
        disabled={disabled}
      >
        <div
          className={cn(
            autocompleteSearchVariants({ orientation, size }),
            className
          )}
        >
          {shouldShowLabel && label && (
            <Label htmlFor={id} className={cn("select-none", labelClassName)}>
              {label}
            </Label>
          )}

          <AutocompleteInput
            id={id}
            name={name}
            placeholder={placeholder}
            showClear={showClear}
            showTrigger={showTrigger}
            showIcon={showIcon}
            icon={icon}
            kbd={kbd}
            disabled={disabled}
            className={inputClassName}
          />
        </div>

        {query && (
          <AutocompleteContent className={contentClassName}>
            {statusNode && (
              <AutocompleteStatus>{statusNode}</AutocompleteStatus>
            )}
            <AutocompleteList>
              {currentItems.map((item, idx) => {
                const opt = normalizeOption(item, extractors);
                const itemKey = opt.id ?? opt.value ?? String(idx);

                let content: React.ReactNode = null;
                if (renderItem) {
                  content = renderItem(item, {
                    index: idx,
                    value: opt.value,
                    label: opt.label,
                  });
                } else if (variant === "user") {
                  content = (
                    <div className="flex w-full items-center gap-2.5">
                      <Avatar className="size-8 shrink-0">
                        {opt.avatar && (
                          <AvatarImage src={opt.avatar} alt={opt.label} />
                        )}
                        <AvatarFallback className="text-xs">
                          {opt.initials ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {opt.label}
                        </p>
                        {opt.description && (
                          <p className="text-muted-foreground truncate text-xs">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                } else if (variant === "detailed") {
                  content = (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {opt.icon}
                          <p className="truncate text-sm font-medium">
                            {opt.label}
                          </p>
                        </div>
                        {opt.description && (
                          <p className="text-muted-foreground truncate text-xs">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  // "default" or "compact"
                  content = (
                    <div className="flex w-full items-center gap-2">
                      {opt.icon}
                      <span className="truncate">{opt.label}</span>
                      {opt.description && (
                        <span className="text-muted-foreground ml-auto truncate text-xs">
                          {opt.description}
                        </span>
                      )}
                    </div>
                  );
                }

                const itemInner = animateItems ? (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING_TRANSITION, delay: idx * 0.03 }}
                    className="w-full"
                  >
                    {content}
                  </motion.div>
                ) : (
                  content
                );

                return (
                  <AutocompleteItem
                    key={itemKey}
                    value={opt.value}
                    label={opt.label}
                    disabled={opt.disabled}
                    className={cn(
                      autocompleteItemVariants({ variant }),
                      itemClassName
                    )}
                  >
                    {itemInner}
                  </AutocompleteItem>
                );
              })}
            </AutocompleteList>
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  );
}
