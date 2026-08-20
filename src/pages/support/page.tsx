import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <PageWrapper
      title="Support & Help Center"
      subtitle="Access documentation, submit ticket requests, or contact system administrators."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">Documentation & Guides</h2>
          <p className="text-muted-foreground text-sm">
            Explore the Admin CMS Sidebar & Permission UI Architecture Guide for
            details on policy structures and roles.
          </p>
          <Button variant="outline" className="w-fit">
            View Architecture Guide
          </Button>
        </div>

        <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
          <h2 className="text-lg font-semibold">Submit a Support Ticket</h2>
          <p className="text-muted-foreground text-sm">
            Encountering an issue or requiring emergency role elevation? Reach
            out to the Sentry IAM team.
          </p>
          <Button className="w-fit">Create Support Ticket</Button>
        </div>
      </div>
    </PageWrapper>
  );
}
