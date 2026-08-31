import { PageWrapper } from "@/components/page-wrapper";

import { ActivityTable } from "./components/activity-table";

export default function MyActivityPage() {
  return (
    <PageWrapper
      title="Activity Log"
      subtitle="Personal audit history of authorization events, configuration changes, and actions performed by your authenticated account."
    >
      <ActivityTable />
    </PageWrapper>
  );
}
