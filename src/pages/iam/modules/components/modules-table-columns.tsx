import {
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Folder01Icon,
  MoreHorizontalIcon,
  Shield01Icon,
  ShieldCheck,
  Sorting01Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef, Row } from "@tanstack/react-table";

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
import { getModuleIcon } from "@/layout/module-icons";
import { formatDate } from "@/lib/format";
import type {
  IGetModulesTableColumnsProps,
  IModule,
  INavigationGroup,
} from "@/types/iam/modules";

export const MODULE_STATUSES = [
  "active",
  "inactive",
  "maintenance",
  "beta",
] as const;

export function getStatusIcon(status: IModule["status"]) {
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
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} {...props} />
      );
    case "beta":
      return (props: any) => (
        <HugeiconsIcon icon={ShieldCheck} strokeWidth={2} {...props} />
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
const ShieldIconComp = (props: any) => (
  <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} {...props} />
);
const CalendarIconComp = (props: any) => (
  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} {...props} />
);
const FolderIconComp = (props: any) => (
  <HugeiconsIcon icon={Folder01Icon} strokeWidth={2} {...props} />
);

/**
 * Resolves the effective navigation group for a module.
 * Child and sub-modules automatically inherit the group of their parent.
 */
function getEffectiveGroup(
  row: Row<IModule>,
  groups: INavigationGroup[]
): INavigationGroup | null {
  let currentRow: Row<IModule> | undefined = row;
  while (currentRow) {
    const currentGroupId = currentRow.original.groupId;
    if (currentGroupId) {
      const g = groups.find((grp) => grp.id === currentGroupId);
      if (g) return g;
    }
    currentRow = currentRow.getParentRow();
  }
  return null;
}

export function getModulesTableColumns({
  statusCounts,
  priorityRange,
  groups = [],
  setRowAction,
  onEditModule,
  onAssignGroup,
  onUpdateStatus,
  onToggleSystem,
}: IGetModulesTableColumnsProps): ColumnDef<IModule>[] {
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
        const { icon, description, badge } = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
              {getModuleIcon(icon, 2, 16)}
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground text-xs font-medium sm:text-[0.8125rem]">
                  {row.getValue("name")}
                </span>
                {badge && (
                  <Badge
                    variant="secondary"
                    className="h-4 px-1 text-[0.625rem] font-medium"
                  >
                    {badge}
                  </Badge>
                )}
              </div>
              {description && (
                <span className="text-muted-foreground max-w-70 truncate text-[0.6875rem]">
                  {description}
                </span>
              )}
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
      id: "group",
      accessorFn: (row) => row.groupId,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Sidebar Group" />
      ),
      cell: ({ row }) => {
        const isChild = row.depth > 0;
        const targetGroup = getEffectiveGroup(row, groups);
        if (!targetGroup) {
          return (
            <span className="text-muted-foreground text-xs italic">
              Unassigned
            </span>
          );
        }

        return (
          <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
            <span>{targetGroup.name}</span>
            {isChild && (
              <span className="text-muted-foreground text-[0.625rem] font-normal">
                (Inherited)
              </span>
            )}
          </div>
        );
      },
      meta: {
        label: "Sidebar Group",
        variant: "multiSelect",
        options: [
          ...groups.map((grp) => ({
            label: grp.name,
            value: grp.id,
            icon: FolderIconComp,
          })),
          { label: "Unassigned", value: "unassigned", icon: FolderIconComp },
        ],
        icon: FolderIconComp,
      },
      filterFn: (row, _columnId, filterValue) => {
        if (
          !filterValue ||
          !Array.isArray(filterValue) ||
          filterValue.length === 0
        )
          return true;
        const targetGroup = getEffectiveGroup(row, groups);
        const currentGroupId = targetGroup?.id || "unassigned";
        return filterValue.includes(currentGroupId);
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
        <div className="bg-muted/60 text-muted-foreground inline-block rounded border px-2 py-0.5 font-mono text-xs">
          {row.getValue("route")}
        </div>
      ),
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
        icon: SortingIconComp,
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
        const status = cell.getValue<IModule["status"]>();
        const Icon = getStatusIcon(status);

        let badgeVariant: "default" | "secondary" | "destructive" | "outline" =
          "outline";
        let extraClasses = "";

        if (status === "active") {
          badgeVariant = "secondary";
          extraClasses =
            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
        } else if (status === "beta") {
          badgeVariant = "secondary";
          extraClasses =
            "bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800";
        } else if (status === "maintenance") {
          badgeVariant = "outline";
          extraClasses =
            "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
        } else {
          badgeVariant = "outline";
          extraClasses = "text-muted-foreground";
        }

        return (
          <Badge
            variant={badgeVariant}
            className={`gap-1.5 py-0.5 text-xs capitalize ${extraClasses}`}
          >
            <Icon className="size-3.5" />
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
      cell: ({ row }) =>
        row.original.isSystem ? (
          <Badge variant="secondary" className="border-border border">
            System Module
          </Badge>
        ) : (
          <Badge variant="outline">Custom</Badge>
        ),
      meta: {
        label: "Type",
        variant: "select",
        options: [
          { label: "System Module", value: "true" },
          { label: "Custom", value: "false" },
        ],
        icon: ShieldIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Registered" />
      ),
      cell: ({ cell }) => {
        const date = cell.getValue<Date>();
        return (
          <div className="text-muted-foreground text-xs font-medium">
            {formatDate(date)}
          </div>
        );
      },
      meta: {
        label: "Registered",
        variant: "dateRange",
        icon: CalendarIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const module = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Open menu"
              >
                <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEditModule?.(module)}>
                Edit Module
              </DropdownMenuItem>

              {/* Assign to Group submenu (only available for parent/root modules) */}
              {row.depth === 0 && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Assign to Group
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="min-w-44">
                    {groups.map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={() => {
                          onAssignGroup?.(row.original.id, group.id);
                          toast.success(
                            `Assigned "${row.original.name}" to "${group.name}"`
                          );
                        }}
                        className="gap-2"
                      >
                        {getModuleIcon(group.icon, 2, 14)}
                        <span className="flex-1 truncate">{group.name}</span>
                        {row.original.groupId === group.id && (
                          <span className="text-primary text-[0.625rem] font-bold">
                            ✓
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        onAssignGroup?.(row.original.id, null);
                        toast.success(
                          `Unassigned "${row.original.name}" from group`
                        );
                      }}
                      className="text-muted-foreground"
                    >
                      Unassign Group
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}

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
                        value as IModule["status"]
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
