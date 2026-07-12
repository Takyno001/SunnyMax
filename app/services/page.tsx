"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Cpu, Zap, Wrench, Home, Lightbulb, Plug, ShieldCheck, Wifi, ChevronRight, Phone, Mail, MapPin, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import { CONTENT_STORAGE_KEYS, DashboardService, readStoredContent } from "../lib/content";

const services = [
  {
    num: "01",
    icon: <Cpu className="w-8 h-8 text-[#ff5017]" />,
    title: "Cung Cấp Thiết Bị Điện",
    description:
      "Phân phối sỉ & lẻ thiết bị điện dân dụng, công nghiệp chính hãng. Cam kết chất lượng từ dây cáp, công tắc, ổ cắm đến các thiết bị đóng cắt an toàn.",
    detail: "Chúng tôi cung cấp đầy đủ các loại thiết bị điện từ các thương hiệu hàng đầu như Panasonic, Schneider, Cadivi, Sino với cam kết hàng chính hãng 100% và bảo hành đầy đủ.",
  },
  {
    num: "02",
    icon: <Zap className="w-8 h-8 text-[#ff5017]" />,
    title: "Giải Pháp Smart Home",
    description:
      "Tư vấn, thiết kế và thi công hệ thống nhà thông minh toàn diện. Tự động hóa hệ thống chiếu sáng, rèm cửa, điều hòa, kiểm soát an ninh thông minh.",
    detail: "Hệ thống Smart Home tích hợp app điều khiển từ xa, lên lịch tự động, cảm biến chuyển động và nhiệt độ giúp tiết kiệm điện năng tối đa.",
  },
  {
    num: "03",
    icon: <Wrench className="w-8 h-8 text-[#ff5017]" />,
    title: "Thiết Kế Thi Công Điện Nước",
    description:
      "Thiết kế bản vẽ kỹ thuật M&E và thi công hệ thống điện nước an toàn, chuẩn kỹ thuật cho nhà phố, biệt thự, quán cafe, văn phòng làm việc.",
    detail: "Đội ngũ kỹ sư có chứng chỉ hành nghề, kinh nghiệm hơn 10 năm trong lĩnh vực M&E. Bảo hành công trình 24 tháng.",
  },
];


const customServiceIconMap = { Cpu, Zap, Wrench, Home, Lightbulb, Plug, ShieldCheck, Wifi };
function CustomServiceIcon({ name }: { name?: string }) {
  const Icon = customServiceIconMap[name as keyof typeof customServiceIconMap] ?? Wrench;
  return <Icon className="h-8 w-8 text-[#ff5017]" />;
}
export default function ServicesPage() {
  const [customServices, setCustomServices] = useState<DashboardService[]>([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    const timer = window.setTimeout(() => setCustomServices(readStoredContent<DashboardService>(CONTENT_STORAGE_KEYS.services)), 0);
    return () => window.clearTimeout(timer);
  }, []);


  const allServices = [
    ...services,
    ...customServices.map((service, index) => ({
      ...service,
      num: String(services.length + index + 1).padStart(2, "0"),
      icon: <CustomServiceIcon name={service.icon} />,
    })),
  ];

  const pageCount = Math.max(1, Math.ceil(allServices.length / 9));
  const paginatedServices = allServices.slice((page - 1) * 9, page * 9);

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-[#ff5017] selection:text-white">
      <div className="relative z-20 min-h-screen bg-[#121212] shadow-2xl overflow-x-hidden">
        <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-12 bg-[#121212] overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-20 relative z-20">
            <Link href="/" className="text-[#ff5017] hover:text-orange-700 transition-colors">Home</Link>
            <span className="text-zinc-500">›</span>
            <span className="text-white">Services</span>
          </nav>

          {/* Title wrapper */}
          <div className="relative flex items-center justify-center mb-5" style={{ height: "110px" }}>
            {/* Ghost: paint-order stroke fill — clean outline, no inner artifacts */}
            <span
              aria-hidden="true"
              suppressHydrationWarning
              className="ghost-title absolute font-display font-black pointer-events-none select-none"
              style={{
                fontSize: "200px",
                lineHeight: 1,
                whiteSpace: "nowrap",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Services
            </span>
            {/* Solid foreground */}
            <h1 className="relative z-10 font-display font-black leading-none text-white tracking-tight" style={{ fontSize: "clamp(56px, 8.5vw, 96px)" }}>
              Services
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Từ cung cấp thiết bị điện chính hãng đến thiết kế thi công hệ thống điện nước và Smart Home — Truong Nguyen đồng hành cùng công trình của bạn từ đầu đến cuối.
          </p>

        </div>
      </section>

      {/* Service Cards */}
      <section className="relative z-10 py-20 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {paginatedServices.map((svc, idx) => (
              <div
                key={idx}
                className="bg-[#1e1e1e] border border-white/5 rounded-xl p-8 hover:bg-[#262626] transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="p-3 bg-zinc-800/50 rounded-lg border border-white/5 group-hover:bg-[#ff5017]/10  transition-colors">
                    {svc.icon}
                  </div>
                  <span className="text-3xl font-black text-zinc-800 group-hover:text-[#ff5017]/20 transition-colors">
                    {svc.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#ff5017] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {svc.description}
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed border-t border-white/5 pt-4 mt-4">
                  {svc.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-16">
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </div>
      </section>

      {/* CTA / Contact strip */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-bold text-[#ff5017] tracking-[0.2em] uppercase block mb-4">
              Liên hệ tư vấn
            </span>
            <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight mb-6">
              Sẵn sàng<br />bắt đầu dự án?
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-8">
              Đội ngũ kỹ sư của chúng tôi sẵn sàng tư vấn miễn phí và báo giá chiết khấu tốt nhất cho công trình của bạn.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:0987654321"
                className="flex items-center gap-2 px-6 py-3 bg-[#ff5017] hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" /> Gọi ngay
              </a>
              <Link
                href="/#contact"
                className="flex items-center gap-2 px-6 py-3 border border-white/15  text-white hover:text-[#ff5017] font-bold text-sm uppercase tracking-wider rounded-xl transition-colors"
              >
                Gửi yêu cầu <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: <Phone className="w-4 h-4" />, label: "Hotline / Zalo", value: "0987.654.321" },
              { icon: <Mail className="w-4 h-4" />, label: "Email", value: "truong.electric@gmail.com" },
              { icon: <MapPin className="w-4 h-4" />, label: "Địa chỉ", value: "Quận 1, TP. HCM" },
              { icon: <Info className="w-4 h-4" />, label: "Giờ hoạt động", value: "7:30 – 20:00 (T2 – CN)" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-zinc-900/60 border border-white/5 rounded-xl">
                <div className="p-2 bg-[#ff5017]/10 rounded-md text-[#ff5017]">{item.icon}</div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{item.label}</span>
                  <span className="text-sm font-bold text-white">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      </div>
      <div aria-hidden="true" style={{ height: "var(--footer-height, 450px)" }} />
      <Footer />
    </div>
  );
}
