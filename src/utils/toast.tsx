import { ToastOptions, toast } from "react-hot-toast";

// Basic toast
export function showAlert(
  title: string,
  text?: string,
  icon: "success" | "error" | "warning" | "info" = "info",
  options?: ToastOptions
) {
  return toast(`${title}${text ? ": " + text : ""}`, {
    ...options,
    icon: getIcon(icon),
  });
}

// Success toast
export function showSuccess(
  title: string,
  text?: string,
  options?: ToastOptions
) {
  return toast.success(`${title}${text ? ": " + text : ""}`, options);
}

// Error toast
export function showError(
  title: string,
  text?: string,
  options?: ToastOptions
) {
  return toast.error(`${title}${text ? ": " + text : ""}`, options);
}

// Warning toast
export function showWarning(
  title: string,
  text?: string,
  options?: ToastOptions
) {
  return toast(`${title}${text ? ": " + text : ""}`, {
    ...options,
    icon: "⚠️",
  });
}

// Info toast
export function showInfo(title: string, text?: string, options?: ToastOptions) {
  return toast(`${title}${text ? ": " + text : ""}`, {
    ...options,
    icon: "ℹ️",
  });
}

// Confirm dialog using react-hot-toast promise
export function showConfirm(
  title: string,
  text?: string,
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel"
): Promise<boolean> {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <div className="font-semibold">{title}</div>
          {text && <div className="text-sm text-gray-600">{text}</div>}
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700"
            >
              {confirmButtonText}
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="rounded bg-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-400"
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  });
}

// Custom toast (accepts any react-hot-toast options)
export function showCustom(options: ToastOptions & { message: string }) {
  return toast(options.message, options);
}

function getIcon(icon: string) {
  switch (icon) {
    case "success":
      return "✅";
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
    default:
      return undefined;
  }
}
