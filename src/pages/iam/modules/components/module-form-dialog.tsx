import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { IModule, IModuleFormDialogProps } from "@/types/iam/modules";

import { MODULE_STATUSES } from "./modules-table-columns";

const GROUP_TYPE_LABELS: Record<string, string> = {
  main: "Main",
  primary: "Primary",
  secondary: "Secondary",
  default: "Primary",
};

export function ModuleFormDialog({
  open,
  onOpenChange,
  initialValues,
  isChildModule = false,
  parentModuleName,
  groups = [],
  onSubmit,
}: IModuleFormDialogProps) {
  const [name, setName] = React.useState("");
  const [route, setRoute] = React.useState("");
  const [icon, setIcon] = React.useState<string>("DashboardCircleIcon");
  const [priority, setPriority] = React.useState<number>(1);
  const [status, setStatus] = React.useState<IModule["status"]>("active");
  const [groupId, setGroupId] = React.useState<string>("unassigned");
  const [badge, setBadge] = React.useState<string>("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (open && initialValues) {
      setName(initialValues.name ?? "");
      setRoute(initialValues.route ?? "");
      setIcon(initialValues.icon ?? "DashboardCircleIcon");
      setPriority(initialValues.priority ?? 1);
      setStatus(initialValues.status ?? "active");
      setGroupId(initialValues.groupId ?? "unassigned");
      setBadge(String(initialValues.badge ?? ""));
      setDescription(initialValues.description ?? "");
    }
  }, [open, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let targetGroupId: string | null = null;
    if (isChildModule) {
      targetGroupId = initialValues?.groupId ?? null;
    } else if (groupId !== "unassigned") {
      targetGroupId = groupId;
    }

    onSubmit({
      name: name.trim(),
      route: route.trim(),
      icon,
      priority: Number(priority),
      status,
      // If it's a child module, preserve the inherited groupId
      groupId: targetGroupId,
      badge: badge.trim() || undefined,
      description: description.trim(),
    });
    onOpenChange(false);
  };

  const assignedGroup = groups.find((g) => g.id === groupId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0 sm:max-w-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Module Configuration</DialogTitle>
            <DialogDescription>
              Configure the navigation route scope, sidebar icon, navigation
              group, and display priority.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <div className="flex flex-col gap-4 px-4 py-4 text-xs sm:px-5 sm:pb-5">
              <div className="bg-muted/40 border-border/60 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[0.625rem] font-semibold tracking-wider uppercase">
                    Module Identity & Context
                  </span>
                  <p className="text-foreground text-xs font-semibold">
                    {initialValues?.name || "System Module"}
                  </p>
                  <p className="text-muted-foreground font-mono text-[0.6875rem] leading-tight">
                    {initialValues?.route || "/"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {initialValues?.code && (
                    <Badge
                      variant="outline"
                      className="font-mono text-[0.625rem]"
                    >
                      {initialValues.code}
                    </Badge>
                  )}
                  <Badge
                    variant={initialValues?.isSystem ? "secondary" : "outline"}
                    className={
                      initialValues?.isSystem
                        ? "border-border border text-[0.6875rem]"
                        : "text-[0.6875rem]"
                    }
                  >
                    {initialValues?.isSystem ? "System Module" : "Custom"}
                  </Badge>
                  {isChildModule ? (
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground text-[0.6875rem]"
                    >
                      Inherited from {parentModuleName || "Parent"}
                    </Badge>
                  ) : (
                    assignedGroup && (
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-primary bg-primary/5 text-[0.6875rem]"
                      >
                        {assignedGroup.name} ({assignedGroup.type})
                      </Badge>
                    )
                  )}
                </div>
              </div>

              {/* Module Name & Route Path Grid */}
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label
                    htmlFor="module-name"
                    className="text-xs font-semibold"
                  >
                    Module Name *
                  </Label>
                  <Input
                    id="module-name"
                    placeholder="e.g. Identity & Access (IAM)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-8 text-xs"
                  />
                </div>

                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label
                    htmlFor="module-route"
                    className="text-xs font-semibold"
                  >
                    Route Path *
                  </Label>
                  <Input
                    id="module-route"
                    placeholder="e.g. /iam/*"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    required
                    className="h-8 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Navigation Group & Sidebar Icon Grid */}
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="module-group"
                      className="text-xs font-semibold"
                    >
                      Sidebar Navigation Group
                    </Label>
                    {isChildModule && (
                      <span className="text-muted-foreground text-[0.625rem]">
                        Inherited from parent
                      </span>
                    )}
                  </div>
                  <Select
                    value={groupId}
                    disabled={isChildModule}
                    onValueChange={(val) => setGroupId(val ?? "unassigned")}
                  >
                    <SelectTrigger
                      id="module-group"
                      className="h-8 w-full text-xs disabled:opacity-75"
                    >
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="unassigned">
                          <span className="text-muted-foreground italic">
                            Unassigned (Hidden from custom groups)
                          </span>
                        </SelectItem>
                        {groups.map((grp) => (
                          <SelectItem key={grp.id} value={grp.id}>
                            <div className="flex items-center gap-2">
                              {getModuleIcon(grp.icon, 2, 14)}
                              <span>{grp.name}</span>
                              <span className="text-muted-foreground text-[0.625rem]">
                                ({GROUP_TYPE_LABELS[grp.type] || grp.type})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isChildModule ? (
                    <span className="text-muted-foreground text-[0.6875rem]">
                      Child modules inherit navigation group from{" "}
                      {parentModuleName
                        ? `"${parentModuleName}"`
                        : "their parent module"}
                      .
                    </span>
                  ) : (
                    initialValues?.groupId &&
                    groupId !== initialValues.groupId && (
                      <span className="text-[0.6875rem] font-medium text-amber-600 dark:text-amber-400">
                        {groupId === "unassigned"
                          ? `Will be unassigned from "${groups.find((g) => g.id === initialValues.groupId)?.name}"`
                          : `Will be moved from "${groups.find((g) => g.id === initialValues.groupId)?.name}" to "${groups.find((g) => g.id === groupId)?.name}"`}
                      </span>
                    )
                  )}
                </div>

                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label
                    htmlFor="module-icon"
                    className="text-xs font-semibold"
                  >
                    Sidebar Icon
                  </Label>
                  <Select
                    value={icon}
                    onValueChange={(val) => setIcon(val ?? "")}
                  >
                    <SelectTrigger
                      id="module-icon"
                      className="h-8 w-full text-xs"
                    >
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      <SelectGroup>
                        {AVAILABLE_MODULE_ICONS.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              {getModuleIcon(item.id, 2, 14)}
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Priority & Status Grid */}
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="module-priority"
                      className="text-xs font-semibold"
                    >
                      Priority Order
                    </Label>
                    <span className="text-muted-foreground text-[0.625rem]">
                      Lower numbers appear first
                    </span>
                  </div>
                  <Input
                    id="module-priority"
                    type="number"
                    min={1}
                    value={priority}
                    onChange={(e) => setPriority(Number(e.target.value))}
                    required
                    className="h-8 text-xs"
                  />
                </div>

                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label
                    htmlFor="module-status"
                    className="text-xs font-semibold"
                  >
                    Status
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as IModule["status"])}
                  >
                    <SelectTrigger
                      id="module-status"
                      className="h-8 w-full text-xs capitalize"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MODULE_STATUSES.map((st) => (
                        <SelectItem key={st} value={st} className="capitalize">
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Badge & Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="module-badge" className="text-xs font-semibold">
                  Sidebar Badge{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional tag e.g. &quot;New&quot;, &quot;Beta&quot;, 3)
                  </span>
                </Label>
                <Input
                  id="module-badge"
                  placeholder="e.g. New, Pro, 3"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="module-desc" className="text-xs font-semibold">
                  Description Details{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="module-desc"
                  placeholder="Brief description of the module's core functions and authorization scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-18 text-xs leading-relaxed"
                />
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
