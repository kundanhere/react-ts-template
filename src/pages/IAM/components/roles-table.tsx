import * as React from "react";

import {
  Copy01Icon,
  Delete02Icon,
  PencilEdit01Icon,
  ShieldCheck,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDataTable } from "@/hooks/use-data-table";
import { cn } from "@/lib/utils";
import type { QueryKeys } from "@/types/data-table";

import { RolesTableActionBar } from "./roles-table-action-bar";
import {
  type RoleItem,
  getRoleIcon,
  getRolesTableColumns,
} from "./roles-table-columns";
import { RolesTableToolbarActions } from "./roles-table-toolbar-actions";

const INITIAL_ROLES: RoleItem[] = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Full global system access across all modules and policies.",
    userCount: 1,
    isSystem: true,
  },
  {
    id: "dept-manager",
    name: "Department Manager",
    description: "View and manage team users within assigned department.",
    userCount: 42,
    isSystem: false,
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    description: "Read-only access across Users, Policies, and Audit Logs.",
    userCount: 15,
    isSystem: false,
  },
  {
    id: "regular-employee",
    name: "Regular Employee",
    description: "Standard operational permissions for domain modules.",
    userCount: 1180,
    isSystem: false,
  },
  {
    id: "support",
    name: "Support",
    description: "Standard operational permissions for support modules.",
    userCount: 3,
    isSystem: false,
  },
];

interface RolesTableProps {
  queryKeys?: Partial<QueryKeys>;
  onNewRoleClick?: () => void;
}

export function RolesTable({ queryKeys, onNewRoleClick }: RolesTableProps) {
  const [roles, setRoles] = React.useState<RoleItem[]>(INITIAL_ROLES);

  const handleBulkDelete = React.useCallback((ids: string[]) => {
    setRoles((prev) => prev.filter((r) => !ids.includes(r.id)));
  }, []);

  const handleEditRole = React.useCallback((role: RoleItem) => {
    toast.info(`Editing role: ${role.name}`);
  }, []);

  const handleDuplicateRole = React.useCallback((role: RoleItem) => {
    const newRole: RoleItem = {
      ...role,
      id: `${role.id}-copy-${Date.now()}`,
      name: `${role.name} (Copy)`,
      isSystem: false,
    };
    setRoles((prev) => [newRole, ...prev]);
    toast.success(`Duplicated role: ${role.name}`);
  }, []);

  const handleDeleteRole = React.useCallback((role: RoleItem) => {
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    toast.success(`Deleted role: ${role.name}`);
  }, []);

  const columns = React.useMemo(
    () =>
      getRolesTableColumns({
        onEditRole: handleEditRole,
        onDuplicateRole: handleDuplicateRole,
        onDeleteRole: handleDeleteRole,
      }),
    [handleEditRole, handleDuplicateRole, handleDeleteRole]
  );

  const { table } = useDataTable({
    data: roles,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "userCount", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
  });

  return (
    <DataTable
      table={table}
      enableViewToggle
      defaultViewMode="grid"
      actionBar={
        <RolesTableActionBar table={table} onBulkDelete={handleBulkDelete} />
      }
      renderCard={(row) => {
        const role = row.original;
        const isSelected = row.getIsSelected();
        const checkboxId = `role-check-${role.id}`;
        return (
          <Card
            key={row.id}
            className={cn(
              "group hover:border-primary/40 transition-all",
              isSelected && "border-primary bg-accent/30 ring-primary/30 ring-1"
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="relative flex size-7 shrink-0 items-center justify-center">
                  {isSelected ? (
                    <Checkbox
                      id={checkboxId}
                      aria-label={`Select role ${role.name}`}
                      checked={isSelected}
                      onCheckedChange={(value) => row.toggleSelected(!!value)}
                    />
                  ) : (
                    <>
                      <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg group-hover:hidden">
                        {role.icon ?? getRoleIcon(role.id)}
                      </div>
                      <div className="hidden size-7 items-center justify-center group-hover:flex">
                        <Checkbox
                          id={checkboxId}
                          aria-label={`Select role ${role.name}`}
                          checked={isSelected}
                          onCheckedChange={(value) =>
                            row.toggleSelected(!!value)
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
                <label
                  htmlFor={checkboxId}
                  className="hover:text-primary cursor-pointer font-medium transition-colors select-none"
                >
                  {role.name}
                </label>
              </CardTitle>
              <CardAction>
                {role.isSystem ? (
                  <Badge variant="secondary">System Role</Badge>
                ) : (
                  <Badge variant="outline">Custom</Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>{role.description}</CardContent>
            <CardFooter className="flex w-full items-center justify-between border-t pt-3">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <HugeiconsIcon icon={UserGroupIcon} size={14} />
                <span>{`${role.userCount} Assigned User${role.userCount > 1 ? "s" : ""}`}</span>
              </div>
              <div className="bg-muted/40 inline-flex items-center rounded-lg border p-0.5 shadow-2xs">
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="hover:bg-background size-7 rounded-md transition-all hover:shadow-2xs"
                      onClick={() => handleEditRole(role)}
                      aria-label="Edit Role"
                    >
                      <HugeiconsIcon
                        icon={PencilEdit01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit Role</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="hover:bg-background size-7 rounded-md transition-all hover:shadow-2xs"
                      onClick={() => handleDuplicateRole(role)}
                      aria-label="Duplicate Role"
                    >
                      <HugeiconsIcon
                        icon={Copy01Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Duplicate Role</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="hover:bg-background size-7 rounded-md transition-all hover:shadow-2xs"
                      render={<Link to={`/iam/roles/${role.id}`} />}
                      aria-label="Manage Policy"
                    >
                      <HugeiconsIcon
                        icon={ShieldCheck}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Manage Policy</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive size-7 rounded-md transition-all"
                      onClick={() => handleDeleteRole(role)}
                      aria-label="Delete Role"
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        strokeWidth={2}
                        className="size-3.5"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Role</TooltipContent>
                </Tooltip>
              </div>
            </CardFooter>
          </Card>
        );
      }}
    >
      <DataTableToolbar table={table}>
        <RolesTableToolbarActions
          table={table}
          onNewRoleClick={onNewRoleClick}
        />
      </DataTableToolbar>
    </DataTable>
  );
}
