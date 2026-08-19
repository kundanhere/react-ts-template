import { UsersTable } from "./components/users-table";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage user permissions, roles, access levels, and account status
          across the organization.
        </p>
      </div>

      <UsersTable />
    </div>
  );
}
