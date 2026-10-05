import { EmptyAnalyticsIllustration, EmptyDataTable } from "@/components/empty";
import { PageWrapper } from "@/components/page-wrapper";

export default function DashboardPage() {
  return (
    <PageWrapper
      title="Dashboard"
      subtitle="This is a protected dashboard page. Only authenticated users should see this."
    >
      <div className="flex h-[70dvh] items-center justify-center">
        <EmptyDataTable
          emptyStateWidget={
            <EmptyAnalyticsIllustration className="mx-auto mb-4" />
          }
          emptyStateDescription="There is nothing here to view right now, please do some activity to get started."
        />
      </div>
    </PageWrapper>
  );
}
