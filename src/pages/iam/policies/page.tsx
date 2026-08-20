import { PageWrapper } from "@/components/page-wrapper";

import { PoliciesTable } from "./components/policies-table";

export default function PoliciesPage() {
  return (
    <PageWrapper
      title="Policies Registry"
      subtitle="Manage granular access control rules, conditions, and policy JSON definitions."
    >
      <PoliciesTable />
    </PageWrapper>
  );
}
