import { Typography } from "@/components/typography";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <Typography variant="h1" className="mb-4">
        Dashboard
      </Typography>
      <Typography variant="p">
        This is a protected dashboard page. Only authenticated users should see
        this.
      </Typography>
    </div>
  );
}
