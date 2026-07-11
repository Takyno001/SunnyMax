"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search } from "lucide-react";

interface NavbarProps {
  onSearchOpen?: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
    { href: "/products", label: "Product" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-[#121212]/90 border-b border-white/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-24">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/truong_logo_cropped.png"
            alt="Truong Nguyen Logo"
            className="h-12 w-auto object-contain"
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
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className="text-zinc-400 hover:text-[#ff5017] transition-colors cursor-pointer"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          <Link
            href="/#contact"
            className="px-5 py-2.5 bg-[#ff5017] hover:bg-orange-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-colors duration-300"
          >
            Let&apos;s Talk
          </Link>
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex md:hidden items-center gap-4">
          {onSearchOpen && (
            <button
              onClick={onSearchOpen}
              className="text-zinc-400 hover:text-[#ff5017] transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#121212]/98 border-b border-white/5 backdrop-blur-lg">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold py-2 transition-colors border-b border-white/5 ${
                  isActive(href) ? "text-[#ff5017]" : "text-zinc-300 hover:text-[#ff5017]"
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 w-full py-2.5 bg-[#ff5017] hover:bg-orange-700 text-white text-center text-xs font-bold tracking-wider uppercase rounded-xl transition-colors"
            >
              Let&apos;s Talk
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
