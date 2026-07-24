import Script from "next/script";
import { FB_PIXEL_ID } from "@/lib/fbpixel";

// Head snippet — fires the base pixel + first PageView. Rendered inside
// <head> from app/layout.js. Subsequent client-side navigations (App Router
// soft-navigation doesn't reload the page) are tracked separately by
// RouteChangeTracker, which calls window.fbq('track', 'PageView') on every
// route change — otherwise Facebook would only ever see a single PageView
// for the whole visit.
export function FacebookPixelHead() {
  return (
    <Script id="fb-pixel-script" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${FB_PIXEL_ID}');
      fbq('track', 'PageView');`}
    </Script>
  );
}

// noscript fallback — for visitors with JavaScript disabled.
export function FacebookPixelBody() {
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
