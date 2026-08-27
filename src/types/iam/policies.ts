import type * as React from "react";

import type { Table } from "@tanstack/react-table";

import type { AlertDialog } from "@/components/ui/alert-dialog";
import type { IDataTableRowAction, IQueryKeys } from "@/types/data-table";

export interface IPolicy {
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
export type Policy = IPolicy;

export interface IGetPoliciesTableColumnsProps {
  effectCounts: Record<IPolicy["effect"], number>;
  typeCounts: Record<IPolicy["type"], number>;
  statusCounts: Record<IPolicy["status"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<IDataTableRowAction<IPolicy> | null>
  >;
  onUpdatePolicyEffect?: (policyId: string, effect: IPolicy["effect"]) => void;
  onDuplicatePolicy?: (policy: IPolicy) => void;
}
export type GetPoliciesTableColumnsProps = IGetPoliciesTableColumnsProps;

export interface IPoliciesTableProps {
  queryKeys?: Partial<IQueryKeys>;
}
export type PoliciesTableProps = IPoliciesTableProps;

export interface IPoliciesTableActionBarProps {
  table: Table<IPolicy>;
  onBulkUpdateEffect?: (policyIds: string[], effect: IPolicy["effect"]) => void;
  onBulkUpdateStatus?: (policyIds: string[], status: IPolicy["status"]) => void;
  onBulkDelete?: (policyIds: string[]) => void;
}
export type PoliciesTableActionBarProps = IPoliciesTableActionBarProps;

export interface IPoliciesTableToolbarActionsProps {
  table: Table<IPolicy>;
}
export type PoliciesTableToolbarActionsProps =
  IPoliciesTableToolbarActionsProps;

export interface IDeletePoliciesDialogProps extends React.ComponentPropsWithoutRef<
  typeof AlertDialog
> {
  policies: IPolicy[];
  onSuccess?: () => void;
  showTrigger?: boolean;
  onDeletePolicies?: (policyIds: string[]) => void;
}
export type DeletePoliciesDialogProps = IDeletePoliciesDialogProps;
