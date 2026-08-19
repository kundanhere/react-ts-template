import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function FeedbackPage() {
  return (
    <PageWrapper
      title="User Feedback"
      subtitle="Help us improve Sentry IAM. Send suggestions, feature requests, or report UI bugs directly."
    >
      <div className="bg-card flex max-w-2xl flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <h2 className="text-lg font-semibold">Submit Your Feedback</h2>
        <div className="flex flex-col gap-2">
          <label className="text-muted-foreground text-xs font-medium">
            Comments & Suggestions
          </label>
          <Textarea
            placeholder="Share your experience or suggest new features..."
            className="h-32"
          />
        </div>
        <Button className="w-fit">Submit Feedback</Button>
      </div>
    </PageWrapper>
  );
}
