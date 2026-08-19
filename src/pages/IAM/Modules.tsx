import { PageWrapper } from "@/components/page-wrapper";

import { ModulesTable } from "./components/modules-table";

export default function ModulesPage() {
  return (
    <PageWrapper
      title="Module Management"
      subtitle="Configure system modules, route prefixes, and sidebar navigation hierarchy."
    >
      <ModulesTable />
    </PageWrapper>
  );
}
