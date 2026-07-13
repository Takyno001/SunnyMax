"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import SearchModal from "./SearchModal";

const FacebookIcon = ({ className = "h-5 w-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.75l.45-3h-3.2V8.06c0-.87.29-1.46 1.52-1.46h1.82V3.92c-.31-.04-1.38-.14-2.61-.14-2.58 0-4.35 1.58-4.35 4.49V10H7.1v3h2.78v8h3.62Z" /></svg>);

const MessengerIcon = ({ className = "h-5 w-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.1 2 11.17c0 2.9 1.45 5.5 3.73 7.18V22l3.4-1.87c.9.25 1.84.38 2.87.38 5.52 0 10-4.1 10-9.34C22 6.1 17.52 2 12 2Zm1.06 12.2-2.73-2.91-5.32 2.91 5.85-6.21 2.73 2.91 5.32-2.91-5.85 6.21Z" /></svg>);
const ZaloIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const id = React.useId();
  const maskId = `zalo-mask-${id.replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 50 50"
      width="24"
      height="24"
      fill="currentColor"
      {...props}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="50" height="50" fill="white" />
          <path fill="black" d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z" />
          <path fill="black" d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z" />
          <path fill="black" d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z" />
          <path fill="black" d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z" />
          <path fill="black" d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z" />
        </mask>
      </defs>
      <path
        mask={`url(#${maskId})`}
        d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
      />
    </svg>
  );
};

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" />
  </svg>
);

const YoutubeIcon = ({ className = "h-5 w-5" }: { className?: string }) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.5 15.6V8.4l6.3 3.6-6.3 3.6Z" /></svg>);
interface NavbarProps {
  onSearchOpen?: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuClosing, setMobileMenuClosing] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const pathname = usePathname();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileMenuClosing(true);
    window.setTimeout(() => {
      setMobileMenuOpen(false);
      setMobileMenuClosing(false);
    }, 300);
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);


  useEffect(() => {
    if (!mobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [mobileMenuOpen]);
  useEffect(() => {
    const handleScrollState = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScrollState);
    handleScrollState();
    return () => window.removeEventListener("scroll", handleScrollState);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/products", label: "Products" },
    { href: "/news", label: "News" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isInnerPage = pathname !== "/";
  const showSolid = scrolled || isInnerPage;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        showSolid
          ? "bg-[#121212] border-transparent shadow-lg"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/truong_logo_cropped.png?v=3"
            alt="Truong Nguyen Logo"
            className="h-12 w-auto object-contain brightness-0 invert"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-base font-semibold tracking-wider transition-colors duration-200 relative pb-1.5
                after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-[#ff5017] after:transition-all after:duration-200
                ${
                  isActive(href)
                    ? "text-white after:w-full"
                    : "text-zinc-400 hover:text-white after:w-0 hover:after:w-full"
                }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Action Tools */}
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => onSearchOpen ? onSearchOpen() : setSearchModalOpen(true)}
            className="text-zinc-400 hover:text-[#ff5017] transition-colors cursor-pointer"
            aria-label="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </button>
          <a
            href="tel:0987654321"
            className="px-5 py-2.5 bg-[#ff5017] hover:bg-orange-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-colors duration-300"
          >
            Let&apos;s Talk
          </a>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => onSearchOpen ? onSearchOpen() : setSearchModalOpen(true)}
            className="text-zinc-400 hover:text-[#ff5017] transition-colors cursor-pointer"
            aria-label="Tìm kiếm"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => mobileMenuOpen ? closeMobileMenu() : setMobileMenuOpen(true)}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`relative flex h-6 w-6 flex-col items-center justify-center gap-1.5`} aria-hidden="true">
              <span className={`block h-0.5 w-6 origin-center rounded-full bg-current transition-transform duration-300 ease-out ${mobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-200 ease-out ${mobileMenuOpen ? "scale-x-0 opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 origin-center rounded-full bg-current transition-transform duration-300 ease-out ${mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {(mobileMenuOpen || mobileMenuClosing) && (
        <div className={`mobile-menu-enter ${mobileMenuClosing ? "mobile-menu-exit" : ""} fixed inset-0 z-[60] touch-none overflow-hidden bg-[#101010] text-white md:hidden`}>
          <div className="absolute inset-0 h-full opacity-45 grayscale brightness-100" style={{ backgroundImage: "url(/mobile-contour-lines.png)", backgroundPosition: "center bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#101010]/65 via-[#101010]/15 to-transparent" aria-hidden="true" />
          <button type="button" onClick={closeMobileMenu} onPointerDown={(event) => event.stopPropagation()} className="mobile-menu-close-button pointer-events-auto absolute right-5 top-5 z-[70] cursor-pointer rounded-full p-2 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white" aria-label="Đóng menu">
<X className={`h-6 w-6 ${mobileMenuClosing ? "mobile-menu-close-spin" : ""}`} />
          </button>
          <div className={`mobile-menu-content-enter ${mobileMenuClosing ? "mobile-menu-content-exit" : ""} relative z-10 flex min-h-full flex-col items-center justify-center px-8 pb-10 pt-16`}>
            <img src="/truong_logo_cropped.png?v=3" alt="Truong Nguyen" className="mb-10 h-14 w-auto object-contain brightness-0 invert" />
            <nav className="flex flex-col items-center gap-5 text-xl font-bold">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} onClick={closeMobileMenu} className={isActive(href) ? "text-[#ff5017]" : "text-zinc-300 hover:text-white"}>
                  {label}
                </Link>
              ))}
              
            </nav>
            <div className="mt-12 flex items-center gap-4">
              <a href="https://m.me" target="_blank" rel="noreferrer" aria-label="Messenger" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5017] text-white transition-all hover:-translate-y-1 hover:bg-orange-600"><MessengerIcon /></a>
              <a href="https://zalo.me" target="_blank" rel="noreferrer" aria-label="Zalo" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5017] text-white transition-all hover:-translate-y-1 hover:bg-orange-600"><ZaloIcon /></a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5017] text-white transition-all hover:-translate-y-1 hover:bg-orange-600"><TiktokIcon /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Youtube" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff5017] text-white transition-all hover:-translate-y-1 hover:bg-orange-600"><YoutubeIcon /></a>
            </div>
          </div>
        </div>
      )}      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
}
