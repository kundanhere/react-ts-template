import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export type FeedbackType =
  "feedback" | "bug" | "feature" | "improvement" | "performance";

export type FeedbackCategory =
  "auth" | "iam" | "ui_ux" | "api" | "performance" | "billing" | "general";

export type FeedbackPriority = "low" | "medium" | "high" | "critical";

export type FeedbackStatus =
  "new" | "in_review" | "in_progress" | "resolved" | "closed";

export interface IFeedbackAuthor {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface IFeedback {
  id: string;
  code: string;
  title: string;
  description: string;
  stepsToReproduce?: string;
  type: FeedbackType;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  rating: number; // 1 - 5
  author: IFeedbackAuthor;
  deviceInfo?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetFeedbackTableColumnsProps {
  typeCounts: Record<FeedbackType, number>;
  categoryCounts: Record<FeedbackCategory, number>;
  priorityCounts: Record<FeedbackPriority, number>;
  statusCounts: Record<FeedbackStatus, number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<IFeedback> | null>
  >;
  onViewDetails: (feedback: IFeedback) => void;
  onUpdateStatus?: (feedbackId: string, status: FeedbackStatus) => void;
  onUpdatePriority?: (feedbackId: string, priority: FeedbackPriority) => void;
  onDuplicateFeedback?: (feedback: IFeedback) => void;
}

export interface IFeedbackTableProps {
  feedbacks: IFeedback[];
  onUpdateFeedback: (feedback: IFeedback) => void;
  onDeleteFeedback: (ids: string[]) => void;
  onDuplicateFeedback: (feedback: IFeedback) => void;
  onNewFeedbackClick: () => void;
  queryKeys?: Partial<IQueryKeys>;
}

export interface IFeedbackTableActionBarProps {
  table: Table<IFeedback>;
  onBulkUpdateStatus?: (feedbackIds: string[], status: FeedbackStatus) => void;
  onBulkUpdatePriority?: (
    feedbackIds: string[],
    priority: FeedbackPriority
  ) => void;
  onBulkDelete?: (feedbackIds: string[]) => void;
}

export interface IFeedbackTableToolbarActionsProps {
  table: Table<IFeedback>;
  onNewFeedbackClick: () => void;
}

export interface IDeleteFeedbackDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  feedbacks: IFeedback[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeleteFeedback?: (feedbackIds: string[]) => void;
}
