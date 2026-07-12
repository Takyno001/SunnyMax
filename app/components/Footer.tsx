"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Send } from "lucide-react";

// Social media SVG icons
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    {...props}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const MessengerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.453 5.518 3.733 7.181V22l3.407-1.869c.896.249 1.84.385 2.86.385 5.523 0 10-4.146 10-9.258S17.523 2 12 2zm1.06 12.195-2.73-2.912-5.32 2.912 5.845-6.208 2.73 2.912 5.32-2.912-5.845 6.208z" />
  </svg>
);

const ZaloIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const id = React.useId();
  const maskId = `zalo-mask-footer-${id.replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 50 50"
      width="18"
      height="18"
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
    viewBox="0 0 16 16"
    width="18"
    height="18"
    fill="currentColor"
    {...props}
  >
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const updateFooterHeight = () => {
      document.documentElement.style.setProperty(
        "--footer-height",
        `${footer.getBoundingClientRect().height}px`,
      );
    };

    updateFooterHeight();
    const resizeObserver = new ResizeObserver(updateFooterHeight);
    resizeObserver.observe(footer);

    return () => {
      resizeObserver.disconnect();
      document.documentElement.style.removeProperty("--footer-height");
    };
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      alert(`Cảm ơn bạn! Bản tin kỹ thuật sẽ được gửi tới Email: ${email}`);
      setEmail("");
    }
  };

  return (
    <footer
      ref={footerRef}
      className="fixed inset-x-0 bottom-0 z-0 bg-[#121212] text-zinc-400 text-sm pt-16 pb-8 overflow-hidden"
    >
      {/* Background topographic pattern overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[190px] pointer-events-none opacity-10 z-0"
        style={{
          backgroundImage: "url('/footer-bg.png')",
          backgroundPosition: "bottom",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 190px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-16 relative z-10">
        
        {/* Column 1: Brand & Newsletter */}
        <div className="lg:col-span-4 flex flex-col justify-start">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/truong_logo_cropped.png"
              alt="Truong Nguyen Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>
          <p className="text-zinc-500 text-xs leading-relaxed mb-6">
            Thiết bị điện cao cấp & Giải pháp Smart Home chuyên nghiệp cho mọi công trình. Kiến tạo không gian sống tiện nghi, sang trọng và tiết kiệm năng lượng.
          </p>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
            Đăng ký nhận bản tin
          </h4>
          <form onSubmit={handleSubscribe} className="flex max-w-sm">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Địa chỉ Email của bạn"
              required
              className="flex-1 bg-zinc-900 border border-white/5 focus:border-primary/50 px-4 py-2.5 rounded-l-xl text-xs text-white placeholder-zinc-500 outline-none transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-r-xl transition-colors duration-300 cursor-pointer"
            >
              ĐĂNG KÝ
            </button>
          </form>
        </div>

        {/* Column 2: Quick Links */}
        <div className="lg:col-span-2">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Liên Kết Nhanh
          </h4>
          <ul className="space-y-3 text-xs font-semibold">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Trang Chủ
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-primary transition-colors">
                Dịch Vụ
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-primary transition-colors">
                Sản Phẩm
              </Link>
            </li>
            <li>
              <a href="tel:0987654321" className="hover:text-primary transition-colors">
                Let&apos;s Talk
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Featured Services */}
        <div className="lg:col-span-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Dịch Vụ Nổi Bật
          </h4>
          <ul className="space-y-3 text-xs">
            <li className="text-zinc-500">
              Điện Thông Minh Smart Home
            </li>
            <li className="text-zinc-500">
              Thiết Bị Điện Cao Cấp Vimar / Legrand
            </li>
            <li className="text-zinc-500">
              Giải Pháp Chiếu Sáng Thông Minh
            </li>
            <li className="text-zinc-500">
              Tư Vấn Thiết Kế & Thi Công Lắp Đặt
            </li>
          </ul>
        </div>

        {/* Column 4: Contact Us */}
        <div className="lg:col-span-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Thông Tin Liên Hệ
          </h4>
          <ul className="space-y-3 text-xs mb-6">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary flex-shrink-0" />
              <a href="tel:0987654321" className="hover:text-white transition-colors">
                0987.654.321
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary flex-shrink-0" />
              <a href="mailto:truong.electric@gmail.com" className="hover:text-white transition-colors">
                truong.electric@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5 text-zinc-400">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Quận 1, TP. Hồ Chí Minh</span>
            </li>
          </ul>
          
          <div className="flex items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-primary flex items-center justify-center text-zinc-400 hover:text-primary transition-all">
              <FacebookIcon />
            </a>
            <a href="https://zalo.me" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-primary flex items-center justify-center text-zinc-400 hover:text-primary transition-all">
              <ZaloIcon />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-primary flex items-center justify-center text-zinc-400 hover:text-primary transition-all">
              <TiktokIcon />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 hover:border-primary flex items-center justify-center text-zinc-400 hover:text-primary transition-all">
              <YoutubeIcon />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <div>
          Copyright © 2026 Truong Nguyen. Tất cả quyền được bảo lưu.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-400 transition-colors">Chính Sách Bảo Mật</a>
          <span>|</span>
          <a href="#" className="hover:text-zinc-400 transition-colors">Điều Khoản Sử Dụng</a>
        </div>
      </div>
    </footer>
  );
}
