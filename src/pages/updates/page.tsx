import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";

export default function UpdatesPage() {
  const updates = [
    {
      version: "v2.4.0",
      date: "August 18, 2026",
      title: "Enhanced Policy Simulator & Dynamic Breadcrumb Navigation",
      description:
        "Added real-time policy evaluation traces, fine-grained breadcrumb resolution, and dark mode optimizations.",
    },
    {
      version: "v2.3.1",
      date: "August 10, 2026",
      title: "Multi-Factor Authentication (MFA) Policy Enforcement",
      description:
        "Administrators can now mandate Hardware Security Keys and TOTP authenticators across IAM personas.",
    },
  ];

  return (
    <PageWrapper
      title="System Updates & Release Notes"
      subtitle="Latest platform enhancements, security patches, and product release logs."
    >
      <div className="flex flex-col gap-4">
        {updates.map((u) => (
          <div
            key={u.version}
            className="bg-card flex flex-col gap-2 rounded-xl border p-6 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default">{u.version}</Badge>
                <h2 className="text-lg font-semibold">{u.title}</h2>
              </div>
              <span className="text-muted-foreground text-xs">{u.date}</span>
            </div>
            <p className="text-muted-foreground text-sm">{u.description}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
