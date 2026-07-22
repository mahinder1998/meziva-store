import Script from "next/script";
import { GTM_ID } from "@/lib/gtm";

// Head snippet — Next.js docs recommend `afterInteractive` for GTM so it
// loads early without blocking page render. This must be rendered inside
// <head>, which is what app/layout.js does.
export function GoogleTagManagerHead() {
  return (
    <Script id="gtm-script" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

// noscript fallback — must be as high as possible inside <body> for
// visitors with JavaScript disabled. Rendered as the first child of <body>
// in app/layout.js.
export function GoogleTagManagerBody() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
