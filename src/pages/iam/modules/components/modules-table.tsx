import * as React from "react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { toast } from "@/components/ui/toast";
import { useDataTable } from "@/hooks/use-data-table";
import type { IDataTableRowAction } from "@/types/data-table";
import type { IModule, IModulesTableProps } from "@/types/iam/modules";

import { DeleteModulesDialog } from "./delete-modules-dialog";
import { ModuleFormDialog } from "./module-form-dialog";
import { ModulesTableActionBar } from "./modules-table-action-bar";
import { getModulesTableColumns } from "./modules-table-columns";
import { ModulesTableToolbarActions } from "./modules-table-toolbar-actions";

const INITIAL_MODULES: IModule[] = [
  {
    id: "mod-1",
    code: "MOD-1001",
    name: "Identity & Access (IAM)",
    route: "/iam/*",
    priority: 1,
    category: "core",
    status: "active",
    isSystem: true,
    description:
      "Core authentication, authorization, and token management service",
    createdAt: new Date("2023-01-10"),
    children: [
      {
        id: "mod-2",
        code: "MOD-1002",
        name: "User Management",
        route: "/iam/users",
        priority: 2,
        category: "system",
        status: "active",
        isSystem: true,
        description:
          "User lifecycle, profiles, credentials, and directory sync",
        createdAt: new Date("2023-01-15"),
      },
      {
        id: "mod-3",
        code: "MOD-1003",
        name: "Roles & Permissions",
        route: "/iam/roles",
        priority: 3,
        category: "system",
        status: "active",
        isSystem: true,
        description:
          "Role-based access controls and granular permission definitions",
        createdAt: new Date("2023-01-20"),
      },
      {
        id: "mod-4",
        code: "MOD-1004",
        name: "Policies Registry",
        route: "/iam/policies",
        priority: 4,
        category: "system",
        status: "active",
        isSystem: true,
        description: "Attribute-based policy rules engine and policy simulator",
        createdAt: new Date("2023-02-01"),
        children: [
          {
            id: "mod-4-1",
            code: "MOD-1004-A",
            name: "ABAC Rule Compiler",
            route: "/iam/policies/rules",
            priority: 41,
            category: "system",
            status: "active",
            isSystem: true,
            description: "Attribute expression compiler and validator engine",
            createdAt: new Date("2023-02-05"),
          },
          {
            id: "mod-4-2",
            code: "MOD-1004-B",
            name: "Policy Simulator Engine",
            route: "/iam/policies/simulator",
            priority: 42,
            category: "governance",
            status: "active",
            isSystem: false,
            description: "Dry-run access evaluation and impact testing",
            createdAt: new Date("2023-02-10"),
          },
        ],
      },
      {
        id: "mod-5",
        code: "MOD-1005",
        name: "Security & Audit",
        route: "/iam/audit",
        priority: 5,
        category: "governance",
        status: "active",
        isSystem: false,
        description: "Compliance logging, security events, and audit trails",
        createdAt: new Date("2023-02-15"),
      },
      {
        id: "mod-6",
        code: "MOD-1006",
        name: "Governance & Tools",
        route: "/iam/access-matrix",
        priority: 6,
        category: "governance",
        status: "maintenance",
        isSystem: false,
        description: "Access matrix breakdown and privilege elevation analyzer",
        createdAt: new Date("2023-03-01"),
      },
    ],
  },
  {
    id: "mod-7",
    code: "MOD-1007",
    name: "Billing & Subscriptions",
    route: "/billing/*",
    priority: 7,
    category: "feature",
    status: "active",
    isSystem: false,
    description: "Invoicing, subscription tiers, and payment processing",
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "mod-8",
    code: "MOD-1008",
    name: "Analytics & Reporting",
    route: "/analytics/*",
    priority: 8,
    category: "feature",
    status: "active",
    isSystem: false,
    description:
      "System performance dashboards, usage stats, and custom reports",
    createdAt: new Date("2023-04-01"),
  },
  {
    id: "mod-9",
    code: "MOD-1009",
    name: "Notification Engine",
    route: "/notifications/*",
    priority: 9,
    category: "integration",
    status: "beta",
    isSystem: false,
    description:
      "Multi-channel notification dispatch system (Email, SMS, Webhooks)",
    createdAt: new Date("2023-04-20"),
  },
  {
    id: "mod-10",
    code: "MOD-1010",
    name: "Workflow Automation",
    route: "/workflows/*",
    priority: 10,
    category: "integration",
    status: "inactive",
    isSystem: false,
    description: "Automated event-driven workflow engine and triggers",
    createdAt: new Date("2023-05-05"),
  },
];

export function ModulesTable({ queryKeys }: IModulesTableProps) {
  const [modules, setModules] = React.useState<IModule[]>(INITIAL_MODULES);
  const [rowAction, setRowAction] =
    React.useState<IDataTableRowAction<IModule> | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingModule, setEditingModule] = React.useState<IModule | null>(
    null
  );

  const statusCounts = React.useMemo(() => {
    const acc: Record<IModule["status"], number> = {
      active: 0,
      inactive: 0,
      maintenance: 0,
      beta: 0,
    };
    const countItem = (item: IModule) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      item.children?.forEach(countItem);
    };
    modules.forEach(countItem);
    return acc;
  }, [modules]);

  const categoryCounts = React.useMemo(() => {
    const acc: Record<IModule["category"], number> = {
      core: 0,
      system: 0,
      feature: 0,
      integration: 0,
      governance: 0,
    };
    const countItem = (item: IModule) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      item.children?.forEach(countItem);
    };
    modules.forEach(countItem);
    return acc;
  }, [modules]);

  const priorityRange = React.useMemo(() => {
    const priorities: number[] = [];
    const collectPriorities = (item: IModule) => {
      priorities.push(item.priority);
      item.children?.forEach(collectPriorities);
    };
    modules.forEach(collectPriorities);
    if (priorities.length === 0) return { min: 1, max: 10 };
    return {
      min: Math.min(...priorities),
      max: Math.max(...priorities),
    };
  }, [modules]);

  const handleEditModule = React.useCallback((module: IModule) => {
    setEditingModule(module);
    setIsFormOpen(true);
  }, []);

  const handleAddModuleClick = React.useCallback(() => {
    setEditingModule(null);
    setIsFormOpen(true);
  }, []);

  const handleSaveModule = React.useCallback(
    (values: Omit<IModule, "id" | "code" | "createdAt">) => {
      if (editingModule) {
        const updateRecursive = (list: IModule[]): IModule[] =>
          list.map((m) => {
            if (m.id === editingModule.id) return { ...m, ...values };
            if (m.children?.length)
              return { ...m, children: updateRecursive(m.children) };
            return m;
          });
        setModules(updateRecursive);
        toast.success(`Updated module "${values.name}"`);
      } else {
        const nextIdNum = modules.length + 1;
        const newModule: IModule = {
          id: `mod-${Date.now()}`,
          code: `MOD-10${nextIdNum < 10 ? `0${nextIdNum}` : nextIdNum}`,
          ...values,
          createdAt: new Date(),
        };
        setModules((prev) => [newModule, ...prev]);
        toast.success(`Created new module "${values.name}"`);
      }
    },
    [editingModule, modules.length]
  );

  const handleUpdateStatus = React.useCallback(
    (moduleId: string, status: IModule["status"]) => {
      const updateRecursive = (list: IModule[]): IModule[] =>
        list.map((m) => {
          if (m.id === moduleId) return { ...m, status };
          if (m.children?.length)
            return { ...m, children: updateRecursive(m.children) };
          return m;
        });
      setModules(updateRecursive);
    },
    []
  );

  const handleToggleSystem = React.useCallback((moduleId: string) => {
    const updateRecursive = (list: IModule[]): IModule[] =>
      list.map((m) => {
        if (m.id === moduleId) {
          const nextVal = !m.isSystem;
          toast.success(
            `Module "${m.name}" set to ${nextVal ? "System" : "Custom"}`
          );
          return { ...m, isSystem: nextVal };
        }
        if (m.children?.length)
          return { ...m, children: updateRecursive(m.children) };
        return m;
      });
    setModules(updateRecursive);
  }, []);

  const handleBulkUpdateStatus = React.useCallback(
    (moduleIds: string[], status: IModule["status"]) => {
      const updateRecursive = (list: IModule[]): IModule[] =>
        list.map((m) => {
          const updated = moduleIds.includes(m.id) ? { ...m, status } : m;
          if (updated.children?.length) {
            return {
              ...updated,
              children: updateRecursive(updated.children),
            };
          }
          return updated;
        });
      setModules(updateRecursive);
    },
    []
  );

  const handleBulkUpdateCategory = React.useCallback(
    (moduleIds: string[], category: IModule["category"]) => {
      const updateRecursive = (list: IModule[]): IModule[] =>
        list.map((m) => {
          const updated = moduleIds.includes(m.id) ? { ...m, category } : m;
          if (updated.children?.length) {
            return {
              ...updated,
              children: updateRecursive(updated.children),
            };
          }
          return updated;
        });
      setModules(updateRecursive);
    },
    []
  );

  const handleBulkDelete = React.useCallback((moduleIds: string[]) => {
    const filterRecursive = (list: IModule[]): IModule[] =>
      list
        .filter((m) => !moduleIds.includes(m.id))
        .map((m) =>
          m.children?.length
            ? { ...m, children: filterRecursive(m.children) }
            : m
        );
    setModules(filterRecursive);
  }, []);

  const columns = React.useMemo(
    () =>
      getModulesTableColumns({
        statusCounts,
        categoryCounts,
        priorityRange,
        setRowAction,
        onEditModule: handleEditModule,
        onUpdateStatus: handleUpdateStatus,
        onToggleSystem: handleToggleSystem,
      }),
    [
      statusCounts,
      categoryCounts,
      priorityRange,
      handleEditModule,
      handleUpdateStatus,
      handleToggleSystem,
    ]
  );

  const { table } = useDataTable({
    data: modules,
    columns,
    pageCount: 1,
    enableAdvancedFilter: false,
    enableNestedRows: true,
    getSubRows: (row) => row.children,
    initialState: {
      sorting: [{ id: "priority", desc: false }],
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
        enableNestedRows
        actionBar={
          <ModulesTableActionBar
            table={table}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkUpdateCategory={handleBulkUpdateCategory}
            onBulkDelete={handleBulkDelete}
          />
        }
      >
        <DataTableToolbar table={table}>
          <ModulesTableToolbarActions
            table={table}
            onAddModule={handleAddModuleClick}
          />
        </DataTableToolbar>
      </DataTable>

      <DeleteModulesDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        modules={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onDeleteModules={handleBulkDelete}
      />

      <ModuleFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialValues={editingModule}
        onSubmit={handleSaveModule}
      />
    </>
  );
}
