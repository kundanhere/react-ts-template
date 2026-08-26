import * as React from "react";

import {
  Alert01Icon,
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  InformationCircleIcon,
  MoreHorizontalIcon,
  Sorting01Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { DataTableRowAction } from "@/types/data-table";

export interface ActivityItem {
  id: string;
  code: string;
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  status: "SUCCESS" | "DENIED" | "WARNING";
  severity: "info" | "warning" | "error";
  ipAddress: string;
}

export const ACTIVITY_STATUSES = ["SUCCESS", "DENIED", "WARNING"] as const;
export const ACTIVITY_SEVERITIES = ["info", "warning", "error"] as const;

export function getStatusIcon(status: ActivityItem["status"]) {
  switch (status) {
    case "SUCCESS":
      return (props: any) => (
        <HugeiconsIcon
          icon={CheckmarkCircle01Icon}
          strokeWidth={2}
          {...props}
        />
      );
    case "DENIED":
      return (props: any) => (
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} {...props} />
      );
    case "WARNING":
      return (props: any) => (
        <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} {...props} />
      );
  }
}

export function getSeverityIcon(severity: ActivityItem["severity"]) {
  switch (severity) {
    case "info":
      return (props: any) => (
        <HugeiconsIcon
          icon={InformationCircleIcon}
          strokeWidth={2}
          {...props}
        />
      );
    case "warning":
      return (props: any) => (
        <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} {...props} />
      );
    case "error":
      return (props: any) => (
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} {...props} />
      );
  }
}

const TextIconComp = (props: any) => (
  <HugeiconsIcon icon={TextFontIcon} strokeWidth={2} {...props} />
);
const SortingIconComp = (props: any) => (
  <HugeiconsIcon icon={Sorting01Icon} strokeWidth={2} {...props} />
);
const CheckmarkIconComp = (props: any) => (
  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} {...props} />
);
const CalendarIconComp = (props: any) => (
  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} {...props} />
);

interface GetActivityTableColumnsProps {
  statusCounts: Record<ActivityItem["status"], number>;
  severityCounts: Record<ActivityItem["severity"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<ActivityItem> | null>
  >;
  onViewDetails?: (item: ActivityItem) => void;
}

export function getActivityTableColumns({
  statusCounts,
  severityCounts,
  setRowAction,
  onViewDetails,
}: GetActivityTableColumnsProps): ColumnDef<ActivityItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => {
        let isChecked: boolean | "indeterminate" = false;
        if (table.getIsAllPageRowsSelected()) {
          isChecked = true;
        } else if (table.getIsSomePageRowsSelected()) {
          isChecked = "indeterminate";
        }
        return (
          <Checkbox
            aria-label="Select all"
            className="translate-y-0.5"
            checked={isChecked as any}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      size: 40,
    },
    {
      id: "code",
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Activity ID" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground w-16 font-mono text-xs font-semibold">
          {row.getValue("code")}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 60,
    },
    {
      id: "actor",
      accessorKey: "actor",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Actor" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-foreground text-xs font-medium">
            {row.getValue("actor")}
          </span>
          <span className="text-muted-foreground font-mono text-[11px]">
            {row.original.ipAddress}
          </span>
        </div>
      ),
      meta: {
        label: "Actor",
        placeholder: "Search by actor",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "action",
      accessorKey: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Action" />
      ),
      cell: ({ row }) => (
        <code className="bg-muted/60 text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-xs">
          {row.getValue("action")}
        </code>
      ),
      meta: {
        label: "Action",
        placeholder: "Filter action (e.g. iam:UpdateUserRole)",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "resource",
      accessorKey: "resource",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Target Resource" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-60 truncate font-mono text-xs">
          {row.getValue("resource")}
        </div>
      ),
      meta: {
        label: "Target Resource",
        placeholder: "Search target resource",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<ActivityItem["status"]>();
        if (!status) return null;

        let dotColorClass = "bg-amber-500";
        let statusText = "Warning";

        if (status === "SUCCESS") {
          dotColorClass = "bg-emerald-500";
          statusText = "Success";
        } else if (status === "DENIED") {
          dotColorClass = "bg-destructive";
          statusText = "Denied";
        }

        return (
          <Badge
            variant="outline"
            className="text-foreground gap-1.5 px-2 py-0.5 text-xs font-normal"
          >
            <span className={`size-1.5 rounded-full ${dotColorClass}`} />
            {statusText}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: ACTIVITY_STATUSES.map((status) => ({
          label: status.charAt(0) + status.slice(1).toLowerCase(),
          value: status,
          count: statusCounts[status] || 0,
          icon: getStatusIcon(status),
        })),
        icon: CheckmarkIconComp,
      },
      enableColumnFilter: true,
      size: 95,
    },
    {
      id: "severity",
      accessorKey: "severity",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Severity" />
      ),
      cell: ({ cell }) => {
        const severity = cell.getValue<ActivityItem["severity"]>();
        if (!severity) return null;
        const Icon = getSeverityIcon(severity);

        if (severity === "warning") {
          return (
            <Badge
              variant="outline"
              className="gap-1 border-amber-500/30 bg-amber-50/50 px-1.5 py-0.5 text-xs text-amber-600 capitalize dark:bg-amber-950/20 dark:text-amber-400 [&>svg]:size-3"
            >
              <Icon />
              {severity}
            </Badge>
          );
        }

        if (severity === "error") {
          return (
            <Badge
              variant="outline"
              className="text-destructive border-destructive/30 bg-destructive/10 dark:bg-destructive/20 gap-1 px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3"
            >
              <Icon />
              {severity}
            </Badge>
          );
        }

        return (
          <Badge
            variant="secondary"
            className="border-border gap-1 border px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3"
          >
            <Icon />
            {severity}
          </Badge>
        );
      },
      meta: {
        label: "Severity",
        variant: "multiSelect",
        options: ACTIVITY_SEVERITIES.map((severity) => ({
          label: severity.charAt(0).toUpperCase() + severity.slice(1),
          value: severity,
          count: severityCounts[severity] || 0,
          icon: getSeverityIcon(severity),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 90,
    },
    {
      id: "timestamp",
      accessorKey: "timestamp",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Timestamp" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Date>();
        return (
          <div className="text-muted-foreground font-mono text-xs whitespace-nowrap">
            {formatDate(date, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </div>
        );
      },
      meta: {
        label: "Timestamp",
        variant: "dateRange",
        icon: CalendarIconComp,
      },
      enableColumnFilter: true,
      size: 160,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <HugeiconsIcon
                  icon={MoreHorizontalIcon}
                  strokeWidth={2}
                  className="size-4"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem onClick={() => onViewDetails?.(row.original)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.code);
                  toast.success(`Copied activity ID ${row.original.code}`);
                }}
              >
                Copy Activity ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original.action);
                  toast.success(`Copied action ${row.original.action}`);
                }}
              >
                Copy Action
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setRowAction({ row, variant: "delete" })}
              >
                Delete Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
