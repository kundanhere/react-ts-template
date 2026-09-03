import * as React from "react";

import {
  Alert02Icon,
  Bug01Icon,
  FlashIcon,
  Message01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import type {
  FeedbackCategory,
  FeedbackPriority,
  FeedbackType,
  IFeedback,
} from "@/types/feedback";
import { getItem, setItem } from "@/utils/local-storage";

interface IFeedbackSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitFeedback?: (feedback: IFeedback) => void;
  defaultType?: FeedbackType;
}

export function FeedbackSubmissionDialog({
  open,
  onOpenChange,
  onSubmitFeedback,
  defaultType = "feedback",
}: IFeedbackSubmissionDialogProps) {
  const [type, setType] = React.useState<FeedbackType>(defaultType);

  React.useEffect(() => {
    if (open && defaultType) {
      setType(defaultType);
    }
  }, [open, defaultType]);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [stepsToReproduce, setStepsToReproduce] = React.useState("");
  const [category, setCategory] = React.useState<FeedbackCategory>("ui_ux");
  const [priority, setPriority] = React.useState<FeedbackPriority>("medium");
  const [rating, setRating] = React.useState(5);
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);
  const [authorName, setAuthorName] = React.useState("Alex Morgan");
  const [authorEmail, setAuthorEmail] = React.useState(
    "alex.morgan@company.com"
  );
  const [pageUrl] = React.useState(window.location.pathname);
  const [deviceInfo] = React.useState(
    navigator.userAgent.includes("Mac")
      ? "Chrome 128 · macOS"
      : "Chrome 128 · Windows 11"
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStepsToReproduce("");
    setCategory("ui_ux");
    setPriority("medium");
    setRating(5);
    setType("feedback");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a summary title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please provide description details");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let codePrefix = "FB";
      if (type === "bug") {
        codePrefix = "BUG";
      } else if (type === "feature") {
        codePrefix = "FEAT";
      } else if (type === "performance") {
        codePrefix = "PERF";
      }
      const randomCodeNum = Math.floor(1000 + Math.random() * 9000);

      const newFeedback: IFeedback = {
        id: `fb-${Date.now()}`,
        code: `${codePrefix}-${randomCodeNum}`,
        title: title.trim(),
        description: description.trim(),
        stepsToReproduce: type === "bug" ? stepsToReproduce.trim() : undefined,
        type,
        category,
        priority,
        status: "new",
        rating,
        author: {
          name: authorName.trim() || "Anonymous User",
          email: authorEmail.trim() || "user@company.com",
          role: "Member",
        },
        deviceInfo,
        url: pageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (onSubmitFeedback) {
        onSubmitFeedback(newFeedback);
      } else {
        try {
          const cached = getItem<any[]>("sentry_user_feedbacks_v1") || [];
          setItem("sentry_user_feedbacks_v1", [newFeedback, ...cached]);
        } catch {
          // ignore
        }
      }
      setIsSubmitting(false);
      onOpenChange(false);
      resetForm();
      toast.success(
        type === "bug"
          ? `Bug report logged successfully (#${newFeedback.code})`
          : `Feedback submitted successfully (#${newFeedback.code})`
      );
    }, 350);
  };

  const typeConfig: Record<
    FeedbackType,
    { label: string; desc: string; icon: any; badgeClass: string }
  > = {
    feedback: {
      label: "User Feedback",
      desc: "General thoughts, usability feedback, or product suggestions",
      icon: Message01Icon,
      badgeClass:
        "border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
    },
    bug: {
      label: "Bug Report",
      desc: "Functional bugs, glitches, broken UI components, or exceptions",
      icon: Bug01Icon,
      badgeClass:
        "border-rose-500/30 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
    },
    feature: {
      label: "Feature Request",
      desc: "New capabilities, enterprise workflows, or IAM integrations",
      icon: FlashIcon,
      badgeClass:
        "border-sky-500/30 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
    },
    improvement: {
      label: "Improvement",
      desc: "Enhancements to existing modules, wording, or keyboard shortcuts",
      icon: Message01Icon,
      badgeClass:
        "border-violet-500/30 text-violet-600 bg-violet-50/50 dark:bg-violet-950/20 dark:text-violet-400",
    },
    performance: {
      label: "Performance",
      desc: "Slow table queries, latency issues, memory spikes, or sluggish UI",
      icon: Alert02Icon,
      badgeClass:
        "border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
    },
  };

  let submitButtonLabel = "Submit Feedback";
  if (isSubmitting) {
    submitButtonLabel = "Submitting...";
  } else if (type === "bug") {
    submitButtonLabel = "Save Bug Report";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" className="p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit User Feedback</DialogTitle>
            <DialogDescription>
              Submit bug reports, feature requests, or product reviews to help
              us improve Sentry IAM.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            <div className="flex flex-col gap-4 px-4 py-4 text-xs sm:px-5 sm:pb-5">
              {/* Context Box matching Save Simulation Scenario pattern */}
              <div className="bg-muted/40 border-border/60 flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-0.5">
                  <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    Submission Channel
                  </span>
                  <p className="text-foreground text-xs font-semibold">
                    {typeConfig[type].label}
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-tight">
                    {typeConfig[type].desc}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      {
                        id: "feedback",
                        label: "Feedback",
                        icon: Message01Icon,
                      },
                      { id: "bug", label: "Bug Report", icon: Bug01Icon },
                      { id: "feature", label: "Feature", icon: FlashIcon },
                      {
                        id: "performance",
                        label: "Performance",
                        icon: Alert02Icon,
                      },
                    ] as const
                  ).map((t) => (
                    <Button
                      key={t.id}
                      type="button"
                      variant={type === t.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setType(t.id)}
                      className={`h-7 gap-1 px-2.5 text-[11px] font-medium transition-all ${
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

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fb-title" className="text-xs font-semibold">
                  {type === "bug" ? "Issue Summary *" : "Subject / Title *"}
                </Label>
                <Input
                  id="fb-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "e.g. Session timeout triggers infinite redirect loop on expired JWT"
                      : "e.g. Add Passkey biometric login support for FIDO2 security keys"
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Category & Priority Grid taking full available width */}
              <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label
                    htmlFor="fb-category"
                    className="text-xs font-semibold"
                  >
                    Affected Module / Category
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(val) =>
                      setCategory(val as FeedbackCategory)
                    }
                  >
                    <SelectTrigger
                      id="fb-category"
                      className="h-8 w-full text-xs"
                    >
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auth">Authentication & JWT</SelectItem>
                      <SelectItem value="iam">IAM Policies & Roles</SelectItem>
                      <SelectItem value="ui_ux">UI / UX Usability</SelectItem>
                      <SelectItem value="api">API & Dev Tools</SelectItem>
                      <SelectItem value="performance">
                        System Performance
                      </SelectItem>
                      <SelectItem value="billing">
                        Billing & Subscriptions
                      </SelectItem>
                      <SelectItem value="general">General Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <Label
                    htmlFor="fb-priority"
                    className="text-xs font-semibold"
                  >
                    Priority / Impact
                  </Label>
                  <Select
                    value={priority}
                    onValueChange={(val) =>
                      setPriority(val as FeedbackPriority)
                    }
                  >
                    <SelectTrigger
                      id="fb-priority"
                      className="h-8 w-full text-xs"
                    >
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        Low (Cosmetic / Minor)
                      </SelectItem>
                      <SelectItem value="medium">Medium (Standard)</SelectItem>
                      <SelectItem value="high">
                        High (Major impairment)
                      </SelectItem>
                      <SelectItem value="critical">
                        Critical (Blocking operations)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="fb-desc" className="text-xs font-semibold">
                  {type === "bug"
                    ? "Observed Behavior & Details *"
                    : "Feedback Details & Use Case *"}
                </Label>
                <Textarea
                  id="fb-desc"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "Detailed explanation of the unexpected behavior, error codes, and symptoms..."
                      : "Describe how this enhancement helps your workflow or how to improve the current experience..."
                  }
                  className="min-h-20 text-xs leading-relaxed"
                />
              </div>

              {/* Steps to Reproduce (if bug) */}
              {type === "bug" && (
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="fb-steps" className="text-xs font-semibold">
                      Steps to Reproduce
                    </Label>
                    <span className="text-muted-foreground text-[10px]">
                      Numbered steps
                    </span>
                  </div>
                  <Textarea
                    id="fb-steps"
                    value={stepsToReproduce}
                    onChange={(e) => setStepsToReproduce(e.target.value)}
                    placeholder={
                      "1. Navigate to /iam/access-matrix\n2. Attempt to expand root role\n3. Observe redirect loop"
                    }
                    className="h-20 font-mono text-xs leading-relaxed"
                  />
                </div>
              )}

              {/* Rating & Environment Box */}
              <div className="bg-muted/40 border-border/60 flex flex-col items-start justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
                    Experience Rating
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverRating ?? rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="cursor-pointer p-0.5 transition-transform hover:scale-115 focus:outline-none"
                          aria-label={`Rate ${star} star`}
                        >
                          <HugeiconsIcon
                            icon={StarIcon}
                            strokeWidth={2}
                            className={`size-4.5 ${
                              isFilled
                                ? "fill-amber-400 text-amber-500"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-foreground ml-1.5 text-xs font-medium">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-right sm:justify-end">
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {pageUrl}
                  </Badge>
                  <span className="text-muted-foreground text-[10px]">
                    {deviceInfo}
                  </span>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fb-name" className="text-xs font-semibold">
                    Reporter Name
                  </Label>
                  <Input
                    id="fb-name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your full name"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fb-email" className="text-xs font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="fb-email"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
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
              className="h-8 text-xs"
            >
              {submitButtonLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
