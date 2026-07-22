"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pushToDataLayer } from "@/lib/gtm";

export default function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    pushToDataLayer({
      event: "page_view",
      page_path: url,
      page_title: typeof document !== "undefined" ? document.title : "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
