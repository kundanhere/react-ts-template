import {
  Alert02Icon,
  Bug01Icon,
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  FlashIcon,
  Message01Icon,
  MoreHorizontalIcon,
  Sorting01Icon,
  StarIcon,
  Tag01Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InlineCopy } from "@/components/ui/inline-copy";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type {
  FeedbackCategory,
  FeedbackPriority,
  FeedbackStatus,
  FeedbackType,
  IFeedback,
  IGetFeedbackTableColumnsProps,
} from "@/types/feedback";

export const FEEDBACK_TYPES: FeedbackType[] = [
  "feedback",
  "bug",
  "feature",
  "improvement",
  "performance",
];

export const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  "auth",
  "iam",
  "ui_ux",
  "api",
  "performance",
  "billing",
  "general",
];

export const FEEDBACK_PRIORITIES: FeedbackPriority[] = [
  "low",
  "medium",
  "high",
  "critical",
];

export const FEEDBACK_STATUSES: FeedbackStatus[] = [
  "new",
  "in_review",
  "in_progress",
  "resolved",
  "closed",
];

export function getTypeIcon(type: FeedbackType) {
  switch (type) {
    case "bug":
      return (props: any) => (
        <HugeiconsIcon icon={Bug01Icon} strokeWidth={2} {...props} />
      );
    case "feature":
      return (props: any) => (
        <HugeiconsIcon icon={FlashIcon} strokeWidth={2} {...props} />
      );
    case "performance":
      return (props: any) => (
        <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} {...props} />
      );
    case "improvement":
    case "feedback":
    default:
      return (props: any) => (
        <HugeiconsIcon icon={Message01Icon} strokeWidth={2} {...props} />
      );
  }
}

export function getStatusIcon(status: FeedbackStatus) {
  switch (status) {
    case "new":
      return (props: any) => (
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} {...props} />
      );
    case "in_review":
    case "in_progress":
      return (props: any) => (
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} {...props} />
      );
    case "resolved":
      return (props: any) => (
        <HugeiconsIcon
          icon={CheckmarkCircle01Icon}
          strokeWidth={2}
          {...props}
        />
      );
    case "closed":
      return (props: any) => (
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} {...props} />
      );
  }
}

const TextIconComp = (props: any) => (
  <HugeiconsIcon icon={TextFontIcon} strokeWidth={2} {...props} />
);
const SortingIconComp = (props: any) => (
  <HugeiconsIcon icon={Sorting01Icon} strokeWidth={2} {...props} />
);
const CalendarIconComp = (props: any) => (
  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} {...props} />
);
const TagIconComp = (props: any) => (
  <HugeiconsIcon icon={Tag01Icon} strokeWidth={2} {...props} />
);

export function getFeedbackTableColumns({
  typeCounts,
  categoryCounts,
  priorityCounts,
  statusCounts,
  setRowAction,
  onViewDetails,
  onUpdateStatus,
  onUpdatePriority,
  onDuplicateFeedback,
}: IGetFeedbackTableColumnsProps): ColumnDef<IFeedback>[] {
  return [
    {
      id: "select",
      header: ({ table }) => {
        let isChecked: boolean | "indeterminate" = false;
        if (table.getIsAllPageRowsSelected()) {
          isChecked = true;
        } else if (table.getIsSomePageRowsSelected()) {
          isChecked = "indeterminate";
        }
        return (
          <Checkbox
            aria-label="Select all"
            className="translate-y-0.5"
            checked={isChecked as any}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        );
      },
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          className="translate-y-0.5"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      size: 40,
    },
    {
      id: "code",
      accessorKey: "code",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="ID" />
      ),
      cell: ({ row }) => (
        <InlineCopy
          text={row.getValue("code")}
          label="feedback ID"
          className="text-muted-foreground hover:text-primary w-20 font-mono text-xs font-semibold"
        />
      ),
      enableSorting: true,
      enableHiding: false,
      size: 65,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Review / Issue Summary" />
      ),
      cell: ({ row }) => (
        <div className="flex max-w-sm min-w-56 flex-col">
          <button
            type="button"
            onClick={() => onViewDetails(row.original)}
            className="hover:text-primary cursor-pointer truncate text-left text-xs font-medium transition-colors"
          >
            {row.getValue("title")}
          </button>
          <span className="text-muted-foreground truncate text-[11px] leading-tight">
            {row.original.description}
          </span>
        </div>
      ),
      meta: {
        label: "Title",
        placeholder: "Search reviews & bug reports...",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "type",
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Type" />
      ),
      cell: ({ cell }) => {
        const type = cell.getValue<FeedbackType>();
        if (!type) return null;
        const Icon = getTypeIcon(type);

        const badgeClass: Record<FeedbackType, string> = {
          bug: "border-rose-500/30 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
          feature:
            "border-sky-500/30 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
          performance:
            "border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
          improvement:
            "border-violet-500/30 text-violet-600 bg-violet-50/50 dark:bg-violet-950/20 dark:text-violet-400",
          feedback:
            "border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
        };

        return (
          <Badge
            variant="outline"
            className={`gap-1 px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3 ${badgeClass[type]}`}
          >
            <Icon />
            {type}
          </Badge>
        );
      },
      meta: {
        label: "Type",
        variant: "multiSelect",
        options: FEEDBACK_TYPES.map((t) => ({
          label: t.charAt(0).toUpperCase() + t.slice(1),
          value: t,
          count: typeCounts[t] || 0,
          icon: getTypeIcon(t),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 90,
    },
    {
      id: "category",
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Category" />
      ),
      cell: ({ cell }) => {
        const category = cell.getValue<FeedbackCategory>();
        if (!category) return null;

        const categoryLabels: Record<FeedbackCategory, string> = {
          auth: "Auth & JWT",
          iam: "IAM & Roles",
          ui_ux: "UI / UX",
          api: "API & Dev",
          performance: "Performance",
          billing: "Billing",
          general: "General",
        };

        return (
          <Badge
            variant="secondary"
            className="border-border/60 text-muted-foreground border px-1.5 py-0.5 text-[11px] font-medium"
          >
            {categoryLabels[category] || category}
          </Badge>
        );
      },
      meta: {
        label: "Category",
        variant: "multiSelect",
        options: FEEDBACK_CATEGORIES.map((c) => ({
          label: c.toUpperCase().replace("_", "/"),
          value: c,
          count: categoryCounts[c] || 0,
        })),
        icon: TagIconComp,
      },
      enableColumnFilter: true,
      size: 100,
    },
    {
      id: "priority",
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Priority" />
      ),
      cell: ({ cell }) => {
        const priority = cell.getValue<FeedbackPriority>();
        if (!priority) return null;

        const priorityDot: Record<FeedbackPriority, string> = {
          critical: "bg-rose-500",
          high: "bg-amber-500",
          medium: "bg-sky-500",
          low: "bg-muted-foreground",
        };

        return (
          <Badge
            variant="outline"
            className="text-foreground gap-1.5 px-2 py-0.5 text-xs font-normal capitalize"
          >
            <span
              className={`size-1.5 rounded-full ${priorityDot[priority]}`}
            />
            {priority}
          </Badge>
        );
      },
      meta: {
        label: "Priority",
        variant: "multiSelect",
        options: FEEDBACK_PRIORITIES.map((p) => ({
          label: p.charAt(0).toUpperCase() + p.slice(1),
          value: p,
          count: priorityCounts[p] || 0,
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 85,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<FeedbackStatus>();
        if (!status) return null;
        const Icon = getStatusIcon(status);

        const statusClass: Record<FeedbackStatus, string> = {
          new: "text-sky-600 border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
          in_review:
            "text-amber-600 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
          in_progress:
            "text-violet-600 border-violet-500/30 bg-violet-50/50 dark:bg-violet-950/20 dark:text-violet-400",
          resolved:
            "text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
          closed: "text-muted-foreground border-muted bg-muted/40",
        };

        return (
          <Badge
            variant="outline"
            className={`gap-1 px-1.5 py-0.5 text-xs capitalize [&>svg]:size-3 ${statusClass[status]}`}
          >
            <Icon />
            {status.replace("_", " ")}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: FEEDBACK_STATUSES.map((s) => ({
          label: s.charAt(0).toUpperCase() + s.slice(1).replace("_", " "),
          value: s,
          count: statusCounts[s] || 0,
          icon: getStatusIcon(s),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 95,
    },
    {
      id: "rating",
      accessorKey: "rating",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Rating" />
      ),
      cell: ({ cell }) => {
        const rating = cell.getValue<number>() || 5;
        return (
          <div className="flex items-center gap-0.5 text-amber-500">
            {Array.from({ length: 5 }, () => crypto.randomUUID()).map(
              (idx, i) => (
                <HugeiconsIcon
                  key={idx}
                  icon={StarIcon}
                  strokeWidth={2}
                  className={`size-3.5 ${
                    i < rating
                      ? "fill-amber-400 text-amber-500"
                      : "text-muted-foreground/30"
                  }`}
                />
              )
            )}
          </div>
        );
      },
      enableSorting: true,
      size: 80,
    },
    {
      id: "author",
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Reporter" />
      ),
      cell: ({ row }) => {
        const { author } = row.original;
        const initials = author.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return (
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full text-[10px] font-bold">
              {initials}
            </div>
            <div className="flex flex-col">
              <span className="text-xs leading-none font-medium">
                {author.name}
              </span>
              <span className="text-muted-foreground text-[10px] leading-tight">
                {author.email}
              </span>
            </div>
          </div>
        );
      },
      size: 130,
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Submitted" />
      ),
      cell: ({ cell }) => (
        <span className="text-muted-foreground text-xs whitespace-nowrap">
          {formatDate(cell.getValue<Date>())}
        </span>
      ),
      meta: {
        label: "Submitted Date",
        variant: "dateRange",
        icon: CalendarIconComp,
      },
      enableColumnFilter: true,
      size: 90,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <HugeiconsIcon
                  icon={MoreHorizontalIcon}
                  strokeWidth={2}
                  className="size-4"
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.status}
                    onValueChange={(value) => {
                      onUpdateStatus?.(
                        row.original.id,
                        value as FeedbackStatus
                      );
                      toast.success(`Status set to ${value.replace("_", " ")}`);
                    }}
                  >
                    {FEEDBACK_STATUSES.map((status) => (
                      <DropdownMenuRadioItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1).replace("_", " ")}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Priority</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.priority}
                    onValueChange={(value) => {
                      onUpdatePriority?.(
                        row.original.id,
                        value as FeedbackPriority
                      );
                      toast.success(`Priority set to ${value}`);
                    }}
                  >
                    {FEEDBACK_PRIORITIES.map((pri) => (
                      <DropdownMenuRadioItem key={pri} value={pri}>
                        {pri.charAt(0).toUpperCase() + pri.slice(1)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                onClick={() => onDuplicateFeedback?.(row.original)}
              >
                Duplicate Item
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setRowAction({ row, variant: "delete" })}
              >
                Delete Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
