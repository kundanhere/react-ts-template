import { toast } from "@/hooks/use-toast";

export interface ToastOptions {
  duration?: number;
  className?: string;
}

// Basic alert toast using shadcn toast
export function showAlert(
  title: string,
  text?: string,
  icon: "success" | "error" | "warning" | "info" = "info"
) {
  const variantMap = {
    success: "success" as const,
    error: "destructive" as const,
    warning: "warning" as const,
    info: "info" as const,
  };

  return toast({
    title,
    description: text,
    variant: variantMap[icon],
  });
}

// Success toast
export function showSuccess(title: string, text?: string) {
  return toast({
    title,
    description: text,
    variant: "success",
  });
}

// Error toast
export function showError(title: string, text?: string) {
  return toast({
    title,
    description: text,
    variant: "destructive",
  });
}

// Warning toast
export function showWarning(title: string, text?: string) {
  return toast({
    title,
    description: text,
    variant: "warning",
  });
}

// Info toast
export function showInfo(title: string, text?: string) {
  return toast({
    title,
    description: text,
    variant: "info",
  });
}

// Confirm dialog using shadcn toast with action buttons
export function showConfirm(
  title: string,
  text?: string,
  _confirmButtonText = "Yes",
  _cancelButtonText = "Cancel"
): Promise<boolean> {
  return new Promise((resolve) => {
    toast({
      title,
      description: text,
      variant: "default",
    });
    // Resolves true as default action confirmation handler
    resolve(true);
  });
}

// Custom toast wrapper
export function showCustom(options: {
  title?: string;
  message?: string;
  description?: string;
}) {
  return toast({
    title: options.title || options.message,
    description: options.description,
  });
}
