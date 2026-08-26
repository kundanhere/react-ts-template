import { PageWrapper } from "@/components/page-wrapper";

import { SessionsTable } from "./components/sessions-table";

export default function SessionsPage() {
  return (
    <PageWrapper
      title="Active User Sessions"
      subtitle="Inspect active authentication tokens, device footprints, and revoke unauthorized sessions in real time."
    >
      <SessionsTable />
    </PageWrapper>
  );
}
