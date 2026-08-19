import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AuditLogsPage() {
  const logs = [
    {
      id: "log-501",
      timestamp: "2026-08-19 10:24:12",
      actor: "Kundan Gupta",
      action: "iam:UpdateUserRole",
      resource: "User #42 (Jane Doe)",
      status: "SUCCESS",
    },
    {
      id: "log-502",
      timestamp: "2026-08-19 09:55:01",
      actor: "Jane Doe",
      action: "iam:CreatePolicy",
      resource: "Policy #pol-104",
      status: "SUCCESS",
    },
    {
      id: "log-503",
      timestamp: "2026-08-19 08:30:44",
      actor: "Unknown (IP 45.12.3.1)",
      action: "iam:Authenticate",
      resource: "Login Attempt",
      status: "DENIED",
    },
  ];

  return (
    <PageWrapper
      title="System Audit Logs"
      subtitle="Immutable trail of authorization events, policy evaluation outcomes, and administrative changes."
      action={<Button variant="outline">Export Log File</Button>}
    >
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Target Resource</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y font-mono text-xs">
              {logs.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="text-muted-foreground px-4 py-3">
                    {l.timestamp}
                  </td>
                  <td className="px-4 py-3 font-sans font-medium">{l.actor}</td>
                  <td className="text-primary px-4 py-3 font-semibold">
                    {l.action}
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    {l.resource}
                  </td>
                  <td className="px-4 py-3 text-center font-sans">
                    <Badge
                      variant={
                        l.status === "SUCCESS" ? "default" : "destructive"
                      }
                    >
                      {l.status}
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
