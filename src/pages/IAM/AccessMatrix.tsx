import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";

export default function AccessMatrixPage() {
  const matrix = [
    {
      module: "Users",
      superAdmin: "Full",
      editor: "View",
      viewer: "View",
      guest: "—",
    },
    {
      module: "Roles",
      superAdmin: "Full",
      editor: "—",
      viewer: "—",
      guest: "—",
    },
    {
      module: "Policies",
      superAdmin: "Full",
      editor: "View",
      viewer: "—",
      guest: "—",
    },
    {
      module: "Modules",
      superAdmin: "Full",
      editor: "View",
      viewer: "—",
      guest: "—",
    },
    {
      module: "Audit Logs",
      superAdmin: "Full",
      editor: "View",
      viewer: "View",
      guest: "—",
    },
    {
      module: "Security Settings",
      superAdmin: "Full",
      editor: "—",
      viewer: "—",
      guest: "—",
    },
  ];

  return (
    <PageWrapper
      title="Visual Access Matrix"
      subtitle="Comprehensive grid mapping assigned system roles against module capability levels."
    >
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <h2 className="text-lg font-semibold">
          Capabilities Grid (Roles vs Modules)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
              <tr>
                <th className="border-r px-4 py-3">Module \ Role</th>
                <th className="border-r px-4 py-3 text-center">Super Admin</th>
                <th className="border-r px-4 py-3 text-center">Editor</th>
                <th className="border-r px-4 py-3 text-center">Viewer</th>
                <th className="px-4 py-3 text-center">Guest</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {matrix.map((row) => (
                <tr key={row.module} className="hover:bg-muted/30">
                  <td className="border-r px-4 py-3 font-semibold">
                    {row.module}
                  </td>
                  <td className="border-r px-4 py-3 text-center">
                    <Badge variant="default" className="gap-1">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                      {row.superAdmin}
                    </Badge>
                  </td>
                  <td className="border-r px-4 py-3 text-center">
                    {row.editor !== "—" ? (
                      <Badge variant="secondary">{row.editor}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="border-r px-4 py-3 text-center">
                    {row.viewer !== "—" ? (
                      <Badge variant="outline">{row.viewer}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-muted-foreground">—</span>
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
