import { PageWrapper } from "@/components/page-wrapper";

import { ModulesTable } from "./components/modules-table";

export default function ModulesPage() {
  return (
    <PageWrapper
      title="Modules Tree Structure"
      subtitle="Configure system modules, route prefixes, and sidebar menu priority hierarchy."
    >
      <ModulesTable />
    </PageWrapper>
  );
}
