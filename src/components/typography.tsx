import { JSX, ReactNode } from "react";

const variantMap = {
  h1: "text-3xl sm:text-4xl md:text-5xl font-bold",
  h2: "text-2xl sm:text-3xl font-semibold",
  h3: "text-xl sm:text-2xl font-semibold",
  h4: "text-lg sm:text-xl font-medium",
  h5: "text-base sm:text-lg font-medium",
  h6: "text-base font-medium",
  p: "text-base sm:text-lg",
  span: "text-base",
};

type TypographyProps = {
  variant?: keyof typeof variantMap;
  className?: string;
  children: ReactNode;
};

export function Typography({
  variant = "p",
  className = "",
  children,
}: TypographyProps) {
  const Tag = variant as keyof JSX.IntrinsicElements;
  return (
    <Tag className={`${variantMap[variant]} ${className}`}>{children}</Tag>
  );
}
