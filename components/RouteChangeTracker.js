"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { pushToDataLayer } from "@/lib/gtm";

export default function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const query = searchParams?.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    pushToDataLayer({
      event: "page_view",
      page_path: url,
      page_title: typeof document !== "undefined" ? document.title : "",
    });

    // Facebook Pixel: the base script (in FacebookPixelHead) already fires
    // one PageView on initial page load — skip that first run here to avoid
    // double-counting, and fire on every navigation after that (App Router
    // soft-navigations don't reload the page, so without this, only the
    // very first page of a visit would ever be visible to the Pixel).
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return null;
}
