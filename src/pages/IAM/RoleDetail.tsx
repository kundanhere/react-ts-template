import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const permissions = [
    {
      module: "Users Management",
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    {
      module: "Roles & Hierarchy",
      create: true,
      read: true,
      update: true,
      delete: false,
    },
    {
      module: "Policies Registry",
      create: true,
      read: true,
      update: true,
      delete: false,
    },
    {
      module: "Audit Logs",
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    {
      module: "Security Settings",
      create: false,
      read: true,
      update: false,
      delete: false,
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-2"
          render={<Link to="/iam/roles" />}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="mr-1" />
          Back to Roles
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary rounded-xl p-3">
            <HugeiconsIcon icon={Shield01Icon} size={24} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight capitalize">
                Role Details: {id?.replace(/-/g, " ")}
              </h1>
              <Badge variant="secondary">Active Role</Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              Role ID: <code className="font-mono text-xs">{id}</code>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card flex flex-col gap-4 rounded-xl border p-6 shadow-xs">
        <h2 className="text-lg font-semibold">Role Capability Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Module Name</th>
                <th className="px-4 py-3 text-center">Create</th>
                <th className="px-4 py-3 text-center">Read / View</th>
                <th className="px-4 py-3 text-center">Update / Edit</th>
                <th className="px-4 py-3 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {permissions.map((p) => (
                <tr key={p.module} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{p.module}</td>
                  <td className="px-4 py-3 text-center">
                    {p.create ? (
                      <span className="inline-flex justify-center text-emerald-600">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.read ? (
                      <span className="inline-flex justify-center text-emerald-600">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.update ? (
                      <span className="inline-flex justify-center text-emerald-600">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.delete ? (
                      <span className="inline-flex justify-center text-emerald-600">
                        <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} />
                      </span>
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
