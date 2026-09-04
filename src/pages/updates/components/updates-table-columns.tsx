import {
  MoreHorizontalIcon,
  Sorting01Icon,
  TextFontIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InlineCopy } from "@/components/ui/inline-copy";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type {
  IGetUpdatesTableColumnsProps,
  ISystemUpdate,
  UpdateChannel,
  UpdateImpact,
  UpdateStatus,
  UpdateType,
} from "@/types/updates";

export const UPDATE_TYPES: UpdateType[] = [
  "major",
  "minor",
  "patch",
  "security",
  "hotfix",
  "maintenance",
];

export const UPDATE_CHANNELS: UpdateChannel[] = [
  "stable",
  "beta",
  "security",
  "lts",
];

export const UPDATE_STATUSES: UpdateStatus[] = [
  "deployed",
  "rolling_out",
  "scheduled",
  "draft",
];

export const UPDATE_IMPACTS: UpdateImpact[] = [
  "critical",
  "high",
  "medium",
  "low",
];

const TextIconComp = (props: any) => (
  <HugeiconsIcon icon={TextFontIcon} strokeWidth={2} {...props} />
);
const SortingIconComp = (props: any) => (
  <HugeiconsIcon icon={Sorting01Icon} strokeWidth={2} {...props} />
);

export function getUpdatesTableColumns({
  typeCounts,
  channelCounts,
  statusCounts,
  impactCounts,
  onViewDetails,
  onToggleRead,
  onDeleteUpdate,
}: IGetUpdatesTableColumnsProps): ColumnDef<ISystemUpdate>[] {
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
      id: "version",
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Version" />
      ),
      cell: ({ row }) => {
        const update = row.original;
        return (
          <div className="flex items-center gap-1.5">
            {update.isUnread && (
              <span className="size-1.5 shrink-0 rounded-full bg-blue-500 ring-2 ring-blue-500/25" />
            )}
            <InlineCopy
              text={update.version}
              label="version"
              className="border-border/50 bg-muted/60 text-foreground hover:text-primary rounded border px-1.5 py-0.5 font-mono text-xs font-bold"
            />
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
      size: 90,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Title & Overview" />
      ),
      cell: ({ row }) => {
        const update = row.original;
        return (
          <div className="flex max-w-sm min-w-52 flex-col">
            <button
              type="button"
              onClick={() => onViewDetails(update)}
              className="hover:text-primary cursor-pointer truncate text-left text-xs font-medium transition-colors"
            >
              {update.title}
            </button>
            <span className="text-muted-foreground truncate text-[11px] leading-tight">
              {update.summary}
            </span>
          </div>
        );
      },
      meta: {
        label: "Title",
        placeholder: "Search release notes...",
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
        const type = cell.getValue<UpdateType>();
        if (!type) return null;

        const badgeClass: Record<UpdateType, string> = {
          major:
            "border-emerald-500/30 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
          minor:
            "border-sky-500/30 text-sky-600 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
          patch:
            "border-indigo-500/30 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 dark:text-indigo-400",
          security:
            "border-rose-500/30 text-rose-600 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
          hotfix:
            "border-amber-500/30 text-amber-600 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
          maintenance: "border-muted bg-muted/40 text-muted-foreground",
        };

        return (
          <Badge
            variant="outline"
            className={`px-1.5 py-0.5 text-xs capitalize ${badgeClass[type] || ""}`}
          >
            {type}
          </Badge>
        );
      },
      meta: {
        label: "Type",
        variant: "multiSelect",
        options: UPDATE_TYPES.map((t) => ({
          label: t.charAt(0).toUpperCase() + t.slice(1),
          value: t,
          count: typeCounts[t] || 0,
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 95,
    },
    {
      id: "channel",
      accessorKey: "channel",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Channel" />
      ),
      cell: ({ cell }) => {
        const ch = cell.getValue<UpdateChannel>();
        return (
          <Badge
            variant="outline"
            className="text-foreground px-1.5 text-[10px] uppercase"
          >
            {ch}
          </Badge>
        );
      },
      meta: {
        label: "Channel",
        variant: "multiSelect",
        options: UPDATE_CHANNELS.map((c) => ({
          label: c.toUpperCase(),
          value: c,
          count: channelCounts[c] || 0,
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
        const st = cell.getValue<UpdateStatus>();
        const isRolling = st === "rolling_out";
        return (
          <Badge
            variant={isRolling ? "outline" : "secondary"}
            className={`gap-1 px-1.5 text-xs capitalize ${
              isRolling
                ? "border-amber-500/30 bg-amber-50/50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                : ""
            }`}
          >
            {isRolling && (
              <span className="size-1.5 rounded-full bg-amber-500 ring-2 ring-amber-500/25" />
            )}
            {st.replace("_", " ")}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: UPDATE_STATUSES.map((s) => ({
          label: s.charAt(0).toUpperCase() + s.slice(1).replace("_", " "),
          value: s,
          count: statusCounts[s] || 0,
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 95,
    },
    {
      id: "impact",
      accessorKey: "impact",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Impact" />
      ),
      cell: ({ cell }) => {
        const impact = cell.getValue<UpdateImpact>();
        const dotColors: Record<UpdateImpact, string> = {
          critical: "bg-rose-500",
          high: "bg-amber-500",
          medium: "bg-sky-500",
          low: "bg-muted-foreground",
        };
        return (
          <div className="flex items-center gap-1.5 text-xs capitalize">
            <span
              className={`size-1.5 rounded-full ${dotColors[impact] || "bg-muted-foreground"}`}
            />
            {impact}
          </div>
        );
      },
      meta: {
        label: "Impact",
        variant: "multiSelect",
        options: UPDATE_IMPACTS.map((i) => ({
          label: i.charAt(0).toUpperCase() + i.slice(1),
          value: i,
          count: impactCounts[i] || 0,
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
      size: 85,
    },
    {
      id: "author",
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Deployer" />
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
            <Avatar size="sm" className="size-6 after:hidden">
              {author.avatar ? (
                <AvatarImage src={author.avatar} alt={author.name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="max-w-28 truncate text-xs leading-none font-medium">
                {author.name}
              </span>
              <span className="text-muted-foreground max-w-28 truncate text-[10px] leading-tight">
                {author.role}
              </span>
            </div>
          </div>
        );
      },
      size: 130,
    },
    {
      id: "publishedAt",
      accessorKey: "publishedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Released" />
      ),
      cell: ({ cell }) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(cell.getValue<Date>())}
        </span>
      ),
      enableSorting: true,
      size: 95,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const update = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="size-7" />
              }
            >
              <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 text-xs">
              <DropdownMenuItem onClick={() => onViewDetails(update)}>
                View Details
              </DropdownMenuItem>
              {onToggleRead && (
                <DropdownMenuItem onClick={() => onToggleRead(update.id)}>
                  {update.isUnread ? "Mark as Read" : "Mark as Unread"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  const text = `# ${update.version}: ${update.title}\n\n${update.summary}`;
                  navigator.clipboard.writeText(text);
                  toast.success(`Copied notes for ${update.version}`);
                }}
              >
                Copy Changelog
              </DropdownMenuItem>
              {onDeleteUpdate && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => onDeleteUpdate(update.id)}
                  >
                    Delete Update
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 48,
    },
  ];
}
