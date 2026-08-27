import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction } from "@/types/data-table";
import type { User, UsersTableProps } from "@/types/iam/users";

import { DeleteUsersDialog } from "./delete-users-dialog";
import { UsersTableActionBar } from "./users-table-action-bar";
import { getUsersTableColumns } from "./users-table-columns";
import { UsersTableToolbarActions } from "./users-table-toolbar-actions";

const INITIAL_USERS: User[] = [
  {
    id: "usr_1",
    code: "USR-1001",
    name: "Alex Morgan",
    email: "alex.morgan@company.com",
    role: "owner",
    status: "active",
    department: "engineering",
    loginCount: 142,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "usr_2",
    code: "USR-1002",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    role: "admin",
    status: "active",
    department: "design",
    loginCount: 98,
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "usr_3",
    code: "USR-1003",
    name: "Michael Scott",
    email: "michael.scott@company.com",
    role: "member",
    status: "active",
    department: "sales",
    loginCount: 64,
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "usr_4",
    code: "USR-1004",
    name: "Dwight Schrute",
    email: "dwight.schrute@company.com",
    role: "admin",
    status: "active",
    department: "sales",
    loginCount: 185,
    createdAt: new Date("2023-03-12"),
  },
  {
    id: "usr_5",
    code: "USR-1005",
    name: "Jim Halpert",
    email: "jim.halpert@company.com",
    role: "member",
    status: "pending",
    department: "sales",
    loginCount: 45,
    createdAt: new Date("2023-04-01"),
  },
  {
    id: "usr_6",
    code: "USR-1006",
    name: "Pam Beesly",
    email: "pam.beesly@company.com",
    role: "member",
    status: "active",
    department: "design",
    loginCount: 72,
    createdAt: new Date("2023-04-05"),
  },
  {
    id: "usr_7",
    code: "USR-1007",
    name: "Ryan Howard",
    email: "ryan.howard@company.com",
    role: "viewer",
    status: "suspended",
    department: "marketing",
    loginCount: 12,
    createdAt: new Date("2023-05-18"),
  },
  {
    id: "usr_8",
    code: "USR-1008",
    name: "Angela Martin",
    email: "angela.martin@company.com",
    role: "admin",
    status: "active",
    department: "engineering",
    loginCount: 110,
    createdAt: new Date("2023-06-22"),
  },
  {
    id: "usr_9",
    code: "USR-1009",
    name: "Kevin Malone",
    email: "kevin.malone@company.com",
    role: "viewer",
    status: "inactive",
    department: "engineering",
    loginCount: 28,
    createdAt: new Date("2023-07-14"),
  },
  {
    id: "usr_10",
    code: "USR-1010",
    name: "Oscar Martinez",
    email: "oscar.martinez@company.com",
    role: "member",
    status: "active",
    department: "support",
    loginCount: 95,
    createdAt: new Date("2023-08-30"),
  },
];

export function UsersTable({ queryKeys }: UsersTableProps) {
  const [users, setUsers] = React.useState<User[]>(INITIAL_USERS);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<User> | null>(null);

  const statusCounts = React.useMemo(
    () =>
      users.reduce(
        (acc, user) => {
          acc[user.status] = (acc[user.status] || 0) + 1;
          return acc;
        },
        { active: 0, inactive: 0, pending: 0, suspended: 0 } as Record<
          User["status"],
          number
        >
      ),
    [users]
  );

  const roleCounts = React.useMemo(
    () =>
      users.reduce(
        (acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        },
        { owner: 0, admin: 0, member: 0, viewer: 0 } as Record<
          User["role"],
          number
        >
      ),
    [users]
  );

  const departmentCounts = React.useMemo(
    () =>
      users.reduce(
        (acc, user) => {
          acc[user.department] = (acc[user.department] || 0) + 1;
          return acc;
        },
        {
          engineering: 0,
          design: 0,
          marketing: 0,
          sales: 0,
          support: 0,
        } as Record<User["department"], number>
      ),
    [users]
  );

  const loginCountRange = React.useMemo(() => {
    if (users.length === 0) return { min: 0, max: 200 };
    const counts = users.map((u) => u.loginCount);
    return {
      min: Math.min(...counts),
      max: Math.max(...counts),
    };
  }, [users]);

  const handleUpdateRole = React.useCallback(
    (userId: string, role: User["role"]) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    },
    []
  );

  const handleBulkUpdateStatus = React.useCallback(
    (userIds: string[], status: User["status"]) => {
      setUsers((prev) =>
        prev.map((u) => (userIds.includes(u.id) ? { ...u, status } : u))
      );
    },
    []
  );

  const handleBulkUpdateRole = React.useCallback(
    (userIds: string[], role: User["role"]) => {
      setUsers((prev) =>
        prev.map((u) => (userIds.includes(u.id) ? { ...u, role } : u))
      );
    },
    []
  );

  const handleBulkDelete = React.useCallback((userIds: string[]) => {
    setUsers((prev) => prev.filter((u) => !userIds.includes(u.id)));
  }, []);

  const columns = React.useMemo(
    () =>
      getUsersTableColumns({
        statusCounts,
        roleCounts,
        departmentCounts,
        loginCountRange,
        setRowAction,
        onUpdateUserRole: handleUpdateRole,
      }),
    [
      statusCounts,
      roleCounts,
      departmentCounts,
      loginCountRange,
      handleUpdateRole,
    ]
  );

  const { table } = useDataTable({
    data: users,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <UsersTableActionBar
            table={table}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkUpdateRole={handleBulkUpdateRole}
            onBulkDelete={handleBulkDelete}
          />
        }
      >
        <DataTableToolbar table={table}>
          <UsersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <DeleteUsersDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        users={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onDeleteUsers={handleBulkDelete}
      />
    </>
  );
}
