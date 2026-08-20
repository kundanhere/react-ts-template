import * as React from "react";

import {
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CodeIcon,
  Layers01Icon,
  MoreHorizontalIcon,
  ShieldKeyIcon,
  Sorting01Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

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

export interface Policy {
  id: string;
  code: string;
  name: string;
  description: string;
  effect: "ALLOW" | "DENY";
  type: "system" | "custom" | "inline";
  status: "active" | "inactive" | "deprecated";
  resource: string;
  actions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const POLICY_EFFECTS = ["ALLOW", "DENY"] as const;
export const POLICY_TYPES = ["system", "custom", "inline"] as const;
export const POLICY_STATUSES = ["active", "inactive", "deprecated"] as const;

export function getEffectIcon(effect: Policy["effect"]) {
  switch (effect) {
    case "ALLOW":
      return (props: any) => (
        <HugeiconsIcon
          icon={CheckmarkCircle01Icon}
          strokeWidth={2}
          {...props}
        />
      );
    case "DENY":
      return (props: any) => (
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} {...props} />
      );
  }
}

export function getTypeIcon(type: Policy["type"]) {
  switch (type) {
    case "system":
      return (props: any) => (
        <HugeiconsIcon icon={ShieldKeyIcon} strokeWidth={2} {...props} />
      );
    case "custom":
      return (props: any) => (
        <HugeiconsIcon icon={CodeIcon} strokeWidth={2} {...props} />
      );
    case "inline":
      return (props: any) => (
        <HugeiconsIcon icon={Layers01Icon} strokeWidth={2} {...props} />
      );
  }
}

export function getStatusIcon(status: Policy["status"]) {
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
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} {...props} />
      );
    case "deprecated":
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

interface GetPoliciesTableColumnsProps {
  effectCounts: Record<Policy["effect"], number>;
  typeCounts: Record<Policy["type"], number>;
  statusCounts: Record<Policy["status"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Policy> | null>
  >;
  onUpdatePolicyEffect?: (policyId: string, effect: Policy["effect"]) => void;
  onDuplicatePolicy?: (policy: Policy) => void;
}

export function getPoliciesTableColumns({
  effectCounts,
  typeCounts,
  statusCounts,
  setRowAction,
  onUpdatePolicyEffect,
  onDuplicatePolicy,
}: GetPoliciesTableColumnsProps): ColumnDef<Policy>[] {
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
        <DataTableColumnHeader column={column} label="ID" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground w-14 font-mono text-xs font-semibold">
          {row.getValue("code")}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Policy Name" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link
            to={`/iam/policies/${row.original.id}`}
            className="hover:text-primary font-medium transition-colors"
          >
            {row.getValue("name")}
          </Link>
          <span className="text-muted-foreground max-w-64 truncate text-xs">
            {row.original.description}
          </span>
        </div>
      ),
      meta: {
        label: "Policy Name",
        placeholder: "Search by policy name",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "effect",
      accessorKey: "effect",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Effect" />
      ),
      cell: ({ cell }) => {
        const effect = cell.getValue<Policy["effect"]>();
        if (!effect) return null;
        const isAllow = effect.toUpperCase() === "ALLOW";

        return (
          <Badge
            variant="outline"
            className="text-foreground gap-1.5 px-2 py-0.5 text-xs font-normal"
          >
            <span
              className={`size-1.5 rounded-full ${
                isAllow ? "bg-emerald-500" : "bg-destructive"
              }`}
            />
            {isAllow ? "Allow" : "Deny"}
          </Badge>
        );
      },
      meta: {
        label: "Effect",
        variant: "multiSelect",
        options: POLICY_EFFECTS.map((effect) => ({
          label: effect === "ALLOW" ? "Allow" : "Deny",
          value: effect,
          count: effectCounts[effect],
          icon: getEffectIcon(effect),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 75,
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ cell }) => {
        const type = cell.getValue<Policy["type"]>();
        if (!type) return null;
        const Icon = getTypeIcon(type);

        return (
          <Badge
            variant="secondary"
            className="border-border gap-1 border px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3"
          >
            <Icon />
            {type}
          </Badge>
        );
      },
      meta: {
        label: "Type",
        variant: "multiSelect",
        options: POLICY_TYPES.map((type) => ({
          label: type.charAt(0).toUpperCase() + type.slice(1),
          value: type,
          count: typeCounts[type],
          icon: getTypeIcon(type),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 85,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<Policy["status"]>();
        if (!status) return null;
        const Icon = getStatusIcon(status);

        const variantMap: Record<Policy["status"], string> = {
          active:
            "text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
          inactive: "text-muted-foreground border-muted bg-muted/40",
          deprecated:
            "text-amber-600 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
        };

        return (
          <Badge
            variant="outline"
            className={`gap-1 px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3 ${variantMap[status]}`}
          >
            <Icon />
            {status}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: POLICY_STATUSES.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
          count: statusCounts[status],
          icon: getStatusIcon(status),
        })),
        icon: CheckmarkIconComp,
      },
      enableColumnFilter: true,
      size: 90,
    },
    {
      id: "resource",
      accessorKey: "resource",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Resource" />
      ),
      cell: ({ row }) => (
        <code className="bg-muted/60 text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-xs">
          {row.getValue("resource")}
        </code>
      ),
      enableColumnFilter: true,
    },
    {
      id: "actionsList",
      accessorKey: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Actions" />
      ),
      cell: ({ row }) => {
        const actionsList: string[] = row.getValue("actionsList") || [];
        const maxDisplay = 2;
        const displayed = actionsList.slice(0, maxDisplay);
        const remaining = actionsList.length - maxDisplay;

        return (
          <div className="flex flex-wrap items-center gap-1">
            {displayed.map((act) => (
              <Badge
                key={act}
                variant="outline"
                className="bg-muted/40 font-mono text-[10px] lowercase"
              >
                {act}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="secondary" className="font-mono text-[10px]">
                +{remaining}
              </Badge>
            )}
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Updated At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Updated At",
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                render={<Link to={`/iam/policies/${row.original.id}`} />}
              >
                Inspect JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Edit policy ${row.original.name}`)}
              >
                Edit Policy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDuplicatePolicy?.(row.original)}
              >
                Duplicate Policy
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Effect</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.effect}
                    onValueChange={(value) => {
                      onUpdatePolicyEffect?.(
                        row.original.id,
                        value as Policy["effect"]
                      );
                      toast.success(`Effect updated to ${value}`);
                    }}
                  >
                    {POLICY_EFFECTS.map((eff) => (
                      <DropdownMenuRadioItem key={eff} value={eff}>
                        {eff}
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
                Delete Policy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
