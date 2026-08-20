import * as React from "react";

import {
  ApartmentIcon,
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CpuIcon,
  Grid02Icon,
  Layers01Icon,
  MoreHorizontalIcon,
  Settings01Icon,
  Shield01Icon,
  ShieldCheck,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { DataTableRowAction } from "@/types/data-table";

export interface Module {
  id: string;
  code: string;
  name: string;
  route: string;
  priority: number;
  category: "core" | "system" | "feature" | "integration" | "governance";
  status: "active" | "inactive" | "maintenance" | "beta";
  isSystem: boolean;
  description: string;
  createdAt: Date;
  children?: Module[];
}

export const MODULE_CATEGORIES = [
  "core",
  "system",
  "feature",
  "integration",
  "governance",
] as const;

export const MODULE_STATUSES = [
  "active",
  "inactive",
  "maintenance",
  "beta",
] as const;

export function getCategoryIcon(category: Module["category"]) {
  switch (category) {
    case "core":
      return (props: any) => (
        <HugeiconsIcon icon={CpuIcon} strokeWidth={2} {...props} />
      );
    case "system":
      return (props: any) => (
        <HugeiconsIcon icon={Layers01Icon} strokeWidth={2} {...props} />
      );
    case "feature":
      return (props: any) => (
        <HugeiconsIcon icon={Grid02Icon} strokeWidth={2} {...props} />
      );
    case "integration":
      return (props: any) => (
        <HugeiconsIcon icon={ApartmentIcon} strokeWidth={2} {...props} />
      );
    case "governance":
      return (props: any) => (
        <HugeiconsIcon icon={ShieldCheck} strokeWidth={2} {...props} />
      );
  }
}

export function getStatusIcon(status: Module["status"]) {
  switch (status) {
    case "active":
      return (props: any) => (
        <HugeiconsIcon
          icon={CheckmarkCircle01Icon}
          strokeWidth={2}
          {...props}
        />
      );
    case "inactive":
      return (props: any) => (
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} {...props} />
      );
    case "maintenance":
      return (props: any) => (
        <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} {...props} />
      );
    case "beta":
      return (props: any) => (
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          strokeWidth={2}
          {...props}
        />
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
const ClockIconComp = (props: any) => (
  <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} {...props} />
);
const CalendarIconComp = (props: any) => (
  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} {...props} />
);
const ShieldIconComp = (props: any) => (
  <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} {...props} />
);

interface GetModulesTableColumnsProps {
  statusCounts: Record<Module["status"], number>;
  categoryCounts: Record<Module["category"], number>;
  priorityRange: { min: number; max: number };
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Module> | null>
  >;
  onEditModule?: (module: Module) => void;
  onUpdateStatus?: (moduleId: string, status: Module["status"]) => void;
  onToggleSystem?: (moduleId: string) => void;
}

export function getModulesTableColumns({
  statusCounts,
  categoryCounts,
  priorityRange,
  setRowAction,
  onEditModule,
  onUpdateStatus,
  onToggleSystem,
}: GetModulesTableColumnsProps): ColumnDef<Module>[] {
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
        <DataTableColumnHeader column={column} label="Module ID" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground w-20 font-mono text-xs font-semibold">
          {row.getValue("code")}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Module Name" />
      ),
      cell: ({ row }) => {
        const { category, description } = row.original;
        const CategoryIcon = getCategoryIcon(category);
        return (
          <div className="flex items-center gap-2.5">
            <div className="bg-muted/40 flex size-8 shrink-0 items-center justify-center rounded-lg border">
              <CategoryIcon className="text-primary size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-medium">
                {row.getValue("name")}
              </span>
              <span className="text-muted-foreground max-w-70 truncate text-xs">
                {description}
              </span>
            </div>
          </div>
        );
      },
      meta: {
        label: "Module Name",
        placeholder: "Search by module",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "route",
      accessorKey: "route",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Route Scope" />
      ),
      cell: ({ row }) => (
        <div className="bg-muted/60 text-muted-foreground inline-block rounded border px-2 py-1 font-mono text-xs">
          {row.getValue("route")}
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Category" />
      ),
      cell: ({ cell }) => {
        const category = cell.getValue<Module["category"]>();
        if (!category) return null;
        const Icon = getCategoryIcon(category);

        return (
          <Badge
            variant="outline"
            className="gap-1 py-1 capitalize [&>svg]:size-3.5"
          >
            <Icon />
            {category}
          </Badge>
        );
      },
      meta: {
        label: "Category",
        variant: "multiSelect",
        options: MODULE_CATEGORIES.map((cat) => ({
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          value: cat,
          count: categoryCounts[cat] || 0,
          icon: getCategoryIcon(cat),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Priority" />
      ),
      cell: ({ cell }) => {
        const priority = cell.getValue<number>();
        return (
          <div className="w-12 text-center font-mono text-xs font-semibold">
            {priority}
          </div>
        );
      },
      meta: {
        label: "Priority",
        variant: "range",
        range: [priorityRange.min, priorityRange.max],
        unit: "priority",
        icon: ClockIconComp,
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
        const status = cell.getValue<Module["status"]>();
        if (!status) return null;
        const Icon = getStatusIcon(status);

        const variantMap: Record<Module["status"], string> = {
          active:
            "text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20",
          inactive: "text-muted-foreground border-muted",
          maintenance:
            "text-amber-600 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20",
          beta: "text-blue-600 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20",
        };

        return (
          <Badge
            variant="outline"
            className={`gap-1 py-1 capitalize [&>svg]:size-3.5 ${variantMap[status]}`}
          >
            <Icon />
            {status}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: MODULE_STATUSES.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
          count: statusCounts[status] || 0,
          icon: getStatusIcon(status),
        })),
        icon: CheckmarkIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "isSystem",
      accessorKey: "isSystem",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ row }) => {
        const isSystem = row.getValue<boolean>("isSystem");
        return isSystem ? (
          <Badge
            variant="secondary"
            className="border-border gap-1 border text-xs font-normal"
          >
            <ShieldIconComp className="text-primary size-3" />
            System
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-muted-foreground text-xs font-normal"
          >
            Custom
          </Badge>
        );
      },
      meta: {
        label: "Type",
        variant: "multiSelect",
        options: [
          { label: "System", value: "true", icon: ShieldIconComp },
          { label: "Custom", value: "false", icon: TextIconComp },
        ],
        icon: ShieldIconComp,
      },
      filterFn: (row, columnId, filterValue) => {
        if (
          !filterValue ||
          !Array.isArray(filterValue) ||
          filterValue.length === 0
        )
          return true;
        const val = row.getValue<boolean>(columnId);
        return filterValue.includes(String(val));
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIconComp,
      },
      enableColumnFilter: true,
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
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEditModule?.(row.original)}>
                Edit Module
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleSystem?.(row.original.id)}
              >
                Toggle {row.original.isSystem ? "Custom" : "System"} Type
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.status}
                    onValueChange={(value) => {
                      onUpdateStatus?.(
                        row.original.id,
                        value as Module["status"]
                      );
                      toast.success(`Module status updated to ${value}`);
                    }}
                  >
                    {MODULE_STATUSES.map((status) => (
                      <DropdownMenuRadioItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setRowAction({ row, variant: "delete" })}
              >
                Delete Module
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
