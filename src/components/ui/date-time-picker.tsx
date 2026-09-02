"use client";

import * as React from "react";

import { Calendar01Icon, Clock01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type CalendarDate,
  fromDate,
  getLocalTimeZone,
  toCalendarDate,
} from "@internationalized/date";
import { parseDate as parseNaturalLanguage } from "chrono-node";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export const DEFAULT_TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 ? "30" : "00";
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
});

export function parseNaturalLanguageInput(value: string) {
  if (!value || !value.trim()) {
    return { date: undefined, time: undefined };
  }
  try {
    const parsed = parseNaturalLanguage(value);
    if (!parsed) {
      return { date: undefined, time: undefined };
    }

    const calDate = toCalendarDate(fromDate(parsed, getLocalTimeZone()));
    const hours = parsed.getHours();
    const minutes = parsed.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    let roundedMin: string;
    if (minutes >= 45) {
      roundedMin = "00";
    } else if (minutes >= 15) {
      roundedMin = "30";
    } else {
      roundedMin = "00";
    }
    const timeStr = `${String(displayHour).padStart(2, "0")}:${roundedMin} ${ampm}`;

    return { date: calDate, time: timeStr };
  } catch {
    return { date: undefined, time: undefined };
  }
}

export function formatDateTime(
  calendarDate: CalendarDate | undefined,
  timeStr?: string
) {
  if (!calendarDate) {
    return "";
  }

  const date = calendarDate.toDate(getLocalTimeZone());
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return timeStr ? `${formattedDate}, ${timeStr}` : formattedDate;
}

export interface IDateTimePickerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSelect?: (
    date: CalendarDate | undefined,
    time?: string,
    formattedValue?: string
  ) => void;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
  timeOptions?: string[];
  confirmText?: string;
  cancelText?: string;
  showActions?: boolean;
}

export function DateTimePicker({
  value: controlledValue,
  defaultValue = "In 2 days at 09:00 AM",
  onChange,
  onSelect,
  onCancel,
  placeholder = "Tomorrow or next week",
  className,
  timeOptions = DEFAULT_TIME_OPTIONS,
  confirmText = "Apply",
  cancelText = "Cancel",
  showActions = true,
}: IDateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(
    controlledValue ?? defaultValue
  );
  const [time, setTime] = React.useState("09:00 AM");

  const [date, setDate] = React.useState<CalendarDate | undefined>(() => {
    const parsed = parseNaturalLanguageInput(controlledValue ?? defaultValue);
    return parsed.date;
  });

  const value = controlledValue ?? internalValue;

  const handleValueChange = (val: string) => {
    if (controlledValue === undefined) {
      setInternalValue(val);
    }
    onChange?.(val);

    const parsed = parseNaturalLanguageInput(val);
    if (parsed.date) {
      setDate(parsed.date);
    }
    if (parsed.time) {
      setTime(parsed.time);
    }
  };

  const stopPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const handleCancel = () => {
    handleValueChange("");
    setDate(undefined);
    setOpen(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    setOpen(false);
    const formatted = formatDateTime(date, time);
    onSelect?.(date, time, formatted);
  };

  return (
    <div className={cn("p-1.5 text-left", className)}>
      <Field className="w-56 gap-2">
        <InputGroup>
          <InputGroupInput
            id="date-time-input"
            type="text"
            value={value}
            placeholder={placeholder}
            autoComplete="off"
            onChange={(e) => handleValueChange(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />
          <InputGroupAddon align="inline-end">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <InputGroupButton
                    id="date-picker"
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Select date and time"
                  />
                }
              >
                <HugeiconsIcon icon={Calendar01Icon} />
                <span className="sr-only">Select date and time</span>
              </PopoverTrigger>
              <PopoverContent
                className="divide-border flex w-auto flex-row gap-0! divide-x overflow-hidden p-0"
                align="end"
                sideOffset={8}
                onClick={stopPropagation}
                onPointerDown={stopPropagation}
              >
                <div className="p-1" onPointerDown={stopPropagation}>
                  <Calendar
                    mode="single"
                    selected={
                      date ? date.toDate(getLocalTimeZone()) : undefined
                    }
                    captionLayout="dropdown"
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        const calDate = toCalendarDate(
                          fromDate(selectedDate, getLocalTimeZone())
                        );
                        setDate(calDate);
                        const formatted = formatDateTime(calDate, time);
                        handleValueChange(formatted);
                      } else {
                        setDate(undefined);
                        handleValueChange("");
                      }
                    }}
                  />
                </div>
                <div
                  className="flex h-72 w-32 flex-col p-2"
                  onPointerDown={stopPropagation}
                >
                  <div className="text-muted-foreground border-border/50 mb-1.5 flex shrink-0 items-center gap-1.5 border-b px-2 py-1 text-xs font-medium">
                    <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                    <span>Time</span>
                  </div>
                  <ScrollArea className="min-h-0 flex-1">
                    <div className="flex flex-col gap-0.5 p-0.5 pr-2">
                      {timeOptions.map((t) => {
                        const isSelected = time === t;
                        return (
                          <Button
                            key={t}
                            variant={isSelected ? "default" : "ghost"}
                            size="xs"
                            className={cn(
                              "h-7 w-full justify-center text-xs",
                              isSelected && "font-semibold"
                            )}
                            onClick={() => {
                              setTime(t);
                              if (date) {
                                const formatted = formatDateTime(date, t);
                                handleValueChange(formatted);
                              }
                            }}
                          >
                            {t}
                          </Button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          </InputGroupAddon>
        </InputGroup>
        <div className="text-muted-foreground px-0.5 text-xs">
          Selected:{" "}
          <span className="text-foreground font-medium">
            {formatDateTime(date, time) || "..."}
          </span>
        </div>
        {showActions && (
          <div className="flex items-center justify-end gap-1.5 pt-1">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button size="sm" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        )}
      </Field>
    </div>
  );
}
