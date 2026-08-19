import {
  Add01Icon,
  CheckmarkCircle02Icon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ModulesPage() {
  const modules = [
    {
      id: "mod-1",
      name: "Identity & Access (IAM)",
      route: "/iam/*",
      priority: 1,
      isSystem: true,
    },
    {
      id: "mod-2",
      name: "User Management",
      route: "/iam/users",
      priority: 2,
      isSystem: true,
    },
    {
      id: "mod-3",
      name: "Roles & Permissions",
      route: "/iam/roles",
      priority: 3,
      isSystem: true,
    },
    {
      id: "mod-4",
      name: "Policies Registry",
      route: "/iam/policies",
      priority: 4,
      isSystem: true,
    },
    {
      id: "mod-5",
      name: "Security & Audit",
      route: "/iam/audit",
      priority: 5,
      isSystem: false,
    },
    {
      id: "mod-6",
      name: "Governance & Tools",
      route: "/iam/access-matrix",
      priority: 6,
      isSystem: false,
    },
  ];

  return (
    <PageWrapper
      title="Modules Tree Structure"
      subtitle="Configure system modules, route prefixes, and sidebar menu priority hierarchy."
      action={
        <Button>
          <HugeiconsIcon icon={Add01Icon} size={16} />
          Add New Module
        </Button>
      }
    >
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <h2 className="text-lg font-semibold">Registered System Modules</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Module ID</th>
                <th className="px-4 py-3">Module Name</th>
                <th className="px-4 py-3">Route Scope</th>
                <th className="px-4 py-3 text-center">Priority</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {modules.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30">
                  <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                    {m.id}
                  </td>
                  <td className="flex items-center gap-2 px-4 py-3 font-medium">
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      size={16}
                      className="text-primary"
                    />
                    {m.name}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{m.route}</td>
                  <td className="px-4 py-3 text-center">{m.priority}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className="gap-1 text-emerald-600">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                      Active
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
