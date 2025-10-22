"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ensureFreshToken } from "@/lib/auth-client";

export default function AuthInitializer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Run once on mount and on route changes.
  useEffect(() => {
    ensureFreshToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return null;
}


