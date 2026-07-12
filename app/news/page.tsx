"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar";
import { CONTENT_STORAGE_KEYS, type DashboardPost, readStoredContent } from "../lib/content";

function formatNewsDate(value: string) {
  const trimmed = value.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]} ${isoMatch[4]}:${isoMatch[5]}`;
  }

  return trimmed.replace("T", " ");
}

export const defaultNews: DashboardPost[] = [
  {
    id: "default-safety-cable",
    category: "An Toàn Điện",
    title: "Cách Chọn Dây Cáp Điện Cho Nhà Phố Tránh Nguy Cơ Chập Cháy",
    desc: "Lựa chọn tiết diện dây điện phù hợp với công suất sử dụng là yếu tố cốt lõi giúp hệ thống điện gia đình luôn an toàn ổn định.",
    date: "05/07/2026",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "default-smart-home",
    category: "Smart Home",
    title: "Xu Hướng Thiết Kế Nhà Thông Minh Tiết Kiệm Năng Lượng 2026",
    desc: "Khám phá các giải pháp tự động hóa, cảm biến chuyển động và biến tần thông minh giúp tối ưu điện năng trong ngôi nhà Việt.",
    date: "28/06/2026",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "default-energy-saving",
    category: "Mẹo Tiết Kiệm",
    title: "5 Thiết Bị Điện Thông Minh Giúp Hóa Đơn Điện Nhà Bạn Giảm Đến 30%",
    desc: "Thay thế thiết bị truyền thống bằng công tắc hẹn giờ, đèn LED cảm biến và ổ cắm tự ngắt để sử dụng điện hiệu quả hơn.",
    date: "15/06/2026",
    image: "https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=900&q=80",
  },
];

export default function NewsPage() {
  const [customNews, setCustomNews] = useState<DashboardPost[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCustomNews(readStoredContent<DashboardPost>(CONTENT_STORAGE_KEYS.posts));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const news = customNews.length > 0 ? customNews : defaultNews;
  const pageCount = Math.max(1, Math.ceil(news.length / 9));
  const paginatedNews = news.slice((page - 1) * 9, page * 9);

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-[#ff5017] selection:text-white">
      <div className="relative z-20 min-h-screen bg-[#121212] shadow-2xl overflow-x-hidden">
      <Navbar />

      <main>
        <section className="relative pt-32 pb-12 bg-[#121212] overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-20 relative z-20">
              <Link href="/" className="text-[#ff5017] transition-colors hover:text-orange-700">Home</Link>
              <span className="text-zinc-500">›</span>
              <span className="text-white">News</span>
            </nav>

            <div className="relative flex items-center justify-center mb-5" style={{ height: "110px" }}>
              <span aria-hidden="true" suppressHydrationWarning className="ghost-title absolute font-display font-black pointer-events-none select-none" style={{ fontSize: "200px", lineHeight: 1, whiteSpace: "nowrap", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>News</span>
              <h1 className="relative z-10 font-display font-black leading-none text-white tracking-tight" style={{ fontSize: "clamp(56px, 8.5vw, 96px)" }}>News</h1>
            </div>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl leading-relaxed">
              Kiến thức, xu hướng và giải pháp mới nhất về thiết bị điện và Smart Home.
            </p>
          </div>
        </section>

        <section className="relative z-10 py-20 bg-[#121212]">
          <div className="max-w-7xl mx-auto px-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {paginatedNews.map((post) => (
                <article key={post.id} className="bg-card-bg border border-white/5 rounded-xl overflow-hidden  transition-all duration-300 flex flex-col group">
                  <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                    <img src={post.image || "/truong_hero.png"} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded">{post.category}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-zinc-500 text-xs mb-3 block">{formatNewsDate(post.date)}</span>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-1 line-clamp-3">{post.desc}</p>
                    {post.sourceUrl ? (
                      <a href={post.sourceUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:text-[#ff5017]">Đọc tiếp <ChevronRight className="h-4 w-4" /></a>
                    ) : (
                      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">Đọc tiếp <ChevronRight className="h-4 w-4" /></span>
                    )}
                  </div>
                </article>
              ))}
            </div>
            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </section>
      </main>

      </div>
      <div aria-hidden="true" style={{ height: "var(--footer-height, 450px)" }} />
      <Footer />
    </div>
  );
}
