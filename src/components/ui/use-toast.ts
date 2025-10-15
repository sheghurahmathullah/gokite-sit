import { useState } from "react";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = (options: ToastOptions) => {
    setToast(options);

    if (options.duration) {
      setTimeout(() => {
        setToast(null);
      }, options.duration);
    }
  };

  return {
    toast,
    showToast,
  };
}

export function toast(options: ToastOptions) {
  // This is a simplified toast implementation
  console.log("Toast:", options);
  // In a real implementation, you might use a global state management solution
  // or a context to show toasts across the application
}
