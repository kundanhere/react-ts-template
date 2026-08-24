import { PageWrapper } from "@/components/page-wrapper";

import { AuditLogsTable } from "./components/audit-logs-table";

export default function AuditLogsPage() {
  return (
    <PageWrapper
      title="System Audit Logs"
      subtitle="Immutable trail of authorization events, policy evaluation outcomes, and administrative changes."
    >
      <AuditLogsTable />
    </PageWrapper>
  );
}
