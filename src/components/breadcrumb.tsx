import { ComponentType } from "react";

import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

import { useRoutes } from "@/hooks/useRoutes";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: ComponentType<any>;
}

export function Breadcrumb() {
  const { currentPath } = useRoutes();

  // Don't show breadcrumb on home page
  if (currentPath === "/") {
    return null;
  }

  // Generate breadcrumb items from current path
  const pathSegments = currentPath.split("/").filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Home", path: "/", icon: Home },
    ...pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, path };
    }),
  ];

  return (
    <nav className="text-muted-foreground mb-6 flex items-center space-x-2 text-sm">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const Icon = item.icon;

        return (
          <div key={item.path} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={16} className="text-muted-foreground mx-2" />
            )}

            {isLast ? (
              <span className="text-foreground font-medium">
                {Icon && <Icon size={16} className="mr-1 inline" />}
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-primary flex items-center hover:underline"
              >
                {Icon && <Icon size={16} className="mr-1" />}
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
