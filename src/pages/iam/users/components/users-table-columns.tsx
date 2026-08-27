import {
  ApartmentIcon,
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  MoreHorizontalIcon,
  ShieldCheck,
  ShieldKeyIcon,
  Sorting01Icon,
  TextFontIcon,
  UserBlock01Icon,
  UserIcon,
  ViewIcon,
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
import type { GetUsersTableColumnsProps, User } from "@/types/iam/users";

export const USER_ROLES = ["owner", "admin", "member", "viewer"] as const;
export const USER_STATUSES = [
  "active",
  "inactive",
  "pending",
  "suspended",
] as const;
export const USER_DEPARTMENTS = [
  "engineering",
  "design",
  "marketing",
  "sales",
  "support",
] as const;

export function getRoleIcon(role: User["role"]) {
  switch (role) {
    case "owner":
      return (props: any) => (
        <HugeiconsIcon icon={ShieldKeyIcon} strokeWidth={2} {...props} />
      );
    case "admin":
      return (props: any) => (
        <HugeiconsIcon icon={ShieldCheck} strokeWidth={2} {...props} />
      );
    case "member":
      return (props: any) => (
        <HugeiconsIcon icon={UserIcon} strokeWidth={2} {...props} />
      );
    case "viewer":
      return (props: any) => (
        <HugeiconsIcon icon={ViewIcon} strokeWidth={2} {...props} />
      );
  }
}

export function getStatusIcon(status: User["status"]) {
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
    case "pending":
      return (props: any) => (
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} {...props} />
      );
    case "suspended":
      return (props: any) => (
        <HugeiconsIcon icon={UserBlock01Icon} strokeWidth={2} {...props} />
      );
  }
}

const BuildingIconComp = (props: any) => (
  <HugeiconsIcon icon={ApartmentIcon} strokeWidth={2} {...props} />
);
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

export function getUsersTableColumns({
  statusCounts,
  roleCounts,
  departmentCounts,
  loginCountRange,
  setRowAction,
  onUpdateUserRole,
}: GetUsersTableColumnsProps): ColumnDef<User>[] {
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
        <div className="w-20 font-mono text-xs">{row.getValue("code")}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "name",
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="User Name" />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="max-w-125 truncate font-medium">
            {row.getValue("name")}
          </span>
          <span className="text-muted-foreground text-xs">
            {row.original.email}
          </span>
        </div>
      ),
      meta: {
        label: "Name",
        placeholder: "Search by name or email",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "email",
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Email" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs">
          {/* <HugeiconsIcon
            icon={Mail01Icon}
            strokeWidth={2}
            className="text-muted-foreground size-3.5"
          /> */}
          <span className="truncate">{row.getValue("email")}</span>
        </div>
      ),
      enableColumnFilter: true,
    },
    {
      id: "role",
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Role" />
      ),
      cell: ({ cell }) => {
        const role = cell.getValue<User["role"]>();
        if (!role) return null;
        const Icon = getRoleIcon(role);

        return (
          <Badge
            variant="outline"
            className="gap-1 py-1 capitalize [&>svg]:size-3.5"
          >
            <Icon />
            {role}
          </Badge>
        );
      },
      meta: {
        label: "Role",
        variant: "multiSelect",
        options: USER_ROLES.map((role) => ({
          label: role.charAt(0).toUpperCase() + role.slice(1),
          value: role,
          count: roleCounts[role],
          icon: getRoleIcon(role),
        })),
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
        const status = cell.getValue<User["status"]>();
        if (!status) return null;
        const Icon = getStatusIcon(status);

        return (
          <Badge
            variant="outline"
            className="gap-1 py-1 capitalize [&>svg]:size-3.5"
          >
            <Icon />
            {status}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: USER_STATUSES.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
          count: statusCounts[status],
          icon: getStatusIcon(status),
        })),
        icon: CheckmarkIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "department",
      accessorKey: "department",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Department" />
      ),
      cell: ({ cell }) => {
        const dept = cell.getValue<User["department"]>();
        if (!dept) return null;
        return (
          <Badge
            variant="secondary"
            className="border-border border py-1 capitalize"
          >
            {dept}
          </Badge>
        );
      },
      meta: {
        label: "Department",
        variant: "multiSelect",
        options: USER_DEPARTMENTS.map((dept) => ({
          label: dept.charAt(0).toUpperCase() + dept.slice(1),
          value: dept,
          count: departmentCounts[dept],
          icon: BuildingIconComp,
        })),
        icon: BuildingIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "loginCount",
      accessorKey: "loginCount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Logins" />
      ),
      cell: ({ cell }) => {
        const count = cell.getValue<number>();
        return <div className="w-16 text-right font-mono">{count}</div>;
      },
      meta: {
        label: "Logins",
        variant: "range",
        range: [loginCountRange.min, loginCountRange.max],
        unit: "logins",
        icon: ClockIconComp,
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => toast.info("Edit user clicked")}>
                Edit User
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.role}
                    onValueChange={(value) => {
                      onUpdateUserRole?.(
                        row.original.id,
                        value as User["role"]
                      );
                      toast.success(`Role updated to ${value}`);
                    }}
                  >
                    {USER_ROLES.map((role) => (
                      <DropdownMenuRadioItem
                        key={role}
                        value={role}
                        className="capitalize"
                      >
                        {role}
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
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
