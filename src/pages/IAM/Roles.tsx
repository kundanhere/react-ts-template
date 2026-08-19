import {
  Add01Icon,
  Shield01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router-dom";

import { PageWrapper } from "@/components/page-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RolesPage() {
  const roles = [
    {
      id: "super-admin",
      name: "Super Admin",
      description: "Full global system access across all modules and policies.",
      userCount: 3,
      isSystem: true,
    },
    {
      id: "iam-admin",
      name: "IAM Administrator",
      description: "Full management of Users, Roles, Policies, and Sessions.",
      userCount: 8,
      isSystem: true,
    },
    {
      id: "dept-manager",
      name: "Department Manager",
      description: "View and manage team users within assigned department.",
      userCount: 42,
      isSystem: false,
    },
    {
      id: "security-auditor",
      name: "Security Auditor",
      description: "Read-only access across Users, Policies, and Audit Logs.",
      userCount: 15,
      isSystem: false,
    },
    {
      id: "regular-employee",
      name: "Regular Employee",
      description: "Standard operational permissions for domain modules.",
      userCount: 1180,
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-card flex flex-col justify-between rounded-xl border p-5 shadow-xs transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary rounded-lg p-2">
                    <HugeiconsIcon
                      icon={Shield01Icon}
                      size={18}
                      strokeWidth={2}
                    />
                  </div>
                  <h2 className="text-base font-semibold">{role.name}</h2>
                </div>
                {role.isSystem ? (
                  <Badge variant="secondary">System Role</Badge>
                ) : (
                  <Badge variant="outline">Custom</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                {role.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <HugeiconsIcon icon={UserGroupIcon} size={14} />
                <span>{role.userCount} Assigned Users</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                render={<Link to={`/iam/roles/${role.id}`} />}
              >
                View Role &rarr;
              </Button>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}
