import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";

export default function InboxPage() {
  const notifications = [
    {
      id: "notif-1",
      title: "Security Alert: Unusual Login Attempt",
      time: "15 mins ago",
      read: false,
    },
    {
      id: "notif-2",
      title: "Role Assignment Changed for Jane Doe",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "notif-3",
      title: "Monthly Audit Log Archive Ready for Download",
      time: "1 day ago",
      read: true,
    },
  ];

  return (
    <PageWrapper
      title="Notifications & Inbox"
      subtitle="Security alerts, system notifications, and admin activity messages."
    >
      <div className="bg-card flex flex-col gap-3 rounded-xl border p-6 shadow-xs">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="bg-muted/20 hover:bg-muted/40 flex items-center justify-between rounded-lg border p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              {!n.read && <div className="bg-primary size-2 rounded-full" />}
              <span className="text-sm font-medium">{n.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs">{n.time}</span>
              <Badge variant={n.read ? "outline" : "secondary"}>
                {n.read ? "Read" : "New"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
