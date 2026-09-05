import * as React from "react";

import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { PageWrapper } from "@/components/page-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CURRENT_USER = {
  name: "Kundan Gupta",
  email: "kundang25@gmail.com",
  avatar: "https://i.pravatar.cc/150?u=a04",
  roleId: "super-admin",
  roleName: "Super Admin",
  department: "Engineering",
  session: {
    id: "SESS-1001",
    ipAddress: "192.168.1.45",
    location: "San Francisco, US",
    device: "Chrome 122.0 on macOS 14.3",
  },
};

const ROLES = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Full global system access across all modules and policies.",
  },
  {
    id: "dept-manager",
    name: "Department Manager",
    description: "View and manage team users within assigned department.",
  },
  {
    id: "security-auditor",
    name: "Security Auditor",
    description: "Read-only access across Users, Policies, and Audit Logs.",
  },
  {
    id: "regular-employee",
    name: "Regular Employee",
    description: "Standard operational permissions for domain modules.",
  },
  {
    id: "support",
    name: "Support",
    description: "Standard operational permissions for support modules.",
  },
];

interface IPermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  description: string;
}

const MODULE_PERMISSIONS: Record<string, Record<string, IPermission>> = {
  "super-admin": {
    Users: {
      create: true,
      read: true,
      update: true,
      delete: true,
      description: "Manage users, invites, and account states.",
    },
    Roles: {
      create: true,
      read: true,
      update: true,
      delete: true,
      description: "Define security groups and configure capability matrices.",
    },
    Policies: {
      create: true,
      read: true,
      update: true,
      delete: true,
      description: "Manage policy registers and validation rules.",
    },
    Modules: {
      create: true,
      read: true,
      update: true,
      delete: true,
      description: "Configure system paths, routing, and access control lists.",
    },
    "Audit Logs": {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "View system audit trails and access history.",
    },
    "Security Settings": {
      create: true,
      read: true,
      update: true,
      delete: true,
      description:
        "Manage global security settings and authentication policies.",
    },
  },
  "dept-manager": {
    Users: {
      create: true,
      read: true,
      update: true,
      delete: false,
      description: "Manage department users and team invites.",
    },
    Roles: {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "View department security group definitions.",
    },
    Policies: {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "View access policies applicable to department.",
    },
    Modules: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to module configuration.",
    },
    "Audit Logs": {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "View department-specific audit logs.",
    },
    "Security Settings": {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to security settings.",
    },
  },
  "security-auditor": {
    Users: {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "Inspect user accounts and profile compliance.",
    },
    Roles: {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "Read role hierarchies and assigned capability lists.",
    },
    Policies: {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "Audit active and compiled security policies.",
    },
    Modules: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to module configuration.",
    },
    "Audit Logs": {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "Analyze full system audit trail logs.",
    },
    "Security Settings": {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "Read security configurations and compliance status.",
    },
  },
  "regular-employee": {
    Users: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to user management.",
    },
    Roles: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to role hierarchy.",
    },
    Policies: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to policies register.",
    },
    Modules: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to module configuration.",
    },
    "Audit Logs": {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to audit logs.",
    },
    "Security Settings": {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to security settings.",
    },
  },
  support: {
    Users: {
      create: false,
      read: true,
      update: true,
      delete: false,
      description: "Assist users with profile updates and basic management.",
    },
    Roles: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to role hierarchy.",
    },
    Policies: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to policies register.",
    },
    Modules: {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to module configuration.",
    },
    "Audit Logs": {
      create: false,
      read: true,
      update: false,
      delete: false,
      description: "Inspect system logs to troubleshoot user issues.",
    },
    "Security Settings": {
      create: false,
      read: false,
      update: false,
      delete: false,
      description: "No access to security settings.",
    },
  },
};

interface IAccessLevelConfig {
  label: string;
  dotClass: string;
  badgeClass: string;
}

function getAccessLevel(permission: IPermission): IAccessLevelConfig {
  const { create, read, update, delete: del } = permission;
  if (create && read && update && del) {
    return {
      label: "Full Access",
      dotClass: "bg-emerald-500",
      badgeClass:
        "text-emerald-600 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 dark:text-emerald-400",
    };
  }
  if (read && (create || update || del)) {
    return {
      label: "Limited Access",
      dotClass: "bg-amber-500",
      badgeClass:
        "text-amber-600 border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 dark:text-amber-400",
    };
  }
  if (read) {
    return {
      label: "Read-Only",
      dotClass: "bg-sky-500",
      badgeClass:
        "text-sky-600 border-sky-500/30 bg-sky-50/50 dark:bg-sky-950/20 dark:text-sky-400",
    };
  }
  return {
    label: "No Access",
    dotClass: "bg-destructive",
    badgeClass:
      "text-destructive border-destructive/30 bg-destructive/10 dark:bg-destructive/20",
  };
}

export default function AccessMatrixPage() {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>(
    CURRENT_USER.roleId
  );

  const selectedRole = React.useMemo(
    () => ROLES.find((r) => r.id === selectedRoleId) || ROLES[0],
    [selectedRoleId]
  );

  const permissions = React.useMemo(
    () =>
      MODULE_PERMISSIONS[selectedRoleId] ||
      MODULE_PERMISSIONS[CURRENT_USER.roleId],
    [selectedRoleId]
  );

  const stats = React.useMemo(() => {
    let full = 0;
    let limited = 0;
    let view = 0;
    let none = 0;

    Object.values(permissions).forEach((perm) => {
      const access = getAccessLevel(perm);

      if (access.label === "Full Access") full += 1;
      else if (access.label === "Limited Access") limited += 1;
      else if (access.label === "Read-Only") view += 1;
      else none += 1;
    });

    return {
      total: Object.keys(permissions).length,
      full,
      limited,
      view,
      none,
    };
  }, [permissions]);

  return (
    <TooltipProvider delay={100}>
      <PageWrapper
        title="Access Matrix"
        subtitle="Inspect your active role's modules and capability levels across Sentry IAM."
      >
        <div className="flex flex-col gap-6">
          {/* User Session Info Card */}
          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-border/40 flex flex-col items-start justify-between gap-4 border-b px-4 py-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <Avatar size="lg" className="border shadow-2xs">
                  <AvatarImage
                    src={CURRENT_USER.avatar}
                    alt={CURRENT_USER.name}
                  />
                  <AvatarFallback>KG</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    {CURRENT_USER.name}
                    <Badge
                      variant="secondary"
                      className="border-border border px-1.5 py-0.5 text-[0.625rem] font-normal capitalize"
                    >
                      {CURRENT_USER.roleName}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-border bg-input/10 text-muted-foreground px-1.5 py-0.5 text-[0.625rem] font-normal"
                    >
                      {CURRENT_USER.department}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {CURRENT_USER.email}
                  </CardDescription>
                </div>
              </div>

              {/* Role selection dropdown */}
              <div className="flex w-full min-w-50 flex-col gap-1 sm:w-auto">
                <span className="text-muted-foreground text-[0.625rem] font-bold tracking-wider uppercase">
                  Inspect Role Matrix
                </span>
                <Select
                  value={selectedRoleId}
                  onValueChange={(val) => val && setSelectedRoleId(val)}
                >
                  <SelectTrigger className="w-full text-xs sm:w-60">
                    <SelectValue placeholder="Select role to inspect" />
                  </SelectTrigger>
                  <SelectContent className="min-w-60">
                    {ROLES.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}{" "}
                        {role.id === CURRENT_USER.roleId && "(My Role)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardFooter className="bg-muted/30 border-border/40 text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t px-4 py-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold">
                  Active Session:
                </span>
                <span className="bg-background text-foreground shadow-3xs rounded border px-1.5 py-0.5 font-mono text-[0.625rem]">
                  {CURRENT_USER.session.id}
                </span>
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold tracking-wider text-emerald-600 uppercase dark:bg-emerald-950/20 dark:text-emerald-400"
                >
                  <span className="size-1 animate-ping rounded-full bg-emerald-500" />
                  This Device
                </Badge>
              </div>
              <div className="text-muted-foreground/30 hidden sm:block">•</div>
              <div>
                <span className="text-foreground font-semibold">
                  IP Address:
                </span>{" "}
                {CURRENT_USER.session.ipAddress}
              </div>
              <div className="text-muted-foreground/30 hidden sm:block">•</div>
              <div>
                <span className="text-foreground font-semibold">Location:</span>{" "}
                {CURRENT_USER.session.location}
              </div>
              <div className="text-muted-foreground/30 hidden sm:block">•</div>
              <div>
                <span className="text-foreground font-semibold">
                  Device footprint:
                </span>{" "}
                {CURRENT_USER.session.device}
              </div>
            </CardFooter>
          </Card>

          {/* Permissions Details Card Container */}
          <Card className="gap-0 py-0 shadow-xs">
            <CardHeader className="border-border/40 flex flex-col justify-between gap-4 border-b px-4 py-3 md:flex-row md:items-center">
              <div className="flex flex-col gap-0.5">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <HugeiconsIcon
                    icon={Shield01Icon}
                    className="text-primary size-4.5"
                  />
                  <span>Effective Capabilities: {selectedRole.name}</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {selectedRole.description}
                </CardDescription>
              </div>

              {/* Legend / Status Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-[0.6875rem]">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground font-medium">
                    Granted
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-destructive size-1.5 rounded-full" />
                  <span className="text-muted-foreground font-medium">
                    Denied
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-5 px-4 py-4">
              {/* Quick Metrics KPI cards (Custom Sentry Analytics Dashboard Card style) */}
              <div className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Modules */}
                <div className="border-border/75 bg-card relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-2xs">
                  <div className="absolute top-0 right-0 left-0 h-[0.15625rem] bg-slate-500" />
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <span className="text-muted-foreground truncate text-xs font-semibold tracking-tight">
                      Total Modules
                    </span>
                    <Badge
                      variant="outline"
                      className="gap-1 border-slate-500/30 bg-slate-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-slate-600 dark:bg-slate-950/20 dark:text-slate-400"
                    >
                      <span className="size-1 rounded-full bg-slate-500" />
                      Console
                    </Badge>
                  </div>
                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                      <div className="text-foreground text-xl leading-none font-bold tracking-tight">
                        {stats.total}
                      </div>
                      <div className="text-muted-foreground mt-1 truncate text-[0.625rem] font-medium">
                        Assigned in console
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Access */}
                <div className="border-border/75 bg-card relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-2xs">
                  <div className="bg-primary absolute top-0 right-0 left-0 h-[0.15625rem]" />
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <span className="text-muted-foreground truncate text-xs font-semibold tracking-tight">
                      Full Access
                    </span>
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary gap-1 px-1.5 py-0.5 text-[0.625rem] font-semibold"
                    >
                      <span className="bg-primary size-1 rounded-full" />
                      Unrestricted
                    </Badge>
                  </div>
                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                      <div className="text-foreground text-xl leading-none font-bold tracking-tight">
                        {stats.full}
                      </div>
                      <div className="text-muted-foreground mt-1 truncate text-[0.625rem] font-medium">
                        Unrestricted capabilities
                      </div>
                    </div>
                  </div>
                </div>

                {/* Restricted Access */}
                <div className="border-border/75 bg-card relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-2xs">
                  <div className="absolute top-0 right-0 left-0 h-[0.15625rem] bg-amber-500" />
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <span className="text-muted-foreground truncate text-xs font-semibold tracking-tight">
                      Restricted Access
                    </span>
                    <Badge
                      variant="outline"
                      className="gap-1 border-amber-500/30 bg-amber-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                    >
                      <span className="size-1 rounded-full bg-amber-500" />
                      Limited
                    </Badge>
                  </div>
                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                      <div className="text-foreground text-xl leading-none font-bold tracking-tight">
                        {stats.limited + stats.view}
                      </div>
                      <div className="text-muted-foreground mt-1 truncate text-[0.625rem] font-medium">
                        Read or partial edit
                      </div>
                    </div>
                  </div>
                </div>

                {/* No Access */}
                <div className="border-border/75 bg-card relative flex flex-col justify-between overflow-hidden rounded-xl border p-3.5 shadow-2xs">
                  <div className="absolute top-0 right-0 left-0 h-[0.15625rem] bg-rose-500" />
                  <div className="flex items-center justify-between gap-1 pt-0.5">
                    <span className="text-muted-foreground truncate text-xs font-semibold tracking-tight">
                      No Access
                    </span>
                    <Badge
                      variant="outline"
                      className="gap-1 border-rose-500/30 bg-rose-50/50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                    >
                      <span className="size-1 rounded-full bg-rose-500" />
                      Blocked
                    </Badge>
                  </div>
                  <div className="mt-2.5 flex items-end justify-between gap-2">
                    <div className="flex min-w-0 flex-col">
                      <div className="text-foreground text-xl leading-none font-bold tracking-tight">
                        {stats.none}
                      </div>
                      <div className="text-muted-foreground mt-1 truncate text-[0.625rem] font-medium">
                        Explicitly blocked
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capabilities Table */}
              <div className="*:data-[slot=table-container]:no-scrollbar w-full overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50 border-b">
                    <TableRow>
                      <TableHead className="w-45 font-semibold">
                        Module
                      </TableHead>
                      <TableHead className="min-w-55 font-semibold">
                        Description
                      </TableHead>
                      <TableHead className="w-30 text-center font-semibold">
                        Access Level
                      </TableHead>
                      <TableHead className="w-22.5 text-center font-semibold">
                        Create
                      </TableHead>
                      <TableHead className="w-22.5 text-center font-semibold">
                        Read
                      </TableHead>
                      <TableHead className="w-22.5 text-center font-semibold">
                        Update
                      </TableHead>
                      <TableHead className="w-22.5 text-center font-semibold">
                        Delete
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y">
                    {Object.entries(permissions).map(([moduleName, perm]) => {
                      const access = getAccessLevel(perm);
                      return (
                        <TableRow
                          key={moduleName}
                          className="hover:bg-muted/30"
                        >
                          <TableCell className="text-sm font-semibold">
                            {moduleName}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {perm.description}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`gap-1.5 px-2 py-0.5 text-xs font-normal ${access.badgeClass}`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${access.dotClass}`}
                              />
                              {access.label}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex cursor-default justify-center">
                                  {perm.create ? (
                                    <HugeiconsIcon
                                      icon={CheckmarkCircle02Icon}
                                      className="size-5 text-emerald-600"
                                    />
                                  ) : (
                                    <HugeiconsIcon
                                      icon={CancelCircleIcon}
                                      className="text-destructive/35 size-5 animate-pulse"
                                    />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="text-[0.625rem]">
                                {perm.create
                                  ? "Create permission: Granted"
                                  : "Create permission: Denied"}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>

                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex cursor-default justify-center">
                                  {perm.read ? (
                                    <HugeiconsIcon
                                      icon={CheckmarkCircle02Icon}
                                      className="size-5 text-emerald-600"
                                    />
                                  ) : (
                                    <HugeiconsIcon
                                      icon={CancelCircleIcon}
                                      className="text-destructive/35 size-5 animate-pulse"
                                    />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="text-[0.625rem]">
                                {perm.read
                                  ? "Read permission: Granted"
                                  : "Read permission: Denied"}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>

                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex cursor-default justify-center">
                                  {perm.update ? (
                                    <HugeiconsIcon
                                      icon={CheckmarkCircle02Icon}
                                      className="size-5 text-emerald-600"
                                    />
                                  ) : (
                                    <HugeiconsIcon
                                      icon={CancelCircleIcon}
                                      className="text-destructive/35 size-5 animate-pulse"
                                    />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="text-[0.625rem]">
                                {perm.update
                                  ? "Update permission: Granted"
                                  : "Update permission: Denied"}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>

                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex cursor-default justify-center">
                                  {perm.delete ? (
                                    <HugeiconsIcon
                                      icon={CheckmarkCircle02Icon}
                                      className="size-5 text-emerald-600"
                                    />
                                  ) : (
                                    <HugeiconsIcon
                                      icon={CancelCircleIcon}
                                      className="text-destructive/35 size-5 animate-pulse"
                                    />
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="text-[0.625rem]">
                                {perm.delete
                                  ? "Delete permission: Granted"
                                  : "Delete permission: Denied"}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </TooltipProvider>
  );
}
