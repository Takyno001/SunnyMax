export type DashboardCategory = {
  id: string;
  name: string;
};

export const DEFAULT_PRODUCT_CATEGORIES: DashboardCategory[] = [
  { id: "smarthome", name: "Điện thông minh" },
  { id: "lighting", name: "Thiết bị chiếu sáng" },
  { id: "breaker", name: "Cáp & bảo vệ" },
  { id: "other", name: "Khác" },
];

export type DashboardProduct = {
  id: string;
  code: string;
  title: string;
  category: string;
  categoryName: string;
  image: string;
  description: string;
  spec: string;
  sourceUrl?: string;
  createdAt?: string;
};

export type DashboardPost = {
  id: string;
  category: string;
  title: string;
  desc: string;
  date: string;
  image: string;
  sourceUrl?: string;
  createdAt?: string;
};

export type DashboardService = {
  id: string;
  num: string;
  title: string;
  description: string;
  detail: string;
};

export const CONTENT_STORAGE_KEYS = {
  products: "truong-nguyen-dashboard-products",
  posts: "truong-nguyen-dashboard-posts",
  services: "truong-nguyen-dashboard-services",
  categories: "truong-nguyen-dashboard-categories",
} as const;

export function readStoredContent<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(key);
    if (!value) return [];

    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeStoredContent<T>(key: string, items: T[]) {
  window.localStorage.setItem(key, JSON.stringify(items));
}
