import React, {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { CircleXIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createPortal } from "react-dom";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// -- Types --
interface IItemMeta {
  value: string;
  label: string;
  disabled?: boolean;
}

interface IAutocompleteCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  selectedValue: string | null;
  selectedLabel: string | null;
  highlightedValue: string | null;
  setHighlightedValue: (v: string | null) => void;
  disabled: boolean;
  inputWrapperRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
  popupRef: React.RefObject<HTMLDivElement>;
  itemsRef: React.MutableRefObject<IItemMeta[]>;
  registerItem: (item: IItemMeta) => void;
  unregisterItem: (value: string) => void;
  selectItem: (value: string, label: string) => void;
  clearSelection: () => void;
  highlightNext: () => void;
  highlightPrev: () => void;
  selectHighlighted: () => void;
  onValueChange?: (v: string | null) => void;
}

const AutocompleteCtx = createContext<IAutocompleteCtx | null>(null);

const useAc = (): IAutocompleteCtx => {
  const ctx = useContext(AutocompleteCtx);
  if (!ctx) throw new Error("Must be used inside <Autocomplete>");
  return ctx;
};

// -- Root --
export interface IAutocompleteProps {
  children: ReactNode;
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (v: string | null) => void;
  defaultInputValue?: string;
  inputValue?: string;
  onInputValueChange?: (v: string) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  disabled?: boolean;
}

const Autocomplete = ({
  children,
  defaultValue,
  value: valueProp,
  onValueChange,
  defaultInputValue = "",
  inputValue: inputValueProp,
  onInputValueChange,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  disabled = false,
}: IAutocompleteProps) => {
  const [openState, setOpenState] = useState(defaultOpen);
  const [inputValueState, setInputValueState] = useState(defaultInputValue);
  const [selectedValue, setSelectedValue] = useState<string | null>(
    defaultValue ?? null
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  const itemsRef = useRef<IItemMeta[]>([]);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const isOpen = openProp !== undefined ? openProp : openState;
  const resolvedValue = valueProp !== undefined ? valueProp : selectedValue;
  const resolvedInputValue =
    inputValueProp !== undefined ? inputValueProp : inputValueState;

  const setOpen = useCallback(
    (v: boolean) => {
      if (openProp === undefined) setOpenState(v);
      onOpenChange?.(v);
    },
    [openProp, onOpenChange]
  );

  const setInputValue = useCallback(
    (v: string) => {
      if (inputValueProp === undefined) {
        setInputValueState(v);
      }
      onInputValueChange?.(v);
    },
    [inputValueProp, onInputValueChange]
  );

  const registerItem = useCallback((item: IItemMeta) => {
    if (!itemsRef.current.some((i) => i.value === item.value)) {
      itemsRef.current = [...itemsRef.current, item];
    }
  }, []);

  const unregisterItem = useCallback((value: string) => {
    itemsRef.current = itemsRef.current.filter((i) => i.value !== value);
  }, []);

  const selectItem = useCallback(
    (value: string, label: string) => {
      if (valueProp === undefined) setSelectedValue(value);
      setSelectedLabel(label);
      setInputValue(label);
      setOpen(false);
      setHighlightedValue(null);
      onValueChange?.(value);
    },
    [valueProp, setInputValue, setOpen, onValueChange]
  );

  const clearSelection = useCallback(() => {
    if (valueProp === undefined) setSelectedValue(null);
    setSelectedLabel(null);
    setInputValue("");
    onValueChange?.(null);
    inputRef.current?.focus();
  }, [valueProp, setInputValue, onValueChange]);

  const highlightNext = useCallback(() => {
    const items = itemsRef.current.filter((i) => !i.disabled);
    if (!items.length) return;
    const idx = items.findIndex((i) => i.value === highlightedValue);
    setHighlightedValue(items[(idx + 1) % items.length].value);
  }, [highlightedValue]);

  const highlightPrev = useCallback(() => {
    const items = itemsRef.current.filter((i) => !i.disabled);
    if (!items.length) return;
    const idx = items.findIndex((i) => i.value === highlightedValue);
    setHighlightedValue(items[(idx - 1 + items.length) % items.length].value);
  }, [highlightedValue]);

  const selectHighlighted = useCallback(() => {
    if (!highlightedValue) return;
    const item = itemsRef.current.find((i) => i.value === highlightedValue);
    if (item && !item.disabled) selectItem(item.value, item.label);
  }, [highlightedValue, selectItem]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        !popupRef.current?.contains(t) &&
        !inputWrapperRef.current?.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, setOpen]);

  const contextValue = useMemo(
    () => ({
      open: isOpen,
      setOpen,
      inputValue: resolvedInputValue,
      setInputValue,
      selectedValue: resolvedValue ?? null,
      selectedLabel,
      highlightedValue,
      setHighlightedValue,
      disabled,
      inputWrapperRef,
      inputRef,
      popupRef,
      itemsRef,
      registerItem,
      unregisterItem,
      selectItem,
      clearSelection,
      highlightNext,
      highlightPrev,
      selectHighlighted,
      onValueChange,
    }),
    [
      isOpen,
      setOpen,
      resolvedInputValue,
      setInputValue,
      resolvedValue,
      selectedLabel,
      highlightedValue,
      setHighlightedValue,
      disabled,
      registerItem,
      unregisterItem,
      selectItem,
      clearSelection,
      highlightNext,
      highlightPrev,
      selectHighlighted,
      onValueChange,
    ]
  );

  return (
    <AutocompleteCtx.Provider value={contextValue}>
      {children}
    </AutocompleteCtx.Provider>
  );
};

// -- Value --
const AutocompleteValue = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  const { selectedLabel } = useAc();
  return (
    <span data-slot="autocomplete-value" className={className} {...props}>
      {selectedLabel}
    </span>
  );
};

// -- Input --
export interface IAutocompleteInputProps extends Omit<
  React.ComponentProps<"input">,
  "value" | "onChange"
> {
  showClear?: boolean;
  showTrigger?: boolean;
  showIcon?: boolean;
  icon?: React.ReactNode;
  kbd?: React.ReactNode;
  wrapperClassName?: string;
}

const AutocompleteInput = React.forwardRef<
  HTMLInputElement,
  IAutocompleteInputProps
>(
  (
    {
      className,
      wrapperClassName,
      showClear = false,
      showTrigger = false,
      showIcon = true,
      icon,
      kbd,
      disabled: propDisabled,
      onFocus,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const {
      open,
      setOpen,
      inputValue,
      setInputValue,
      selectedValue,
      clearSelection,
      inputWrapperRef,
      inputRef,
      disabled: ctxDisabled,
      highlightNext,
      highlightPrev,
      selectHighlighted,
    } = useAc();

    const disabled = propDisabled ?? ctxDisabled;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) setOpen(true);
          highlightNext();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!open) setOpen(true);
          highlightPrev();
          break;
        case "Enter":
          e.preventDefault();
          if (open) selectHighlighted();
          break;
        case "Escape":
          e.preventDefault();
          setOpen(false);
          break;
        case "Tab":
          setOpen(false);
          break;
      }
      onKeyDown?.(e);
    };

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    let resolvedKbd: React.ReactNode = null;
    if (kbd) {
      resolvedKbd = typeof kbd === "string" ? <Kbd>{kbd}</Kbd> : kbd;
    } else if (showTrigger) {
      resolvedKbd = <Kbd>⇧ ⌘ K</Kbd>;
    }

    const hasClear = showClear && Boolean(selectedValue || inputValue);
    const hasEndAddon = Boolean(hasClear || resolvedKbd);

    return (
      <InputGroup
        ref={inputWrapperRef}
        className={cn("w-full", wrapperClassName)}
      >
        <InputGroupInput
          ref={inputRef}
          data-autocomplete-slot="input"
          role="combobox"
          aria-controls="autocomplete-list"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          disabled={disabled}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={(e) => {
            onFocus?.(e);
          }}
          onKeyDown={handleKeyDown}
          className={className}
          {...props}
        />
        {showIcon && (
          <InputGroupAddon>
            {icon ?? (
              <HugeiconsIcon
                icon={Search01Icon}
                className="text-muted-foreground"
              />
            )}
          </InputGroupAddon>
        )}
        {hasEndAddon && (
          <InputGroupAddon align="inline-end">
            {hasClear ? (
              <button
                type="button"
                data-slot="autocomplete-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                aria-label="Clear"
                className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors focus-visible:outline-none"
              >
                <HugeiconsIcon icon={CircleXIcon} className="size-3.5" />
              </button>
            ) : (
              resolvedKbd
            )}
          </InputGroupAddon>
        )}
      </InputGroup>
    );
  }
);
AutocompleteInput.displayName = "AutocompleteInput";

// -- Status --
const AutocompleteStatus = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="autocomplete-status"
    className={cn(
      "text-muted-foreground px-2 py-1.5 text-sm empty:m-0 empty:p-0",
      className
    )}
    {...props}
  />
);

// -- Portal --
interface IAutocompletePortalProps {
  children: ReactNode;
  container?: HTMLElement | null;
}

const AutocompletePortal = ({
  children,
  container,
}: IAutocompletePortalProps) => {
  const [mounted, setMounted] = useState(() => typeof document !== "undefined");
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
};

// -- Backdrop --
const AutocompleteBackdrop = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="autocomplete-backdrop"
    className={cn("fixed inset-0 z-50", className)}
    {...props}
  />
);

// -- Positioner --
interface IAutocompletePositionerProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "end" | "center";
  sideOffset?: number;
  alignOffset?: number;
  side?: "top" | "bottom";
  anchor?: React.RefObject<HTMLElement>;
}

const AutocompletePositioner = ({
  className,
  children,
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  side = "bottom",
  anchor: anchorProp,
  style: styleProp,
  ...props
}: IAutocompletePositionerProps) => {
  const { inputWrapperRef, open } = useAc();
  const positionerRef = useRef<HTMLDivElement>(null);
  const anchorRef = anchorProp ?? inputWrapperRef;

  const calculateStyle = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const positionerEl = positionerRef.current;
    const popupHeight = positionerEl?.offsetHeight ?? 240;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let computedSide = side;
    if (
      side === "bottom" &&
      spaceBelow < popupHeight &&
      spaceAbove > spaceBelow
    ) {
      computedSide = "top";
    } else if (
      side === "top" &&
      spaceAbove < popupHeight &&
      spaceBelow > spaceAbove
    ) {
      computedSide = "bottom";
    }

    const s: React.CSSProperties = {
      position: "fixed",
      width: rect.width,
    };

    if (computedSide === "bottom") {
      s.top = rect.bottom + sideOffset;
    } else {
      s.bottom = window.innerHeight - rect.top + sideOffset;
    }

    if (align === "start") {
      s.left = rect.left + alignOffset;
    } else if (align === "end") {
      s.right = window.innerWidth - rect.right + alignOffset;
    } else {
      s.left = rect.left + rect.width / 2 + alignOffset;
      s.transform = "translateX(-50%)";
    }

    return s;
  }, [anchorRef, side, sideOffset, align, alignOffset]);

  const [posStyle, setPosStyle] = useState<React.CSSProperties>(
    () => calculateStyle() ?? { position: "fixed", visibility: "hidden" }
  );

  const updatePosition = useCallback(() => {
    const s = calculateStyle();
    if (s) {
      setPosStyle(s);
    }
  }, [calculateStyle]);

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    const anchorEl = anchorRef.current;
    const positionerEl = positionerRef.current;
    if (!anchorEl) return;

    updatePosition();

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updatePosition())
        : null;

    if (ro) {
      ro.observe(anchorEl);
      if (positionerEl) ro.observe(positionerEl);
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    let frameId: number;
    let prevRect = anchorEl.getBoundingClientRect();

    const checkPosition = () => {
      const currentRect = anchorEl.getBoundingClientRect();
      if (
        currentRect.top !== prevRect.top ||
        currentRect.left !== prevRect.left ||
        currentRect.width !== prevRect.width ||
        currentRect.height !== prevRect.height
      ) {
        prevRect = currentRect;
        updatePosition();
      }
      frameId = requestAnimationFrame(checkPosition);
    };

    frameId = requestAnimationFrame(checkPosition);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      cancelAnimationFrame(frameId);
    };
  }, [open, updatePosition, anchorRef]);

  return (
    <div
      ref={positionerRef}
      data-slot="autocomplete-positioner"
      className={cn("fixed z-50 outline-none", className)}
      style={{ ...posStyle, ...styleProp }}
      {...props}
    >
      {children}
    </div>
  );
};

// -- Content --
export interface IAutocompleteContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: IAutocompletePositionerProps["align"];
  sideOffset?: IAutocompletePositionerProps["sideOffset"];
  alignOffset?: IAutocompletePositionerProps["alignOffset"];
  side?: IAutocompletePositionerProps["side"];
  anchor?: IAutocompletePositionerProps["anchor"];
  showBackdrop?: boolean;
}

const AutocompleteContent = ({
  className,
  children,
  showBackdrop = false,
  align = "start",
  sideOffset = 4,
  alignOffset = 0,
  side = "bottom",
  anchor,
  ...props
}: IAutocompleteContentProps) => {
  const { open, popupRef } = useAc();

  if (!open) return null;

  return (
    <AutocompletePortal>
      <div ref={popupRef}>
        {showBackdrop && <AutocompleteBackdrop />}
        <AutocompletePositioner
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          side={side}
          anchor={anchor}
        >
          <div
            data-slot="autocomplete-popup"
            className={cn(
              "text-popover-foreground ring-foreground/10 bg-background flex max-h-96 w-full flex-col overflow-hidden rounded-lg py-0.5 shadow-md ring-1",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-300 ease-out",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </AutocompletePositioner>
      </div>
    </AutocompletePortal>
  );
};

// -- List --
interface IAutocompleteListProps extends React.HTMLAttributes<HTMLDivElement> {}

const AutocompleteList = ({
  id = "autocomplete-list",
  className,
  ...props
}: IAutocompleteListProps) => (
  <div
    id={id}
    data-slot="autocomplete-list"
    role="listbox"
    className={cn(
      "max-h-96 scroll-py-1 overflow-y-auto overscroll-contain not-empty:px-1 not-empty:py-1",
      "scrollbar-thin [scrollbar-color:var(--muted-foreground)_transparent]",
      "[&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent",
      "[&::-webkit-scrollbar-button]:hidden",
      "[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full",
      "[&::-webkit-scrollbar-thumb:hover]:bg-muted-foreground/60",
      className
    )}
    {...props}
  />
);

// -- Collection --
const AutocompleteCollection = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="autocomplete-collection" className={className} {...props} />
);

// -- Row --

const AutocompleteRow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="autocomplete-row"
    className={cn("flex items-center gap-2", className)}
    {...props}
  />
);

// -- Item --
interface IAutocompleteItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label?: string;
  disabled?: boolean;
}

const AutocompleteItem = ({
  className,
  value,
  label: labelProp,
  disabled = false,
  children,
  ...props
}: IAutocompleteItemProps) => {
  const {
    selectedValue,
    highlightedValue,
    setHighlightedValue,
    selectItem,
    registerItem,
    unregisterItem,
  } = useAc();
  const itemRef = useRef<HTMLDivElement>(null);

  const label = labelProp ?? (typeof children === "string" ? children : value);

  useEffect(() => {
    registerItem({ value, label, disabled });
    return () => unregisterItem(value);
  }, [value, label, disabled, registerItem, unregisterItem]);

  const isHighlighted = highlightedValue === value;
  const isSelected = selectedValue === value;

  useEffect(() => {
    if (isHighlighted) {
      itemRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isHighlighted]);

  return (
    <div
      ref={itemRef}
      role="option"
      tabIndex={disabled ? -1 : 0}
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-slot="autocomplete-item"
      data-highlighted={isHighlighted || undefined}
      data-selected={isSelected || undefined}
      data-disabled={disabled || undefined}
      onMouseEnter={() => !disabled && setHighlightedValue(value)}
      onMouseLeave={() => setHighlightedValue(null)}
      onClick={() => {
        if (!disabled) selectItem(value, label);
      }}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          selectItem(value, label);
        }
      }}
      className={cn(
        "text-foreground data-highlighted:text-foreground data-highlighted:before:bg-accent relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden transition-colors select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:relative data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-0 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([role=img]):not([class*=text-])]:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// -- Group --
const AutocompleteGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="autocomplete-group"
    role="group"
    className={className}
    {...props}
  />
);

// -- GroupLabel --

const AutocompleteGroupLabel = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="autocomplete-group-label"
    className={cn(
      "text-muted-foreground px-1.5 py-1 text-xs font-medium",
      className
    )}
    {...props}
  />
);

// -- Empty --
const AutocompleteEmpty = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="autocomplete-empty"
    className={cn(
      "text-muted-foreground px-2 py-1.5 text-center text-sm empty:m-0 empty:p-0",
      className
    )}
    {...props}
  />
);

// -- Clear --
export interface IAutocompleteClearProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AutocompleteClear = ({
  className,
  ...props
}: IAutocompleteClearProps) => {
  const { clearSelection, selectedValue, inputValue } = useAc();

  if (!selectedValue && !inputValue) return null;

  return (
    <button
      type="button"
      data-slot="autocomplete-clear"
      onClick={clearSelection}
      aria-label="Clear"
      className={cn(
        "ring-offset-background focus:ring-ring absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer opacity-70 transition-opacity hover:opacity-100 focus:ring-0 focus:ring-offset-0 focus:outline-none disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={CircleXIcon} size={14} />
    </button>
  );
};

// -- Trigger --
export interface IAutocompleteTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const AutocompleteTrigger = ({
  className,
  ...props
}: IAutocompleteTriggerProps) => {
  const { open, setOpen } = useAc();

  return (
    <button
      type="button"
      data-slot="autocomplete-trigger"
      onClick={() => setOpen(!open)}
      aria-label="Toggle suggestions"
      className={cn(
        "focus:ring-ring ring-offset-background absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer focus:ring-0 focus:ring-offset-0 focus:outline-none disabled:pointer-events-none has-[+[data-slot=autocomplete-clear]]:hidden",
        className
      )}
      {...props}
    >
      <HugeiconsIcon icon={Search01Icon} size={14} className="opacity-70" />
    </button>
  );
};

// -- Arrow --
const AutocompleteArrow = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="autocomplete-arrow" className={className} {...props} />
);

// -- Separator --
const AutocompleteSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHRElement>) => (
  <hr
    data-slot="autocomplete-separator"
    className={cn("bg-border my-1.5 h-px border-none", className)}
    {...props}
  />
);

export {
  Autocomplete,
  AutocompleteValue,
  AutocompleteTrigger,
  AutocompleteInput,
  AutocompleteStatus,
  AutocompletePortal,
  AutocompleteBackdrop,
  AutocompletePositioner,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteCollection,
  AutocompleteRow,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteClear,
  AutocompleteArrow,
  AutocompleteSeparator,
};
