import { PageWrapper } from "@/components/page-wrapper";
import { toast } from "@/components/ui/toast";

import { RolesTable } from "./components/roles-table";

export default function RolesPage() {
  const handleNewRoleClick = () => {
    toast.info("Create Role modal triggered");
  };

  return (
    <PageWrapper
      title="Role Management"
      subtitle="Define role hierarchy, attach access policies, and inspect effective capabilities."
    >
      <RolesTable onNewRoleClick={handleNewRoleClick} />
    </PageWrapper>
  );
}
