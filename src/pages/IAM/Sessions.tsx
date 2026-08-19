import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SessionsPage() {
  const sessions = [
    {
      id: "sess-901",
      user: "Kundan Gupta",
      ip: "192.168.1.45",
      device: "Chrome on macOS (Current Session)",
      startedAt: "10 mins ago",
      isCurrent: true,
    },
    {
      id: "sess-902",
      user: "Jane Doe",
      ip: "10.0.0.12",
      device: "Firefox on Windows 11",
      startedAt: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "sess-903",
      user: "Alex Smith",
      ip: "172.16.0.88",
      device: "Safari on iOS",
      startedAt: "5 hours ago",
      isCurrent: false,
    },
  ];

  return (
    <PageWrapper
      title="Active User Sessions"
      subtitle="Inspect active authentication tokens and revoke unauthorized sessions in real time."
      action={<Button variant="destructive">Revoke All Other Sessions</Button>}
    >
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Device & Client</th>
                <th className="px-4 py-3">Session Age</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30">
                  <td className="flex items-center gap-2 px-4 py-3 font-medium">
                    {s.user}
                    {s.isCurrent && (
                      <Badge variant="secondary">This Device</Badge>
                    )}
                  </td>
                  <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                    {s.ip}
                  </td>
                  <td className="px-4 py-3">{s.device}</td>
                  <td className="text-muted-foreground px-4 py-3 text-xs">
                    {s.startedAt}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.isCurrent ? (
                      <span className="text-muted-foreground text-xs font-medium">
                        Active Now
                      </span>
                    ) : (
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    )}
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
