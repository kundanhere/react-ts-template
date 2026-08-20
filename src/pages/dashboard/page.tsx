import { PageWrapper } from "@/components/page-wrapper";

export default function DashboardPage() {
  return (
    <PageWrapper
      title="Dashboard"
      subtitle="This is a protected dashboard page. Only authenticated users should see this."
    >
      <h1>Hello</h1>
    </PageWrapper>
  );
}
