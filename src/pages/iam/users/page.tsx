import { PageWrapper } from "@/components/page-wrapper";

import { UsersTable } from "./components/users-table";

export default function UsersPage() {
  return (
    <PageWrapper
      title="User Management"
      subtitle="Manage user permissions, roles, access levels, and account status across the organization."
    >
      <UsersTable />
    </PageWrapper>
  );
}
