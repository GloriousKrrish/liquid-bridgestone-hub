export function BridgestoneFooter() {
  const links = [
    { label: "Cookie Policy", href: "#" },
    { label: "Terms & Conditions", href: "#" },
    { label: "eXpress Unconditional Warranty Guidelines", href: "#" },
  ];

  return (
    <footer className="relative z-20 w-full mt-auto border-t border-[#E9E1D6] bg-[#F5F1EB] pt-8">
      <div className="text-[11px] text-[#666666] px-6 max-w-5xl mx-auto pb-8 flex flex-col sm:flex-row gap-4 justify-between items-center text-center sm:text-left font-medium">
        <div>
          © 2026 Bridgestone India Private Limited. Operational Headless CMS Gateway. Fully compliant with DPDP Act 2023.
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center sm:justify-end">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#666666] hover:text-[#E60012] transition-colors focus-visible:ring-2 focus-visible:ring-[#E60012] focus-visible:outline-none rounded px-1.5 py-0.5"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

