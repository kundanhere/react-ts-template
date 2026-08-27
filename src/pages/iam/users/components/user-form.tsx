import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, UserFormProps } from "@/types/iam/users";

import {
  USER_DEPARTMENTS,
  USER_ROLES,
  USER_STATUSES,
} from "./users-table-columns";

export function UserForm({
  initialValues,
  onSubmit,
  onCancel,
  submitText = "Save",
}: UserFormProps) {
  const [name, setName] = React.useState(initialValues?.name ?? "");
  const [email, setEmail] = React.useState(initialValues?.email ?? "");
  const [role, setRole] = React.useState<User["role"]>(
    initialValues?.role ?? "member"
  );
  const [status, setStatus] = React.useState<User["status"]>(
    initialValues?.status ?? "active"
  );
  const [department, setDepartment] = React.useState<User["department"]>(
    initialValues?.department ?? "engineering"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      role,
      status,
      department,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="e.g. John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="e.g. john.doe@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(v) => setRole(v as User["role"])}>
          <SelectTrigger id="role" className="capitalize">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((r) => (
              <SelectItem key={r} value={r} className="capitalize">
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as User["status"])}
        >
          <SelectTrigger id="status" className="capitalize">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {USER_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={department}
          onValueChange={(v) => setDepartment(v as User["department"])}
        >
          <SelectTrigger id="department" className="capitalize">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            {USER_DEPARTMENTS.map((d) => (
              <SelectItem key={d} value={d} className="capitalize">
                {d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{submitText}</Button>
      </div>
    </form>
  );
}
