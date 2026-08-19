import { useLocation } from "react-router-dom";

export interface BreadcrumbItem {
  title: string;
  href?: string;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const location = useLocation();
  const { pathname } = location;

  if (pathname === "/") {
    return [{ title: "Home" }];
  }

  const items: BreadcrumbItem[] = [{ title: "Home", href: "/" }];

  const routeMap: Record<
    string,
    { title: string; parent?: string; parentHref?: string }
  > = {
    "/dashboard": { title: "Overview" },
    "/updates": { title: "Updates" },
    "/inbox": { title: "Inbox" },

    // IAM Main Section
    "/iam/dashboard": {
      title: "Identity & Access",
    },
    "/iam/users": {
      title: "Users",
      parent: "Identity & Access",
      parentHref: "/iam/dashboard",
    },
    "/iam/roles": {
      title: "Roles",
      parent: "Identity & Access",
      parentHref: "/iam/dashboard",
    },
    "/iam/policies": {
      title: "Policies",
      parent: "Identity & Access",
      parentHref: "/iam/dashboard",
    },
    "/iam/modules": {
      title: "Modules",
      parent: "Identity & Access",
      parentHref: "/iam/dashboard",
    },

    // Security & System Section
    "/iam/security/settings": {
      title: "Security Settings",
      parent: "Security & System",
      parentHref: "/iam/sessions",
    },
    "/iam/sessions": {
      title: "Active Sessions",
      parent: "Security & System",
      parentHref: "/iam/security/settings",
    },
    "/iam/audit": {
      title: "Audit Trail",
      parent: "Security & System",
      parentHref: "/iam/sessions",
    },
    "/iam/audit/me": {
      title: "My Activity Log",
      parent: "Audit Trail",
      parentHref: "/iam/audit/logs",
    },
    "/iam/audit/logs": {
      title: "System Audit Logs",
      parent: "Audit Trail",
      parentHref: "/iam/audit/logs",
    },

    // Governance & Tools Section
    "/iam/access-matrix": {
      title: "Access Matrix",
      parent: "Governance & Tools",
      parentHref: "/iam/dashboard",
    },
    "/iam/access/simulate": {
      title: "Policy Simulator",
      parent: "Governance & Tools",
      parentHref: "/iam/access-matrix",
    },

    // Secondary
    "/support": { title: "Support" },
    "/feedback": { title: "Feedback" },
  };

  if (routeMap[pathname]) {
    const route = routeMap[pathname];
    if (route.parent) {
      if (route.parent === "Audit Trail") {
        items.push({ title: "Security & System", href: "/iam/sessions" });
        items.push({ title: "Audit Trail", href: "/iam/audit/logs" });
      } else {
        items.push({ title: route.parent, href: route.parentHref });
      }
    }
    items.push({ title: route.title });
  } else if (pathname.startsWith("/iam/users/")) {
    items.push({ title: "Identity & Access", href: "/iam/dashboard" });
    items.push({ title: "Users", href: "/iam/users" });
    const sub = pathname.replace("/iam/users/", "");
    if (sub.endsWith("/policies")) {
      items.push({ title: "User Policy Overrides" });
    } else if (sub.endsWith("/access")) {
      items.push({ title: "Effective Access Matrix" });
    } else {
      items.push({ title: `User Details (${sub})` });
    }
  } else if (pathname.startsWith("/iam/roles/")) {
    items.push({ title: "Identity & Access", href: "/iam/dashboard" });
    items.push({ title: "Roles", href: "/iam/roles" });
    const sub = pathname.replace("/iam/roles/", "");
    items.push({ title: `Role Details (${sub})` });
  } else if (pathname.startsWith("/iam/policies/")) {
    items.push({ title: "Identity & Access", href: "/iam/dashboard" });
    items.push({ title: "Policies", href: "/iam/policies" });
    const sub = pathname.replace("/iam/policies/", "");
    if (sub === "new") {
      items.push({ title: "Policy Builder" });
    } else {
      items.push({ title: `Policy Details (${sub})` });
    }
  } else {
    // Dynamic fallback split by "/"
    const segments = pathname.split("/").filter(Boolean);
    let currentPath = "";
    segments.forEach((segment, idx) => {
      currentPath += `/${segment}`;
      const isLast = idx === segments.length - 1;
      const title =
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      items.push({
        title,
        href: isLast ? undefined : currentPath,
      });
    });
  }

  // Safety filter: ensure no parent item in the breadcrumb list has an href equal to current pathname
  return items.map((item, idx) => {
    if (idx < items.length - 1 && item.href === pathname) {
      return { ...item, href: undefined };
    }
    return item;
  });
}
