import * as React from "react";

import {
  Add01Icon,
  AlertCircleIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  CommandIcon,
  Delete02Icon,
  Edit02Icon,
  Layers01Icon,
  Navigation03Icon,
  Settings01Icon,
  StarIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getModuleIcon } from "@/layout/module-icons";
import { cn } from "@/lib/utils";
import type { IModule, INavigationGroup } from "@/types/iam/modules";

interface IGroupsManagementViewProps {
  groups: INavigationGroup[];
  modules: IModule[];
  onEditGroup: (group: INavigationGroup) => void;
  onCreateGroup: () => void;
  onDeleteGroup: (groupId: string) => void;
  onRemoveModuleFromGroup: (moduleId: string) => void;
}

export function GroupsManagementView({
  groups,
  modules,
  onEditGroup,
  onCreateGroup,
  onDeleteGroup,
  onRemoveModuleFromGroup,
}: IGroupsManagementViewProps) {
  const [deletingGroup, setDeletingGroup] =
    React.useState<INavigationGroup | null>(null);
  const [showLivePreview, setShowLivePreview] = React.useState(true);

  // Flatten modules to find modules by ID
  const flattenModules = React.useCallback((list: IModule[]): IModule[] => {
    const res: IModule[] = [];
    const traverse = (items: IModule[]) => {
      items.forEach((item) => {
        res.push(item);
        if (item.children?.length) traverse(item.children);
      });
    };
    traverse(list);
    return res;
  }, []);

  const flatModules = React.useMemo(
    () => flattenModules(modules),
    [modules, flattenModules]
  );

  const getModuleById = React.useCallback(
    (id: string) => flatModules.find((m) => m.id === id),
    [flatModules]
  );

  // Categorize groups by sidebar tiers
  // First checks 'main', with 'primary' as fallback for Main navigation
  const mainGroups = React.useMemo(() => {
    const byMain = groups.filter((g) => g.type === "main" || g.slug === "main");
    if (byMain.length > 0) return byMain;
    return groups.filter((g) => g.slug === "primary");
  }, [groups]);

  const secondaryGroups = React.useMemo(
    () =>
      groups.filter((g) => g.type === "secondary" || g.slug === "secondary"),
    [groups]
  );

  const primaryGroups = React.useMemo(() => {
    const mainIds = new Set(mainGroups.map((g) => g.id));
    const secondaryIds = new Set(secondaryGroups.map((g) => g.id));
    return groups
      .filter((g) => !mainIds.has(g.id) && !secondaryIds.has(g.id))
      .sort((a, b) => a.priority - b.priority);
  }, [groups, mainGroups, secondaryGroups]);

  // Only root/parent modules are displayed as unassigned (child modules inherit from parents)
  const unassignedModules = React.useMemo(
    () => modules.filter((m) => !m.groupId),
    [modules]
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Sidebar Navigation Architecture
          </h3>
          <p className="text-muted-foreground text-xs">
            Configure how modules are grouped and ordered in the application
            sidebar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={ViewIcon} className="size-3.5" />
            {showLivePreview ? "Hide Preview" : "Show Sidebar Preview"}
          </Button>

          <Button onClick={onCreateGroup} className="gap-1.5 text-xs">
            <HugeiconsIcon icon={Add01Icon} className="size-3.5" />
            New Group
          </Button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <div className="bg-card flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
            <HugeiconsIcon
              icon={Layers01Icon}
              className="size-4"
              strokeWidth={2}
            />
          </div>
          <div className="min-w-0">
            <span className="text-muted-foreground block truncate text-[0.6875rem] font-medium">
              Total Groups
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold">{groups.length}</span>
              <span className="text-muted-foreground truncate text-[0.625rem]">
                {mainGroups.length} Main · {secondaryGroups.length} Sec
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors">
          <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-md">
            <HugeiconsIcon
              icon={Navigation03Icon}
              className="size-4"
              strokeWidth={2}
            />
          </div>
          <div className="min-w-0">
            <span className="text-muted-foreground block truncate text-[0.6875rem] font-medium">
              Primary Groups
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-primary text-sm font-bold">
                {primaryGroups.length}
              </span>
              <span className="text-muted-foreground text-[0.625rem]">
                sections
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4"
              strokeWidth={2}
            />
          </div>
          <div className="min-w-0">
            <span className="text-muted-foreground block truncate text-[0.6875rem] font-medium">
              Grouped Modules
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {flatModules.length - unassignedModules.length}
              </span>
              <span className="text-muted-foreground text-[0.625rem]">
                / {flatModules.length} active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card flex items-center gap-2.5 rounded-lg border p-2.5 transition-colors">
          <div
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-md",
              unassignedModules.length > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            <HugeiconsIcon
              icon={AlertCircleIcon}
              className="size-4"
              strokeWidth={2}
            />
          </div>
          <div className="min-w-0">
            <span className="text-muted-foreground block truncate text-[0.6875rem] font-medium">
              Unassigned
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  "text-sm font-bold",
                  unassignedModules.length > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-foreground"
                )}
              >
                {unassignedModules.length}
              </span>
              <span className="text-muted-foreground text-[0.625rem]">
                {unassignedModules.length > 0 ? "needs group" : "all assigned"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Groups + Live Sidebar Preview */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left: Group Cards (7 or 12 cols depending on preview) */}
        <div
          className={cn(
            "flex flex-col gap-6",
            showLivePreview ? "lg:col-span-7 xl:col-span-8" : "lg:col-span-12"
          )}
        >
          {/* Main Navigation */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="border-primary/20 bg-primary/10 text-primary gap-1 font-medium"
              >
                <HugeiconsIcon
                  icon={StarIcon}
                  className="size-3 text-amber-500"
                />
                Main
              </Badge>
              <span className="text-muted-foreground text-xs">
                Displayed at the top of the sidebar without a section header.
              </span>
            </div>

            {mainGroups.length === 0 ? (
              <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
                No Main group configured. Create a group with placement set to
                &quot;Main&quot;.
              </div>
            ) : (
              mainGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  getModuleById={getModuleById}
                  onEditGroup={onEditGroup}
                  onDeleteGroup={() => setDeletingGroup(group)}
                  onRemoveModuleFromGroup={onRemoveModuleFromGroup}
                />
              ))
            )}
          </div>

          {/* Primary Navigation */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1 font-medium">
                  <HugeiconsIcon
                    icon={Navigation03Icon}
                    className="text-primary size-3"
                  />
                  Primary
                </Badge>
                <span className="text-muted-foreground text-xs">
                  Displayed in the main sidebar area under section headers,
                  sorted by priority.
                </span>
              </div>
            </div>

            {primaryGroups.length === 0 ? (
              <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
                No Primary groups configured. Create a group to organize modules
                under section headers.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {primaryGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    getModuleById={getModuleById}
                    onEditGroup={onEditGroup}
                    onDeleteGroup={() => setDeletingGroup(group)}
                    onRemoveModuleFromGroup={onRemoveModuleFromGroup}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Secondary Navigation */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-muted-foreground gap-1">
                <HugeiconsIcon icon={Settings01Icon} className="size-3" />
                Secondary
              </Badge>
              <span className="text-muted-foreground text-xs">
                Pinned at the bottom of the sidebar above the user profile.
              </span>
            </div>

            {secondaryGroups.length === 0 ? (
              <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-center text-xs">
                No Secondary group configured. Create a group with placement set
                to &quot;Secondary&quot;.
              </div>
            ) : (
              secondaryGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  getModuleById={getModuleById}
                  onEditGroup={onEditGroup}
                  onDeleteGroup={() => setDeletingGroup(group)}
                  onRemoveModuleFromGroup={onRemoveModuleFromGroup}
                />
              ))
            )}
          </div>

          {/* Unassigned Modules Warning / Bucket */}
          {unassignedModules.length > 0 && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Unassigned Modules ({unassignedModules.length})
                  </h4>
                  <p className="text-muted-foreground mt-0.5 text-[0.6875rem]">
                    These modules exist in the catalog but will not show in
                    custom sidebar navigation until assigned to a group.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {unassignedModules.map((m) => (
                  <Badge
                    key={m.id}
                    variant="outline"
                    className="bg-background gap-1 border-dashed text-[0.6875rem]"
                  >
                    <span>{m.name}</span>
                    {m.children && m.children.length > 0 && (
                      <span className="text-muted-foreground text-[0.625rem]">
                        ({m.children.length} sub-modules)
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Sidebar Outcome Preview */}
        {showLivePreview && (
          <div className="sticky top-2 transform-[translateZ(0)] self-start will-change-transform backface-hidden lg:col-span-5 xl:col-span-4">
            <Card className="border-border/70 gap-0 overflow-hidden py-0 shadow-xs">
              <CardHeader className="border-border/60 flex flex-row items-center justify-between space-y-0 border-b px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
                    <HugeiconsIcon
                      icon={Layers01Icon}
                      strokeWidth={2}
                      className="size-4"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">
                      Sidebar Live Preview
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">
                      Real-time layout outcome
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <SidebarPreviewBox
                  mainGroups={mainGroups}
                  primaryGroups={primaryGroups}
                  secondaryGroups={secondaryGroups}
                  getModuleById={getModuleById}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Delete Group Confirmation Dialog */}
      <Dialog
        open={Boolean(deletingGroup)}
        onOpenChange={(open) => !open && setDeletingGroup(null)}
      >
        <DialogContent size="sm" className="p-0 sm:max-w-md">
          <DialogHeader className="p-4 sm:p-5">
            <DialogTitle>Delete Navigation Group</DialogTitle>
            <DialogDescription className="mt-1.5 text-xs leading-normal">
              Are you sure you want to delete the{" "}
              <span className="text-foreground font-semibold">
                &ldquo;{deletingGroup?.name}&rdquo;
              </span>{" "}
              navigation group? Any assigned modules will become unassigned from
              sidebar navigation, but will remain safe in the system catalog.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="border-t px-4 py-3 sm:px-5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeletingGroup(null)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                if (deletingGroup) {
                  onDeleteGroup(deletingGroup.id);
                  setDeletingGroup(null);
                }
              }}
              className="h-8 text-xs"
            >
              Delete Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Group Card component
function GroupCard({
  group,
  getModuleById,
  onEditGroup,
  onDeleteGroup,
  onRemoveModuleFromGroup,
}: {
  group: INavigationGroup;
  getModuleById: (id: string) => IModule | undefined;
  onEditGroup: (group: INavigationGroup) => void;
  onDeleteGroup: () => void;
  onRemoveModuleFromGroup: (moduleId: string) => void;
}) {
  const groupModules = React.useMemo(
    () =>
      group.moduleIds
        .map(getModuleById)
        .filter((m): m is IModule => Boolean(m)),
    [group.moduleIds, getModuleById]
  );

  return (
    <div className="bg-card hover:border-border/80 rounded-lg border p-3.5 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-muted/30 flex size-8 items-center justify-center rounded-md border">
            {getModuleIcon(group.icon, 2)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">{group.name}</span>
              <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-[0.625rem]">
                slug: {group.slug}
              </code>
              <Badge variant="outline" className="font-mono text-[0.625rem]">
                Priority {group.priority}
              </Badge>
            </div>
            {group.description && (
              <p className="text-muted-foreground mt-0.5 text-[0.6875rem]">
                {group.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => onEditGroup(group)}
                aria-label="Edit Group"
              >
                <HugeiconsIcon icon={Edit02Icon} className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Group</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive size-7"
                onClick={onDeleteGroup}
                aria-label="Delete Group"
              >
                <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Group</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Modules chips list inside group */}
      <div className="mt-3 border-t pt-2.5">
        <div className="text-muted-foreground mb-1.5 flex items-center justify-between text-[0.6875rem]">
          <span>Assigned Modules ({groupModules.length})</span>
        </div>

        {groupModules.length === 0 ? (
          <p className="text-muted-foreground text-[0.6875rem] italic">
            No modules assigned to this group yet. Edit group or select modules
            in table to assign.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {groupModules.map((module) => (
              <span
                key={module.id}
                className="group/chip border-border/80 bg-background text-foreground hover:border-border inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium shadow-2xs transition-colors"
              >
                {getModuleIcon(module.icon, 2, 14)}
                <span>{module.name}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => onRemoveModuleFromGroup(module.id)}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-1 ml-0.5 flex size-4 cursor-pointer items-center justify-center rounded-full transition-colors"
                      aria-label="Remove from group"
                    >
                      ×
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Remove from group</TooltipContent>
                </Tooltip>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarPreviewBox({
  mainGroups,
  primaryGroups,
  secondaryGroups,
  getModuleById,
}: {
  mainGroups: INavigationGroup[];
  primaryGroups: INavigationGroup[];
  secondaryGroups: INavigationGroup[];
  getModuleById: (id: string) => IModule | undefined;
}) {
  const mainModules = React.useMemo(
    () =>
      mainGroups
        .flatMap((g) => g.moduleIds)
        .map(getModuleById)
        .filter((m): m is IModule => Boolean(m)),
    [mainGroups, getModuleById]
  );

  const secondaryModules = React.useMemo(
    () =>
      secondaryGroups
        .flatMap((g) => g.moduleIds)
        .map(getModuleById)
        .filter((m): m is IModule => Boolean(m)),
    [secondaryGroups, getModuleById]
  );

  return (
    <div className="bg-sidebar text-sidebar-foreground flex min-h-120 flex-col">
      <div className="border-sidebar-border/60 bg-sidebar flex items-center gap-2.5 border-b px-3.5 py-3">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-7 items-center justify-center rounded-lg font-bold shadow-2xs">
          <HugeiconsIcon
            icon={CommandIcon}
            strokeWidth={2}
            className="size-3.5"
          />
        </div>
        <div className="grid flex-1 text-left leading-tight">
          <span className="text-sidebar-foreground truncate text-xs font-semibold">
            Sentry IAM
          </span>
          <span className="text-sidebar-foreground/60 truncate text-[0.625rem]">
            Access Console
          </span>
        </div>
      </div>

      {/* Main Scrollable Area */}
      <div className="flex max-h-105 flex-1 flex-col space-y-3 overflow-y-auto p-2">
        {/* Main Navigation */}
        <div className="space-y-0.5">
          {mainModules.length === 0 ? (
            <div className="border-sidebar-border/60 text-sidebar-foreground/50 rounded-md border border-dashed px-3 py-2 text-center text-[0.6875rem]">
              No Main links configured
            </div>
          ) : (
            mainModules.map((mod) => (
              <div
                key={mod.id}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group/item text-sidebar-foreground/90 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="text-sidebar-foreground/70 group-hover/item:text-sidebar-foreground">
                    {getModuleIcon(mod.icon, 2, 16)}
                  </span>
                  <span className="truncate text-xs">{mod.name}</span>
                </div>
                {mod.badge && (
                  <span className="bg-primary/15 text-primary py-0.2 rounded px-1.5 text-[0.625rem] font-semibold">
                    {mod.badge}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Primary Sections */}
        <div className="border-sidebar-border/40 flex-1 space-y-3 border-t pt-2">
          {primaryGroups.length === 0 ? (
            <div className="border-sidebar-border/60 text-sidebar-foreground/50 rounded-md border border-dashed px-3 py-3 text-center text-[0.6875rem]">
              No Primary sections configured
            </div>
          ) : (
            primaryGroups.map((grp) => {
              const groupModules = grp.moduleIds
                .map(getModuleById)
                .filter((m): m is IModule => Boolean(m));

              return (
                <div key={grp.id} className="space-y-1">
                  <div className="text-sidebar-foreground/60 flex items-center justify-between px-2 pt-1 pb-0.5 text-[0.625rem] font-bold tracking-wider uppercase">
                    <span className="truncate">{grp.name}</span>
                    <span className="text-sidebar-foreground/40 font-mono text-[0.5625rem]">
                      {groupModules.length}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {groupModules.length === 0 ? (
                      <div className="text-sidebar-foreground/40 px-2 py-1 text-[0.6875rem] italic">
                        (Empty section)
                      </div>
                    ) : (
                      groupModules.map((mod) => (
                        <div key={mod.id} className="space-y-0.5">
                          <div className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group/item text-sidebar-foreground/90 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors">
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span className="text-sidebar-foreground/70 group-hover/item:text-sidebar-foreground">
                                {getModuleIcon(mod.icon, 2, 16)}
                              </span>
                              <span className="truncate text-xs">
                                {mod.name}
                              </span>
                            </div>
                            {mod.children && mod.children.length > 0 && (
                              <HugeiconsIcon
                                icon={ArrowRight01Icon}
                                className="text-sidebar-foreground/40 group-hover/item:text-sidebar-foreground size-3 transition-transform"
                                strokeWidth={2}
                              />
                            )}
                          </div>

                          {/* Sub-modules hierarchy */}
                          {mod.children && mod.children.length > 0 && (
                            <div className="border-sidebar-border/60 ml-5 space-y-0.5 border-l py-0.5 pl-2.5">
                              {mod.children.map((child) => (
                                <div
                                  key={child.id}
                                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 flex items-center justify-between rounded-md px-2 py-1 text-[0.6875rem] transition-colors"
                                >
                                  <span className="truncate">{child.name}</span>
                                  {child.badge && (
                                    <span className="text-sidebar-foreground/50 font-mono text-[0.5625rem]">
                                      {child.badge}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Secondary Navigation */}
        {secondaryModules.length > 0 && (
          <div className="border-sidebar-border/50 mt-auto space-y-0.5 border-t pt-2">
            {secondaryModules.map((mod) => (
              <div
                key={mod.id}
                className="hover:text-sidebar-foreground hover:bg-sidebar-accent group/item text-sidebar-foreground/75 flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
              >
                <span className="text-sidebar-foreground/60 group-hover/item:text-sidebar-foreground">
                  {getModuleIcon(mod.icon, 2, 16)}
                </span>
                <span className="truncate text-xs">{mod.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Footer */}
      <div className="border-sidebar-border/60 bg-sidebar mt-auto border-t p-2">
        <div className="hover:bg-sidebar-accent flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors">
          <div className="bg-primary/10 text-primary ring-primary/20 flex size-7 items-center justify-center rounded-full text-[0.6875rem] font-semibold ring-1">
            AD
          </div>
          <div className="grid min-w-0 flex-1 text-left leading-tight">
            <span className="text-sidebar-foreground truncate text-xs font-medium">
              Admin User
            </span>
            <span className="text-sidebar-foreground/60 truncate text-[0.625rem]">
              admin@sentry.io
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
