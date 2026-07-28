import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Search, X, Menu } from "lucide-react";
import { useLanguage } from "../lib/LanguageContext";
import { useModals } from "../lib/ModalContext";

type NavLink = {
  text: string;
  href: string;
  to?: string;
};

type NavColumn = {
  headerText: string;
  headerHref: string;
  items: NavLink[];
};

export function BridgestoneNav() {
  const { language, setLanguage, t } = useLanguage();
  const { openPartnerLogin } = useModals();
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAnyMenuOpen = openMenu !== null || searchOpen || mobileMenuOpen;

  const renderLink = (item: NavLink) => {
    if (item.to) {
      return (
        <Link
          to={item.to}
          onClick={() => {
            setOpenMenu(null);
            setMobileMenuOpen(false);
          }}
          className="text-xs text-white/60 hover:text-white hover:translate-x-1 transition-all duration-150 block py-1 cursor-pointer"
        >
          {item.text}
        </Link>
      );
    }
    const isExternal = item.href.startsWith("http");
    return (
      <a
        href={item.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={() => setOpenMenu(null)}
        className="text-xs text-white/60 hover:text-white hover:translate-x-1 transition-all duration-150 block py-1 cursor-pointer"
      >
        {item.text}
      </a>
    );
  };

  const renderHeader = (headerText: string, headerHref: string) => {
    const isExternal = headerHref.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={headerHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpenMenu(null)}
          className="text-[#D71920] text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2 hover:text-[#E53035] transition-colors block cursor-pointer"
        >
          {headerText}
        </a>
      );
    }
    return (
      <h4 className="text-[#D71920] text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
        {headerText}
      </h4>
    );
  };

  // Products Mega Menu Structure
  const productsColumns: NavColumn[] = [
    {
      headerText: "Passenger Car Tyres",
      headerHref: "https://www.bridgestone.co.in/passenger-tyres",
      items: [
        { text: "Car Tyres", href: "https://www.bridgestone.co.in/passenger-tyres" },
        { text: "SUV Tyres", href: "https://www.bridgestone.co.in/passenger-tyres" },
        { text: "Tyre Selector Guide", href: "/vehicle-matcher", to: "/vehicle-matcher" },
        { text: "Bridgestone Bookings", href: "#" },
        { text: "Browse Car Models", href: "#" }
      ]
    },
    {
      headerText: "Truck & Bus Radials",
      headerHref: "https://www.bridgestone.co.in/truck-and-bus",
      items: [
        { text: "Tube Type Tyres", href: "https://www.bridgestone.co.in/truck-and-bus" },
        { text: "Tubeless Tyres", href: "https://www.bridgestone.co.in/truck-and-bus" },
        { text: "Fuel Efficient Radials", href: "https://www.bridgestone.co.in/truck-and-bus" },
        { text: "Heavy Construction Tippers", href: "https://www.bridgestone.co.in/truck-and-bus" },
        { text: "Fleet Management Portal", href: "/fleet-dashboard", to: "/fleet-dashboard" }
      ]
    },
    {
      headerText: "Special Application Tyres",
      headerHref: "#",
      items: [
        { text: "Off-The-Road (OTR) Tyres", href: "https://www.bridgestone.co.in/off-the-road" },
        { text: "Mining Infrastructure Tyres", href: "#" },
        { text: "Agricultural & Tractor Tyres", href: "#" },
        { text: "Industrial Utility Casing", href: "#" }
      ]
    },
    {
      headerText: "Branded Featured Ranges",
      headerHref: "#",
      items: [
        { text: "Turanza Comfort Series", href: "#" },
        { text: "Dueler All-Terrain", href: "#" },
        { text: "Sturdo Indian Road Durability", href: "#" },
        { text: "Ecopia Fuel Savers", href: "#" },
        { text: "Premium Tyre Manufacturer Overview", href: "https://www.bridgestone.co.in/our-company/about" }
      ]
    }
  ];

  // Solutions Mega Menu Structure
  const solutionsColumns: NavColumn[] = [
    {
      headerText: "Consumer Solutions & Support",
      headerHref: "#",
      items: [
        { text: "Pick Up and Drop Service", href: "https://www.pickupdropbridgestone.in/" },
        { text: "Select On Wheels Mobile Fitment", href: "#" },
        { text: "Roadside Assistance (RSA) Network", href: "#" },
        { text: "Tyre Clinic & Health Diagnostics", href: "#" }
      ]
    },
    {
      headerText: "Commercial & Fleet Solutions",
      headerHref: "#",
      items: [
        { text: "Smart Fleet Analytics", href: "/fleet-dashboard", to: "/fleet-dashboard" },
        { text: "Admin Intelligence Panel", href: "/admin-intelligence", to: "/admin-intelligence" },
        { text: "Fleet Care Tyre Management", href: "#" },
        { text: "Retread Lifecycle Programs", href: "#" }
      ]
    }
  ];

  // Company Mega Menu Structure
  const companyColumns: NavColumn[] = [
    {
      headerText: "Corporate Profile & Values",
      headerHref: "#",
      items: [
        { text: "About Bridgestone India", href: "https://www.bridgestone.co.in/our-company/about" },
        { text: "Premium Tyre Manufacturer Overview", href: "https://www.bridgestone.co.in/our-company/about" },
        { text: "Sustainability Initiatives", href: "https://www.bridgestone.co.in/our-company/sustainability1" },
        { text: "Environmental Commitments", href: "#" }
      ]
    },
    {
      headerText: "Media & Contact Centers",
      headerHref: "#",
      items: [
        { text: "Press Releases & News", href: "#" },
        { text: "Corporate Governance", href: "#" },
        { text: "Careers & Open Roles", href: "https://careers.bridgestone-asiapacific.com/content/India/?locale=en_GB" },
        { text: "Find Nearest Tyre Shop or Authorized Dealer", href: "#" }
      ]
    }
  ];

  return (
    <>
      {/* 
        Temporary pointer interference blocker backdrop:
        When a dropdown is open, this overlay catches clicks/drags to prevent
        mouse events from going down to the underlying 3D WebGL Canvas component.
      */}
      {isAnyMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default pointer-events-auto"
          onClick={() => {
            setOpenMenu(null);
            setSearchOpen(false);
          }}
        />
      )}

      <nav className="fixed top-0 left-0 w-full z-50 bg-[#121212]/90 backdrop-blur-md border-b border-white/5 transition-colors duration-300 px-4 sm:px-6 py-4" aria-label="Main navigation">
        <img
          src="/bridgestone-global-logo.png"
          alt="Bridgestone Global Logo"
          className="absolute top-4 left-8 z-50 h-10 w-auto object-contain option mix-blend-screen pointer-events-none hidden xl:block"
        />
        <div className="max-w-5xl mx-auto relative">
          <div className="liquid-glass rounded-full px-6 sm:px-8 py-4 flex items-center justify-between relative z-[100]">
            {/* Brand */}
            <Link to="/" className="flex flex-col items-start gap-0 group" aria-label="Bridgestone India Home">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-white">
                  BRIDGESTONE
                </span>
                <span className="inline-block w-1.5 h-1.5 bg-[#D71920]" />
              </div>
              <span className="text-[7px] sm:text-[8px] tracking-widest text-white/50 uppercase font-medium -mt-0.5">
                Solutions for your journey
              </span>
            </Link>

            {/* Mega Links (Desktop Menu Hooks) */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: "Our Products", idx: 0 },
                { label: "Our Solutions", idx: 1 },
                { label: "Our Company", idx: 2 }
              ].map((menu) => (
                <button
                  key={menu.label}
                  type="button"
                  onClick={() => setOpenMenu(openMenu === menu.idx ? null : menu.idx)}
                  aria-expanded={openMenu === menu.idx}
                  aria-label={menu.label}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none cursor-pointer relative z-[100]"
                >
                  {menu.label}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${openMenu === menu.idx ? "rotate-180" : ""}`}
                  />
                </button>
              ))}
            </div>

            {/* Action Core */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Localizer */}
              <button
                type="button"
                onClick={() => setLanguage(language === "EN" ? "HI" : "EN")}
                className="hidden sm:block text-white/60 hover:text-white text-[11px] tracking-widest font-bold transition-colors focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none rounded px-2 py-1 cursor-pointer"
                aria-label="Toggle language"
              >
                India ({language})
              </button>

              {/* Search toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none cursor-pointer"
                aria-label="Toggle search"
              >
                {searchOpen ? <X size={16} /> : <Search size={16} />}
              </button>

              {/* Partner Portal */}
              <button
                type="button"
                onClick={openPartnerLogin}
                className="hidden sm:block liquid-glass rounded-full px-5 py-2 text-[10px] uppercase tracking-wider font-bold border border-white/10 hover:bg-white/10 transition-all text-white cursor-pointer focus-visible:ring-2 focus-visible:ring-[#D71920] focus-visible:outline-none"
              >
                {t("partner_portal")}
              </button>

              {/* Hamburger Toggle (Mobile Only) */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Expanded search bar */}
          {searchOpen && (
            <div className="mt-3 liquid-glass rounded-full px-6 py-3 flex items-center gap-3 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2 duration-200 relative z-[100] border border-white/10 bg-slate-950/80 backdrop-blur-xl">
              <Search size={16} className="text-white/40" />
              <input
                autoFocus
                placeholder="Search tyres, dealers, solutions…"
                className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40"
              />
            </div>
          )}
        </div>

        {/* Mega dropdowns moved outside max-w-5xl for full-width layout */}
        {/* ========================================
           MEGA-DROPDOWN MENU 1: "OUR PRODUCTS"
           ======================================== */}
        {openMenu === 0 && (
          <div className="absolute top-full left-0 w-full bg-[#1A1A1A]/98 text-white border-b border-white/10 shadow-2xl p-8 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200 rounded-b-2xl">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
              {productsColumns.map((col, cIdx) => (
                <div key={cIdx}>
                  {renderHeader(col.headerText, col.headerHref)}
                  <div className="flex flex-col gap-2">
                    {col.items.map((item, iIdx) => (
                      <div key={iIdx}>{renderLink(item)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================
           MEGA-DROPDOWN MENU 2: "OUR SOLUTIONS"
           ======================================== */}
        {openMenu === 1 && (
          <div className="absolute top-full left-0 w-full bg-[#1A1A1A]/98 text-white border-b border-white/10 shadow-2xl p-8 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200 rounded-b-2xl">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {solutionsColumns.map((col, cIdx) => (
                <div key={cIdx}>
                  {renderHeader(col.headerText, col.headerHref)}
                  <div className="flex flex-col gap-2">
                    {col.items.map((item, iIdx) => (
                      <div key={iIdx}>{renderLink(item)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================
           MEGA-DROPDOWN MENU 3: "OUR COMPANY"
           ======================================== */}
        {openMenu === 2 && (
          <div className="absolute top-full left-0 w-full bg-[#1A1A1A]/98 text-white border-b border-white/10 shadow-2xl p-8 z-[100] pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200 rounded-b-2xl">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {companyColumns.map((col, cIdx) => (
                <div key={cIdx}>
                  {renderHeader(col.headerText, col.headerHref)}
                  <div className="flex flex-col gap-2">
                    {col.items.map((item, iIdx) => (
                      <div key={iIdx}>{renderLink(item)}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[150] bg-[#121212]/98 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto animate-in fade-in slide-in-from-right-10 duration-200">
          {/* Header inside drawer */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex flex-col items-start gap-0"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-[0.25em] uppercase text-white">
                  BRIDGESTONE
                </span>
                <span className="inline-block w-1.5 h-1.5 bg-[#D71920]" />
              </div>
              <span className="text-[8px] tracking-widest text-white/50 uppercase font-medium -mt-0.5">
                Solutions for your journey
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* List of links */}
          <div className="flex-1 py-8 space-y-6">
            {/* 1. Products Section */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-[#D71920] font-bold">
                Our Products
              </h3>
              <div className="pl-2 space-y-4">
                {productsColumns.map((col, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="text-white text-xs font-semibold">{col.headerText}</div>
                    <div className="pl-2 flex flex-col gap-1.5">
                      {col.items.map((item, iIdx) => (
                        item.to ? (
                          <Link
                            key={iIdx}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-white/60 hover:text-white transition-colors duration-150 block py-1"
                          >
                            {item.text}
                          </Link>
                        ) : (
                          <a
                            key={iIdx}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-white/60 hover:text-white transition-colors duration-150 block py-1"
                          >
                            {item.text}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Solutions Section */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-[#D71920] font-bold">
                Our Solutions
              </h3>
              <div className="pl-2 space-y-4">
                {solutionsColumns.map((col, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="text-white text-xs font-semibold">{col.headerText}</div>
                    <div className="pl-2 flex flex-col gap-1.5">
                      {col.items.map((item, iIdx) => (
                        item.to ? (
                          <Link
                            key={iIdx}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-white/60 hover:text-white transition-colors duration-150 block py-1"
                          >
                            {item.text}
                          </Link>
                        ) : (
                          <a
                            key={iIdx}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-white/60 hover:text-white transition-colors duration-150 block py-1"
                          >
                            {item.text}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Company Section */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-widest text-[#D71920] font-bold">
                Our Company
              </h3>
              <div className="pl-2 space-y-4">
                {companyColumns.map((col, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="text-white text-xs font-semibold">{col.headerText}</div>
                    <div className="pl-2 flex flex-col gap-1.5">
                      {col.items.map((item, iIdx) => (
                        item.to ? (
                          <Link
                            key={iIdx}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-white/60 hover:text-white transition-colors duration-150 block py-1"
                          >
                            {item.text}
                          </Link>
                        ) : (
                          <a
                            key={iIdx}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-xs text-white/60 hover:text-white transition-colors duration-150 block py-1"
                          >
                            {item.text}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons inside drawer */}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => {
                setLanguage(language === "EN" ? "HI" : "EN");
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-full border border-white/10 text-white/70 hover:text-white text-xs font-bold cursor-pointer"
            >
              Change Language: India ({language})
            </button>
            <button
              type="button"
              onClick={() => {
                openPartnerLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-full bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold cursor-pointer"
            >
              {t("partner_portal")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
