import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

export interface Policy {
  id: string;
  code: string;
  name: string;
  description: string;
  effect: "ALLOW" | "DENY";
  type: "system" | "custom" | "inline";
  status: "active" | "inactive" | "deprecated";
  resource: string;
  actions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GetPoliciesTableColumnsProps {
  effectCounts: Record<Policy["effect"], number>;
  typeCounts: Record<Policy["type"], number>;
  statusCounts: Record<Policy["status"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Policy> | null>
  >;
  onUpdatePolicyEffect?: (policyId: string, effect: Policy["effect"]) => void;
  onDuplicatePolicy?: (policy: Policy) => void;
}

export interface PoliciesTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export interface PoliciesTableActionBarProps {
  table: Table<Policy>;
  onBulkUpdateEffect?: (policyIds: string[], effect: Policy["effect"]) => void;
  onBulkUpdateStatus?: (policyIds: string[], status: Policy["status"]) => void;
  onBulkDelete?: (policyIds: string[]) => void;
}

export interface PoliciesTableToolbarActionsProps {
  table: Table<Policy>;
}

export interface DeletePoliciesDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  policies: Policy[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeletePolicies?: (policyIds: string[]) => void;
}
