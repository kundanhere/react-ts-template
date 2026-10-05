import * as React from "react";

import { cn } from "@/lib/utils";

export interface ILayoutIllustrationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function BottomLayoutIllustration({
  className,
  ...props
}: ILayoutIllustrationProps) {
  return (
    <svg
      width="62"
      height="42"
      viewBox="0 0 62 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary transition-colors", className)}
      {...props}
    >
      <g clipPath="url(#bottom-layout-clip)">
        {/* Window Background */}
        <path
          fill="var(--card)"
          d="M59 1H3a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h56a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Z"
        />
        {/* Title Bar Background */}
        <path
          fill="var(--card)"
          d="M1 3a2 2 0 0 1 2-2h56a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3Z"
        />
        {/* Window Outline */}
        <path
          stroke="var(--primary)"
          strokeWidth="0.5"
          className="opacity-30 dark:opacity-40"
          d="M59 1H3a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h56a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Z"
        />
        {/* Title Bar Divider */}
        <path
          fill="var(--primary)"
          className="opacity-20 dark:opacity-30"
          d="M61 8.5v-.25H1v.5h60V8.5Z"
        />
        {/* Traffic Light Dots */}
        <g opacity="0.85">
          <path
            fill="#D93D42"
            d="M5.5 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
          <path
            fill="#FFBA18"
            d="M9 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
          <path
            fill="#299764"
            d="M12.5 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
        </g>
        {/* Active Bottom Area */}
        <path
          fill="var(--primary)"
          className="opacity-75 dark:opacity-85"
          d="M1 37h60v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2Z"
        />
        <path
          stroke="var(--primary)"
          strokeWidth="0.5"
          className="opacity-90 dark:opacity-100"
          d="M1 37h60v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2Z"
        />
      </g>
      <defs>
        <clipPath id="bottom-layout-clip">
          <path fill="#fff" d="M0 0h62v42H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function SidebarLayoutIllustration({
  className,
  ...props
}: ILayoutIllustrationProps) {
  return (
    <svg
      width="62"
      height="42"
      viewBox="0 0 62 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary transition-colors", className)}
      {...props}
    >
      <g clipPath="url(#sidebar-layout-clip)">
        {/* Window Background */}
        <path
          fill="var(--card)"
          d="M59 1H3a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h56a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Z"
        />
        {/* Title Bar Background */}
        <path
          fill="var(--card)"
          d="M1 3a2 2 0 0 1 2-2h56a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3Z"
        />
        {/* Window Outline */}
        <path
          stroke="var(--primary)"
          strokeWidth="0.5"
          className="opacity-30 dark:opacity-40"
          d="M59 1H3a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h56a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Z"
        />
        {/* Title Bar Divider */}
        <path
          fill="var(--primary)"
          className="opacity-20 dark:opacity-30"
          d="M61 8.5v-.25H1v.5h60V8.5Z"
        />
        {/* Traffic Light Dots */}
        <g opacity="0.85">
          <path
            fill="#D93D42"
            d="M5.5 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
          <path
            fill="#FFBA18"
            d="M9 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
          <path
            fill="#299764"
            d="M12.5 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
        </g>
        {/* Active Sidebar Area */}
        <path
          fill="var(--primary)"
          className="opacity-75 dark:opacity-85"
          d="M1 8.5h16V41H3a2 2 0 0 1-2-2V8.5Z"
        />
        <path
          stroke="var(--primary)"
          strokeWidth="0.5"
          className="opacity-90 dark:opacity-100"
          d="M1 8.5h16V41H3a2 2 0 0 1-2-2V8.5Z"
        />
      </g>
      <defs>
        <clipPath id="sidebar-layout-clip">
          <path fill="#fff" d="M0 0h62v42H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function TopLayoutIllustration({
  className,
  ...props
}: ILayoutIllustrationProps) {
  return (
    <svg
      width="62"
      height="42"
      viewBox="0 0 62 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary transition-colors", className)}
      {...props}
    >
      <g clipPath="url(#top-layout-clip)">
        {/* Window Background */}
        <path
          fill="var(--card)"
          d="M59 1H3a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h56a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Z"
        />
        {/* Title Bar Background */}
        <path
          fill="var(--card)"
          d="M1 3a2 2 0 0 1 2-2h56a2 2 0 0 1 2 2v3.5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3Z"
        />
        {/* Window Outline */}
        <path
          stroke="var(--primary)"
          strokeWidth="0.5"
          className="opacity-30 dark:opacity-40"
          d="M59 1H3a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2h56a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Z"
        />
        {/* Title Bar Divider */}
        <path
          fill="var(--primary)"
          className="opacity-20 dark:opacity-30"
          d="M61 8.5v-.25H1v.5h60V8.5Z"
        />
        {/* Traffic Light Dots */}
        <g opacity="0.85">
          <path
            fill="#D93D42"
            d="M5.5 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
          <path
            fill="#FFBA18"
            d="M9 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
          <path
            fill="#299764"
            d="M12.5 4.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z"
          />
        </g>
        {/* Active Top Nav Area */}
        <path
          fill="var(--primary)"
          className="opacity-75 dark:opacity-85"
          d="M1 8.5h60v4H1v-4Z"
        />
        <path
          stroke="var(--primary)"
          strokeWidth="0.5"
          className="opacity-90 dark:opacity-100"
          d="M1 8.5h60v4H1v-4Z"
        />
      </g>
      <defs>
        <clipPath id="top-layout-clip">
          <path fill="#fff" d="M0 0h62v42H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
