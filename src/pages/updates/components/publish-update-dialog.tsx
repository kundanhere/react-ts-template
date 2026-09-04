import * as React from "react";

import { Rocket01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type {
  ISystemUpdate,
  UpdateChannel,
  UpdateImpact,
  UpdateStatus,
  UpdateType,
} from "@/types/updates";

interface IPublishUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishUpdate: (update: ISystemUpdate) => void;
}

export function PublishUpdateDialog({
  open,
  onOpenChange,
  onPublishUpdate,
}: IPublishUpdateDialogProps) {
  const [version, setVersion] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<UpdateType>("minor");
  const [channel, setChannel] = React.useState<UpdateChannel>("stable");
  const [status, setStatus] = React.useState<UpdateStatus>("deployed");
  const [impact, setImpact] = React.useState<UpdateImpact>("medium");
  const [highlightsText, setHighlightsText] = React.useState("");
  const [affectedModulesText, setAffectedModulesText] = React.useState(
    "Policy Engine, Auth Core"
  );
  const [securityNotice, setSecurityNotice] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = () => {
    setVersion("");
    setTitle("");
    setSummary("");
    setDescription("");
    setType("minor");
    setChannel("stable");
    setStatus("deployed");
    setImpact("medium");
    setHighlightsText("");
    setAffectedModulesText("Policy Engine, Auth Core");
    setSecurityNotice("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!version.trim()) {
      toast.error("Please enter a version tag (e.g. v2.5.0)");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a release title");
      return;
    }
    if (!summary.trim()) {
      toast.error("Please provide a summary of changes");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const highlights = highlightsText
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean);

      const affectedModules = affectedModulesText
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

      const newUpdate: ISystemUpdate = {
        id: `upd-${Date.now()}`,
        version: version.startsWith("v")
          ? version.trim()
          : `v${version.trim()}`,
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim() || summary.trim(),
        type,
        channel,
        status,
        impact,
        isUnread: true,
        publishedAt: new Date(),
        author: {
          name: "Alex Morgan",
          role: "Platform Architect",
        },
        highlights: highlights.length > 0 ? highlights : undefined,
        affectedModules:
          affectedModules.length > 0 ? affectedModules : ["General"],
        securityNotice: securityNotice.trim()
          ? securityNotice.trim()
          : undefined,
        commitHash: Math.random().toString(16).substring(2, 9),
      };

      onPublishUpdate(newUpdate);
      setIsSubmitting(false);
      onOpenChange(false);
      resetForm();
      toast.success(`Published release announcement for ${newUpdate.version}`);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-4 pb-2 sm:p-5 sm:pb-2.5">
            <DialogTitle>Publish System Update</DialogTitle>
            <DialogDescription>
              Broadcast platform releases, security advisories, or maintenance
              notifications to all tenant consoles.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <div className="flex flex-col gap-4 px-4 pt-1 pb-4 text-xs sm:px-5 sm:pt-1 sm:pb-5">
              {/* Row 1: Version & Title */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="rel-ver" className="text-xs font-semibold">
                    Version Tag *
                  </Label>
                  <Input
                    id="rel-ver"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v2.5.0"
                    className="h-8 font-mono text-xs"
                    required
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="rel-title" className="text-xs font-semibold">
                    Release Headline *
                  </Label>
                  <Input
                    id="rel-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Fine-grained RBAC Delegations & Faster Policy Eval"
                    className="h-8 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Type, Channel, Impact */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Update Type</Label>
                  <Select
                    value={type}
                    onValueChange={(v) => setType(v as UpdateType)}
                  >
                    <SelectTrigger className="h-8 w-full text-xs capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="major">Major Release</SelectItem>
                      <SelectItem value="minor">Minor Feature</SelectItem>
                      <SelectItem value="patch">Patch</SelectItem>
                      <SelectItem value="security">
                        Security Advisory
                      </SelectItem>
                      <SelectItem value="hotfix">Hotfix</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Distribution Channel
                  </Label>
                  <Select
                    value={channel}
                    onValueChange={(v) => setChannel(v as UpdateChannel)}
                  >
                    <SelectTrigger className="h-8 w-full text-xs uppercase">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="beta">Beta / Canary</SelectItem>
                      <SelectItem value="security">
                        Security Advisory
                      </SelectItem>
                      <SelectItem value="lts">LTS Track</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Impact Severity
                  </Label>
                  <Select
                    value={impact}
                    onValueChange={(v) => setImpact(v as UpdateImpact)}
                  >
                    <SelectTrigger className="h-8 w-full text-xs capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <Label htmlFor="rel-summary" className="text-xs font-semibold">
                  Executive Summary *
                </Label>
                <Input
                  id="rel-summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="One or two sentences describing the customer-facing benefit..."
                  className="h-8 text-xs"
                  required
                />
              </div>

              {/* Full Description / Architecture Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="rel-desc" className="text-xs font-semibold">
                  Detailed Changelog & Technical Notes
                </Label>
                <Textarea
                  id="rel-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe architectural adjustments, performance gains, or background jobs..."
                  className="h-20 text-xs leading-relaxed"
                />
              </div>

              {/* Key Highlights */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="rel-highlights"
                    className="text-xs font-semibold"
                  >
                    Bullet Highlights
                  </Label>
                  <span className="text-muted-foreground text-[10px]">
                    One item per line
                  </span>
                </div>
                <Textarea
                  id="rel-highlights"
                  value={highlightsText}
                  onChange={(e) => setHighlightsText(e.target.value)}
                  placeholder={
                    "Sub-5ms evaluation engine rewrite\nOpenTelemetry distributed trace propagation\nStrict client cert fingerprint binding"
                  }
                  className="h-16 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Affected Modules & Security Notice */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="rel-modules"
                    className="text-xs font-semibold"
                  >
                    Impacted Modules
                  </Label>
                  <Input
                    id="rel-modules"
                    value={affectedModulesText}
                    onChange={(e) => setAffectedModulesText(e.target.value)}
                    placeholder="Policy Engine, Auth Core, Audit"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Deployment State
                  </Label>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as UpdateStatus)}
                  >
                    <SelectTrigger className="h-8 w-full text-xs capitalize">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deployed">100% Deployed</SelectItem>
                      <SelectItem value="rolling_out">Rolling Out</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Security Advisory Callout (optional) */}
              {type === "security" && (
                <div className="space-y-1.5 rounded-lg border border-rose-500/30 bg-rose-50/40 p-3 dark:bg-rose-950/20">
                  <Label
                    htmlFor="rel-sec"
                    className="text-xs font-semibold text-rose-700 dark:text-rose-400"
                  >
                    Security Advisory Notice (CVE / Mitigation)
                  </Label>
                  <Input
                    id="rel-sec"
                    value={securityNotice}
                    onChange={(e) => setSecurityNotice(e.target.value)}
                    placeholder="e.g. Critical mitigation for CVE-2026-3829..."
                    className="bg-background h-8 text-xs"
                  />
                </div>
              )}
            </div>
          </DialogBody>

          <DialogFooter className="border-t px-4 py-3 sm:px-5">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-8 gap-1.5 text-xs"
            >
              <HugeiconsIcon
                icon={Rocket01Icon}
                strokeWidth={2}
                className="size-3.5"
              />
              {isSubmitting ? "Publishing..." : "Broadcast Release"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
