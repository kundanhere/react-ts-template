import * as React from "react";

import { GridViewIcon, Group01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { useDataTable } from "@/hooks/use-data-table";
import type { IDataTableRowAction } from "@/types/data-table";
import type {
  IModule,
  IModulesTableProps,
  INavigationGroup,
} from "@/types/iam/modules";

import { DeleteModulesDialog } from "./delete-modules-dialog";
import { GroupFormDialog } from "./group-form-dialog";
import { GroupsManagementView } from "./groups-management-view";
import { ModuleFormDialog } from "./module-form-dialog";
import { ModulesTableActionBar } from "./modules-table-action-bar";
import { getModulesTableColumns } from "./modules-table-columns";
import { ModulesTableToolbarActions } from "./modules-table-toolbar-actions";

export const INITIAL_GROUPS: INavigationGroup[] = [
  {
    id: "grp-main",
    name: "Main Navigation",
    slug: "main",
    type: "main",
    priority: 1,
    icon: "DashboardSquare01Icon",
    description: "Main overview links displayed at the top of the sidebar",
    moduleIds: ["mod-8", "mod-7"],
  },
  {
    id: "grp-iam",
    name: "IAM & Security",
    slug: "iam",
    type: "primary",
    priority: 2,
    icon: "Shield01Icon",
    description:
      "Identity, authentication, and security access policy controllers",
    moduleIds: ["mod-1"],
  },
  {
    id: "grp-ops",
    name: "Operations & Integration",
    slug: "operations",
    type: "primary",
    priority: 3,
    icon: "Audit02Icon",
    description:
      "System integrations, event dispatches, and automation workflows",
    moduleIds: ["mod-9", "mod-10"],
  },
  {
    id: "grp-secondary",
    name: "Utilities & Settings",
    slug: "secondary",
    type: "secondary",
    priority: 99,
    icon: "Settings01Icon",
    description: "Secondary utility links pinned at the bottom of the sidebar",
    moduleIds: [],
  },
];

const INITIAL_MODULES: IModule[] = [
  {
    id: "mod-1",
    code: "MOD-1001",
    name: "Identity & Access (IAM)",
    route: "/iam/*",
    icon: "Shield01Icon",
    priority: 1,
    status: "active",
    isSystem: true,
    groupId: "grp-iam",
    description:
      "Core authentication, authorization, and token management service",
    createdAt: new Date("2023-01-10"),
    children: [
      {
        id: "mod-2",
        code: "MOD-1002",
        name: "User Management",
        route: "/iam/users",
        icon: "UserGroupIcon",
        priority: 2,
        status: "active",
        isSystem: true,
        groupId: "grp-iam",
        description:
          "User lifecycle, profiles, credentials, and directory sync",
        createdAt: new Date("2023-01-15"),
      },
      {
        id: "mod-3",
        code: "MOD-1003",
        name: "Roles & Permissions",
        route: "/iam/roles",
        icon: "ShieldCheck",
        priority: 3,
        status: "active",
        isSystem: true,
        groupId: "grp-iam",
        description:
          "Role-based access controls and granular permission definitions",
        createdAt: new Date("2023-01-20"),
      },
      {
        id: "mod-4",
        code: "MOD-1004",
        name: "Policies Registry",
        route: "/iam/policies",
        icon: "Quiz05Icon",
        priority: 4,
        status: "active",
        isSystem: true,
        groupId: "grp-iam",
        description: "Attribute-based policy rules engine and policy simulator",
        createdAt: new Date("2023-02-01"),
        children: [
          {
            id: "mod-4-1",
            code: "MOD-1004-A",
            name: "ABAC Rule Compiler",
            route: "/iam/policies/rules",
            icon: "CpuIcon",
            priority: 41,
            status: "active",
            isSystem: true,
            groupId: "grp-iam",
            description: "Attribute expression compiler and validator engine",
            createdAt: new Date("2023-02-05"),
          },
          {
            id: "mod-4-2",
            code: "MOD-1004-B",
            name: "Policy Simulator Engine",
            route: "/iam/policies/simulator",
            icon: "ShieldKeyIcon",
            priority: 42,
            status: "active",
            isSystem: false,
            groupId: "grp-iam",
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
        icon: "Audit02Icon",
        priority: 5,
        status: "active",
        isSystem: false,
        groupId: "grp-iam",
        description: "Compliance logging, security events, and audit trails",
        createdAt: new Date("2023-02-15"),
      },
      {
        id: "mod-6",
        code: "MOD-1006",
        name: "Governance & Tools",
        route: "/iam/access-matrix",
        icon: "GridIcon",
        priority: 6,
        status: "maintenance",
        isSystem: false,
        groupId: "grp-iam",
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
    icon: "Folder01Icon",
    priority: 7,
    status: "active",
    isSystem: false,
    groupId: "grp-main",
    badge: "Pro",
    description: "Invoicing, subscription tiers, and payment processing",
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "mod-8",
    code: "MOD-1008",
    name: "Analytics & Reporting",
    route: "/analytics/*",
    icon: "DashboardSquare01Icon",
    priority: 8,
    status: "active",
    isSystem: false,
    groupId: "grp-main",
    badge: "New",
    description:
      "System performance dashboards, usage stats, and custom reports",
    createdAt: new Date("2023-04-01"),
  },
  {
    id: "mod-9",
    code: "MOD-1009",
    name: "Notification Engine",
    route: "/notifications/*",
    icon: "BellPlusIcon",
    priority: 9,
    status: "beta",
    isSystem: false,
    groupId: "grp-ops",
    badge: 3,
    description:
      "Multi-channel notification dispatch system (Email, SMS, Webhooks)",
    createdAt: new Date("2023-04-20"),
  },
  {
    id: "mod-10",
    code: "MOD-1010",
    name: "Workflow Automation",
    route: "/workflows/*",
    icon: "SentIcon",
    priority: 10,
    status: "inactive",
    isSystem: false,
    groupId: "grp-ops",
    description: "Automated event-driven workflow engine and triggers",
    createdAt: new Date("2023-05-05"),
  },
];

// Helper to find the parent module of any nested child module
const findParentModule = (
  targetId: string,
  list: IModule[],
  parent: IModule | null = null
): IModule | null => {
  for (const item of list) {
    if (item.id === targetId) return parent;
    if (item.children?.length) {
      const found = findParentModule(targetId, item.children, item);
      if (found !== null) return found;
    }
  }
  return null;
};

// Helper to cascade group assignment down the entire tree of children
const cascadeGroupId = (
  children: IModule[] | undefined,
  groupId: string | null | undefined
): IModule[] | undefined => {
  if (!children?.length) return children;
  const targetId = groupId ?? null;
  return children.map((child) => ({
    ...child,
    groupId: targetId,
    children: cascadeGroupId(child.children, targetId),
  }));
};

export function ModulesTable({ queryKeys }: IModulesTableProps) {
  const [modules, setModules] = React.useState<IModule[]>(INITIAL_MODULES);
  const [groups, setGroups] =
    React.useState<INavigationGroup[]>(INITIAL_GROUPS);
  const [activeTab, setActiveTab] = React.useState<string>("modules");

  const [rowAction, setRowAction] =
    React.useState<IDataTableRowAction<IModule> | null>(null);

  // Module edit state
  const [isModuleFormOpen, setIsModuleFormOpen] = React.useState(false);
  const [editingModule, setEditingModule] = React.useState<IModule | null>(
    null
  );
  const [editingModuleParent, setEditingModuleParent] =
    React.useState<IModule | null>(null);

  // Group form state
  const [isGroupFormOpen, setIsGroupFormOpen] = React.useState(false);
  const [editingGroup, setEditingGroup] =
    React.useState<Partial<INavigationGroup> | null>(null);

  // Total count of modules including nested children
  const totalModuleCount = React.useMemo(() => {
    let count = 0;
    const countItems = (items: IModule[]) => {
      items.forEach((item) => {
        count += 1;
        if (item.children?.length) countItems(item.children);
      });
    };
    countItems(modules);
    return count;
  }, [modules]);

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

  // Edit module callback - detects if editing target is a child module
  const handleEditModule = React.useCallback(
    (module: IModule) => {
      const parent = findParentModule(module.id, modules);
      setEditingModuleParent(parent);
      setEditingModule(module);
      setIsModuleFormOpen(true);
    },
    [modules]
  );

  // Save module modifications (Edit only)
  const handleSaveModule = React.useCallback(
    (values: Partial<IModule>) => {
      if (!editingModule) return;

      const isChild = Boolean(editingModuleParent);
      // If editing a child module, preserve the inherited parent groupId
      let newGroupId: string | null = null;
      if (isChild) {
        newGroupId = editingModule.groupId ?? null;
      } else if (values.groupId && values.groupId !== "unassigned") {
        newGroupId = values.groupId;
      }

      const updateRecursive = (list: IModule[]): IModule[] =>
        list.map((m) => {
          if (m.id === editingModule.id) {
            const finalGroupId = isChild ? m.groupId : newGroupId;
            return {
              ...m,
              ...values,
              groupId: finalGroupId,
              children: isChild
                ? m.children
                : cascadeGroupId(m.children, finalGroupId),
            };
          }
          if (m.children?.length) {
            return { ...m, children: updateRecursive(m.children) };
          }
          return m;
        });

      setModules(updateRecursive);

      // Sync navigation groups membership for root modules only
      if (!isChild) {
        setGroups((prevGroups) =>
          prevGroups.map((grp) => {
            const isTargetGroup = grp.id === newGroupId;
            const containsModule = grp.moduleIds.includes(editingModule.id);

            if (isTargetGroup && !containsModule) {
              return {
                ...grp,
                moduleIds: [...grp.moduleIds, editingModule.id],
              };
            }
            if (!isTargetGroup && containsModule) {
              return {
                ...grp,
                moduleIds: grp.moduleIds.filter(
                  (id) => id !== editingModule.id
                ),
              };
            }
            return grp;
          })
        );
      }

      toast.success(`Updated module "${values.name || editingModule.name}"`);
      setIsModuleFormOpen(false);
      setEditingModule(null);
      setEditingModuleParent(null);
    },
    [editingModule, editingModuleParent]
  );

  // Assign a single module to a group - cascades to all children
  const handleAssignGroup = React.useCallback(
    (moduleId: string, targetGroupId: string | null) => {
      const updateRecursive = (list: IModule[]): IModule[] =>
        list.map((m) => {
          if (m.id === moduleId) {
            return {
              ...m,
              groupId: targetGroupId,
              children: cascadeGroupId(m.children, targetGroupId),
            };
          }
          if (m.children?.length) {
            return { ...m, children: updateRecursive(m.children) };
          }
          return m;
        });

      setModules(updateRecursive);

      // Sync groups membership
      setGroups((prevGroups) =>
        prevGroups.map((grp) => {
          const isTarget = grp.id === targetGroupId;
          const hasModule = grp.moduleIds.includes(moduleId);

          if (isTarget && !hasModule) {
            return { ...grp, moduleIds: [...grp.moduleIds, moduleId] };
          }
          if (!isTarget && hasModule) {
            return {
              ...grp,
              moduleIds: grp.moduleIds.filter((id) => id !== moduleId),
            };
          }
          return grp;
        })
      );

      const targetGroup = groups.find((g) => g.id === targetGroupId);
      toast.success(
        targetGroup
          ? `Module assigned to "${targetGroup.name}"`
          : "Module unassigned from group"
      );
    },
    [groups]
  );

  // Bulk assign selected modules to a group - cascades to all children
  const handleBulkAssignGroup = React.useCallback(
    (moduleIds: string[], targetGroupId: string | null) => {
      const updateRecursive = (list: IModule[]): IModule[] =>
        list.map((m) => {
          if (moduleIds.includes(m.id)) {
            return {
              ...m,
              groupId: targetGroupId,
              children: cascadeGroupId(m.children, targetGroupId),
            };
          }
          if (m.children?.length) {
            return {
              ...m,
              children: updateRecursive(m.children),
            };
          }
          return m;
        });

      setModules(updateRecursive);

      // Sync groups
      setGroups((prevGroups) =>
        prevGroups.map((grp) => {
          const isTarget = grp.id === targetGroupId;
          const remainingIds = grp.moduleIds.filter(
            (id) => !moduleIds.includes(id)
          );

          if (isTarget) {
            return {
              ...grp,
              moduleIds: Array.from(new Set([...remainingIds, ...moduleIds])),
            };
          }
          return {
            ...grp,
            moduleIds: remainingIds,
          };
        })
      );

      const targetGroup = groups.find((g) => g.id === targetGroupId);
      toast.success(
        targetGroup
          ? `Assigned ${moduleIds.length} module(s) to "${targetGroup.name}"`
          : `Unassigned ${moduleIds.length} module(s) from groups`
      );
    },
    [groups]
  );

  // Open group dialog pre-populated with selected modules
  const handleCreateGroupFromSelected = React.useCallback(
    (moduleIds: string[]) => {
      setEditingGroup({
        moduleIds,
        type: "primary",
        priority: groups.length + 1,
      });
      setIsGroupFormOpen(true);
    },
    [groups.length]
  );

  const handleCreateGroup = React.useCallback(() => {
    setEditingGroup(null);
    setIsGroupFormOpen(true);
  }, []);

  const handleEditGroup = React.useCallback((group: INavigationGroup) => {
    setEditingGroup(group);
    setIsGroupFormOpen(true);
  }, []);

  // Save or create a navigation group
  const handleSaveGroup = React.useCallback(
    (groupData: Omit<INavigationGroup, "id"> & { id?: string }) => {
      const targetGroupId = groupData.id || `grp-${Date.now()}`;
      const isEdit = Boolean(groupData.id);

      const finalGroup: INavigationGroup = {
        id: targetGroupId,
        name: groupData.name,
        slug: groupData.slug,
        type: groupData.type,
        priority: groupData.priority,
        icon: groupData.icon,
        description: groupData.description,
        moduleIds: groupData.moduleIds || [],
      };

      const selectedModuleSet = new Set(groupData.moduleIds || []);

      setGroups((prev) => {
        const cleaned = prev.map((g) => {
          if (g.id === targetGroupId) {
            return finalGroup;
          }
          // Remove any module IDs that were assigned to the target group
          return {
            ...g,
            moduleIds: g.moduleIds.filter((id) => !selectedModuleSet.has(id)),
          };
        });

        if (isEdit) {
          return cleaned;
        }
        return [...cleaned, finalGroup];
      });

      // Synchronize module groupId attributes and cascade to children
      const updateRoot = (list: IModule[]): IModule[] =>
        list.map((m) => {
          let nextGroupId = m.groupId;
          if (selectedModuleSet.has(m.id)) {
            nextGroupId = targetGroupId;
          } else if (m.groupId === targetGroupId) {
            nextGroupId = null;
          }

          return {
            ...m,
            groupId: nextGroupId,
            children: cascadeGroupId(m.children, nextGroupId),
          };
        });

      setModules(updateRoot);
      toast.success(
        isEdit
          ? `Updated group "${groupData.name}"`
          : `Created group "${groupData.name}"`
      );
      setIsGroupFormOpen(false);
      setEditingGroup(null);
    },
    []
  );

  // Delete navigation group - cascades unassign to all children
  const handleDeleteGroup = React.useCallback((groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));

    // Clear groupId for any modules assigned to this deleted group
    const updateRecursive = (list: IModule[]): IModule[] =>
      list.map((m) => {
        const shouldUnassign = m.groupId === groupId;
        const nextGroupId = shouldUnassign ? null : m.groupId;
        let nextChildren = m.children;
        if (shouldUnassign) {
          nextChildren = cascadeGroupId(m.children, null);
        } else if (m.children) {
          nextChildren = updateRecursive(m.children);
        }

        return {
          ...m,
          groupId: nextGroupId,
          children: nextChildren,
        };
      });

    setModules(updateRecursive);
    toast.success("Sidebar group deleted and modules unassigned");
  }, []);

  // Remove module from its assigned group - cascades unassign to all children
  const handleRemoveModuleFromGroup = React.useCallback((moduleId: string) => {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        moduleIds: g.moduleIds.filter((id) => id !== moduleId),
      }))
    );

    const updateRecursive = (list: IModule[]): IModule[] =>
      list.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            groupId: null,
            children: cascadeGroupId(m.children, null),
          };
        }
        if (m.children?.length) {
          return {
            ...m,
            children: updateRecursive(m.children),
          };
        }
        return m;
      });

    setModules(updateRecursive);
    toast.success("Module removed from group");
  }, []);

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

    // Also remove from all groups
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        moduleIds: g.moduleIds.filter((id) => !moduleIds.includes(id)),
      }))
    );
  }, []);

  const columns = React.useMemo(
    () =>
      getModulesTableColumns({
        statusCounts,
        priorityRange,
        groups,
        setRowAction,
        onEditModule: handleEditModule,
        onAssignGroup: handleAssignGroup,
        onUpdateStatus: handleUpdateStatus,
        onToggleSystem: handleToggleSystem,
      }),
    [
      statusCounts,
      priorityRange,
      groups,
      handleEditModule,
      handleAssignGroup,
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
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto">
            <TabsTrigger value="modules" className="gap-2 px-3 text-xs">
              <HugeiconsIcon
                icon={GridViewIcon}
                className="size-3.5"
                strokeWidth={2}
              />
              <span>All Modules</span>
              <Badge
                variant="secondary"
                className="h-4.5 min-w-4 px-1 text-[10px] font-medium"
              >
                {totalModuleCount}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="groups" className="gap-2 px-3 text-xs">
              <HugeiconsIcon
                icon={Group01Icon}
                className="size-3.5"
                strokeWidth={2}
              />
              <span>Sidebar Groups</span>
              <Badge
                variant="secondary"
                className="h-4.5 min-w-4 px-1 text-[10px] font-medium"
              >
                {groups.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="modules" className="space-y-4 outline-none">
          <DataTable
            table={table}
            enableNestedRows
            actionBar={
              <ModulesTableActionBar
                table={table}
                groups={groups}
                onBulkUpdateStatus={handleBulkUpdateStatus}
                onBulkAssignGroup={handleBulkAssignGroup}
                onCreateGroupFromSelected={handleCreateGroupFromSelected}
                onBulkDelete={handleBulkDelete}
              />
            }
            emptyStateTitle="No modules registered"
            emptyStateDescription="Modules are managed by the core system and can be grouped and configured for the application sidebar."
          >
            <DataTableToolbar table={table}>
              <ModulesTableToolbarActions table={table} />
            </DataTableToolbar>
          </DataTable>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4 outline-none">
          <GroupsManagementView
            groups={groups}
            modules={modules}
            onEditGroup={handleEditGroup}
            onCreateGroup={handleCreateGroup}
            onDeleteGroup={handleDeleteGroup}
            onRemoveModuleFromGroup={handleRemoveModuleFromGroup}
          />
        </TabsContent>
      </Tabs>

      <DeleteModulesDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        modules={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
        onDeleteModules={handleBulkDelete}
      />

      <ModuleFormDialog
        open={isModuleFormOpen}
        onOpenChange={(open) => {
          setIsModuleFormOpen(open);
          if (!open) {
            setEditingModule(null);
            setEditingModuleParent(null);
          }
        }}
        initialValues={editingModule}
        isChildModule={Boolean(editingModuleParent)}
        parentModuleName={editingModuleParent?.name}
        groups={groups}
        onSubmit={handleSaveModule}
      />

      <GroupFormDialog
        open={isGroupFormOpen}
        onOpenChange={setIsGroupFormOpen}
        initialValues={editingGroup}
        availableModules={modules}
        groups={groups}
        onSubmit={handleSaveGroup}
      />
    </>
  );
}
