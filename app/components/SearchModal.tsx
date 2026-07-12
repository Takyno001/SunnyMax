"use client";

import React, { useState, useEffect } from "react";
import { Search, X, ChevronRight, ShoppingBag, Wrench, Newspaper, ArrowLeft, MessageSquare, ExternalLink } from "lucide-react";
import { CONTENT_STORAGE_KEYS, type DashboardProduct, type DashboardCategory, type DashboardPost, type DashboardService, readStoredContent } from "../lib/content";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [categories, setCategories] = useState<DashboardCategory[]>([]);
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [services, setServices] = useState<DashboardService[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: "product" | "service" | "post"; data: any } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setQuery("");
    setSelectedItem(null);
    
    // Load from cache first
    setProducts(readStoredContent<DashboardProduct>(CONTENT_STORAGE_KEYS.products));
    setCategories(readStoredContent<DashboardCategory>(CONTENT_STORAGE_KEYS.categories));
    setPosts(readStoredContent<DashboardPost>(CONTENT_STORAGE_KEYS.posts));
    setServices(readStoredContent<DashboardService>(CONTENT_STORAGE_KEYS.services));

    // Fetch latest from API
    void fetch("/api/content")
      .then((res) => res.ok ? res.json() : null)
      .then((data: { products?: DashboardProduct[]; categories?: DashboardCategory[]; posts?: DashboardPost[]; services?: DashboardService[]; storedTypes?: string[] } | null) => {
        if (!data) return;
        if (data.storedTypes?.includes("products")) setProducts(data.products ?? []);
        if (data.storedTypes?.includes("categories")) setCategories(data.categories ?? []);
        if (data.storedTypes?.includes("posts")) setPosts(data.posts ?? []);
        if (data.storedTypes?.includes("services")) setServices(data.services ?? []);
      }).catch(() => undefined);
  }, [isOpen]);

  if (!isOpen) return null;

  const normalizeText = (val: string) => {
    return val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\u0111\u0110]/g, "d").toLowerCase().trim();
  };

  const matches = (text: string, searchVal: string) => {
    return normalizeText(text).includes(normalizeText(searchVal));
  };

  const storedCategoryNames = new Map(categories.map((c) => [c.id, c.name]));

  const filteredProducts = query
    ? products.filter(
        (p) =>
          matches(p.title, query) ||
          matches(p.description, query) ||
          matches(storedCategoryNames.get(p.category) ?? p.categoryName ?? "", query) ||
          matches(p.spec ?? "", query)
      )
    : [];

  const filteredServices = query
    ? services.filter(
        (s) =>
          matches(s.title, query) ||
          matches(s.description, query) ||
          matches(s.detail ?? "", query)
      )
    : [];

  const filteredPosts = query
    ? posts.filter(
        (p) =>
          matches(p.title, query) ||
          matches(p.desc, query) ||
          matches(p.category, query)
      )
    : [];

  const hasResults = filteredProducts.length > 0 || filteredServices.length > 0 || filteredPosts.length > 0;

  const handleClose = () => {
    setQuery("");
    setSelectedItem(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-black/85 backdrop-blur-md transition-all">
      <div className="bg-[#18181c] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-top-4 duration-200 overflow-hidden">
        {selectedItem ? (
          /* DETAILS VIEW */
          <div className="flex flex-col h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 p-5">
              <button
                onClick={() => setSelectedItem(null)}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer text-xs font-bold uppercase tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> Quay lại kết quả
              </button>
              <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="p-6 md:p-8 flex-1">
              {selectedItem.data.image && (
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 mb-6 border border-white/5">
                  <img
                    src={selectedItem.data.image}
                    alt={selectedItem.data.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 mb-4">
                <span className="px-3 py-1 bg-[#ff5017]/15 text-[#ff5017] text-[10px] font-bold uppercase tracking-wider rounded w-fit">
                  {selectedItem.type === "product"
                    ? (storedCategoryNames.get(selectedItem.data.category) ?? selectedItem.data.categoryName ?? "Sản phẩm")
                    : selectedItem.type === "service"
                    ? "Dịch vụ"
                    : selectedItem.data.category ?? "Bài viết"}
                </span>
                <h3 className="text-xl md:text-2xl font-display font-black text-white uppercase">
                  {selectedItem.data.title}
                </h3>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
                {selectedItem.type === "product" ? selectedItem.data.description : selectedItem.type === "service" ? selectedItem.data.description : selectedItem.data.desc}
              </p>

              {selectedItem.type === "product" && selectedItem.data.spec && (
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-5 mb-6">
                  <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Thông Số Kỹ Thuật:</span>
                  <p className="text-sm font-semibold text-zinc-300 font-mono leading-relaxed whitespace-pre-line">
                    {selectedItem.data.spec}
                  </p>
                </div>
              )}

              {selectedItem.type === "service" && selectedItem.data.detail && (
                <div className="bg-zinc-900 border border-white/5 rounded-xl p-5 mb-6">
                  <span className="block text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Chi Tiết Dịch Vụ:</span>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                    {selectedItem.data.detail}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8">
                {selectedItem.type === "post" && selectedItem.data.sourceUrl ? (
                  <a
                    href={selectedItem.data.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-[#ff5017] hover:bg-orange-700 text-white text-xs font-bold tracking-widest uppercase rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    Đọc Bài Viết Gốc <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <a
                    href={`https://zalo.me?text=Tôi%20quan%20tâm%20đến%20${
                      selectedItem.type === "product" ? "sản%20phẩm" : "dịch%20vụ"
                    }%20${encodeURIComponent(selectedItem.data.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-6 py-3.5 bg-[#ff5017] hover:bg-orange-700 text-white text-xs font-bold tracking-widest uppercase rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Liên Hệ Nhận Báo Giá
                  </a>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-6 py-3.5 bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Quay Lại
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* SEARCH INPUT & RESULTS LIST */
          <>
            {/* Header / Input */}
            <div className="border-b border-white/5 p-5 flex items-center justify-between gap-4">
              <div className="relative flex-1 flex items-center">
                <Search className="absolute left-4 text-zinc-500 w-5 h-5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Nhập tên sản phẩm, dịch vụ hoặc tin tức cần tìm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 focus:border-[#ff5017] pl-12 pr-4 py-3.5 rounded-xl text-sm text-white placeholder-zinc-500 outline-none transition-colors"
                />
              </div>
              <button onClick={handleClose} className="text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {query ? (
                hasResults ? (
                  <div className="space-y-6">
                    {/* Products matches */}
                    {filteredProducts.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-wider text-xs mb-3">
                          <ShoppingBag className="w-4 h-4 text-[#ff5017]" />
                          <span>Sản Phẩm ({filteredProducts.length})</span>
                        </div>
                        <div className="space-y-2">
                          {filteredProducts.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => setSelectedItem({ type: "product", data: p })}
                              className="flex items-center justify-between p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded-xl border border-white/5 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <img src={p.image} alt="" className="w-10 h-10 object-cover rounded bg-zinc-800 shrink-0" />
                                <div className="min-w-0">
                                  <span className="block text-sm font-bold text-white group-hover:text-[#ff5017] transition-colors truncate">{p.title}</span>
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{storedCategoryNames.get(p.category) ?? p.categoryName}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Services matches */}
                    {filteredServices.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-wider text-xs mb-3">
                          <Wrench className="w-4 h-4 text-[#ff5017]" />
                          <span>Dịch Vụ ({filteredServices.length})</span>
                        </div>
                        <div className="space-y-2">
                          {filteredServices.map((s) => (
                            <div
                              key={s.id}
                              onClick={() => setSelectedItem({ type: "service", data: s })}
                              className="flex items-center justify-between p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded-xl border border-white/5 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-zinc-800 rounded-lg text-[#ff5017] group-hover:bg-[#ff5017]/10 transition-colors">
                                  <Wrench className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <span className="block text-sm font-bold text-white group-hover:text-[#ff5017] transition-colors truncate">{s.title}</span>
                                  <span className="text-[10px] text-zinc-500 truncate block">{s.description}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Posts matches */}
                    {filteredPosts.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase tracking-wider text-xs mb-3">
                          <Newspaper className="w-4 h-4 text-[#ff5017]" />
                          <span>Tin Tức & Bài Viết ({filteredPosts.length})</span>
                        </div>
                        <div className="space-y-2">
                          {filteredPosts.map((post) => (
                            <div
                              key={post.id}
                              onClick={() => setSelectedItem({ type: "post", data: post })}
                              className="flex items-center justify-between p-3 bg-zinc-900/60 hover:bg-zinc-900 rounded-xl border border-white/5 cursor-pointer transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <img src={post.image || "/truong_hero.png"} alt="" className="w-10 h-10 object-cover rounded bg-zinc-800 shrink-0" />
                                <div className="min-w-0">
                                  <span className="block text-sm font-bold text-white group-hover:text-[#ff5017] transition-colors truncate">{post.title}</span>
                                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{post.category}</span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-zinc-500 text-sm">
                    Không tìm thấy kết quả nào khớp với từ khóa "{query}"
                  </div>
                )
              ) : (
                /* SUGGESTIONS / DEFAULT STATE */
                <div className="space-y-4">
                  <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Sản Phẩm & Dịch vụ Nổi bật:</span>
                  <div className="space-y-2">
                    {products.slice(0, 3).map((p, idx) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedItem({ type: "product", data: p })}
                        className="flex items-center justify-between p-3 bg-zinc-900/40 hover:bg-zinc-900/90 rounded-xl border border-white/5 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-[#ff5017] w-4">{idx + 1}.</span>
                          <img src={p.image} alt="" className="w-10 h-10 object-cover rounded bg-zinc-800" />
                          <div>
                            <span className="block text-sm font-bold text-white group-hover:text-[#ff5017] transition-colors">{p.title}</span>
                            <span className="text-[10px] text-[#ff5017] font-bold uppercase tracking-wider">Hot</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
