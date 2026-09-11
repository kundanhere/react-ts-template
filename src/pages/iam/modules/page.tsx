import { PageWrapper } from "@/components/page-wrapper";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ModulesTable } from "./components/modules-table";

export default function ModulesPage() {
  return (
    <TooltipProvider delay={150}>
      <PageWrapper
        title="Module Management"
        subtitle="Configure system modules, route prefixes, and sidebar navigation hierarchy."
      >
        <ModulesTable />
      </PageWrapper>
    </TooltipProvider>
  );
}
