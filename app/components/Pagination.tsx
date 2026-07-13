"use client";

import { useState } from "react";
import { ChevronDown, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  const [pageMenuOpen, setPageMenuOpen] = useState(false);

  if (pageCount <= 1) return null;

  const changePage = (nextPage: number) => {
    setPageMenuOpen(false);
    onPageChange(nextPage);
  };

  return (
    <nav className="relative z-50 mt-12 flex justify-center overflow-visible" aria-label="Phân trang">
      <div className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-[#151515] p-1.5 shadow-lg">
        <button
          type="button"
          onClick={() => changePage(1)}
          disabled={page === 1}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Trang đầu"
        >
          <ChevronFirst className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => changePage(page - 1)}
          disabled={page === 1}
          className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setPageMenuOpen((open) => !open)}
            className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-xl bg-[#ff5017] px-3 text-xs font-bold text-white transition-colors hover:bg-orange-700"
            aria-haspopup="listbox"
            aria-expanded={pageMenuOpen}
            aria-label="Chọn trang"
          >
            <span>Trang {page}</span>
            <span className="text-white/70">/ {pageCount}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${pageMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {pageMenuOpen && (
            <div
              role="listbox"
              className="absolute left-1/2 top-full z-[100] mt-2 max-h-64 w-36 -translate-x-1/2 overflow-y-auto rounded-xl border border-white/10 bg-[#1a1a1a] p-1.5 shadow-2xl"
            >
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  role="option"
                  aria-selected={pageNumber === page}
                  onClick={() => changePage(pageNumber)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-bold transition-colors ${pageNumber === page
                    ? "bg-[#ff5017] text-white"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>Trang {pageNumber}</span>
                  {pageNumber === page && <span className="text-[10px] text-white/70">Đang xem</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => changePage(page + 1)}
          disabled={page === pageCount}
          className="inline-flex h-10 items-center gap-1 rounded-xl px-3 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Trang sau"
        >
          <span className="hidden sm:inline">Sau</span>
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => changePage(pageCount)}
          disabled={page === pageCount}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
          aria-label="Trang cuối"
        >
          <ChevronLast className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
