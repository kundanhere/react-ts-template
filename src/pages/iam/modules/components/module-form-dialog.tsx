import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { IModule, IModuleFormDialogProps } from "@/types/iam/modules";

import { MODULE_CATEGORIES, MODULE_STATUSES } from "./modules-table-columns";

export function ModuleFormDialog({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: IModuleFormDialogProps) {
  const isEditing = !!initialValues?.id;

  const [name, setName] = React.useState("");
  const [route, setRoute] = React.useState("");
  const [priority, setPriority] = React.useState<number>(1);
  const [category, setCategory] = React.useState<IModule["category"]>("system");
  const [status, setStatus] = React.useState<IModule["status"]>("active");
  const [isSystem, setIsSystem] = React.useState<boolean>(false);
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    if (open) {
      if (initialValues) {
        setName(initialValues.name ?? "");
        setRoute(initialValues.route ?? "");
        setPriority(initialValues.priority ?? 1);
        setCategory(initialValues.category ?? "system");
        setStatus(initialValues.status ?? "active");
        setIsSystem(initialValues.isSystem ?? false);
        setDescription(initialValues.description ?? "");
      } else {
        setName("");
        setRoute("/iam/");
        setPriority(1);
        setCategory("system");
        setStatus("active");
        setIsSystem(true);
        setDescription("");
      }
    }
  }, [open, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      route,
      priority: Number(priority),
      category,
      status,
      isSystem,
      description,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Module" : "Add New Module"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the configuration, route scope, and priority of this module."
              : "Register a new module into the system hierarchy and route table."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 px-4 sm:px-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="module-name">Module Name</Label>
              <Input
                id="module-name"
                placeholder="e.g. Identity & Access (IAM)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="module-route">Route Scope</Label>
                <Input
                  id="module-route"
                  placeholder="e.g. /iam/*"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="module-priority">Priority</Label>
                <Input
                  id="module-priority"
                  type="number"
                  min={1}
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex w-full min-w-0 flex-col gap-2">
                <Label htmlFor="module-category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as IModule["category"])}
                >
                  <SelectTrigger
                    id="module-category"
                    className="w-full capitalize"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex w-full min-w-0 flex-col gap-2">
                <Label htmlFor="module-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as IModule["status"])}
                >
                  <SelectTrigger
                    id="module-status"
                    className="w-full capitalize"
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

            <div className="flex flex-col gap-2">
              <Label htmlFor="module-desc">Description</Label>
              <Textarea
                id="module-desc"
                placeholder="Brief description of the module's core functions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save Changes" : "Create Module"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
