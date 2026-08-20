import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { toast } from "@/components/ui/toast";
import { useDataTable } from "@/hooks/use-data-table";
import type { DataTableRowAction, QueryKeys } from "@/types/data-table";

import { DeletePoliciesDialog } from "./delete-policies-dialog";
import { PoliciesTableActionBar } from "./policies-table-action-bar";
import { type Policy, getPoliciesTableColumns } from "./policies-table-columns";
import { PoliciesTableToolbarActions } from "./policies-table-toolbar-actions";

const INITIAL_POLICIES: Policy[] = [
  {
    id: "pol-101",
    code: "POL-1001",
    name: "Global User Admin Policy",
    description:
      "Grants full administrative control over user accounts and profiles.",
    effect: "ALLOW",
    type: "system",
    status: "active",
    resource: "users:*",
    actions: ["create", "read", "update", "delete"],
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2026-08-20"),
  },
  {
    id: "pol-102",
    code: "POL-1002",
    name: "Audit Log Reader Policy",
    description:
      "Allows viewing and exporting security audit logs across all services.",
    effect: "ALLOW",
    type: "system",
    status: "active",
    resource: "audit:*",
    actions: ["read", "export"],
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2026-08-19"),
  },
  {
    id: "pol-103",
    code: "POL-1003",
    name: "Restricted Security Settings Deny",
    description:
      "Explicitly denies modification and deletion of core security settings.",
    effect: "DENY",
    type: "custom",
    status: "active",
    resource: "security/settings:*",
    actions: ["read", "update", "delete"],
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2026-08-17"),
  },
  {
    id: "pol-104",
    code: "POL-1004",
    name: "Department Manager Access",
    description:
      "Permits department managers to view and edit members within their department.",
    effect: "ALLOW",
    type: "custom",
    status: "active",
    resource: "users:dept",
    actions: ["read", "update"],
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2026-08-15"),
  },
  {
    id: "pol-105",
    code: "POL-1005",
    name: "Billing & Finance Read-Only",
    description:
      "Allows viewing invoices, payment histories, and organization usage metrics.",
    effect: "ALLOW",
    type: "system",
    status: "active",
    resource: "billing:*",
    actions: ["read", "export"],
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2026-08-10"),
  },
  {
    id: "pol-106",
    code: "POL-1006",
    name: "Legacy API Key Access Block",
    description: "Blocks API calls authenticated using legacy v1 API tokens.",
    effect: "DENY",
    type: "inline",
    status: "deprecated",
    resource: "api/v1/*",
    actions: ["create", "read", "update", "delete"],
    createdAt: new Date("2023-04-01"),
    updatedAt: new Date("2026-07-28"),
  },
  {
    id: "pol-107",
    code: "POL-1007",
    name: "Module Configuration Manager",
    description:
      "Enables configuration and routing updates for registered IAM modules.",
    effect: "ALLOW",
    type: "custom",
    status: "active",
    resource: "iam/modules/*",
    actions: ["read", "update"],
    createdAt: new Date("2023-04-18"),
    updatedAt: new Date("2026-08-02"),
  },
  {
    id: "pol-108",
    code: "POL-1008",
    name: "Role Definition Inspector",
    description:
      "Provides read-only inspection of role hierarchy and permission mappings.",
    effect: "ALLOW",
    type: "system",
    status: "active",
    resource: "iam/roles/*",
    actions: ["read"],
    createdAt: new Date("2023-05-12"),
    updatedAt: new Date("2026-08-05"),
  },
  {
    id: "pol-109",
    code: "POL-1009",
    name: "Emergency Freeze Override",
    description:
      "Emergency override policy to temporarily freeze high-privilege operations.",
    effect: "DENY",
    type: "custom",
    status: "inactive",
    resource: "*",
    actions: ["delete"],
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2026-06-15"),
  },
  {
    id: "pol-110",
    code: "POL-1010",
    name: "Analytics & Reporting Suite",
    description:
      "Grants access to reporting tools, custom metrics, and analytics data streams.",
    effect: "ALLOW",
    type: "custom",
    status: "active",
    resource: "analytics/*",
    actions: ["read", "query", "export"],
    createdAt: new Date("2023-07-11"),
    updatedAt: new Date("2026-08-01"),
  },
];

interface PoliciesTableProps {
  queryKeys?: Partial<QueryKeys>;
}

export function PoliciesTable({ queryKeys }: PoliciesTableProps) {
  const [policies, setPolicies] = React.useState<Policy[]>(INITIAL_POLICIES);
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Policy> | null>(null);

  const effectCounts = React.useMemo(
    () =>
      policies.reduce(
        (acc, policy) => {
          acc[policy.effect] = (acc[policy.effect] || 0) + 1;
          return acc;
        },
        { ALLOW: 0, DENY: 0 } as Record<Policy["effect"], number>
      ),
    [policies]
  );

  const typeCounts = React.useMemo(
    () =>
      policies.reduce(
        (acc, policy) => {
          acc[policy.type] = (acc[policy.type] || 0) + 1;
          return acc;
        },
        { system: 0, custom: 0, inline: 0 } as Record<Policy["type"], number>
      ),
    [policies]
  );

  const statusCounts = React.useMemo(
    () =>
      policies.reduce(
        (acc, policy) => {
          acc[policy.status] = (acc[policy.status] || 0) + 1;
          return acc;
        },
        { active: 0, inactive: 0, deprecated: 0 } as Record<
          Policy["status"],
          number
        >
      ),
    [policies]
  );

  const handleUpdateEffect = React.useCallback(
    (policyId: string, effect: Policy["effect"]) => {
      setPolicies((prev) =>
        prev.map((p) => (p.id === policyId ? { ...p, effect } : p))
      );
    },
    []
  );

  const handleDuplicatePolicy = React.useCallback(
    (policy: Policy) => {
      const nextNum = policies.length + 1;
      const newPolicy: Policy = {
        ...policy,
        id: `pol-${Date.now()}`,
        code: `POL-10${nextNum < 10 ? `0${nextNum}` : nextNum}`,
        name: `${policy.name} (Copy)`,
        type: "custom",
        updatedAt: new Date(),
      };
      setPolicies((prev) => [newPolicy, ...prev]);
      toast.success(`Duplicated policy "${policy.name}"`);
    },
    [policies.length]
  );

  const handleBulkUpdateEffect = React.useCallback(
    (policyIds: string[], effect: Policy["effect"]) => {
      setPolicies((prev) =>
        prev.map((p) => (policyIds.includes(p.id) ? { ...p, effect } : p))
      );
    },
    []
  );

  const handleBulkUpdateStatus = React.useCallback(
    (policyIds: string[], status: Policy["status"]) => {
      setPolicies((prev) =>
        prev.map((p) => (policyIds.includes(p.id) ? { ...p, status } : p))
      );
    },
    []
  );

  const handleBulkDelete = React.useCallback((policyIds: string[]) => {
    setPolicies((prev) => prev.filter((p) => !policyIds.includes(p.id)));
  }, []);

  const columns = React.useMemo(
    () =>
      getPoliciesTableColumns({
        effectCounts,
        typeCounts,
        statusCounts,
        setRowAction,
        onUpdatePolicyEffect: handleUpdateEffect,
        onDuplicatePolicy: handleDuplicatePolicy,
      }),
    [
      effectCounts,
      typeCounts,
      statusCounts,
      handleUpdateEffect,
      handleDuplicatePolicy,
    ]
  );

  const { table } = useDataTable({
    data: policies,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    initialState: {
      sorting: [{ id: "updatedAt", desc: true }],
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
          <PoliciesTableActionBar
            table={table}
            onBulkUpdateEffect={handleBulkUpdateEffect}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkDelete={handleBulkDelete}
          />
        }
      >
        <DataTableToolbar table={table}>
          <PoliciesTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <DeletePoliciesDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        policies={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onDeletePolicies={handleBulkDelete}
      />
    </>
  );
}
