import { useCallback } from "react";

import { ToastOptions } from "react-hot-toast";

import {
  showAlert,
  showConfirm,
  showCustom,
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "@/utils/toast";

export function useToast() {
  const alert = useCallback(
    (
      title: string,
      text?: string,
      icon?: "success" | "error" | "warning" | "info",
      options?: ToastOptions
    ) => showAlert(title, text, icon, options),
    []
  );

  const success = useCallback(
    (title: string, text?: string, options?: ToastOptions) =>
      showSuccess(title, text, options),
    []
  );
  const error = useCallback(
    (title: string, text?: string, options?: ToastOptions) =>
      showError(title, text, options),
    []
  );
  const warning = useCallback(
    (title: string, text?: string, options?: ToastOptions) =>
      showWarning(title, text, options),
    []
  );
  const info = useCallback(
    (title: string, text?: string, options?: ToastOptions) =>
      showInfo(title, text, options),
    []
  );

  const confirm = useCallback(
    (
      title: string,
      text?: string,
      confirmButtonText = "Yes",
      cancelButtonText = "Cancel"
    ) => showConfirm(title, text, confirmButtonText, cancelButtonText),
    []
  );

  const custom = useCallback(
    (options: ToastOptions & { message: string }) => showCustom(options),
    []
  );

  return {
    alert,
    success,
    error,
    warning,
    info,
    confirm,
    custom,
  };
}
