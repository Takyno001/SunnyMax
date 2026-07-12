"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "./components/Footer";
import SearchModal from "./components/SearchModal";
import Navbar from "./components/Navbar";
import { CONTENT_STORAGE_KEYS, DashboardPost, readStoredContent, type DashboardProduct, type DashboardCategory, type DashboardService } from "./lib/content";
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
  Home as HomeIcon,
  Lightbulb,
  Plug,
  ShieldCheck,
  Wifi,
  Users,
  Briefcase,
  Music,
  Megaphone,
  Send,
  CheckCircle2,
  Mail,
  MapPin,
  Info
} from "lucide-react";

function formatBlogDate(value: string) {
  const trimmed = value.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}/${isoMatch[1]} ${isoMatch[4]}:${isoMatch[5]}`;
  }

  return trimmed.replace("T", " ");
}

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  format?: (val: number) => string;
}

function Counter({ end, duration = 2000, suffix = "", format }: CounterProps) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = React.useRef(false);
  const ref = React.useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -80px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayVal = format ? format(count) : count.toLocaleString("vi-VN");

  const renderSuffix = () => {
    if (!suffix) return null;
    if (suffix.includes("+")) {
      const parts = suffix.split("+");
      return (
        <span className="inline-flex items-center">
          {parts[0]}
          <span className="font-sans font-bold text-[0.8em] leading-none inline-block -translate-y-[0.03em] ml-1">{"+"}</span>
          {parts[1]}
        </span>
      );
    }
    return <span>{suffix}</span>;
  };

  return (
    <span ref={ref} className="inline-flex items-center justify-center">
      <span>{displayVal}</span>
      {renderSuffix()}
    </span>
  );
}

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

const FAUsersIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 640 512"
    fill="currentColor"
    {...props}
  >
    <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112S381.9 32 320 32 208 82.1 208 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C179.6 288 128 339.6 128 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4C161.5 263.1 145.6 256 128 256H64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z" />
  </svg>
);

const FABriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 512 512"
    fill="currentColor"
    {...props}
  >
    <path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z" />
  </svg>
);

const FALightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 352 512"
    fill="currentColor"
    {...props}
  >
    <path d="M176 0C78.8 0 0 78.8 0 176c0 50.8 21.2 96.7 55 129.3 22.3 21.6 33 51.5 33 82.7V400c0 8.8 7.2 16 16 16h144c8.8 0 16-7.2 16-16v-12c0-31.2 10.7-61.1 33-82.7 33.8-32.6 55-78.5 55-129.3C352 78.8 273.2 0 176 0zm-80 448c0 8.8 7.2 16 16 16h128c8.8 0 16-7.2 16-16v-16H96v16zm128 48c0 8.8-7.2 16-16 16h-64c-8.8 0-16-7.2-16-16v-16h96v16z" />
  </svg>
);

const FAAwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 384 512"
    fill="currentColor"
    {...props}
  >
    <path d="M192 0c-88.4 0-160 71.6-160 160 0 41.5 15.9 79.4 41.7 108.3L3 429.7c-5.7 12.8-1 27.7 10.9 34.9l80 48c6 3.6 13 4.2 19.4 1.7l81-32.4 81 32.4c6.4 2.5 13.4 1.9 19.4-1.7l80-48c11.9-7.2 16.6-22.1 10.9-34.9L310.3 268.3c25.9-28.9 41.7-66.8 41.7-108.3C352 71.6 280.4 0 192 0zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z" />
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
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" />
  </svg>
);

const customServiceIconMap = { Cpu, Zap, Wrench, Home: HomeIcon, Lightbulb, Plug, ShieldCheck, Wifi };
function CustomServiceIcon({ name }: { name?: string }) {
  const Icon = customServiceIconMap[name as keyof typeof customServiceIconMap] ?? Wrench;
  return <Icon className="w-8 h-8 text-primary" />;
}

export default function Home() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customBlogs, setCustomBlogs] = useState<DashboardPost[]>([]);
  const [customProducts, setCustomProducts] = useState<DashboardProduct[]>([]);
  const [customCategories, setCustomCategories] = useState<DashboardCategory[]>([]);
  const [customServices, setCustomServices] = useState<DashboardService[]>([]);
  const blogSectionRef = React.useRef<HTMLDivElement>(null);
  const [blogVisible, setBlogVisible] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<DashboardPost | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCustomBlogs(readStoredContent<DashboardPost>(CONTENT_STORAGE_KEYS.posts));
      setCustomProducts(readStoredContent<DashboardProduct>(CONTENT_STORAGE_KEYS.products));
      setCustomCategories(readStoredContent<DashboardCategory>(CONTENT_STORAGE_KEYS.categories));
      setCustomServices(readStoredContent<DashboardService>(CONTENT_STORAGE_KEYS.services));

      void fetch("/api/content")
        .then((res) => res.ok ? res.json() : null)
        .then((data: { products?: DashboardProduct[]; categories?: DashboardCategory[]; posts?: DashboardPost[]; services?: DashboardService[]; storedTypes?: string[] } | null) => {
          if (!data) return;
          if (data.storedTypes?.includes("products")) {
            setCustomProducts(data.products ?? []);
            window.localStorage.setItem(CONTENT_STORAGE_KEYS.products, JSON.stringify(data.products ?? []));
          }
          if (data.storedTypes?.includes("categories")) {
            setCustomCategories(data.categories ?? []);
            window.localStorage.setItem(CONTENT_STORAGE_KEYS.categories, JSON.stringify(data.categories ?? []));
          }
          if (data.storedTypes?.includes("posts")) {
            setCustomBlogs(data.posts ?? []);
            window.localStorage.setItem(CONTENT_STORAGE_KEYS.posts, JSON.stringify(data.posts ?? []));
          }
          if (data.storedTypes?.includes("services")) {
            setCustomServices(data.services ?? []);
            window.localStorage.setItem(CONTENT_STORAGE_KEYS.services, JSON.stringify(data.services ?? []));
          }
        }).catch(() => undefined);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check search query parameter
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("search") === "open") {
        setSearchModalOpen(true);
        // Clean URL query parameter without triggering reload
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setBlogVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setBlogVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    const el = blogSectionRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const services = [
    {
      num: "01",
      icon: <Cpu className="w-8 h-8 text-primary" />,
      title: "Cung Cấp Thiết Bị Điện",
      description: "Phân phối sỉ & lẻ thiết bị điện dân dụng, công nghiệp chính hãng. Cam kết chất lượng từ dây cáp, công tắc, ổ cắm đến các thiết bị đóng cắt an toàn.",
      detail: "Hỗ trợ bóc tách bản vẽ kỹ thuật, tư vấn tối ưu chủng loại vật tư thiết bị. Chiết khấu cao cho nhà thầu, thợ điện và các đại lý bán lẻ."
    },
    {
      num: "02",
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Giải Pháp Smart Home",
      description: "Tư vấn, thiết kế và thi công hệ thống nhà thông minh toàn diện. Tự động hóa hệ thống chiếu sáng, rèm cửa, điều hòa, kiểm soát an ninh thông minh.",
      detail: "Cài đặt ứng dụng tiếng Việt dễ sử dụng, thiết lập kịch bản thông minh theo thói quen sinh hoạt. Bảo hành chính hãng 24 tháng tận nơi."
    },
    {
      num: "03",
      icon: <Wrench className="w-8 h-8 text-primary" />,
      title: "Thiết Kế Thi Công Điện Nước",
      description: "Thiết kế bản vẽ kỹ thuật M&E và thi công hệ thống điện nước an toàn, chuẩn kỹ thuật cho nhà phố, biệt thự, quán cafe, văn phòng làm việc.",
      detail: "Đội ngũ thợ tay nghề cao trực tiếp thi công. Nghiệm thu bàn giao đo đạc thực tế, sơ đồ hoàn công chi tiết cho chủ nhà."
    }
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

  const allProducts = customProducts.length > 0
    ? customProducts.map((item) => {
        if (item.id.startsWith("website-product-")) {
          const numId = parseInt(item.id.replace("website-product-", ""), 10);
          return { ...item, id: numId };
        }
        return item;
      })
    : products;

  const stats = [
    { icon: <FAUsersIcon />, end: 10, suffix: " K+", label: "Khách Hàng Hài Lòng" },
    { icon: <FABriefcaseIcon />, end: 50, suffix: " +", label: "Dự Án Hoàn Thành" },
    { icon: <FALightbulbIcon />, end: allProducts.length, suffix: " +", label: "Mặt Hàng Cung Cấp" },
    { icon: <FAAwardIcon />, end: 5, suffix: " +", label: "Năm Kinh Nghiệm" }
  ];

  const storedCategoryNames = new Map(customCategories.map((item) => [item.id, item.name]));
  const visibleCategories = customCategories.length > 0
    ? [{ id: "all", label: "Tất Cả" }, ...customCategories.map((c) => ({ id: c.id, label: c.name }))]
    : [
        { id: "all", label: "Tất Cả" },
        { id: "smarthome", label: "Điện Thông Minh" },
        { id: "lighting", label: "Chiếu Sáng" },
        { id: "breaker", label: "Cáp & Bảo Vệ" }
      ];

  const filteredProducts = activeCategory === "all"
    ? allProducts
    : allProducts.filter(p => p.category === activeCategory);


  const defaultBlogs = [
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


  const allServices = customServices.length > 0
    ? customServices.map((service, index) => ({
        ...service,
        num: String(index + 1).padStart(2, "0"),
        icon: <CustomServiceIcon name={service.icon} />,
      }))
    : services;

  const blogs = customBlogs.length > 0 ? customBlogs : defaultBlogs;

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
    <div className="relative min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      {/* Full-page fixed abstract background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
        zIndex: 0,
        }}
      >
        {/* Base: lighter dark */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(115deg, #2b1610 0%, #171214 48%, #0f0f12 100%)" }} />

        {/* Primary glow: blazing orange — bottom-right, much brighter */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 75% 60% at 95% 95%, rgba(255,80,23,0.85) 0%, rgba(255,80,23,0.4) 30%, rgba(255,80,23,0.1) 55%, transparent 70%)`,
          }}
        />

        {/* Secondary glow: deep amber — top-left, brighter */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 5% 5%, rgba(255,150,0,0.6) 0%, rgba(255,100,0,0.25) 40%, transparent 65%)`,
          }}
        />

        {/* Accent glow: blue-purple — top-right */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 45% 40% at 90% 5%, rgba(120,80,255,0.35) 0%, rgba(90,50,220,0.12) 45%, transparent 65%)`,
          }}
        />

        {/* Center mid-glow: warm light in the middle */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,100,30,0.08) 0%, transparent 70%)`,
          }}
        />

        {/* Grid lines — brighter */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Sub-grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />

        {/* Diagonal orange streaks — brighter */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -60deg,
              transparent,
              transparent 120px,
              rgba(255,80,23,0.08) 120px,
              rgba(255,80,23,0.08) 121px
            )`,
          }}
        />

        {/* Softer vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 110% 110% at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)`,
          }}
        />
      </div>
      {/* Scrollable Content Wrapper */}
      <div className="relative z-20 min-h-screen shadow-2xl">
        {/* 1. HEADER / NAVBAR */}
        <Navbar onSearchOpen={() => setSearchModalOpen(true)} />

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

          <div className="max-w-7xl mx-auto px-6 w-full pt-24 pb-20 md:pt-32 md:pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
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
                <a href="https://m.me" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5  flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Messenger">
                  <MessengerIcon className="w-7 h-7" />
                </a>
                <a href="https://zalo.me" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5  flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Zalo">
                  <ZaloIcon className="w-7 h-7" />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5  flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Tiktok">
                  <TiktokIcon className="w-7 h-7" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-zinc-800/80 hover:bg-zinc-600 border border-white/5  flex items-center justify-center text-white transition-all hover:-translate-y-1" aria-label="Youtube">
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
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section header */}
            <div className="flex flex-col gap-6 mb-16">
              {/* Title & Button row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="relative flex flex-col items-start w-full md:w-auto">
                  <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-8 relative z-20">
                    01.
                  </span>

                  {/* Title wrapper */}
                  <div className="relative flex items-center justify-start" style={{ height: "90px", width: "100%" }}>
                    {/* Ghost: paint-order stroke fill — clean outline, no inner artifacts */}
                    <span
                      aria-hidden="true"
                      suppressHydrationWarning
                      className="ghost-title absolute font-display font-black pointer-events-none select-none"
                      style={{
                        fontSize: "clamp(80px, 12vw, 150px)",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        left: "-5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                      }}
                    >
                      Services
                    </span>
                    {/* Solid foreground */}
                    <h2 className="relative z-10 font-display font-black leading-none text-white tracking-tight pl-8" style={{ fontSize: "clamp(48px, 7vw, 80px)" }}>
                      Services
                    </h2>
                  </div>
                </div>

                <Link
                  href="/services"
                  className="px-6 py-3.5 bg-zinc-800/80 hover:bg-black border border-white/5 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center gap-2 group w-fit h-fit self-start md:self-end md:mb-2"
                >
                  Xem Toàn Bộ Dịch Vụ <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Divider line */}
              <div className="border-t border-white/5"></div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
              {allServices.slice(0, 3).map((svc, idx) => (
                <div
                  key={idx}
                  className="bg-card-bg border border-white/5 rounded-xl p-8 hover:bg-card-hover transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-[0_0_20px_rgba(255,80,23,0.15)]">
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
                  {svc.detail && (
                    <p className="text-zinc-500 text-xs leading-relaxed border-t border-white/5 pt-4 mt-4">
                      {svc.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-[#161619] rounded-2xl p-10 md:p-14 relative overflow-hidden">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4 group/item transition-transform duration-300 hover:-translate-y-1">
                  {/* Icon rendered directly (No container box, colored orange) */}
                  <div className="mb-5 text-[#ff5017] group-hover/item:scale-110 transition-transform duration-300">
                    {React.cloneElement(stat.icon as React.ReactElement<{ className?: string }>, { className: "w-7 h-7 text-[#ff5017]" })}
                  </div>
                  
                  {/* Number (Pure white) */}
                  <span className="text-3xl md:text-5xl font-display font-black text-white mb-3 whitespace-nowrap">
                    <Counter end={stat.end} suffix={stat.suffix} />
                  </span>
                  
                  {/* Label (Sleek grey) */}
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. PRODUCTS SECTION */}
        <section id="products" className="py-24 bg-zinc-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section header */}
            <div className="flex flex-col gap-6 mb-16">
              {/* Title & Button row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="relative flex flex-col items-start w-full md:w-auto">
                  <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-8 relative z-20">
                    02.
                  </span>

                  {/* Title wrapper */}
                  <div className="relative flex items-center justify-start" style={{ height: "90px", width: "100%" }}>
                    {/* Ghost: paint-order stroke fill — clean outline, no inner artifacts */}
                    <span
                      aria-hidden="true"
                      suppressHydrationWarning
                      className="ghost-title absolute font-display font-black pointer-events-none select-none"
                      style={{
                        fontSize: "clamp(80px, 12vw, 150px)",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        left: "-5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#09090b",
                      }}
                    >
                      Products
                    </span>
                    {/* Solid foreground */}
                    <h2 className="relative z-10 font-display font-black leading-none text-white tracking-tight pl-8" style={{ fontSize: "clamp(48px, 7vw, 80px)" }}>
                      Products
                    </h2>
                  </div>
                </div>

                <Link
                  href="/products"
                  className="px-6 py-3.5 bg-zinc-800/80 hover:bg-black border border-white/5 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center gap-2 group w-fit h-fit self-start md:self-end md:mb-2"
                >
                  Xem Toàn Bộ Sản Phẩm <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProducts.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => setSelectedProduct(prod)}
                  className="group cursor-pointer flex flex-col bg-card-bg border border-white/5 rounded-xl overflow-hidden  transition-all duration-300"
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
                      {storedCategoryNames.get(prod.category) ?? prod.categoryName}
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


          </div>
        </section>

        {/* 5. BRANDS/PARTNERS SECTION */}
        <section
          id="brands"
          className="py-24 relative overflow-hidden"
          style={{
            backgroundColor: "#202020",
            backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.025), transparent 35%), repeating-linear-gradient(105deg, transparent 0, transparent 118px, rgba(0,0,0,0.18) 119px, transparent 121px)`,
          }}
        >
          <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="flex flex-col items-start">
              <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-2">03.</span>
              <h2 className="text-6xl md:text-8xl font-display font-black text-white tracking-tight">Brands</h2>
            </div>
            <div className="flex min-w-0 items-center justify-center md:justify-end rounded-2xl bg-[#121212]/90 px-6 py-5 shadow-2xl backdrop-blur-sm">
              <img src="/sunnymax.png" alt="SunnyMax" className="h-auto w-[min(30vw,240px)] object-contain" />
            </div>
          </div>
        </section>
        {/* 6. BLOG / NEWS SECTION */}
        <section ref={blogSectionRef} id="blog" className="py-24 bg-zinc-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section header */}
            <div className="flex flex-col gap-6 mb-16">
              {/* Title & Button row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="relative flex flex-col items-start w-full md:w-auto">
                  <span className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase block mb-8 relative z-20">
                    04.
                  </span>

                  {/* Title wrapper */}
                  <div className="relative flex items-center justify-start" style={{ height: "90px", width: "100%" }}>
                    {/* Ghost: paint-order stroke fill — clean outline, no inner artifacts */}
                    <span
                      aria-hidden="true"
                      suppressHydrationWarning
                      className="ghost-title absolute font-display font-black pointer-events-none select-none"
                      style={{
                        fontSize: "clamp(80px, 12vw, 150px)",
                        lineHeight: 1,
                        whiteSpace: "nowrap",
                        left: "-5px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#09090b",
                      }}
                    >
                      News
                    </span>
                    {/* Solid foreground */}
                    <h2 className="relative z-10 font-display font-black leading-none text-white tracking-tight pl-8" style={{ fontSize: "clamp(48px, 7vw, 80px)" }}>
                      News
                    </h2>
                  </div>
                </div>

                <Link href="/news" className="px-6 py-3.5 bg-zinc-800/80 hover:bg-black border border-white/5 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center gap-2 group w-fit h-fit self-start md:self-end md:mb-2">
                  Xem Thêm Bài Viết <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Divider line */}
              <div className="border-t border-white/5"></div>
            </div>

            {/* Blog grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.slice(0, 3).map((blog, idx) => (
                <article
                  key={blog.id}
                  className={`bg-card-bg border border-white/5 rounded-xl overflow-hidden transition-all duration-700 ease-out flex flex-col group ${
                    blogVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-16 scale-90 pointer-events-none"
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Blog Image */}
                  <div className="aspect-video w-full overflow-hidden bg-zinc-900 relative">
                    <img
                      src={blog.image || "/truong_hero.png"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-primary text-white text-[9px] font-bold uppercase tracking-wider rounded">
                      {blog.category}
                    </span>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-zinc-500 text-xs mb-3 block">{formatBlogDate(blog.date)}</span>
                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-6 flex-1 line-clamp-3">
                      {blog.desc}
                    </p>
                    <div className="border-t border-white/10 pt-4 mt-auto">
                      <button
                        onClick={() => setSelectedBlog(blog as DashboardPost)}
                        className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-primary flex items-center gap-2 transition-colors text-left cursor-pointer"
                      >
                        Đọc Tiếp <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>


      </div>{/* END z-20 scrollable wrapper */}

      <div aria-hidden="true" style={{ height: "var(--footer-height, 450px)" }} />
      <Footer />


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
                {storedCategoryNames.get(selectedProduct.category) ?? selectedProduct.categoryName}
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
                  className="px-6 py-3 border border-white/10  text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded transition-colors cursor-pointer"
                >
                  Quay Lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: BLOG DETAIL */}
      {selectedBlog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="bg-card-bg border border-white/10 rounded-2xl overflow-hidden max-w-2xl w-full relative shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:text-primary hover:bg-black/90 flex items-center justify-center transition-colors z-20 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Blog thumbnail */}
            {selectedBlog.image && (
              <div className="aspect-video w-full relative bg-zinc-900 shrink-0">
                <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-card-bg to-transparent" />
                {selectedBlog.category && (
                  <span className="absolute bottom-4 left-6 z-10 px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded">
                    {selectedBlog.category}
                  </span>
                )}
              </div>
            )}

            {/* Blog content */}
            <div className="p-8 overflow-y-auto">
              <span className="text-zinc-500 text-xs mb-3 block">{formatBlogDate(selectedBlog.date)}</span>
              <h3 className="text-2xl font-display font-black text-white mb-4 leading-tight">
                {selectedBlog.title}
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                {(selectedBlog as DashboardPost & { content?: string }).content || selectedBlog.desc}
              </p>
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-3 border border-white/10 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SEARCH */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </div>
  );
}
