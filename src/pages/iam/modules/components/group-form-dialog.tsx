import * as React from "react";

import {
  Navigation03Icon,
  Settings01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AVAILABLE_MODULE_ICONS, getModuleIcon } from "@/layout/module-icons";
import { cn } from "@/lib/utils";
import type {
  IGroupFormDialogProps,
  INavigationGroup,
  NavigationGroupType,
} from "@/types/iam/modules";

const TIER_CONFIG: Record<
  NavigationGroupType,
  { label: string; desc: string; icon: any }
> = {
  main: {
    label: "Main",
    desc: "Displayed at the top of the sidebar without a section header.",
    icon: StarIcon,
  },
  primary: {
    label: "Primary",
    desc: "Displayed in the main sidebar area under section headers.",
    icon: Navigation03Icon,
  },
  secondary: {
    label: "Secondary",
    desc: "Pinned at the bottom of the sidebar above the user profile.",
    icon: Settings01Icon,
  },
};

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function GroupFormDialog({
  open,
  onOpenChange,
  initialValues,
  availableModules = [],
  groups = [],
  onSubmit,
}: IGroupFormDialogProps) {
  const isEditing = Boolean(initialValues?.id);
  const currentGroupId = initialValues?.id;

  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [type, setType] = React.useState<NavigationGroupType>("primary");
  const [priority, setPriority] = React.useState<number>(1);
  const [icon, setIcon] = React.useState<string>("GridIcon");
  const [description, setDescription] = React.useState("");
  const [selectedModuleIds, setSelectedModuleIds] = React.useState<string[]>(
    []
  );
  const [moduleSearch, setModuleSearch] = React.useState("");
  const [filterTab, setFilterTab] = React.useState<
    "all" | "available" | "other"
  >("all");

  React.useEffect(() => {
    if (open) {
      if (initialValues) {
        const groupName = initialValues.name ?? "";
        setName(groupName);
        const rawType = (initialValues.type as string) || "primary";
        let groupType: NavigationGroupType = "primary";

        if (rawType === "main" || initialValues.slug === "main") {
          groupType = "main";
        } else if (
          rawType === "secondary" ||
          initialValues.slug === "secondary"
        ) {
          groupType = "secondary";
        }

        setType(groupType);
        if (groupType === "main") {
          setSlug("main");
        } else if (groupType === "secondary") {
          setSlug("secondary");
        } else {
          setSlug(initialValues.slug || generateSlug(groupName));
        }
        setPriority(initialValues.priority ?? 1);
        setIcon(initialValues.icon ?? "GridIcon");
        setDescription(initialValues.description ?? "");
        setSelectedModuleIds(initialValues.moduleIds ?? []);
      } else {
        setName("");
        setSlug("");
        setType("primary");
        setPriority(groups.length + 1);
        setIcon("GridIcon");
        setDescription("");
        setSelectedModuleIds([]);
      }
      setModuleSearch("");
      setFilterTab("all");
    }
  }, [open, initialValues, groups.length]);

  // Handle name change - dynamically generates slug when Primary tier is selected
  const handleNameChange = (newName: string) => {
    setName(newName);
    if (type === "main") {
      setSlug("main");
    } else if (type === "secondary") {
      setSlug("secondary");
    } else {
      setSlug(generateSlug(newName));
    }
  };

  // Handle placement tier change: Main -> main, Secondary -> secondary, Primary -> dynamic slug from name
  const handleTypeChange = (newType: NavigationGroupType) => {
    setType(newType);
    if (newType === "main") {
      setSlug("main");
    } else if (newType === "secondary") {
      setSlug("secondary");
    } else {
      setSlug(generateSlug(name));
    }
  };

  // Only top-level root modules can be directly assigned to groups.
  // Child and sub-modules automatically inherit from their parent module.
  const rootModules = React.useMemo(() => availableModules, [availableModules]);

  // Map module ID to its current navigation group
  const moduleGroupMap = React.useMemo(() => {
    const map = new Map<string, INavigationGroup>();
    availableModules.forEach((m) => {
      if (m.groupId) {
        const grp = groups.find((g) => g.id === m.groupId);
        if (grp) map.set(m.id, grp);
      }
    });
    return map;
  }, [availableModules, groups]);

  // Returns the other group if this module is already mapped elsewhere
  const getOtherGroupForModule = React.useCallback(
    (moduleId: string) => {
      const grp = moduleGroupMap.get(moduleId);
      if (grp && grp.id !== currentGroupId) {
        return grp;
      }
      return null;
    },
    [moduleGroupMap, currentGroupId]
  );

  const availableCount = React.useMemo(
    () => rootModules.filter((m) => !getOtherGroupForModule(m.id)).length,
    [rootModules, getOtherGroupForModule]
  );

  const otherGroupCount = React.useMemo(
    () =>
      rootModules.filter((m) => Boolean(getOtherGroupForModule(m.id))).length,
    [rootModules, getOtherGroupForModule]
  );

  const overriddenCount = React.useMemo(
    () =>
      selectedModuleIds.filter((id) => Boolean(getOtherGroupForModule(id)))
        .length,
    [selectedModuleIds, getOtherGroupForModule]
  );

  // Filter modules based on search and selected tab filter
  const filteredModules = React.useMemo(
    () =>
      rootModules.filter((m) => {
        const otherGroup = getOtherGroupForModule(m.id);
        if (filterTab === "available" && otherGroup) return false;
        if (filterTab === "other" && !otherGroup) return false;

        if (!moduleSearch.trim()) return true;
        const q = moduleSearch.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.route.toLowerCase().includes(q) ||
          m.code.toLowerCase().includes(q)
        );
      }),
    [rootModules, filterTab, getOtherGroupForModule, moduleSearch]
  );

  // Standard toggle: only allows toggling if module is not in another group or is already selected
  const toggleModuleSelection = (moduleId: string) => {
    const otherGroup = getOtherGroupForModule(moduleId);
    const isSelected = selectedModuleIds.includes(moduleId);

    // If it is in another group and not yet selected, ignore simple clicks (requires explicit override)
    if (otherGroup && !isSelected) {
      return;
    }

    setSelectedModuleIds((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  // Explicit override: reassigns a module from another group
  const handleOverrideModule = (moduleId: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );
  };

  // Revert override: removes module from this group, leaving it in its original group
  const handleRevertOverride = (moduleId: string) => {
    setSelectedModuleIds((prev) => prev.filter((id) => id !== moduleId));
  };

  // Select all available modules in current view (never hijacks other groups)
  const handleSelectAllAvailable = () => {
    const availableIds = filteredModules
      .filter((m) => !getOtherGroupForModule(m.id))
      .map((m) => m.id);
    setSelectedModuleIds((prev) =>
      Array.from(new Set([...prev, ...availableIds]))
    );
  };

  const handleDeselectFiltered = () => {
    const filteredIdsSet = new Set(filteredModules.map((m) => m.id));
    setSelectedModuleIds((prev) =>
      prev.filter((id) => !filteredIdsSet.has(id))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalSlug = slug.trim();
    if (type === "main") {
      finalSlug = "main";
    } else if (type === "secondary") {
      finalSlug = "secondary";
    } else {
      finalSlug = generateSlug(finalSlug || name) || "group";
    }

    onSubmit({
      id: initialValues?.id,
      name: name.trim(),
      slug: finalSlug,
      type,
      priority: Number(priority) || 1,
      icon,
      description: description.trim() || undefined,
      moduleIds: selectedModuleIds,
    });
    onOpenChange(false);
  };

  let slugPlaceholder = "e.g. iam, operations, analytics";
  if (type === "main") {
    slugPlaceholder = "main";
  } else if (type === "secondary") {
    slugPlaceholder = "secondary";
  }

  let displaySlug = slug;
  if (type === "main") {
    displaySlug = "main";
  } else if (type === "secondary") {
    displaySlug = "secondary";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0 sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Navigation Group" : "Create Navigation Group"}
            </DialogTitle>
            <DialogDescription>
              Configure how this group appears in the application sidebar,
              including placement, label, icon, and assigned modules.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <div className="flex flex-col gap-4 px-4 py-4 text-xs sm:px-5 sm:pb-5">
              <div className="bg-muted/40 border-border/60 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[0.625rem] font-semibold tracking-wider uppercase">
                    Sidebar Placement
                  </span>
                  <p className="text-foreground text-xs font-semibold">
                    {TIER_CONFIG[type].label}
                  </p>
                  <p className="text-muted-foreground text-[0.6875rem] leading-tight">
                    {TIER_CONFIG[type].desc}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {(
                    [
                      { id: "main", label: "Main", icon: StarIcon },
                      {
                        id: "primary",
                        label: "Primary",
                        icon: Navigation03Icon,
                      },
                      {
                        id: "secondary",
                        label: "Secondary",
                        icon: Settings01Icon,
                      },
                    ] as const
                  ).map((t) => (
                    <Button
                      key={t.id}
                      type="button"
                      variant={type === t.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTypeChange(t.id)}
                      className={`h-7 gap-1 px-2.5 text-[0.6875rem] font-medium transition-all ${
                        type === t.id
                          ? "shadow-xs"
                          : "border-border/70 hover:bg-muted/60"
                      }`}
                    >
                      <HugeiconsIcon icon={t.icon} size={12} strokeWidth={2} />
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Group Name and Slug Grid */}
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label htmlFor="group-name" className="text-xs font-semibold">
                    Group Label / Name *
                  </Label>
                  <Input
                    id="group-name"
                    placeholder={
                      type === "main"
                        ? "e.g. Main Navigation"
                        : "e.g. IAM & Security"
                    }
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="h-8 text-xs"
                  />
                </div>

                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="group-slug"
                      className="text-xs font-semibold"
                    >
                      API Slug Identifier *
                    </Label>
                    {(type === "main" || type === "secondary") && (
                      <span className="text-muted-foreground text-[0.625rem]">
                        Fixed to &quot;{type}&quot;
                      </span>
                    )}
                  </div>
                  <Input
                    id="group-slug"
                    placeholder={slugPlaceholder}
                    value={displaySlug}
                    onChange={(e) => {
                      if (type === "primary") {
                        setSlug(e.target.value);
                      }
                    }}
                    disabled={type === "main" || type === "secondary"}
                    required={type === "primary"}
                    className="h-8 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Priority & Icon Selection Grid */}
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="group-priority"
                      className="text-xs font-semibold"
                    >
                      Priority Order
                    </Label>
                    <span className="text-muted-foreground text-[0.625rem]">
                      Lower numbers appear first
                    </span>
                  </div>
                  <Input
                    id="group-priority"
                    type="number"
                    min={1}
                    max={999}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    required
                    className="h-8 text-xs"
                  />
                </div>

                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label htmlFor="group-icon" className="text-xs font-semibold">
                    Group Icon
                  </Label>
                  <Select
                    value={icon}
                    onValueChange={(val) => setIcon(val ?? "")}
                  >
                    <SelectTrigger
                      id="group-icon"
                      className="h-8 w-full text-xs"
                    >
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      <SelectGroup>
                        {AVAILABLE_MODULE_ICONS.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              {getModuleIcon(item.id, 2)}
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Optional Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="group-desc" className="text-xs font-semibold">
                  Description Notes{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="group-desc"
                  placeholder="Context or documentation notes for this group section..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-16 text-xs leading-relaxed"
                />
              </div>

              {/* Module Member Assignment */}
              <div className="border-border/60 bg-muted/20 flex flex-col gap-2.5 rounded-lg border p-3">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs font-semibold">
                          Assigned Modules
                        </Label>
                        <Badge
                          variant="secondary"
                          className="h-4.5 px-1.5 text-[0.625rem] font-medium"
                        >
                          {selectedModuleIds.length} Selected
                        </Badge>
                        {overriddenCount > 0 && (
                          <Badge
                            variant="outline"
                            className="h-4.5 border-amber-500/40 bg-amber-500/10 px-1.5 text-[0.625rem] font-medium text-amber-600 dark:text-amber-400"
                          >
                            {overriddenCount} Overridden
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-[0.6875rem]">
                        Select modules to assign. Modules mapped in another
                        group cannot be mapped simply; use{" "}
                        <span className="font-semibold text-amber-600 dark:text-amber-400">
                          Override & Move
                        </span>{" "}
                        to reassign them.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Input
                        placeholder="Filter modules..."
                        value={moduleSearch}
                        onChange={(e) => setModuleSearch(e.target.value)}
                        className="h-7 w-36 text-xs"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={
                          selectedModuleIds.length > 0
                            ? handleDeselectFiltered
                            : handleSelectAllAvailable
                        }
                        className="text-muted-foreground hover:text-foreground h-7 px-2 text-[0.6875rem]"
                      >
                        {selectedModuleIds.length > 0
                          ? "Deselect All"
                          : "Select Available"}
                      </Button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="bg-muted/50 border-border/60 flex w-fit items-center gap-1 rounded-md border p-0.5">
                    <button
                      type="button"
                      onClick={() => setFilterTab("all")}
                      className={cn(
                        "rounded px-2 py-0.5 text-[0.6875rem] font-medium transition-all",
                        filterTab === "all"
                          ? "bg-background text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      All ({rootModules.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("available")}
                      className={cn(
                        "rounded px-2 py-0.5 text-[0.6875rem] font-medium transition-all",
                        filterTab === "available"
                          ? "bg-background text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Available ({availableCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterTab("other")}
                      className={cn(
                        "rounded px-2 py-0.5 text-[0.6875rem] font-medium transition-all",
                        filterTab === "other"
                          ? "bg-background text-foreground shadow-2xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      In Other Groups ({otherGroupCount})
                    </button>
                  </div>
                </div>

                <div className="mt-1 max-h-52 space-y-1.5 overflow-y-auto pr-1">
                  {filteredModules.length === 0 ? (
                    <div className="text-muted-foreground py-4 text-center text-xs">
                      No modules found matching &quot;{moduleSearch}&quot;
                    </div>
                  ) : (
                    filteredModules.map((module) => {
                      const isChecked = selectedModuleIds.includes(module.id);
                      const otherGroup = getOtherGroupForModule(module.id);
                      const isOverridden = isChecked && Boolean(otherGroup);

                      let statusBorderClass =
                        "border-border/60 bg-background text-muted-foreground hover:bg-muted/40";
                      if (isOverridden) {
                        statusBorderClass =
                          "border-amber-500/40 bg-amber-500/5";
                      } else if (isChecked) {
                        statusBorderClass =
                          "border-primary/40 bg-primary/5 text-foreground font-medium";
                      }

                      const renderGroupStatus = () => {
                        if (!otherGroup) {
                          return (
                            <Badge
                              variant={
                                module.isSystem ? "secondary" : "outline"
                              }
                              className={cn(
                                "px-1.5 py-0 text-[0.625rem] font-normal",
                                module.isSystem && "border-border border"
                              )}
                            >
                              {module.isSystem ? "System" : "Custom"}
                            </Badge>
                          );
                        }

                        if (isOverridden) {
                          return (
                            <div className="flex items-center gap-1.5">
                              <Badge
                                variant="outline"
                                className="border-amber-500/40 bg-amber-500/10 text-[0.625rem] font-medium text-amber-600 dark:text-amber-400"
                              >
                                Reassigns from {otherGroup.name}
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRevertOverride(module.id)}
                                className="text-muted-foreground hover:text-foreground h-6 px-1.5 text-[0.6875rem]"
                              >
                                Revert
                              </Button>
                            </div>
                          );
                        }

                        return (
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant="secondary"
                              className="border-border text-muted-foreground border text-[0.625rem] font-normal"
                            >
                              In: {otherGroup.name}
                            </Badge>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOverrideModule(module.id)}
                              className="h-6 gap-1 border-amber-500/40 px-2 text-[0.6875rem] font-medium text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 dark:text-amber-400"
                            >
                              Override & Move
                            </Button>
                          </div>
                        );
                      };

                      return (
                        <div
                          key={module.id}
                          className={cn(
                            "flex flex-col justify-between gap-2 rounded-md border px-2.5 py-1.5 text-xs transition-colors sm:flex-row sm:items-center",
                            statusBorderClass,
                            otherGroup && !isChecked && "opacity-90"
                          )}
                        >
                          <label
                            htmlFor={`module-chk-${module.id}`}
                            className={cn(
                              "flex min-w-0 flex-1 items-center gap-2",
                              otherGroup && !isChecked
                                ? "cursor-default"
                                : "cursor-pointer"
                            )}
                          >
                            <Checkbox
                              id={`module-chk-${module.id}`}
                              checked={isChecked}
                              disabled={Boolean(otherGroup && !isChecked)}
                              onCheckedChange={() =>
                                toggleModuleSelection(module.id)
                              }
                            />
                            <div className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-md">
                              {getModuleIcon(module.icon, 2, 13)}
                            </div>
                            <span className="text-foreground truncate font-medium">
                              {module.name}
                            </span>
                            <code className="text-muted-foreground hidden font-mono text-[0.625rem] sm:inline">
                              {module.route}
                            </code>
                          </label>

                          <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
                            {module.children && module.children.length > 0 && (
                              <Badge
                                variant="outline"
                                className="text-muted-foreground px-1.5 py-0 text-[0.625rem] font-normal"
                              >
                                {module.children.length} sub-modules
                              </Badge>
                            )}

                            {renderGroupStatus()}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="border-t px-4 py-3 sm:px-5">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-8 text-xs">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="h-8 text-xs">
              {isEditing ? "Save Changes" : "Create Group"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
