import * as React from "react";

import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useDataTable } from "@/hooks/use-data-table";
import type { IDataTableRowAction } from "@/types/data-table";
import type {
  FeedbackCategory,
  FeedbackPriority,
  FeedbackStatus,
  FeedbackType,
  IFeedback,
  IFeedbackTableProps,
} from "@/types/feedback";

import { DeleteFeedbackDialog } from "./delete-feedback-dialog";
import { FeedbackDetailDialog } from "./feedback-detail-dialog";
import { FeedbackTableActionBar } from "./feedback-table-action-bar";
import { getFeedbackTableColumns } from "./feedback-table-columns";
import { FeedbackTableToolbarActions } from "./feedback-table-toolbar-actions";

export function FeedbackTable({
  feedbacks,
  onUpdateFeedback,
  onDeleteFeedback,
  onDuplicateFeedback,
  onNewFeedbackClick,
  queryKeys,
}: IFeedbackTableProps) {
  const [rowAction, setRowAction] =
    React.useState<IDataTableRowAction<IFeedback> | null>(null);
  const [inspectFeedback, setInspectFeedback] =
    React.useState<IFeedback | null>(null);

  const typeCounts = React.useMemo(
    () =>
      feedbacks.reduce(
        (acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        },
        {
          feedback: 0,
          bug: 0,
          feature: 0,
          improvement: 0,
          performance: 0,
        } as Record<FeedbackType, number>
      ),
    [feedbacks]
  );

  const categoryCounts = React.useMemo(
    () =>
      feedbacks.reduce(
        (acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + 1;
          return acc;
        },
        {
          auth: 0,
          iam: 0,
          ui_ux: 0,
          api: 0,
          performance: 0,
          billing: 0,
          general: 0,
        } as Record<FeedbackCategory, number>
      ),
    [feedbacks]
  );

  const priorityCounts = React.useMemo(
    () =>
      feedbacks.reduce(
        (acc, item) => {
          acc[item.priority] = (acc[item.priority] || 0) + 1;
          return acc;
        },
        { low: 0, medium: 0, high: 0, critical: 0 } as Record<
          FeedbackPriority,
          number
        >
      ),
    [feedbacks]
  );

  const statusCounts = React.useMemo(
    () =>
      feedbacks.reduce(
        (acc, item) => {
          acc[item.status] = (acc[item.status] || 0) + 1;
          return acc;
        },
        {
          new: 0,
          in_review: 0,
          in_progress: 0,
          resolved: 0,
          closed: 0,
        } as Record<FeedbackStatus, number>
      ),
    [feedbacks]
  );

  const handleUpdateStatus = React.useCallback(
    (feedbackId: string, status: FeedbackStatus) => {
      const target = feedbacks.find((f) => f.id === feedbackId);
      if (target) {
        onUpdateFeedback({ ...target, status, updatedAt: new Date() });
      }
      if (inspectFeedback?.id === feedbackId) {
        setInspectFeedback((prev) => (prev ? { ...prev, status } : null));
      }
    },
    [feedbacks, onUpdateFeedback, inspectFeedback]
  );

  const handleUpdatePriority = React.useCallback(
    (feedbackId: string, priority: FeedbackPriority) => {
      const target = feedbacks.find((f) => f.id === feedbackId);
      if (target) {
        onUpdateFeedback({ ...target, priority, updatedAt: new Date() });
      }
      if (inspectFeedback?.id === feedbackId) {
        setInspectFeedback((prev) => (prev ? { ...prev, priority } : null));
      }
    },
    [feedbacks, onUpdateFeedback, inspectFeedback]
  );

  const handleBulkUpdateStatus = React.useCallback(
    (ids: string[], status: FeedbackStatus) => {
      ids.forEach((id) => {
        const target = feedbacks.find((f) => f.id === id);
        if (target) {
          onUpdateFeedback({ ...target, status, updatedAt: new Date() });
        }
      });
    },
    [feedbacks, onUpdateFeedback]
  );

  const handleBulkUpdatePriority = React.useCallback(
    (ids: string[], priority: FeedbackPriority) => {
      ids.forEach((id) => {
        const target = feedbacks.find((f) => f.id === id);
        if (target) {
          onUpdateFeedback({ ...target, priority, updatedAt: new Date() });
        }
      });
    },
    [feedbacks, onUpdateFeedback]
  );

  const columns = React.useMemo(
    () =>
      getFeedbackTableColumns({
        typeCounts,
        categoryCounts,
        priorityCounts,
        statusCounts,
        setRowAction,
        onViewDetails: (item) => setInspectFeedback(item),
        onUpdateStatus: handleUpdateStatus,
        onUpdatePriority: handleUpdatePriority,
        onDuplicateFeedback,
      }),
    [
      typeCounts,
      categoryCounts,
      priorityCounts,
      statusCounts,
      handleUpdateStatus,
      handleUpdatePriority,
      onDuplicateFeedback,
    ]
  );

  const { table } = useDataTable({
    data: feedbacks,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    queryKeys,
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={
          <FeedbackTableActionBar
            table={table}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkUpdatePriority={handleBulkUpdatePriority}
            onBulkDelete={onDeleteFeedback}
          />
        }
        emptyStateTitle="No reviews or bug reports found"
        emptyStateDescription="Get started by submitting user feedback, reporting an issue, or adjusting your active filters."
        emptyStateActions={
          <Button onClick={onNewFeedbackClick} size="sm" className="gap-1.5">
            <HugeiconsIcon
              icon={Add01Icon}
              strokeWidth={2}
              className="size-4"
            />
            Submit Feedback
          </Button>
        }
      >
        <DataTableToolbar table={table}>
          <FeedbackTableToolbarActions
            table={table}
            onNewFeedbackClick={onNewFeedbackClick}
          />
        </DataTableToolbar>
      </DataTable>

      <DeleteFeedbackDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        feedbacks={rowAction?.row.original ? [rowAction.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onDeleteFeedback={onDeleteFeedback}
      />

      <FeedbackDetailDialog
        open={inspectFeedback !== null}
        onOpenChange={(open) => {
          if (!open) setInspectFeedback(null);
        }}
        feedback={inspectFeedback}
        onUpdateStatus={handleUpdateStatus}
      />
    </>
  );
}
