import { JSX, ReactNode } from "react";

const variantMap = {
  h1: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
  h2: "text-2xl sm:text-3xl font-semibold tracking-tight",
  h3: "text-xl sm:text-2xl font-semibold tracking-tight",
  h4: "text-lg sm:text-xl font-medium tracking-tight",
  h5: "text-base sm:text-lg font-medium tracking-tight",
  h6: "text-base font-medium tracking-tight",
  p: "text-sm",
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
