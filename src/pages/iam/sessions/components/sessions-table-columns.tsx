import * as React from "react";

import {
  AlertCircleIcon,
  Calendar01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CodeIcon,
  ComputerIcon,
  CpuIcon,
  Key01Icon,
  Location01Icon,
  LockIcon,
  MoreHorizontalIcon,
  ShieldCheck,
  SmartPhone01Icon,
  Sorting01Icon,
  Tablet01Icon,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { formatDate } from "@/lib/format";
import type { DataTableRowAction } from "@/types/data-table";

export interface Session {
  id: string;
  code: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  ipAddress: string;
  location: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet" | "api";
  authMethod: "mfa" | "sso" | "password" | "api_key";
  status: "active" | "idle" | "revoked" | "expired";
  isCurrent: boolean;
  riskScore: "low" | "medium" | "high";
  startedAt: Date;
  lastActiveAt: Date;
  expiresAt: Date;
}

export const SESSION_STATUSES = [
  "active",
  "idle",
  "revoked",
  "expired",
] as const;
export const SESSION_DEVICE_TYPES = [
  "desktop",
  "mobile",
  "tablet",
  "api",
] as const;
export const SESSION_AUTH_METHODS = [
  "mfa",
  "sso",
  "password",
  "api_key",
] as const;
export const SESSION_RISK_SCORES = ["low", "medium", "high"] as const;

export function getStatusIcon(status: Session["status"]) {
  switch (status) {
    case "active":
      return (props: any) => (
        <HugeiconsIcon
          icon={CheckmarkCircle01Icon}
          strokeWidth={2}
          {...props}
        />
      );
    case "idle":
      return (props: any) => (
        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} {...props} />
      );
    case "revoked":
      return (props: any) => (
        <HugeiconsIcon icon={CancelCircleIcon} strokeWidth={2} {...props} />
      );
    case "expired":
      return (props: any) => (
        <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} {...props} />
      );
  }
}

export function getDeviceTypeIcon(deviceType: Session["deviceType"]) {
  switch (deviceType) {
    case "desktop":
      return (props: any) => (
        <HugeiconsIcon icon={ComputerIcon} strokeWidth={2} {...props} />
      );
    case "mobile":
      return (props: any) => (
        <HugeiconsIcon icon={SmartPhone01Icon} strokeWidth={2} {...props} />
      );
    case "tablet":
      return (props: any) => (
        <HugeiconsIcon icon={Tablet01Icon} strokeWidth={2} {...props} />
      );
    case "api":
      return (props: any) => (
        <HugeiconsIcon icon={CpuIcon} strokeWidth={2} {...props} />
      );
  }
}

export function getAuthMethodIcon(authMethod: Session["authMethod"]) {
  switch (authMethod) {
    case "mfa":
      return (props: any) => (
        <HugeiconsIcon icon={ShieldCheck} strokeWidth={2} {...props} />
      );
    case "sso":
      return (props: any) => (
        <HugeiconsIcon icon={Key01Icon} strokeWidth={2} {...props} />
      );
    case "password":
      return (props: any) => (
        <HugeiconsIcon icon={LockIcon} strokeWidth={2} {...props} />
      );
    case "api_key":
      return (props: any) => (
        <HugeiconsIcon icon={CodeIcon} strokeWidth={2} {...props} />
      );
  }
}

const TextIconComp = (props: any) => (
  <HugeiconsIcon icon={TextFontIcon} strokeWidth={2} {...props} />
);
const SortingIconComp = (props: any) => (
  <HugeiconsIcon icon={Sorting01Icon} strokeWidth={2} {...props} />
);
const CheckmarkIconComp = (props: any) => (
  <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} {...props} />
);
const CalendarIconComp = (props: any) => (
  <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} {...props} />
);

interface GetSessionsTableColumnsProps {
  statusCounts: Record<Session["status"], number>;
  deviceTypeCounts: Record<Session["deviceType"], number>;
  authMethodCounts: Record<Session["authMethod"], number>;
  riskScoreCounts: Record<Session["riskScore"], number>;
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Session> | null>
  >;
  onViewDetails?: (session: Session) => void;
  onUpdateStatus?: (sessionId: string, status: Session["status"]) => void;
}

export function getSessionsTableColumns({
  statusCounts,
  deviceTypeCounts,
  authMethodCounts,
  riskScoreCounts,
  setRowAction,
  onViewDetails,
  onUpdateStatus,
}: GetSessionsTableColumnsProps): ColumnDef<Session>[] {
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
        <DataTableColumnHeader column={column} label="Session ID" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground w-20 font-mono text-xs font-semibold">
          {row.getValue("code")}
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 80,
    },
    {
      id: "user",
      accessorFn: (row) => `${row.user.name} ${row.user.email}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="User" />
      ),
      cell: ({ row }) => {
        const { user, isCurrent } = row.original;
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-medium">{user.name}</span>
                {isCurrent && (
                  <Badge
                    variant="secondary"
                    className="px-1.5 py-0 text-[10px]"
                  >
                    This Device
                  </Badge>
                )}
              </div>
              <span className="text-muted-foreground max-w-56 truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
      meta: {
        label: "User",
        placeholder: "Search by user or email",
        variant: "text",
        icon: TextIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "device",
      accessorKey: "device",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Device & Client" />
      ),
      cell: ({ row }) => {
        const { device, deviceType } = row.original;
        const DeviceIcon = getDeviceTypeIcon(deviceType);

        return (
          <div className="flex items-center gap-2">
            <div className="bg-muted/40 flex size-7 shrink-0 items-center justify-center rounded border">
              <DeviceIcon className="text-muted-foreground size-3.5" />
            </div>
            <span className="text-foreground max-w-52 truncate text-xs font-medium">
              {device}
            </span>
          </div>
        );
      },
      meta: {
        label: "Device Type",
        variant: "multiSelect",
        options: SESSION_DEVICE_TYPES.map((dt) => ({
          label: dt.charAt(0).toUpperCase() + dt.slice(1),
          value: dt,
          count: deviceTypeCounts[dt] || 0,
          icon: getDeviceTypeIcon(dt),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "ipAddress",
      accessorKey: "ipAddress",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="IP & Location" />
      ),
      cell: ({ row }) => {
        const { ipAddress, location } = row.original;
        return (
          <div className="flex flex-col">
            <code className="text-foreground font-mono text-xs font-medium">
              {ipAddress}
            </code>
            <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
              <HugeiconsIcon
                icon={Location01Icon}
                strokeWidth={2}
                className="size-3"
              />
              {location}
            </span>
          </div>
        );
      },
      enableColumnFilter: true,
    },
    {
      id: "authMethod",
      accessorKey: "authMethod",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Auth Method" />
      ),
      cell: ({ cell }) => {
        const authMethod = cell.getValue<Session["authMethod"]>();
        if (!authMethod) return null;
        const AuthIcon = getAuthMethodIcon(authMethod);

        const labelMap: Record<Session["authMethod"], string> = {
          mfa: "MFA Active",
          sso: "SSO / SAML",
          password: "Password",
          api_key: "API Key",
        };

        return (
          <Badge
            variant="secondary"
            className="border-border gap-1 border px-2 py-0.5 text-xs capitalize [&>svg]:size-3"
          >
            <AuthIcon />
            {labelMap[authMethod]}
          </Badge>
        );
      },
      meta: {
        label: "Auth Method",
        variant: "multiSelect",
        options: SESSION_AUTH_METHODS.map((am) => ({
          label: am.toUpperCase().replace("_", " "),
          value: am,
          count: authMethodCounts[am] || 0,
          icon: getAuthMethodIcon(am),
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "riskScore",
      accessorKey: "riskScore",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Risk Level" />
      ),
      cell: ({ cell }) => {
        const riskScore = cell.getValue<Session["riskScore"]>();
        if (!riskScore) return null;

        const variantMap: Record<Session["riskScore"], string> = {
          low: "text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
          medium:
            "text-amber-600 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
          high: "text-rose-600 border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
        };
        const dotColorMap: Record<Session["riskScore"], string> = {
          low: "bg-emerald-500",
          medium: "bg-amber-500",
          high: "bg-rose-500",
        };

        return (
          <Badge
            variant="outline"
            className={`gap-1 px-2 py-0.5 text-xs capitalize ${variantMap[riskScore]}`}
          >
            <span
              className={`size-1.5 rounded-full ${dotColorMap[riskScore]}`}
            />
            {riskScore}
          </Badge>
        );
      },
      meta: {
        label: "Risk Level",
        variant: "multiSelect",
        options: SESSION_RISK_SCORES.map((rs) => ({
          label: rs.charAt(0).toUpperCase() + rs.slice(1),
          value: rs,
          count: riskScoreCounts[rs] || 0,
        })),
        icon: SortingIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Status" />
      ),
      cell: ({ cell }) => {
        const status = cell.getValue<Session["status"]>();
        if (!status) return null;
        const Icon = getStatusIcon(status);

        const variantMap: Record<Session["status"], string> = {
          active:
            "text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
          idle: "text-amber-600 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
          revoked:
            "text-rose-600 border-rose-500/30 bg-rose-50/50 dark:bg-rose-950/20 dark:text-rose-400",
          expired: "text-muted-foreground border-muted bg-muted/40",
        };

        return (
          <Badge
            variant="outline"
            className={`gap-1 px-2 py-0.5 text-xs capitalize [&>svg]:size-3 ${variantMap[status]}`}
          >
            <Icon />
            {status}
          </Badge>
        );
      },
      meta: {
        label: "Status",
        variant: "multiSelect",
        options: SESSION_STATUSES.map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
          count: statusCounts[status] || 0,
          icon: getStatusIcon(status),
        })),
        icon: CheckmarkIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "lastActiveAt",
      accessorKey: "lastActiveAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} label="Last Active" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Last Active",
        variant: "dateRange",
        icon: CalendarIconComp,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        const { isCurrent, status } = row.original;
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
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onViewDetails?.(row.original)}>
                Session Details
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={status}
                    onValueChange={(val) => {
                      onUpdateStatus?.(
                        row.original.id,
                        val as Session["status"]
                      );
                      toast.success(
                        `Session ${row.original.code} status set to ${val}`
                      );
                    }}
                  >
                    {SESSION_STATUSES.map((st) => (
                      <DropdownMenuRadioItem
                        key={st}
                        value={st}
                        className="capitalize"
                      >
                        {st}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                disabled={isCurrent || status === "revoked"}
                onClick={() => setRowAction({ row, variant: "delete" })}
              >
                Revoke Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}
