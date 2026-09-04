import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export type UpdateType =
  "major" | "minor" | "patch" | "security" | "hotfix" | "maintenance";

export type UpdateChannel = "stable" | "beta" | "security" | "lts";

export type UpdateStatus = "deployed" | "rolling_out" | "scheduled" | "draft";

export type UpdateImpact = "critical" | "high" | "medium" | "low";

export interface IUpdateAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface ISystemUpdate {
  id: string;
  version: string;
  title: string;
  summary: string;
  description: string;
  type: UpdateType;
  channel: UpdateChannel;
  status: UpdateStatus;
  impact: UpdateImpact;
  isUnread?: boolean;
  publishedAt: Date;
  author: IUpdateAuthor;
  highlights?: string[];
  affectedModules: string[];
  breakingChanges?: string[];
  securityNotice?: string;
  commitHash?: string;
  docsUrl?: string;
}

export interface IGetUpdatesTableColumnsProps {
  typeCounts: Record<UpdateType, number>;
  channelCounts: Record<UpdateChannel, number>;
  statusCounts: Record<UpdateStatus, number>;
  impactCounts: Record<UpdateImpact, number>;
  setRowAction?: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<ISystemUpdate> | null>
  >;
  onViewDetails: (update: ISystemUpdate) => void;
  onToggleRead?: (updateId: string) => void;
  onDeleteUpdate?: (updateId: string) => void;
}

export interface IUpdatesTableProps {
  updates: ISystemUpdate[];
  onViewDetails: (update: ISystemUpdate) => void;
  onToggleRead?: (updateId: string) => void;
  onDeleteUpdates: (ids: string[]) => void;
  onNewUpdateClick: () => void;
  queryKeys?: Partial<IQueryKeys>;
}

export interface IUpdatesTableActionBarProps {
  table: Table<ISystemUpdate>;
  onBulkMarkRead?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}
