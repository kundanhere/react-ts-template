import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";

export default function MyActivityPage() {
  const activities = [
    {
      id: "act-1",
      timestamp: "Today at 10:24 AM",
      action: "Updated user role for Jane Doe to Senior Administrator",
      ip: "192.168.1.45",
    },
    {
      id: "act-2",
      timestamp: "Yesterday at 4:15 PM",
      action: "Created new security policy override",
      ip: "192.168.1.45",
    },
    {
      id: "act-3",
      timestamp: "3 days ago",
      action: "Logged into Admin CMS from Chrome on macOS",
      ip: "192.168.1.45",
    },
  ];

  return (
    <PageWrapper
      title="My Activity Log"
      subtitle="Personal audit history of actions performed by your authenticated account."
    >
      <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <div className="flex flex-col gap-4">
          {activities.map((a) => (
            <div
              key={a.id}
              className="bg-muted/20 flex flex-col justify-between gap-2 rounded-lg border p-4 md:flex-row md:items-center"
            >
              <div>
                <p className="text-sm font-medium">{a.action}</p>
                <p className="text-muted-foreground text-xs">{a.timestamp}</p>
              </div>
              <Badge variant="outline" className="w-fit font-mono text-xs">
                IP: {a.ip}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
