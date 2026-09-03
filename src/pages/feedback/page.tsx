import * as React from "react";

import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { IFeedback } from "@/types/feedback";
import { getItem, setItem } from "@/utils/local-storage";

import { FeedbackStatsCards } from "./components/feedback-stats-cards";
import { FeedbackSubmissionDialog } from "./components/feedback-submission-dialog";
import { FeedbackTable } from "./components/feedback-table";
import { INITIAL_FEEDBACKS } from "./data/mock-feedback";

const LS_KEY = "sentry_user_feedbacks_v1";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = React.useState<IFeedback[]>([]);
  const [isSubmissionOpen, setIsSubmissionOpen] = React.useState(false);

  // Initialize data from local storage or fallback to mock data
  React.useEffect(() => {
    const cached = getItem<any[]>(LS_KEY);
    if (cached && Array.isArray(cached) && cached.length > 0) {
      // Rehydrate Dates
      const parsed: IFeedback[] = cached.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
      setFeedbacks(parsed);
    } else {
      setFeedbacks(INITIAL_FEEDBACKS);
      setItem(LS_KEY, INITIAL_FEEDBACKS);
    }
  }, []);

  const handleUpdateFeedback = React.useCallback((updated: IFeedback) => {
    setFeedbacks((prev) => {
      const next = prev.map((f) => (f.id === updated.id ? updated : f));
      setItem(LS_KEY, next);
      return next;
    });
  }, []);

  const handleDeleteFeedback = React.useCallback((ids: string[]) => {
    setFeedbacks((prev) => {
      const next = prev.filter((f) => !ids.includes(f.id));
      setItem(LS_KEY, next);
      return next;
    });
  }, []);

  const handleDuplicateFeedback = React.useCallback(
    (item: IFeedback) => {
      const nextNum = feedbacks.length + 1;
      const duplicated: IFeedback = {
        ...item,
        id: `fb-${Date.now()}`,
        code: `${item.type === "bug" ? "BUG" : "FB"}-10${nextNum < 10 ? `0${nextNum}` : nextNum}`,
        title: `${item.title} (Copy)`,
        status: "new",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setFeedbacks((prev) => {
        const next = [duplicated, ...prev];
        setItem(LS_KEY, next);
        return next;
      });
      toast.success(`Duplicated item "${item.title}"`);
    },
    [feedbacks.length]
  );

  const handleSubmitNewFeedback = React.useCallback(
    (newFeedback: IFeedback) => {
      setFeedbacks((prev) => {
        const next = [newFeedback, ...prev];
        setItem(LS_KEY, next);
        return next;
      });
    },
    []
  );

  const handleResetData = React.useCallback(() => {
    setFeedbacks(INITIAL_FEEDBACKS);
    setItem(LS_KEY, INITIAL_FEEDBACKS);
    toast.success("Feedback records restored to defaults");
  }, []);

  return (
    <PageWrapper
      title="Feedback & Issue Tracker"
      subtitle="Gather user insights, report platform bugs, and manage product feedback reviews."
      action={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetData}
            className="border-border/80 h-8 gap-1.5 text-xs font-medium"
          >
            <HugeiconsIcon icon={RefreshIcon} size={14} />
            Reset Data
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Top KPI Stats (similar to IAM Dashboard / Analytics KPI cards) */}
        <FeedbackStatsCards feedbacks={feedbacks} />

        {/* Data Table (matching IAM Policies data table architecture with filters, toolbar, action bar) */}
        <FeedbackTable
          feedbacks={feedbacks}
          onUpdateFeedback={handleUpdateFeedback}
          onDeleteFeedback={handleDeleteFeedback}
          onDuplicateFeedback={handleDuplicateFeedback}
          onNewFeedbackClick={() => setIsSubmissionOpen(true)}
        />
      </div>

      {/* Modern CMS Submission Dialog */}
      <FeedbackSubmissionDialog
        open={isSubmissionOpen}
        onOpenChange={setIsSubmissionOpen}
        onSubmitFeedback={handleSubmitNewFeedback}
      />
    </PageWrapper>
  );
}
