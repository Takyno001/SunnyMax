"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  MessageSquare,
  Phone,
  ArrowUpRight,
  ChevronRight,
  Cpu,
  Wrench,
  Zap,
  Users,
  Briefcase,
  Layers,
  Award,
  Send,
  CheckCircle2,
  Mail,
  MapPin,
  Info
} from "lucide-react";

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
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
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837z M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const MessengerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.453 5.518 3.733 7.181V22l3.407-1.869c.896.249 1.84.385 2.86.385 5.523 0 10-4.146 10-9.258S17.523 2 12 2zm1.06 12.195-2.73-2.912-5.32 2.912 5.845-6.208 2.73 2.912 5.32-2.912-5.845 6.208z" />
  </svg>
);

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
    viewBox="0 0 16 16"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />
  </svg>
);

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScrollState = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScrollState);
    handleScrollState();
    return () => window.removeEventListener("scroll", handleScrollState);
  }, []);

  // Smooth scroll handler
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setMobileMenuOpen(false);
    }
  };

  const services = [
    {
      num: "01",
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "Cung Cấp Thiết Bị Điện",
      description: "Phân phối sỉ & lẻ thiết bị điện dân dụng, công nghiệp chính hãng. Cam kết chất lượng từ dây cáp, công tắc, ổ cắm đến các thiết bị đóng cắt an toàn."
    },
    {
      num: "02",
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Giải Pháp Smart Home",
      description: "Tư vấn, thiết kế và thi công hệ thống nhà thông minh toàn diện. Tự động hóa hệ thống chiếu sáng, rèm cửa, điều hòa, kiểm soát an ninh thông minh."
    },
    {
      num: "03",
      icon: <Wrench className="w-8 h-8 text-primary" />,
      title: "Thiết Kế Thi Công Điện Nước",
      description: "Thiết kế bản vẽ kỹ thuật M&E và thi công hệ thống điện nước an toàn, chuẩn kỹ thuật cho nhà phố, biệt thự, quán cafe, văn phòng làm việc."
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6 text-primary" />, value: "10K+", label: "Khách Hàng Hài Lòng" },
    { icon: <Briefcase className="w-6 h-6 text-primary" />, value: "500+", label: "Dự Án Hoàn Thành" },
    { icon: <Layers className="w-6 h-6 text-primary" />, value: "2,000+", label: "Mặt Hàng Cung Cấp" },
    { icon: <Award className="w-6 h-6 text-primary" />, value: "10+", label: "Năm Trong Ngành" }
  ];

  const products = [
    {
      id: 1,
      title: "Công Tắc Thông Minh Viền Kim Loại",
      category: "smarthome",
      categoryName: "Điện Thông Minh",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
      description: "Hệ thống mặt kính cường lực chống xước, kết nối Zigbee/Wifi điều khiển qua điện thoại, giọng nói. Thiết kế tối giản, sang trọng.",
      spec: "Điện áp: 220V, Chuẩn kết nối: Zigbee 3.0, Màu sắc: Đen xám / Vàng champagne"
    },
    {
      id: 2,
      title: "Hệ Đèn Ray Nam Châm Hiện Đại",
      category: "lighting",
      categoryName: "Thiết Bị Chiếu Sáng",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
      description: "Giải pháp chiếu sáng kiến trúc cao cấp. Dễ dàng di chuyển, thay đổi vị trí đèn trên ray chìm trần, mang lại ánh sáng tinh tế nghệ thuật.",
      spec: "Chỉ số hoàn màu: CRI > 90, Công suất tiêu thụ: 12W - 24W, Nhiệt độ màu: 3000K - 4000K"
    },
    {
      id: 3,
      title: "Aptomat Chống Giật & Rò Dòng RCBO",
      category: "breaker",
      categoryName: "Cáp & Bảo Vệ",
      image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80",
      description: "Thiết bị bảo vệ tối ưu cho gia đình. Phát hiện rò điện cực nhanh và ngắt điện tức thời, chống quá tải và ngắn mạch.",
      spec: "Dòng định mức: 32A - 63A, Dòng rò bảo vệ: 30mA, Hãng sản xuất: Panasonic / Schneider"
    },
    {
      id: 4,
      title: "Cáp Điện Lõi Đồng Chống Cháy",
      category: "breaker",
      categoryName: "Cáp & Bảo Vệ",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
      description: "Dòng dây dẫn điện chất lượng cao lõi đồng tinh chất 99.9%. Bọc vỏ nhựa PVC chống cháy chậm, giảm thiểu nguy cơ chập cháy điện.",
      spec: "Tiết diện lõi: 2x2.5mm² - 2x4mm², Tiêu chuẩn: TCVN / IEC, Hãng: Cadivi"
    },
    {
      id: 5,
      title: "Bộ Đèn LED Âm Trần Cao Cấp",
      category: "lighting",
      categoryName: "Thiết Bị Chiếu Sáng",
      image: "https://images.unsplash.com/photo-1498188735561-424a27520e5a?auto=format&fit=crop&w=600&q=80",
      description: "Đèn Spotlight âm trần chống chói sâu, góc chiếu hẹp tạo điểm nhấn. Sử dụng chip LED Bridgelux Mỹ siêu bền màu.",
      spec: "Kích thước khoét lỗ: Ø75mm, Tuổi thọ: 50.000 giờ, Công suất: 9W"
    },
    {
      id: 6,
      title: "Hệ Thống Điện Mặt Trời Hybrid",
      category: "smarthome",
      categoryName: "Điện Thông Minh",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
      description: "Giải pháp lưu trữ điện thông minh hòa lưới giúp tiết kiệm điện ban ngày và dự phòng mất điện ban đêm cho các thiết bị ưu tiên.",
      spec: "Công suất inverter: 5kW - 10kW, Pin lưu trữ Lithium: 10kWh, Tấm pin: Mono Half-cell"
    }
  ];

  const filteredProducts = activeCategory === "all"
    ? products
    : products.filter(p => p.category === activeCategory);

  const brands = [
    { name: "Panasonic", logoText: "Panasonic" },
    { name: "Schneider", logoText: "Schneider" },
    { name: "Philips", logoText: "PHILIPS" },
    { name: "Cadivi", logoText: "CADIVI" },
    { name: "Sino", logoText: "SINO" },
    { name: "Lioa", logoText: "LiOA" },
    { name: "Rạng Đông", logoText: "Rang Dong" },
    { name: "Điện Quang", logoText: "DienQuang" }
  ];

  const blogs = [
    {
      id: 1,
      category: "An Toàn Điện",
      title: "Cách Chọn Dây Cáp Điện Cho Nhà Phố Tránh Nguy Cơ Chập Cháy",
      desc: "Lựa chọn tiết diện dây điện phù hợp với công suất sử dụng là yếu tố cốt lõi giúp hệ thống điện gia đình luôn an toàn ổn định...",
      date: "05/07/2026",
      image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 2,
      category: "Smart Home",
      title: "Xu Hướng Thiết Kế Nhà Thông Minh Tiết Kiệm Năng Lượng 2026",
      desc: "Khám phá các giải pháp tích hợp tự động hóa, cảm biến chuyển động và biến tần thông minh giúp tối ưu điện năng trong ngôi nhà Việt...",
      date: "28/06/2026",
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 3,
      category: "Mẹo Tiết Kiệm",
      title: "5 Thiết Bị Điện Thông Minh Giúp Hóa Đơn Điện Nhà Bạn Giảm Đến 30%",
      desc: "Thay thế các thiết bị truyền thống bằng công tắc hẹn giờ, đèn LED thông minh cảm biến và ổ cắm tự ngắt điện khi sạc đầy...",
      date: "15/06/2026",
      image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white font-sans selection:bg-primary selection:text-white">
      {/* 1. HEADER / NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "backdrop-blur-md bg-dark-bg/90 border-b border-white/5"
        : "bg-transparent border-b border-transparent"
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-24">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleScroll(e, "home")} className="flex items-center gap-2 group">
            <img
              src="/truong_logo_cropped.png"
              alt="Truong Nguyen Logo"
              className="h-12 w-auto object-contain"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              onClick={(e) => handleScroll(e, "home")}
              className="text-base font-semibold tracking-wider transition-colors duration-200 relative pb-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200 text-white after:w-full"
            >
              Home
            </a>
            <Link
              href="/services"
              className="text-base font-semibold tracking-wider transition-colors duration-200 relative pb-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200 text-zinc-400 hover:text-white after:w-0 hover:after:w-full"
            >
              Services
            </Link>
            <Link
              href="/products"
              className="text-base font-semibold tracking-wider transition-colors duration-200 relative pb-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200 text-zinc-400 hover:text-white after:w-0 hover:after:w-full"
            >
              Product
            </Link>
          </nav>

          {/* Action Tools */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-zinc-400 hover:text-primary transition-colors cursor-pointer"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              className="px-5 py-2.5 bg-primary hover:bg-orange-700 text-white text-xs font-bold tracking-wider uppercase rounded-xl transition-colors duration-300"
            >
              Let&apos;s Talk
            </a>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-zinc-400 hover:text-primary transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>
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
          <div className="md:hidden absolute top-full left-0 w-full bg-dark-bg/98 border-b border-white/5 backdrop-blur-lg transition-transform duration-300">
            <nav className="flex flex-col p-6 gap-4">
              <a href="#home" onClick={(e) => handleScroll(e, "home")} className="text-base font-semibold text-[#ff5017] py-2 transition-colors border-b border-white/5">
                Home
              </a>
              <Link href="/services" className="text-base font-semibold text-zinc-300 hover:text-primary py-2 transition-colors border-b border-white/5">
                Services
              </Link>
              <Link href="/products" className="text-base font-semibold text-zinc-300 hover:text-primary py-2 transition-colors border-b border-white/5">
                Product
              </Link>
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, "contact")}
                className="mt-4 w-full py-2.5 bg-primary hover:bg-orange-700 text-white text-center text-xs font-bold tracking-wider uppercase rounded-xl transition-colors"
              >
                Let&apos;s Talk
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-center bg-dark-bg overflow-hidden">
        {/* Full-screen Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/truong_hero.png"
            alt="Truong Nguyen - Hero Background"
            fill
            priority
            className="object-cover object-[70%_top] md:object-[right_top]"
          />
          {/* Dark overlay to darken the background image uniformly */}
          <div className="absolute inset-0 bg-black/20" />
          {/* Subtle vignette/gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/25 to-transparent md:from-black/70 md:via-black/15 md:to-transparent" />
          {/* Top gradient overlay to transition with header */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/85 to-transparent" />
          {/* Bottom gradient overlay to blend with Services section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-bg to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full py-20 md:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero text */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary mb-3">
              XIN CHÀO, TÔI LÀ
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-black leading-tight text-white mb-6 tracking-tight">
              Truong<br />
              <span className="text-white">Nguyen</span>
            </h1>

            <div className="text-sm md:text-base font-semibold uppercase tracking-widest text-zinc-300 mb-6">
              Tôi là người bán thiết bị điện
            </div>


            {/* Social handles */}
            <div className="flex items-center gap-5 mb-8">
              <a href="https://m.me" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5 hover:border-zinc-500 flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Messenger">
                <MessengerIcon className="w-7 h-7" />
              </a>
              <a href="https://zalo.me" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5 hover:border-zinc-500 flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Zalo">
                <ZaloIcon className="w-7 h-7" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5 hover:border-zinc-500 flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Tiktok">
                <TiktokIcon className="w-7 h-7" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5 hover:border-zinc-500 flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Youtube">
                <YoutubeIcon className="w-7 h-7" />
              </a>
            </div>

          </div>

          {/* Spacer column to keep text aligned to the left and leave the face visible on the right */}
          <div className="lg:col-span-5 hidden lg:block" />
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 bg-dark-bg relative overflow-hidden">
        {/* Outlined background text */}
        <div className="absolute -top-10 left-10 select-none pointer-events-none opacity-20 z-0">
          <span className="text-stroke-bg text-[10vw] font-display font-extrabold uppercase leading-none">
            Services
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-2">
                01. DỊCH VỤ
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                TÔI CÓ THỂ GIÚP GÌ?
              </h2>
            </div>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              className="px-6 py-2.5 border border-white/15 hover:border-primary text-white hover:text-primary text-xs font-bold tracking-widest uppercase rounded transition-all flex items-center gap-2 group w-fit"
            >
              Yêu Cầu Dịch Vụ <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="bg-card-bg border border-white/5 rounded-xl p-8 hover:bg-card-hover transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-zinc-800/50 rounded-lg border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    {svc.icon}
                  </div>
                  <span className="text-3xl font-display font-bold text-zinc-800 group-hover:text-primary/20 transition-colors">
                    {svc.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                  {svc.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-card-bg/60 border border-white/5 rounded-2xl p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none"></div>
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4">
                <div className="mb-4 bg-zinc-800/40 p-2.5 rounded-full border border-white/5">
                  {stat.icon}
                </div>
                <span className="text-3xl md:text-4xl font-display font-black text-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm font-medium tracking-wide text-zinc-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS SECTION */}
      <section id="products" className="py-24 bg-zinc-950 relative overflow-hidden border-t border-b border-white/5">
        {/* Outlined background text */}
        <div className="absolute -top-10 right-10 select-none pointer-events-none opacity-20 z-0">
          <span className="text-stroke-bg text-[10vw] font-display font-extrabold uppercase leading-none">
            Products
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-2">
                02. SẢN PHẨM NỔI BẬT
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                THIẾT BỊ ĐIỆN CAO CẤP
              </h2>
            </div>

            {/* Filter categories */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Tất Cả" },
                { id: "smarthome", label: "Điện Thông Minh" },
                { id: "lighting", label: "Chiếu Sáng" },
                { id: "breaker", label: "Cáp & Bảo Vệ" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${activeCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="group cursor-pointer flex flex-col bg-card-bg border border-white/5 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300"
              >
                {/* Product image with play overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10"></div>

                  {/* Action Play/Details icon on hover */}
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary hover:bg-primary-light flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <span className="absolute bottom-4 left-4 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 rounded">
                    {prod.categoryName}
                  </span>
                </div>

                {/* Product details */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">
                    {prod.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[11px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                    <span>Xem thông số kỹ thuật</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => {
                alert("Danh mục đầy đủ sản phẩm sẽ được gửi qua Zalo/Email. Vui lòng để lại lời nhắn hoặc liên hệ trực tiếp.");
              }}
              className="px-8 py-3.5 bg-zinc-900 border border-white/10 hover:border-primary text-white hover:text-primary text-xs font-bold tracking-widest uppercase rounded transition-all cursor-pointer"
            >
              Yêu Cầu Tải Báo Giá Catalog PDF
            </button>
          </div>
        </div>
      </section>

      {/* 5. BRANDS/PARTNERS SECTION */}
      <section id="brands" className="py-24 bg-dark-bg relative overflow-hidden">
        {/* Outlined background text */}
        <div className="absolute -top-10 left-10 select-none pointer-events-none opacity-20 z-0">
          <span className="text-stroke-bg text-[10vw] font-display font-extrabold uppercase leading-none">
            Brands
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Description block */}
            <div className="lg:col-span-4 flex flex-col items-start">
              <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-2">
                03. ĐỐI TÁC TIN CẬY
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight mb-6">
                THƯƠNG HIỆU ĐỒNG HÀNH
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Truong Nguyen cam kết phân phối sản phẩm chính hãng 100% từ các thương hiệu thiết bị điện, dây cáp, và giải pháp chiếu sáng hàng đầu trong và ngoài nước. Đảm bảo an toàn tối đa và chế độ bảo hành uy tín cho mọi công trình.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Info className="w-4 h-4" />
                <span>Bảo hành chính hãng từ 12-24 tháng</span>
              </div>
            </div>

            {/* Brands logo grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {brands.map((brand, idx) => (
                <div
                  key={idx}
                  className="bg-card-bg border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center min-h-[100px] hover:bg-card-hover transition-colors group cursor-default"
                >
                  <span className="font-display text-lg font-black uppercase text-zinc-600 tracking-wider group-hover:text-primary transition-colors">
                    {brand.logoText}
                  </span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. BLOG / NEWS SECTION */}
      <section id="blog" className="py-24 bg-zinc-950 relative overflow-hidden border-t border-white/5">
        {/* Outlined background text */}
        <div className="absolute -top-10 right-10 select-none pointer-events-none opacity-20 z-0">
          <span className="text-stroke-bg text-[10vw] font-display font-extrabold uppercase leading-none">
            News
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-2">
                04. TIN TỨC & KỸ THUẬT
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
                KIẾN THỨC BỔ ÍCH
              </h2>
            </div>
            <button
              onClick={() => alert("Chức năng đang được phát triển. Truong Nguyen sẽ cập nhật các bài viết kỹ thuật sớm nhất.")}
              className="px-6 py-2.5 border border-white/15 hover:border-primary text-white hover:text-primary text-xs font-bold tracking-widest uppercase rounded transition-all flex items-center gap-2 group w-fit"
            >
              Xem Thêm Bài Viết <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Blog grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-card-bg border border-white/5 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300 flex flex-col group"
              >
                {/* Blog Image */}
                <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded">
                    {blog.category}
                  </span>
                </div>

                {/* Blog Content */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-zinc-500 text-xs mb-3 block">{blog.date}</span>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-1 line-clamp-3">
                    {blog.desc}
                  </p>
                  <button
                    onClick={() => {
                      alert(`Đọc bài viết: ${blog.title}`);
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-primary flex items-center gap-2 transition-colors cursor-pointer text-left"
                  >
                    Đọc Tiếp <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section id="contact" className="py-24 bg-dark-bg relative overflow-hidden border-t border-white/5">
        {/* Outlined background text */}
        <div className="absolute -top-10 left-10 select-none pointer-events-none opacity-20 z-0">
          <span className="text-stroke-bg text-[10vw] font-display font-extrabold uppercase leading-none">
            Contact
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Main banner block with grid splitting */}
          <div className="bg-card-bg border border-white/5 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Left Column: Form & Details */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
              <div>
                <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-2">
                  05. KẾT NỐI
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight mb-4">
                  HÃY NÓI VỀ YÊU CẦU CỦA BẠN
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 max-w-lg">
                  Hãy gửi tin nhắn hoặc gọi trực tiếp cho Truong Nguyen. Truong Nguyen sẽ tư vấn kỹ thuật, gợi ý sản phẩm phù hợp và báo giá chiết khấu đại lý tốt nhất cho công trình của bạn.
                </p>

                {/* Direct info list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <a href="tel:0987654321" className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-white/5 hover:border-primary/30 rounded-lg group transition-colors">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Hotline / Zalo</span>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">0987.654.321</span>
                    </div>
                  </a>
                  <a href="mailto:truong.electric@gmail.com" className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-white/5 hover:border-primary/30 rounded-lg group transition-colors">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Email liên hệ</span>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">truong.electric@gmail.com</span>
                    </div>
                  </a>
                  <div className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-white/5 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Địa chỉ giao dịch</span>
                      <span className="text-sm font-bold text-white">Quận 1, TP. Hồ Chí Minh</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-white/5 rounded-lg">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Giờ hoạt động</span>
                      <span className="text-sm font-bold text-white">7:30 - 20:00 (Thứ 2 - CN)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message form */}
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Họ và tên của bạn"
                    required
                    className="w-full bg-zinc-900 border border-white/10 focus:border-primary p-3 rounded text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại Zalo"
                    required
                    className="w-full bg-zinc-900 border border-white/10 focus:border-primary p-3 rounded text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Địa chỉ Email (nếu có)"
                  className="w-full bg-zinc-900 border border-white/10 focus:border-primary p-3 rounded text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Mô tả yêu cầu sản phẩm hoặc công trình của bạn..."
                  required
                  className="w-full bg-zinc-900 border border-white/10 focus:border-primary p-3 rounded text-sm text-white placeholder-zinc-500 outline-none transition-colors resize-none"
                />

                {contactSubmitted ? (
                  <div className="bg-emerald-950/60 border border-emerald-500/30 p-4 rounded-lg flex items-center gap-3 text-emerald-400 text-sm">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span>Yêu cầu của bạn đã được gửi thành công! Truong Nguyen sẽ chủ động liên hệ lại qua điện thoại/Zalo sớm nhất có thể.</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3.5 bg-primary hover:bg-primary-light text-white text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 group transition-all duration-300 cursor-pointer w-full sm:w-auto animate-none outline-none"
                  >
                    Gửi Yêu Cầu <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                )}
              </form>
            </div>

            {/* Right Column: Contact portrait */}
            <div className="lg:col-span-5 hidden lg:block relative min-h-[500px] bg-zinc-900 border-l border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent z-10"></div>
              <img
                src="/truong_contact.png"
                alt="Truong Nguyen - Liên hệ tư vấn"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-zinc-950 text-zinc-500 text-sm border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <img
              src="/truong_logo_cropped.png"
              alt="Truong Nguyen Logo"
              className="h-8 w-auto object-contain"
            />
            <p className="text-xs text-zinc-600">
              © 2026 Truong Nguyen. Tất cả quyền được bảo lưu. Thiết kế và phát triển dựa trên Persona Template.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold tracking-wider">
            <a href="#home" onClick={(e) => handleScroll(e, "home")} className="hover:text-primary transition-colors">Home</a>
            <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Product</Link>
          </div>

          {/* Quick Zalo chat float button replacement link */}
          <a
            href="https://zalo.me"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#0068ff] text-white text-xs font-bold rounded-full hover:scale-105 transition-transform"
          >
            <ZaloIcon className="w-4 h-4" />
            <span>Chat Zalo</span>
          </a>
        </div>
      </footer>

      {/* MODAL: PRODUCT DETAILS */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all">
          <div className="bg-card-bg border border-white/10 rounded-2xl overflow-hidden max-w-2xl w-full relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:text-primary hover:bg-black/90 flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full relative bg-zinc-900">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card-bg to-transparent"></div>
              <span className="absolute bottom-4 left-6 z-10 px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded">
                {selectedProduct.categoryName}
              </span>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-display font-black text-white mb-4 uppercase">
                {selectedProduct.title}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <div className="bg-zinc-900 border border-white/5 rounded-lg p-4 mb-6">
                <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Thông Số Kỹ Thuật:</span>
                <p className="text-sm font-semibold text-zinc-300 font-mono leading-relaxed">
                  {selectedProduct.spec}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://zalo.me?text=Tôi%20quan%20tâm%20đến%20sản%20phẩm%20${encodeURIComponent(selectedProduct.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white text-xs font-bold tracking-widest uppercase rounded flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" /> Liên Hệ Zalo Nhận Báo Giá
                </a>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-3 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded transition-colors cursor-pointer"
                >
                  Quay Lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SEARCH */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 bg-black/85 backdrop-blur-md transition-all">
          <div className="bg-card-bg border border-white/10 rounded-xl max-w-xl w-full p-6 relative shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <button
              onClick={() => {
                setSearchModalOpen(false);
                setSearchQuery("");
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="block text-xs font-bold text-primary uppercase tracking-widest mb-4">Tìm kiếm thiết bị / dịch vụ</span>

            <div className="relative flex items-center mb-6">
              <Search className="absolute left-4 text-zinc-500 w-5 h-5" />
              <input
                type="text"
                autoFocus
                placeholder="Nhập tên thiết bị điện, hãng sản xuất hoặc dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 focus:border-primary pl-12 pr-4 py-3.5 rounded text-sm text-white placeholder-zinc-500 outline-none transition-colors"
              />
            </div>

            {/* Simulated Search Results */}
            <div>
              <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3">Kết quả gợi ý:</span>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {searchQuery ? (
                  products.filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length > 0 ? (
                    products.filter(p =>
                      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProduct(p);
                          setSearchModalOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center justify-between p-3 bg-zinc-900 hover:bg-zinc-800 rounded border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 object-cover rounded bg-zinc-800" />
                          <div>
                            <span className="block text-sm font-bold text-white group-hover:text-primary transition-colors">{p.title}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{p.categoryName}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-zinc-500 text-xs">
                      Không tìm thấy thiết bị nào khớp với từ khóa "{searchQuery}"
                    </div>
                  )
                ) : (
                  <>
                    <div
                      onClick={() => {
                        setSelectedProduct(products[0]);
                        setSearchModalOpen(false);
                      }}
                      className="flex items-center justify-between p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded border border-white/5 cursor-pointer text-sm text-zinc-300 hover:text-white"
                    >
                      <span>1. Công tắc thông minh cảm ứng</span>
                      <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Hot</span>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedProduct(products[1]);
                        setSearchModalOpen(false);
                      }}
                      className="flex items-center justify-between p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded border border-white/5 cursor-pointer text-sm text-zinc-300 hover:text-white"
                    >
                      <span>2. Hệ đèn ray nam châm chìm trần</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Chiếu sáng</span>
                    </div>
                    <div
                      onClick={() => {
                        setSelectedProduct(products[2]);
                        setSearchModalOpen(false);
                      }}
                      className="flex items-center justify-between p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded border border-white/5 cursor-pointer text-sm text-zinc-300 hover:text-white"
                    >
                      <span>3. Aptomat chống giật Panasonic</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Bảo vệ</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
