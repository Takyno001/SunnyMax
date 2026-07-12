"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, X, MessageSquare, Phone, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  {
    id: 1,
    title: "Công Tắc Thông Minh Viền Kim Loại",
    category: "smarthome",
    categoryName: "Điện Thông Minh",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    description: "Hệ thống mặt kính cường lực chống xước, kết nối Zigbee/Wifi điều khiển qua điện thoại, giọng nói. Thiết kế tối giản, sang trọng.",
    spec: "Điện áp: 220V, Chuẩn kết nối: Zigbee 3.0, Màu sắc: Đen xám / Vàng champagne",
  },
  {
    id: 2,
    title: "Hệ Đèn Ray Nam Châm Hiện Đại",
    category: "lighting",
    categoryName: "Thiết Bị Chiếu Sáng",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
    description: "Giải pháp chiếu sáng kiến trúc cao cấp. Dễ dàng di chuyển, thay đổi vị trí đèn trên ray chìm trần, mang lại ánh sáng tinh tế nghệ thuật.",
    spec: "Chỉ số hoàn màu: CRI > 90, Công suất tiêu thụ: 12W - 24W, Nhiệt độ màu: 3000K - 4000K",
  },
  {
    id: 3,
    title: "Aptomat Chống Giật & Rò Dòng RCBO",
    category: "breaker",
    categoryName: "Cáp & Bảo Vệ",
    image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80",
    description: "Thiết bị bảo vệ tối ưu cho gia đình. Phát hiện rò điện cực nhanh và ngắt điện tức thời, chống quá tải và ngắn mạch.",
    spec: "Dòng định mức: 32A - 63A, Dòng rò bảo vệ: 30mA, Hãng sản xuất: Panasonic / Schneider",
  },
  {
    id: 4,
    title: "Cáp Điện Lõi Đồng Chống Cháy",
    category: "breaker",
    categoryName: "Cáp & Bảo Vệ",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
    description: "Dòng dây dẫn điện chất lượng cao lõi đồng tinh chất 99.9%. Bọc vỏ nhựa PVC chống cháy chậm, giảm thiểu nguy cơ chập cháy điện.",
    spec: "Tiết diện lõi: 2x2.5mm² - 2x4mm², Tiêu chuẩn: TCVN / IEC, Hãng: Cadivi",
  },
  {
    id: 5,
    title: "Bộ Đèn LED Âm Trần Cao Cấp",
    category: "lighting",
    categoryName: "Thiết Bị Chiếu Sáng",
    image: "https://images.unsplash.com/photo-1498188735561-424a27520e5a?auto=format&fit=crop&w=600&q=80",
    description: "Đèn Spotlight âm trần chống chói sâu, góc chiếu hẹp tạo điểm nhấn. Sử dụng chip LED Bridgelux Mỹ siêu bền màu.",
    spec: "Kích thước khoét lỗ: Ø75mm, Tuổi thọ: 50.000 giờ, Công suất: 9W",
  },
  {
    id: 6,
    title: "Hệ Thống Điện Mặt Trời Hybrid",
    category: "smarthome",
    categoryName: "Điện Thông Minh",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    description: "Giải pháp lưu trữ điện thông minh hòa lưới giúp tiết kiệm điện ban ngày và dự phòng mất điện ban đêm cho các thiết bị ưu tiên.",
    spec: "Công suất inverter: 5kW - 10kW, Pin lưu trữ Lithium: 10kWh, Tấm pin: Mono Half-cell",
  },
];

const categories = [
  { id: "all", label: "Tất Cả" },
  { id: "smarthome", label: "Điện Thông Minh" },
  { id: "lighting", label: "Chiếu Sáng" },
  { id: "breaker", label: "Cáp & Bảo Vệ" },
];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null);

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-[#121212] text-white font-sans selection:bg-[#ff5017] selection:text-white">
      <div className="relative z-20 bg-[#121212] shadow-2xl overflow-x-hidden">
        <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-12 bg-[#121212] overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center px-6">
 
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-20 relative z-20">
            <Link href="/" className="text-[#ff5017] hover:text-orange-700 transition-colors">Home</Link>
            <span className="text-zinc-500">›</span>
            <span className="text-white">Products</span>
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
              Products
            </span>
            {/* Solid foreground */}
            <h1 className="relative z-10 font-display font-black leading-none text-white tracking-tight" style={{ fontSize: "clamp(56px, 8.5vw, 96px)" }}>
              Products
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
            Danh mục sản phẩm thiết bị điện dân dụng & công nghiệp chính hãng từ Panasonic, Schneider, Cadivi, Philips và nhiều thương hiệu uy tín khác.
          </p>

        </div>
      </section>

      {/* Products Section */}
      <section className="relative z-10 py-20 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-[#ff5017] text-white"
                    : "bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                className="group cursor-pointer flex flex-col bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden hover:border-[#ff5017]/20 transition-all duration-300"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#ff5017] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-4 left-4 z-20 px-2.5 py-1 bg-black/70 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-[#ff5017] border border-[#ff5017]/20 rounded">
                    {prod.categoryName}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ff5017] transition-colors line-clamp-1">
                    {prod.title}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-4 flex-1 line-clamp-2">{prod.description}</p>
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
              onClick={() => alert("Danh mục đầy đủ sản phẩm sẽ được gửi qua Zalo/Email.")}
              className="px-8 py-3.5 bg-zinc-900 border border-white/10 hover:border-[#ff5017] text-white hover:text-[#ff5017] text-xs font-bold tracking-widest uppercase rounded transition-all cursor-pointer"
            >
              Yêu Cầu Tải Báo Giá Catalog PDF
            </button>
          </div>
        </div>
      </section>

      {/* Contact Strip */}
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-3">
              Cần báo giá <span className="text-[#ff5017]">nhanh?</span>
            </h2>
            <p className="text-zinc-400 text-sm">Liên hệ trực tiếp qua hotline hoặc gửi yêu cầu và nhận báo giá trong 30 phút.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="tel:0987654321" className="flex items-center gap-2 px-6 py-3 bg-[#ff5017] hover:bg-orange-700 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-colors">
              <Phone className="w-4 h-4" /> 0987.654.321
            </a>
            <a href="tel:0987654321" className="flex items-center gap-2 px-6 py-3 border border-white/15 hover:border-[#ff5017] text-white hover:text-[#ff5017] font-bold text-sm uppercase tracking-wider rounded-xl transition-colors">
              Gửi yêu cầu <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      </div>
      {/* Footer */}
      <Footer />

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden max-w-2xl w-full relative shadow-2xl">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:text-[#ff5017] hover:bg-black/90 flex items-center justify-center transition-colors z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full relative bg-zinc-900">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent" />
              <span className="absolute bottom-4 left-6 z-10 px-3 py-1 bg-[#ff5017] text-white text-xs font-bold uppercase tracking-wider rounded">
                {selectedProduct.categoryName}
              </span>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black text-white mb-4 uppercase">{selectedProduct.title}</h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">{selectedProduct.description}</p>
              <div className="bg-zinc-900 border border-white/5 rounded-lg p-4 mb-6">
                <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Thông Số Kỹ Thuật:</span>
                <p className="text-sm font-semibold text-zinc-300 font-mono">{selectedProduct.spec}</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://zalo.me?text=Tôi quan tâm đến ${encodeURIComponent(selectedProduct.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#ff5017] hover:bg-orange-700 text-white text-xs font-bold tracking-widest uppercase rounded flex items-center gap-2 transition-colors"
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
    </div>
  );
}
