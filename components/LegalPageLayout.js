export default function LegalPageLayout({ title, updatedDate, children }) {
  return (
    <div className="bg-blush/20">
      <div className="container-x py-12 md:py-16 max-w-3xl">
        <div className="mb-8 md:mb-10 pb-6 md:pb-8 border-b border-charcoal/10">
          <h1 className="font-serif text-2xl md:text-4xl text-charcoal">
            {title}
          </h1>
          {updatedDate && (
            <p className="text-xs text-charcoal/40 mt-3 uppercase tracking-widest2">
              Last updated: {updatedDate}
            </p>
          )}
        </div>

        <div className="space-y-8 md:space-y-9 text-[15px] md:text-sm text-charcoal/70 leading-relaxed md:leading-7 [&_h2]:font-serif [&_h2]:text-base [&_h2]:md:text-lg [&_h2]:text-charcoal [&_h2]:mb-2.5 [&_h2]:font-medium [&_a]:text-wine [&_a]:underline [&_a]:decoration-wine/40 [&_a]:hover:decoration-wine">
          {children}
        </div>
      </div>
    </div>
  );
}
