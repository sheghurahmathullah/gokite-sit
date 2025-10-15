"use client";

import * as React from "react";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000;

type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type?: ToastType;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

interface State {
  toasts: Toast[];
}

const initialState: State = { toasts: [] };

function genId() {
  return Math.random().toString(36).substring(2, 9);
}

export function useToast() {
  const [state, setState] = React.useState<State>(initialState);

  const toast = React.useCallback((opts: Omit<Toast, "id">) => {
    const id = genId();

    setState((prev) => ({
      ...prev,
      toasts: [
        ...prev.toasts,
        {
          ...opts,
          id,
          type: opts.type || "info",
        },
      ].slice(-TOAST_LIMIT),
    }));

    return id;
  }, []);

  const dismiss = React.useCallback((toastId?: string) => {
    setState((prev) => ({
      ...prev,
      toasts: prev.toasts.filter((t) => t.id !== toastId),
    }));
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        toasts: prev.toasts.slice(0, -1),
      }));
    }, TOAST_REMOVE_DELAY);

    return () => clearTimeout(timer);
  }, [state.toasts]);

  return {
    toasts: state.toasts,
    toast,
    dismiss,
  };
}
