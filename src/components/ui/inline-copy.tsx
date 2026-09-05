import * as React from "react";

import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export interface IInlineCopyProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  displayValue?: React.ReactNode;
  label?: string;
  iconSize?: number;
}

export function InlineCopy({
  text,
  displayValue,
  label = "identifier",
  iconSize = 12,
  className,
  onClick,
  ...props
}: IInlineCopyProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`Copied ${label} "${text}" to clipboard`);
    setTimeout(() => setCopied(false), 2000);
    onClick?.(e);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "text-foreground hover:text-primary inline-flex cursor-pointer items-center gap-1 font-mono text-[0.6875rem] font-medium transition-colors",
        className
      )}
      title={`Click to copy ${label}`}
      {...props}
    >
      <span>{displayValue ?? text}</span>
      <HugeiconsIcon
        icon={copied ? Tick02Icon : Copy01Icon}
        size={iconSize}
        className={cn(
          "transition-colors",
          copied ? "text-emerald-500" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
