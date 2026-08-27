import {
  ApartmentIcon,
  BadgeInfoIcon,
  CellsIcon,
  LockedIcon,
  MoreHorizontalIcon,
  ShieldCheck,
  UserIcon,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { GetRolesTableColumnsProps, RoleItem } from "@/types/iam/roles";

export function getRoleIcon(roleId: string) {
  switch (roleId) {
    case "super-admin":
      return <HugeiconsIcon icon={ShieldCheck} size={18} strokeWidth={2} />;
    case "dept-manager":
      return <HugeiconsIcon icon={ApartmentIcon} size={18} strokeWidth={2} />;
    case "security-auditor":
      return <HugeiconsIcon icon={LockedIcon} size={18} strokeWidth={2} />;
    case "regular-employee":
      return <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} />;
    case "support":
      return <HugeiconsIcon icon={BadgeInfoIcon} size={18} strokeWidth={2} />;
    default:
      return <HugeiconsIcon icon={CellsIcon} size={18} strokeWidth={2} />;
  }
}

export function getRolesTableColumns({
  onEditRole,
  onDuplicateRole,
  onDeleteRole,
}: GetRolesTableColumnsProps = {}): ColumnDef<RoleItem>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          className="translate-y-0.5"
          checked={
            (table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")) as any
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
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
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Role Name" />
      ),
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg">
              {role.icon ?? getRoleIcon(role.id)}
            </div>
            <span className="font-medium">{role.name}</span>
          </div>
        );
      },
      meta: {
        label: "Name",
        variant: "text",
        placeholder: "Search roles...",
      },
      enableColumnFilter: true,
    },
    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Description" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-1">
          {row.original.description}
        </span>
      ),
      meta: {
        label: "Description",
      },
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
            System Role
          </Badge>
        ) : (
          <Badge variant="outline">Custom</Badge>
        ),
      meta: {
        label: "Type",
        variant: "select",
        options: [
          { label: "System Role", value: "true" },
          { label: "Custom", value: "false" },
        ],
      },
      enableColumnFilter: true,
    },
    {
      id: "userCount",
      accessorKey: "userCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Assigned Users" />
      ),
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {row.original.userCount} Users
        </span>
      ),
      meta: {
        label: "Assigned Users",
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const role = row.original;
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open actions menu"
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
                <DropdownMenuItem onClick={() => onEditRole?.(role)}>
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicateRole?.(role)}>
                  Duplicate Role
                </DropdownMenuItem>
                <DropdownMenuItem
                  render={<Link to={`/iam/roles/${role.id}`} />}
                >
                  Manage Policy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDeleteRole?.(role)}
                >
                  Delete Role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
