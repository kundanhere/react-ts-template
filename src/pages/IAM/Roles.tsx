import {
  Add01Icon,
  ApartmentIcon,
  BadgeInfoIcon,
  CellsIcon,
  LockedIcon,
  ShieldCheck,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RolesPage() {
  const roles = [
    {
      id: "super-admin",
      name: "Super Admin",
      icon: <HugeiconsIcon icon={ShieldCheck} size={18} strokeWidth={2} />,
      description: "Full global system access across all modules and policies.",
      userCount: 1,
      isSystem: true,
    },
    {
      id: "dept-manager",
      name: "Department Manager",
      icon: <HugeiconsIcon icon={ApartmentIcon} size={18} strokeWidth={2} />,
      description: "View and manage team users within assigned department.",
      userCount: 42,
      isSystem: false,
    },
    {
      id: "security-auditor",
      name: "Security Auditor",
      icon: <HugeiconsIcon icon={LockedIcon} size={18} strokeWidth={2} />,
      description: "Read-only access across Users, Policies, and Audit Logs.",
      userCount: 15,
      isSystem: false,
    },
    {
      id: "regular-employee",
      name: "Regular Employee",
      icon: <HugeiconsIcon icon={UserIcon} size={18} strokeWidth={2} />,
      description: "Standard operational permissions for domain modules.",
      userCount: 1180,
      isSystem: false,
    },
    {
      id: "support",
      name: "Support",
      icon: <HugeiconsIcon icon={BadgeInfoIcon} size={18} strokeWidth={2} />,
      description: "Standard operational permissions for support modules.",
      userCount: 3,
      isSystem: false,
    },
  ];

  return (
    <PageWrapper
      title="Role Management"
      subtitle="Define role hierarchy, attach access policies, and inspect effective capabilities."
      action={
        <Button>
          <HugeiconsIcon icon={Add01Icon} size={16} />
          Create New Role
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roles.map((role) => (
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-1">
                <div className="bg-primary/10 text-primary rounded-lg">
                  {role?.icon ?? (
                    <HugeiconsIcon icon={CellsIcon} size={18} strokeWidth={2} />
                  )}
                </div>
                {role.name}
              </CardTitle>
              <CardAction>
                {role.isSystem ? (
                  <Badge variant="secondary">System Role</Badge>
                ) : (
                  <Badge variant="outline">Custom</Badge>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>{role.description}</p>
            </CardContent>
            <CardFooter className="flex w-full items-center justify-between">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <HugeiconsIcon icon={UserGroupIcon} size={14} />
                <span>{`${role.userCount} Assigned User${role.userCount > 1 ? "s" : ""}`}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link to={`/iam/roles/${role.id}`} />}
              >
                View Role &rarr;
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
