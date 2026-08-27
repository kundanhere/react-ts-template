import * as React from "react";

import { Slot as SlotPrimitive } from "@radix-ui/react-slot";
import * as ReactDOM from "react-dom";

import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { useAsRef } from "@/hooks/use-as-ref";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useComposedRefs } from "@/lib/compose-refs";
import { cn } from "@/lib/utils";

const ROOT_NAME = "ActionBar";
const GROUP_NAME = "ActionBarGroup";
const ITEM_NAME = "ActionBarItem";
const CLOSE_NAME = "ActionBarClose";
const SEPARATOR_NAME = "ActionBarSeparator";
const ITEM_SELECT = "actionbar.itemSelect";
const ENTRY_FOCUS = "actionbarFocusGroup.onEntryFocus";
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

type Direction = "ltr" | "rtl";
type Orientation = "horizontal" | "vertical";

export interface IDivProps extends React.ComponentProps<"div"> {
  asChild?: boolean;
}

type ItemElement = HTMLButtonElement;

function focusFirst(
  candidates: React.RefObject<HTMLElement | null>[],
  preventScroll = false
) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidateRef of candidates) {
    const candidate = candidateRef.current;
    if (candidate) {
      if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
      candidate.focus({ preventScroll });
      if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
  }
}

function wrapArray<T>(array: T[], startIndex: number) {
  return array.map<T>(
    (_, index) => array[(startIndex + index) % array.length] as T
  );
}

function getDirectionAwareKey(key: string, dir?: Direction) {
  if (dir !== "rtl") return key;
  if (key === "ArrowLeft") return "ArrowRight";
  if (key === "ArrowRight") return "ArrowLeft";
  return key;
}

export interface IItemData {
  id: string;
  ref: React.RefObject<ItemElement | null>;
  disabled: boolean;
}

export interface IActionBarContextValue {
  onOpenChange?: (open: boolean) => void;
  dir: Direction;
  orientation: Orientation;
  loop: boolean;
}

const ActionBarContext = React.createContext<IActionBarContextValue | null>(
  null
);

function useActionBarContext(consumerName: string) {
  const context = React.useContext(ActionBarContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

export interface IFocusContextValue {
  tabStopId: string | null;
  onItemFocus: (tabStopId: string) => void;
  onItemShiftTab: () => void;
  onFocusableItemAdd: () => void;
  onFocusableItemRemove: () => void;
  onItemRegister: (item: IItemData) => void;
  onItemUnregister: (id: string) => void;
  getItems: () => IItemData[];
}

const FocusContext = React.createContext<IFocusContextValue | null>(null);

function useFocusContext(consumerName: string) {
  const context = React.useContext(FocusContext);
  if (!context) {
    throw new Error(
      `\`${consumerName}\` must be used within \`FocusProvider\``
    );
  }
  return context;
}

export interface IActionBarProps extends IDivProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  side?: "top" | "bottom";
  sideOffset?: number;
  portalContainer?: Element | DocumentFragment | null;
  dir?: Direction;
  orientation?: Orientation;
  loop?: boolean;
}

const ActionBar = React.forwardRef<HTMLDivElement, IActionBarProps>(
  (props, ref) => {
    const {
      open = false,
      onOpenChange,
      onEscapeKeyDown,
      side = "bottom",
      alignOffset = 0,
      align = "center",
      sideOffset = 16,
      portalContainer: portalContainerProp,
      dir: dirProp,
      orientation = "horizontal",
      loop = true,
      className,
      style,
      asChild,
      ...rootProps
    } = props;

    const [mounted, setMounted] = React.useState(false);

    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const composedRef = useComposedRefs(ref as any, rootRef);

    const propsRef = useAsRef({
      onEscapeKeyDown,
      onOpenChange,
    });

    const dir = useDirection(dirProp);

    React.useLayoutEffect(() => {
      setMounted(true);
    }, []);

    React.useEffect(() => {
      if (!open) return;

      const ownerDocument = rootRef.current?.ownerDocument ?? document;

      function onKeyDown(event: KeyboardEvent) {
        if (event.key === "Escape") {
          propsRef.current.onEscapeKeyDown?.(event);
          if (!event.defaultPrevented) {
            propsRef.current.onOpenChange?.(false);
          }
        }
      }

      ownerDocument.addEventListener("keydown", onKeyDown);
      return () => ownerDocument.removeEventListener("keydown", onKeyDown);
    }, [open, propsRef]);

    const contextValue = React.useMemo<IActionBarContextValue>(
      () => ({
        onOpenChange,
        dir,
        orientation,
        loop,
      }),
      [onOpenChange, dir, orientation, loop]
    );

    const portalContainer =
      portalContainerProp ?? (mounted ? globalThis.document?.body : null);

    if (!portalContainer || !open) return null;

    const RootPrimitive = asChild ? SlotPrimitive : "div";

    return (
      <ActionBarContext.Provider value={contextValue}>
        {ReactDOM.createPortal(
          <RootPrimitive
            role="toolbar"
            aria-orientation={orientation}
            data-slot="action-bar"
            data-side={side}
            data-align={align}
            data-orientation={orientation}
            dir={dir}
            {...rootProps}
            ref={composedRef as any}
            className={cn(
              "bg-card fixed z-50 rounded-lg border shadow-lg outline-none",
              "fade-in-0 zoom-in-95 animate-in duration-250 [animation-timing-function:cubic-bezier(0.16,1,0.3,1)]",
              "data-[side=bottom]:slide-in-from-bottom-4 data-[side=top]:slide-in-from-top-4",
              "motion-reduce:animate-none motion-reduce:transition-none",
              orientation === "horizontal"
                ? "flex flex-row items-center gap-2 px-2 py-1.5"
                : "flex flex-col items-start gap-2 px-1.5 py-2",
              className
            )}
            style={{
              [side]: `${sideOffset}px`,
              ...(align === "center" && {
                left: "50%",
                translate: "-50% 0",
              }),
              ...(align === "start" && { left: `${alignOffset}px` }),
              ...(align === "end" && { right: `${alignOffset}px` }),
              ...style,
            }}
          />,
          portalContainer
        )}
      </ActionBarContext.Provider>
    );
  }
);
ActionBar.displayName = "ActionBar";

const ActionBarSelection = React.forwardRef<HTMLDivElement, IDivProps>(
  (props, ref) => {
    const { className, asChild, ...selectionProps } = props;

    const SelectionPrimitive = asChild ? SlotPrimitive : "div";

    return (
      <SelectionPrimitive
        ref={ref as any}
        data-slot="action-bar-selection"
        {...selectionProps}
        className={cn(
          "flex items-center gap-1 rounded-sm border px-2 py-1 text-sm font-medium tabular-nums",
          className
        )}
      />
    );
  }
);
ActionBarSelection.displayName = "ActionBarSelection";

const ActionBarGroup = React.forwardRef<HTMLDivElement, IDivProps>(
  (props, ref) => {
    const {
      onBlur: onBlurProp,
      onFocus: onFocusProp,
      onMouseDown: onMouseDownProp,
      className,
      asChild,
      ...groupProps
    } = props;

    const [tabStopId, setTabStopId] = React.useState<string | null>(null);
    const [isTabbingBackOut, setIsTabbingBackOut] = React.useState(false);
    const [focusableItemCount, setFocusableItemCount] = React.useState(0);

    const groupRef = React.useRef<HTMLDivElement>(null);
    const composedRef = useComposedRefs(ref as any, groupRef);
    const isClickFocusRef = React.useRef(false);
    const itemsRef = React.useRef<Map<string, IItemData>>(new Map());

    const { dir, orientation } = useActionBarContext(GROUP_NAME);

    const onItemFocus = React.useCallback((tabStopId: string) => {
      setTabStopId(tabStopId);
    }, []);

    const onItemShiftTab = React.useCallback(() => {
      setIsTabbingBackOut(true);
    }, []);

    const onFocusableItemAdd = React.useCallback(() => {
      setFocusableItemCount((prevCount) => prevCount + 1);
    }, []);

    const onFocusableItemRemove = React.useCallback(() => {
      setFocusableItemCount((prevCount) => prevCount - 1);
    }, []);

    const onItemRegister = React.useCallback((item: IItemData) => {
      itemsRef.current.set(item.id, item);
    }, []);

    const onItemUnregister = React.useCallback((id: string) => {
      itemsRef.current.delete(id);
    }, []);

    const getItems = React.useCallback(
      () =>
        Array.from(itemsRef.current.values())
          .filter((item) => item.ref.current)
          .sort((a, b) => {
            const elementA = a.ref.current;
            const elementB = b.ref.current;
            if (!elementA || !elementB) return 0;
            const position = elementA.compareDocumentPosition(elementB);
            /* eslint-disable-next-line no-bitwise */
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
              return -1;
            }
            /* eslint-disable-next-line no-bitwise */
            if (position & Node.DOCUMENT_POSITION_PRECEDING) {
              return 1;
            }
            return 0;
          }),
      []
    );

    const onBlur = React.useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        onBlurProp?.(event);
        if (event.defaultPrevented) return;

        setIsTabbingBackOut(false);
      },
      [onBlurProp]
    );

    const onFocus = React.useCallback(
      (event: React.FocusEvent<HTMLDivElement>) => {
        onFocusProp?.(event);
        if (event.defaultPrevented) return;

        const isKeyboardFocus = !isClickFocusRef.current;
        if (
          event.target === event.currentTarget &&
          isKeyboardFocus &&
          !isTabbingBackOut
        ) {
          const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
          event.currentTarget.dispatchEvent(entryFocusEvent);

          if (!entryFocusEvent.defaultPrevented) {
            const items = Array.from(itemsRef.current.values()).filter(
              (item) => !item.disabled
            );
            const currentItem = items.find((item) => item.id === tabStopId);

            const candidateItems = [currentItem, ...items].filter(
              Boolean
            ) as IItemData[];
            const candidateRefs = candidateItems.map((item) => item.ref);
            focusFirst(candidateRefs, false);
          }
        }
        isClickFocusRef.current = false;
      },
      [onFocusProp, isTabbingBackOut, tabStopId]
    );

    const onMouseDown = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseDownProp?.(event);
        if (event.defaultPrevented) return;

        isClickFocusRef.current = true;
      },
      [onMouseDownProp]
    );

    const focusContextValue = React.useMemo<IFocusContextValue>(
      () => ({
        tabStopId,
        onItemFocus,
        onItemShiftTab,
        onFocusableItemAdd,
        onFocusableItemRemove,
        onItemRegister,
        onItemUnregister,
        getItems,
      }),
      [
        tabStopId,
        onItemFocus,
        onItemShiftTab,
        onFocusableItemAdd,
        onFocusableItemRemove,
        onItemRegister,
        onItemUnregister,
        getItems,
      ]
    );

    const GroupPrimitive = asChild ? SlotPrimitive : "div";

    return (
      <FocusContext.Provider value={focusContextValue}>
        <GroupPrimitive
          role="group"
          data-slot="action-bar-group"
          data-orientation={orientation}
          dir={dir}
          tabIndex={isTabbingBackOut || focusableItemCount === 0 ? -1 : 0}
          {...groupProps}
          ref={composedRef as any}
          className={cn(
            "flex gap-2 outline-none",
            orientation === "horizontal"
              ? "items-center"
              : "w-full flex-col items-start",
            className
          )}
          onBlur={onBlur}
          onFocus={onFocus}
          onMouseDown={onMouseDown}
        />
      </FocusContext.Provider>
    );
  }
);
ActionBarGroup.displayName = "ActionBarGroup";

export interface IActionBarItemProps extends Omit<
  React.ComponentProps<typeof Button>,
  "onSelect"
> {
  onSelect?: (event: Event) => void;
}

const ActionBarItem = React.forwardRef<HTMLButtonElement, IActionBarItemProps>(
  (props, ref) => {
    const {
      onSelect,
      onClick: onClickProp,
      onFocus: onFocusProp,
      onKeyDown: onKeyDownProp,
      onMouseDown: onMouseDownProp,
      className,
      disabled,
      ...itemProps
    } = props;

    const itemRef = React.useRef<HTMLButtonElement>(null);
    const composedRef = useComposedRefs(ref as any, itemRef);
    const isMouseClickRef = React.useRef(false);

    const { dir, orientation, loop } = useActionBarContext(ITEM_NAME);
    const focusContext = useFocusContext(ITEM_NAME);

    const itemId = React.useId();
    const isTabStop = focusContext.tabStopId === itemId;

    useIsomorphicLayoutEffect(() => {
      focusContext.onItemRegister({
        id: itemId,
        ref: itemRef,
        disabled: !!disabled,
      });

      if (!disabled) {
        focusContext.onFocusableItemAdd();
      }

      return () => {
        focusContext.onItemUnregister(itemId);
        if (!disabled) {
          focusContext.onFocusableItemRemove();
        }
      };
    }, [focusContext, itemId, disabled]);

    const onClick = React.useCallback(
      (event: any) => {
        onClickProp?.(event);
        if (event.defaultPrevented) return;

        const item = itemRef.current;
        if (!item) return;

        const itemSelectEvent = new CustomEvent(ITEM_SELECT, {
          bubbles: true,
          cancelable: true,
        });

        item.addEventListener(ITEM_SELECT, (e) => onSelect?.(e), {
          once: true,
        });

        item.dispatchEvent(itemSelectEvent);
      },
      [onClickProp, onSelect]
    );

    const onFocus = React.useCallback(
      (event: any) => {
        onFocusProp?.(event);
        if (event.defaultPrevented) return;

        focusContext.onItemFocus(itemId);
        isMouseClickRef.current = false;
      },
      [onFocusProp, focusContext, itemId]
    );

    const onKeyDown = React.useCallback(
      (event: any) => {
        onKeyDownProp?.(event);
        if (event.defaultPrevented) return;

        if (event.key === "Tab" && event.shiftKey) {
          focusContext.onItemShiftTab();
          return;
        }

        if (event.target !== event.currentTarget) return;

        const key = getDirectionAwareKey(event.key, dir);
        let focusIntent: "first" | "last" | "prev" | "next" | undefined;

        if (orientation === "horizontal") {
          if (key === "ArrowLeft") focusIntent = "prev";
          else if (key === "ArrowRight") focusIntent = "next";
          else if (key === "Home") focusIntent = "first";
          else if (key === "End") focusIntent = "last";
        } else if (key === "ArrowUp") focusIntent = "prev";
        else if (key === "ArrowDown") focusIntent = "next";
        else if (key === "Home") focusIntent = "first";
        else if (key === "End") focusIntent = "last";

        if (focusIntent !== undefined) {
          if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
            return;
          event.preventDefault();

          const items = focusContext
            .getItems()
            .filter((item) => !item.disabled);
          let candidateRefs = items.map((item) => item.ref);

          if (focusIntent === "last") {
            candidateRefs.reverse();
          } else if (focusIntent === "prev" || focusIntent === "next") {
            if (focusIntent === "prev") candidateRefs.reverse();
            const currentIndex = candidateRefs.findIndex(
              (ref) => ref.current === event.currentTarget
            );
            candidateRefs = loop
              ? wrapArray(candidateRefs, currentIndex + 1)
              : candidateRefs.slice(currentIndex + 1);
          }

          queueMicrotask(() => focusFirst(candidateRefs));
        }
      },
      [onKeyDownProp, focusContext, dir, orientation, loop]
    );

    const onMouseDown = React.useCallback(
      (event: any) => {
        onMouseDownProp?.(event);
        if (event.defaultPrevented) return;

        isMouseClickRef.current = true;

        if (disabled) {
          event.preventDefault();
        } else {
          focusContext.onItemFocus(itemId);
        }
      },
      [onMouseDownProp, focusContext, itemId, disabled]
    );

    return (
      <Button
        type="button"
        data-slot="action-bar-item"
        variant="secondary"
        disabled={disabled}
        tabIndex={isTabStop ? 0 : -1}
        {...itemProps}
        className={cn(orientation === "vertical" && "w-full", className)}
        ref={composedRef as any}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onMouseDown={onMouseDown}
      />
    );
  }
);
ActionBarItem.displayName = "ActionBarItem";

export interface IActionBarCloseProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
}

const ActionBarClose = React.forwardRef<
  HTMLButtonElement,
  IActionBarCloseProps
>((props, ref) => {
  const { asChild, className, onClick, ...closeProps } = props;

  const { onOpenChange } = useActionBarContext(CLOSE_NAME);

  const onCloseClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;

      onOpenChange?.(false);
    },
    [onOpenChange, onClick]
  );

  const ClosePrimitive = asChild ? SlotPrimitive : "button";

  return (
    <ClosePrimitive
      ref={ref as any}
      type="button"
      data-slot="action-bar-close"
      {...closeProps}
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 rounded-xs opacity-70 outline-none hover:opacity-100 focus-visible:ring-2 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      onClick={onCloseClick}
    />
  );
});
ActionBarClose.displayName = "ActionBarClose";

export interface IActionBarSeparatorProps extends IDivProps {
  orientation?: Orientation;
}

const ActionBarSeparator = React.forwardRef<
  HTMLDivElement,
  IActionBarSeparatorProps
>((props, ref) => {
  const {
    orientation: orientationProp,
    asChild,
    className,
    ...separatorProps
  } = props;

  const context = useActionBarContext(SEPARATOR_NAME);
  const orientation = orientationProp ?? context.orientation;

  const SeparatorPrimitive = asChild ? SlotPrimitive : "div";

  return (
    <SeparatorPrimitive
      ref={ref as any}
      role="separator"
      aria-orientation={orientation}
      aria-hidden="true"
      data-slot="action-bar-separator"
      {...separatorProps}
      className={cn(
        "bg-border in-data-[slot=action-bar-selection]:ml-0.5 in-data-[slot=action-bar-selection]:h-4 in-data-[slot=action-bar-selection]:w-px",
        orientation === "horizontal" ? "h-6 w-px" : "h-px w-full",
        className
      )}
    />
  );
});
ActionBarSeparator.displayName = "ActionBarSeparator";

export {
  ActionBar,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
  ActionBarSelection,
  ActionBarSeparator,
};
