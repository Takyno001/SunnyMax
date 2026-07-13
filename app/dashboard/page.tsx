"use client";

import type { ChangeEvent, ClipboardEvent, FormEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, GripVertical, Newspaper, ChevronLeft, Check, ChevronDown, Cpu, Home, Lightbulb, Plug, Plug2, ShieldCheck, Wifi, Zap, Cable, CirclePower, LampCeiling, HousePlug, Edit3, FolderPlus, ImagePlus, LayoutDashboard, Link2, ShoppingBag, Plus, RefreshCw, Save, Search, Trash2, Wrench, X } from "lucide-react";
import { CONTENT_STORAGE_KEYS, DEFAULT_PRODUCT_CATEGORIES, type DashboardCategory, type DashboardPost, type DashboardProduct, type DashboardService, readStoredContent, writeStoredContent } from "../lib/content";
import { products as websiteProducts } from "../products/page";
import { services as websiteServices } from "../services/page";
import { defaultNews as websiteNews } from "../news/page";

type Section = "overview" | "categories" | "products" | "posts" | "services";
type ItemType = "categories" | "products" | "posts" | "services";
type ArticlePreview = { title: string; description: string; image: string; url: string; publishedAt?: string };
type IdentifiedContent = { id: string };

const defaultDashboardProducts: DashboardProduct[] = websiteProducts.map((product, index) => ({
  ...product,
  id: `website-product-${product.id}`,
  code: `SP-${String(index + 1).padStart(3, "0")}`,
  categoryName: product.categoryName,
}));

const defaultDashboardServices: DashboardService[] = websiteServices.map((service, index) => ({
  ...service,
  id: `website-service-${service.num}`,
  icon: ["Plug", "Home", "ShieldCheck"][index] ?? "Wrench",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}));

const defaultDashboardPosts: DashboardPost[] = websiteNews.map((post) => ({
  ...post,
  id: post.id,
}));

function mergeDefaultContent<T extends IdentifiedContent>(defaults: T[], stored: T[]) {
  const storedIds = new Set(stored.map((item) => item.id));
  return [...defaults.filter((item) => !storedIds.has(item.id)), ...stored];
}

type FieldProps = { label: string; children: ReactNode; hint?: string };
const inputClass = "w-full rounded-xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#ff5017]/70 focus:ring-2 focus:ring-[#ff5017]/10";
function vietnamDateTimeInput(value: string | Date) {
  const parsed = new Date(typeof value === "string" ? value.replace(" ", "T") : value);
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(safeDate);
  const get = (name: string) => parts.find((part) => part.type === name)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}function formatVietnamDateTime(value: string) {
  const dayFirst = value.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  const localValue = dayFirst
    ? `${dayFirst[3]}-${dayFirst[2]}-${dayFirst[1]}T00:00:00+07:00`
    : /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}T00:00:00+07:00`
    : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)
    ? `${value}:00+07:00`
    : value;
  try {
    const d = new Date(localValue);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(d);
  } catch {
    return value;
  }
}function postDateSortValue(value: string) {
  const dayFirst = value.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (dayFirst) return Date.parse(`${dayFirst[3]}-${dayFirst[2]}-${dayFirst[1]}T00:00:00+07:00`);
  const localValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+07:00` : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ? `${value}:00+07:00` : value;
  const timestamp = Date.parse(localValue);
  return Number.isNaN(timestamp) ? 0 : timestamp;
}function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\u0111\u0110]/g, "d").toLowerCase().trim();
}

function editDistance(left: string, right: string) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    for (let j = 1; j <= right.length; j += 1) {
      const above = row[j];
      row[j] = left[i - 1] === right[j - 1] ? diagonal : Math.min(row[j - 1] + 1, above + 1, diagonal + 1);
      diagonal = above;
    }
  }
  return row[right.length];
}

function fuzzyTextScore(query: string, text: string) {
  if (!query || !text) return 0;
  if (text.includes(query)) return query.length === text.length ? 1000 : 700;
  const words = text.split(/\s+/).filter(Boolean);
  let best = 0;
  for (const word of words) {
    if (word.startsWith(query)) best = Math.max(best, 550);
    const distance = editDistance(query, word);
    const limit = Math.max(1, Math.floor(Math.max(query.length, word.length) * 0.35));
    if (distance <= limit) best = Math.max(best, 420 - distance * 40);
  }
  return best;
}

function fuzzySearchScore(query: string, fields: Array<{ value: string; weight: number }>) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return 0;
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const normalizedFields = fields.map((field) => ({ value: normalizeSearch(field.value), weight: field.weight }));
  let score = 0;
  if (normalizedFields.some((field) => field.value.includes(normalizedQuery))) score += 300;
  for (const token of queryTokens) {
    const bestTokenScore = Math.max(...normalizedFields.map((field) => fuzzyTextScore(token, field.value) * field.weight), 0);
    if (!bestTokenScore) return 0;
    score += bestTokenScore;
  }
  return score;
}

function scorePost(item: DashboardPost, query: string) {
  return fuzzySearchScore(query, [
    { value: item.title, weight: 3 },
    { value: item.category, weight: 2 },
    { value: item.desc, weight: 1 },
    { value: item.sourceUrl ?? "", weight: 1 },
  ]);
}
const categoryIconOptions = [
  { name: "Plug", label: "Ổ cắm", Icon: Plug },
  { name: "HousePlug", label: "Thiết bị điện", Icon: HousePlug },
  { name: "LampCeiling", label: "Bóng đèn", Icon: LampCeiling },
  { name: "Lightbulb", label: "Chiếu sáng", Icon: Lightbulb },
  { name: "Cable", label: "Dây / cáp", Icon: Cable },
  { name: "CirclePower", label: "Công tắc", Icon: CirclePower },
  { name: "ShieldCheck", label: "Bảo vệ điện", Icon: ShieldCheck },
  { name: "Cpu", label: "Thiết bị điều khiển", Icon: Cpu },
] as const;
const categoryIconFor = (id: string) => id === "lighting" ? "LampCeiling" : id === "breaker" ? "ShieldCheck" : id === "smarthome" ? "HousePlug" : "Plug";
const categoryIconComponent = (name?: string) => categoryIconOptions.find((item) => item.name === name)?.Icon ?? Plug;
const serviceIconOptions = [
  { name: "Wrench", label: "Thi công", Icon: Wrench },
  { name: "Cpu", label: "Điều khiển", Icon: Cpu },
  { name: "Zap", label: "Năng lượng", Icon: Zap },
  { name: "Lightbulb", label: "Chiếu sáng", Icon: Lightbulb },
  { name: "ShieldCheck", label: "An toàn điện", Icon: ShieldCheck },
  { name: "Home", label: "Smart Home", Icon: Home },
  { name: "Plug", label: "Thiết bị điện", Icon: Plug },
  { name: "Wifi", label: "Kết nối", Icon: Wifi },
] as const;const emptyProduct: Omit<DashboardProduct, "id"> = { code: "", title: "", category: "smarthome", categoryName: "Điện thông minh", image: "", description: "", spec: "" };
const emptyPost: Omit<DashboardPost, "id"> = { category: "Kiến thức điện", title: "", desc: "", date: vietnamDateTimeInput(new Date()), image: "", sourceUrl: "" };
const emptyService: Omit<DashboardService, "id" | "num"> = { title: "", description: "", detail: "", icon: "Wrench" };
const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "services", label: "Dịch vụ", icon: Wrench },
  { id: "categories", label: "Danh mục", icon: FolderPlus },
  { id: "products", label: "Sản phẩm", icon: ShoppingBag },
  { id: "posts", label: "Bài viết", icon: Newspaper },
];

function Field({ label, children, hint }: FieldProps) {
  return <label className="block space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-zinc-300">{label}</span>{children}{hint && <span className="block text-[11px] text-zinc-600">{hint}</span>}</label>;
}

export default function DashboardPage() {
  const [section, setSection] = useState<Section>("overview");
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [services, setServices] = useState<DashboardService[]>([]);
  const [categories, setCategories] = useState<DashboardCategory[]>(DEFAULT_PRODUCT_CATEGORIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", icon: "Plug" });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ type: "category" | "content"; contentType?: ItemType; id: string; label: string } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ type: ItemType; index: number } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ type: ItemType; index: number } | null>(null);
  const [sortingType, setSortingType] = useState<ItemType | null>(null);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [articleLoading, setArticleLoading] = useState(false);
  const [articlePreview, setArticlePreview] = useState<ArticlePreview | null>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [productQuery, setProductQuery] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [productFilterOpen, setProductFilterOpen] = useState(false);
  const [postForm, setPostForm] = useState(emptyPost);
  const [postQuery, setPostQuery] = useState("");
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [serviceQuery, setServiceQuery] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const localProducts = readStoredContent<DashboardProduct>(CONTENT_STORAGE_KEYS.products);
      const localPosts = readStoredContent<DashboardPost>(CONTENT_STORAGE_KEYS.posts);
      const localServices = readStoredContent<DashboardService>(CONTENT_STORAGE_KEYS.services);
      const localCategories = readStoredContent<DashboardCategory>(CONTENT_STORAGE_KEYS.categories);
      setProducts(mergeDefaultContent(defaultDashboardProducts, localProducts));
      setPosts(mergeDefaultContent(defaultDashboardPosts, localPosts));
      setServices(mergeDefaultContent(defaultDashboardServices, localServices));
      const saved = localCategories;
      if (saved.length) setCategories(saved);
      void fetch("/api/content").then((response) => response.ok ? response.json() : null).then((data: { storedTypes?: string[]; products?: DashboardProduct[]; posts?: DashboardPost[]; services?: DashboardService[]; categories?: DashboardCategory[] } | null) => {
        if (!data) return;
        if (data.storedTypes?.includes("products")) {
          const merged = mergeDefaultContent(defaultDashboardProducts, data.products ?? []);
          setProducts(merged);
          window.localStorage.setItem(CONTENT_STORAGE_KEYS.products, JSON.stringify(merged));
        } else writeStoredContent(CONTENT_STORAGE_KEYS.products, mergeDefaultContent(defaultDashboardProducts, localProducts));

        if (data.storedTypes?.includes("posts")) {
          const merged = mergeDefaultContent(defaultDashboardPosts, data.posts ?? []);
          setPosts(merged);
          window.localStorage.setItem(CONTENT_STORAGE_KEYS.posts, JSON.stringify(merged));
        } else writeStoredContent(CONTENT_STORAGE_KEYS.posts, mergeDefaultContent(defaultDashboardPosts, localPosts));

        if (data.storedTypes?.includes("services")) {
          const merged = mergeDefaultContent(defaultDashboardServices, data.services ?? []);
          setServices(merged);
          window.localStorage.setItem(CONTENT_STORAGE_KEYS.services, JSON.stringify(merged));
        } else writeStoredContent(CONTENT_STORAGE_KEYS.services, mergeDefaultContent(defaultDashboardServices, localServices));

        if (data.storedTypes?.includes("categories")) {
          setCategories(data.categories ?? []);
          window.localStorage.setItem(CONTENT_STORAGE_KEYS.categories, JSON.stringify(data.categories ?? []));
        } else if (localCategories.length) writeStoredContent(CONTENT_STORAGE_KEYS.categories, localCategories);
      }).catch(() => undefined);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const showNotice = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(""), 3000); };

  const closeForm = () => { setFormOpen(false); setEditingId(null); setArticlePreview(null); setCategoryDropdownOpen(false); };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (categoryFormOpen) {
        setCategoryFormOpen(false);
        setEditingCategoryId(null);
        return;
      }
      if (formOpen) {
        closeForm();
        return;
      }
      if (articlePreview) {
        setArticlePreview(null);
        return;
      }
      if (deleteTarget) setDeleteTarget(null);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [categoryFormOpen, formOpen, articlePreview, deleteTarget]);
  const openProductForm = (category?: DashboardCategory) => { setProductForm(category ? { ...emptyProduct, category: category.id, categoryName: category.name } : emptyProduct); setEditingId(null); setSection("products"); setCategoryDropdownOpen(false); setFormOpen(true); };
  const openPostForm = () => { setPostForm({ ...emptyPost, date: vietnamDateTimeInput(new Date()) }); setEditingId(null); setArticlePreview(null); setSection("posts"); setFormOpen(true); };
  const openServiceForm = () => { setServiceForm(emptyService); setEditingId(null); setSection("services"); setFormOpen(true); };
  const editProduct = (item: DashboardProduct) => { setProductForm({ ...item }); setEditingId(item.id); setSection("products"); setCategoryDropdownOpen(false); setFormOpen(true); };
  const editPost = (item: DashboardPost) => { setPostForm({ ...emptyPost, ...item }); setEditingId(item.id); setArticlePreview(null); setSection("posts"); setFormOpen(true); };
  const editService = (item: DashboardService) => { setServiceForm({ title: item.title, description: item.description, detail: item.detail, icon: item.icon ?? "Wrench" }); setEditingId(item.id); setSection("services"); setFormOpen(true); };

  const addCategory = () => {
    const name = categoryForm.name.trim();
    const id = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (!name || !id || categories.some((item) => item.id === id && item.id !== editingCategoryId || item.name.toLowerCase() === name.toLowerCase() && item.id !== editingCategoryId)) { showNotice("Danh mục đã tồn tại hoặc không hợp lệ"); return; }
    const item = { id: editingCategoryId ?? id, name, icon: categoryForm.icon };
    const next = editingCategoryId ? categories.map((old) => old.id === editingCategoryId ? item : old) : [...categories, item];
    setCategories(next); writeStoredContent(CONTENT_STORAGE_KEYS.categories, next); setCategoryForm({ name: "", icon: "Plug" }); setEditingCategoryId(null); setCategoryFormOpen(false); showNotice(editingCategoryId ? "Đã cập nhật danh mục" : "Đã thêm danh mục mới");
  };
  const editCategory = (item: DashboardCategory) => { setCategoryForm({ name: item.name, icon: item.icon ?? categoryIconFor(item.id) }); setEditingCategoryId(item.id); setCategoryFormOpen(true); };
  const requestDelete = (type: "category" | "content", id: string, label: string, contentType?: ItemType) => setDeleteTarget({ type, id, label, contentType });
  const removeCategory = (id: string) => { const item = categories.find((category) => category.id === id); if (item) requestDelete("category", id, item.name); };
  const saveProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!productForm.title.trim() || !productForm.description.trim()) return;
    const id = editingId ?? crypto.randomUUID(); const current = products.find((old) => old.id === id); const now = new Date().toISOString(); const item = { ...productForm, code: productForm.code.trim(), id, createdAt: current?.createdAt ?? now, updatedAt: now }; const next = editingId ? products.map((old) => old.id === id ? item : old) : [...products, item];
    setProducts(next); writeStoredContent(CONTENT_STORAGE_KEYS.products, next); closeForm(); showNotice(editingId ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm");
  };
  const savePost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!postForm.title.trim() || !postForm.desc.trim()) return;
    const id = editingId ?? crypto.randomUUID(); const current = posts.find((old) => old.id === id); const now = new Date().toISOString(); const item = { ...postForm, id, createdAt: current?.createdAt ?? now, updatedAt: now }; const next = editingId ? posts.map((old) => old.id === id ? item : old) : [...posts, item];
    setPosts(next); writeStoredContent(CONTENT_STORAGE_KEYS.posts, next); closeForm(); showNotice(editingId ? "Đã cập nhật bài viết" : "Đã thêm bài viết");
  };
  const saveService = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!serviceForm.title.trim() || !serviceForm.description.trim()) return;
    const id = editingId ?? crypto.randomUUID(); const current = services.find((old) => old.id === id); const now = new Date().toISOString(); const item = { ...serviceForm, id, num: current?.num ?? String(services.length + 1).padStart(2, "0"), createdAt: current?.createdAt ?? now, updatedAt: now }; const next = editingId ? services.map((old) => old.id === id ? item : old) : [...services, item];
    setServices(next); writeStoredContent(CONTENT_STORAGE_KEYS.services, next); closeForm(); showNotice(editingId ? "Đã cập nhật dịch vụ" : "Đã thêm dịch vụ");
  };
  const readImage = (file: File) => {
    if (file.size > 3 * 1024 * 1024) { showNotice("Ảnh tải lên không được vượt quá 3MB"); return; }
    const reader = new FileReader(); reader.onload = () => setProductForm((old) => ({ ...old, image: String(reader.result ?? "") })); reader.readAsDataURL(file);
  };
  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) readImage(file); event.target.value = ""; };
  const onImagePaste = (event: ClipboardEvent<HTMLDivElement>) => { const item = Array.from(event.clipboardData.items).find((entry) => entry.type.startsWith("image/")); const file = item?.getAsFile(); if (!file) return; event.preventDefault(); readImage(file); showNotice("Đã dán ảnh từ clipboard"); };
  const fetchArticle = async () => {
    if (!postForm.sourceUrl?.trim()) { showNotice("Hãy dán link bài báo trước"); return; }
    setArticleLoading(true);
    try {
      const response = await fetch(`/api/article-preview?url=${encodeURIComponent(postForm.sourceUrl)}`); const data = (await response.json()) as ArticlePreview & { error?: string };
      if (!response.ok) throw new Error(data.error || "Không lấy được thông tin bài báo");
      setArticlePreview(data); setPostForm((old) => ({ ...old, title: data.title || old.title, desc: data.description || old.desc, image: data.image || old.image, sourceUrl: data.url || old.sourceUrl, date: data.publishedAt ? vietnamDateTimeInput(data.publishedAt) : old.date })); showNotice("Đã lấy thông tin bài báo");
    } catch (error) { showNotice(error instanceof Error ? error.message : "Không lấy được thông tin bài báo"); } finally { setArticleLoading(false); }
  };

  const moveItem = (type: ItemType, index: number, direction: number) => {
    if (sortingType !== type) return;
    if (type === "products") { const target = index + direction; if (target < 0 || target >= products.length) return; const next = [...products]; [next[index], next[target]] = [next[target], next[index]]; setProducts(next); }
    if (type === "posts") { const target = index + direction; if (target < 0 || target >= posts.length) return; const next = [...posts]; [next[index], next[target]] = [next[target], next[index]]; setPosts(next); }
    if (type === "services") { const target = index + direction; if (target < 0 || target >= services.length) return; const next = [...services]; [next[index], next[target]] = [next[target], next[index]]; setServices(next); }
    if (type === "categories") { const target = index + direction; if (target < 0 || target >= categories.length) return; const next = [...categories]; [next[index], next[target]] = [next[target], next[index]]; setCategories(next); }
  };
  const reorderItem = (type: ItemType, from: number, to: number) => {
    if (sortingType !== type || from === to || from < 0 || to < 0) return;
    if (type === "products") { const next = [...products]; const [item] = next.splice(from, 1); if (!item) return; next.splice(to, 0, item); setProducts(next); }
    if (type === "posts") { const next = [...posts]; const [item] = next.splice(from, 1); if (!item) return; next.splice(to, 0, item); setPosts(next); }
    if (type === "services") { const next = [...services]; const [item] = next.splice(from, 1); if (!item) return; next.splice(to, 0, item); setServices(next); }
    if (type === "categories") { const next = [...categories]; const [item] = next.splice(from, 1); if (!item) return; next.splice(to, 0, item); setCategories(next); }
  };  const moveProduct = (index: number, target: number) => {
    if (sortingType !== "products") return;
    if (productCategoryFilter === "all") { moveItem("products", index, target - index); return; }
    const categoryItems = products.filter((item) => item.category === productCategoryFilter);
    if (target < 0 || target >= categoryItems.length) return;
    const reordered = [...categoryItems];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const slots = products.map((item, position) => item.category === productCategoryFilter ? position : -1).filter((position) => position >= 0);
    const next = [...products];
    slots.forEach((slot, position) => { next[slot] = reordered[position]; });
    setProducts(next);
  };

  const reorderProduct = (from: number, to: number) => {
    if (sortingType !== "products") return;
    if (productCategoryFilter === "all") { reorderItem("products", from, to); return; }
    const categoryItems = products.filter((item) => item.category === productCategoryFilter);
    if (from === to || !categoryItems[from] || !categoryItems[to]) return;
    const reordered = [...categoryItems];
    const [item] = reordered.splice(from, 1);
    reordered.splice(to, 0, item);
    const slots = products.map((entry, position) => entry.category === productCategoryFilter ? position : -1).filter((position) => position >= 0);
    const next = [...products];
    slots.forEach((slot, position) => { next[slot] = reordered[position]; });
    setProducts(next);
  };

  const applySorting = (type: ItemType) => {
    if (type === "products") writeStoredContent(CONTENT_STORAGE_KEYS.products, products);
    if (type === "posts") writeStoredContent(CONTENT_STORAGE_KEYS.posts, posts);
    if (type === "services") writeStoredContent(CONTENT_STORAGE_KEYS.services, services);
    if (type === "categories") writeStoredContent(CONTENT_STORAGE_KEYS.categories, categories);
    setSortingType(null);
    setDraggedItem(null);
    showNotice("Đã áp dụng thứ tự sắp xếp");
  };

  const sortButton = (type: ItemType) => (
    <button type="button" onClick={() => sortingType === type ? applySorting(type) : setSortingType(type)} className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-colors ${sortingType === type ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-white/10 text-zinc-300  hover:text-white"}`}>
      {sortingType === type ? "Áp dụng" : "Sắp xếp"}
    </button>
  );
  const removeItem = (type: ItemType, id: string) => {
    const item = type === "products" ? products.find((entry) => entry.id === id) : type === "posts" ? posts.find((entry) => entry.id === id) : services.find((entry) => entry.id === id);
    if (item) requestDelete("content", id, item.title, type);
  };
  const confirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "category") { const next = categories.filter((item) => item.id !== deleteTarget.id); setCategories(next); writeStoredContent(CONTENT_STORAGE_KEYS.categories, next); }
    if (deleteTarget.type === "content") {
      if (deleteTarget.contentType === "products") { const next = products.filter((item) => item.id !== deleteTarget.id); setProducts(next); writeStoredContent(CONTENT_STORAGE_KEYS.products, next); }
      if (deleteTarget.contentType === "posts") { const next = posts.filter((item) => item.id !== deleteTarget.id); setPosts(next); writeStoredContent(CONTENT_STORAGE_KEYS.posts, next); }
      if (deleteTarget.contentType === "services") { const next = services.filter((item) => item.id !== deleteTarget.id); setServices(next); writeStoredContent(CONTENT_STORAGE_KEYS.services, next); }
    }
    setDeleteTarget(null); showNotice("Đã xoá nội dung");
  };
  const renderProductForm = () => <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4"><form onSubmit={saveProduct} className="my-4 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#ff5017]/20 bg-[#17171b] p-4 shadow-2xl md:p-5">
    <FormHeading title={editingId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"} onClear={() => setProductForm(emptyProduct)} onClose={closeForm} />
    <div className="grid gap-4">
      <Field label="Mã sản phẩm *"><input className={inputClass} value={productForm.code} onChange={(e) => setProductForm({ ...productForm, code: e.target.value })} placeholder="VD: SP-001" required /></Field><Field label="Tên sản phẩm *"><input className={inputClass} value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} placeholder="Tên sản phẩm" required /></Field>
      <Field label="Danh mục"><div className="relative"><button type="button" onClick={() => setCategoryDropdownOpen((open) => !open)} className={`${inputClass} flex items-center justify-between bg-[#0b0b0d] text-left `}><span>{productForm.categoryName || categories.find((item) => item.id === productForm.category)?.name || "Chọn danh mục"}</span><ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${categoryDropdownOpen ? "rotate-180" : ""}`} /></button>{categoryDropdownOpen && <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-[#17171b] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">{categories.map((item) => <button type="button" key={item.id} onClick={() => { setProductForm({ ...productForm, category: item.id, categoryName: item.name }); setCategoryDropdownOpen(false); }} className={`block w-full rounded-lg px-3 py-3 text-left text-sm ${productForm.category === item.id ? "bg-[#ff5017]/15 text-[#ff5017]" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}>{item.name}</button>)}</div>}</div></Field>
      <Field label="Ảnh sản phẩm" hint="Tải file, Ctrl+V ảnh đã copy hoặc dán URL hình ảnh. Tối đa 3MB."><div onPaste={onImagePaste} tabIndex={0} className="space-y-3 rounded-2xl border border-dashed border-[#ff5017]/30 bg-[#ff5017]/[0.03] p-4 outline-none focus:border-[#ff5017]/70"><input ref={imageInputRef} type="file" accept="image/*" onChange={onImageChange} className="hidden" /><button type="button" onClick={() => imageInputRef.current?.click()} className="flex min-h-20 w-full flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-5 text-sm font-bold text-zinc-300  hover:text-white"><ImagePlus className="h-7 w-7 text-[#ff5017]" /><span>Tải hoặc dán ảnh vào đây</span><span className="text-xs font-normal text-zinc-600">Bấm để tải ảnh hoặc dùng Ctrl+V</span></button><input className={inputClass} type="url" value={productForm.image.startsWith("data:") ? "" : productForm.image} onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} placeholder="Hoặc dán URL: https://..." />{productForm.image && <div className="relative"><img src={productForm.image} alt="Xem trước sản phẩm" className="h-28 w-full rounded-xl object-cover" /><button type="button" onClick={() => setProductForm({ ...productForm, image: "" })} className="absolute right-2 top-2 rounded-lg bg-black/70 px-3 py-2 text-xs text-white hover:bg-red-500">Xoá ảnh</button></div>}</div></Field>
      <Field label="Mô tả ngắn *"><textarea className={`${inputClass} min-h-24 resize-y`} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Mô tả sản phẩm" required /></Field>
      <Field label="Thông số kỹ thuật"><textarea className={`${inputClass} min-h-24 resize-y`} value={productForm.spec} onChange={(e) => setProductForm({ ...productForm, spec: e.target.value })} placeholder="Công suất, điện áp, thương hiệu..." /></Field>
    </div>
    <div className="mt-5 flex justify-end"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#ff5017] px-5 py-3 text-sm font-bold text-white hover:bg-orange-700"><Save className="h-4 w-4" />{editingId ? "Cập nhật sản phẩm" : "Lưu sản phẩm"}</button></div>
  </form></div>;

  const renderPostForm = () => <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4"><form onSubmit={savePost} className="my-4 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#ff5017]/20 bg-[#17171b] p-4 shadow-2xl md:p-5">
    <FormHeading title={editingId ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"} onClear={() => { setPostForm({ ...emptyPost, date: vietnamDateTimeInput(new Date()) }); setArticlePreview(null); }} onClose={closeForm} />
    <div className="grid gap-4"><div className="md:col-span-2"><Field label="Link bài báo" hint="Dán link rồi bấm lấy thông tin để tự điền tiêu đề, mô tả và thumbnail/header."><div className="flex gap-3"><div className="relative flex-1"><Link2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" /><input className={`${inputClass} pl-11`} type="url" value={postForm.sourceUrl || ""} onChange={(e) => setPostForm({ ...postForm, sourceUrl: e.target.value })} placeholder="https://..." /></div><button type="button" onClick={fetchArticle} disabled={articleLoading} className="inline-flex items-center gap-2 rounded-xl border border-[#ff5017]/40 px-4 text-xs font-bold text-[#ff5017] disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${articleLoading ? "animate-spin" : ""}`} />{articleLoading ? "Đang lấy" : "Lấy thông tin"}</button></div></Field></div>{articlePreview && <div className="md:col-span-2 flex gap-4 rounded-xl border border-[#ff5017]/20 p-4"><img src={articlePreview.image || "/truong_hero.png"} alt="Thumbnail" className="h-20 w-32 rounded-lg object-cover" /><div className="min-w-0"><p className="text-xs font-bold text-[#ff5017]">Xem trước bài báo</p><p className="mt-1 truncate text-sm font-bold">{articlePreview.title}</p></div></div>}<Field label="Tiêu đề bài viết *"><input className={inputClass} value={postForm.title} onChange={(e) => setPostForm({ ...postForm, title: e.target.value })} required /></Field><Field label="Chuyên mục"><input className={inputClass} value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} /></Field><Field label="Ngày đăng"><input className={inputClass} type="datetime-local" value={postForm.date} onChange={(e) => setPostForm({ ...postForm, date: e.target.value })} required /></Field><Field label="Ảnh đại diện"><input className={inputClass} type="url" value={postForm.image} onChange={(e) => setPostForm({ ...postForm, image: e.target.value })} placeholder="https://..." /></Field><Field label="Mô tả bài viết *"><textarea className={`${inputClass} min-h-32 resize-y`} value={postForm.desc} onChange={(e) => setPostForm({ ...postForm, desc: e.target.value })} required /></Field></div>
    <div className="mt-5 flex justify-end"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#ff5017] px-5 py-3 text-sm font-bold text-white hover:bg-orange-700"><Save className="h-4 w-4" />{editingId ? "Cập nhật bài viết" : "Lưu bài viết"}</button></div>
  </form></div>;

  const renderServiceForm = () => <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4"><form onSubmit={saveService} className="my-4 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#ff5017]/20 bg-[#17171b] p-4 shadow-2xl md:p-5"><FormHeading title={editingId ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"} onClear={() => setServiceForm(emptyService)} onClose={closeForm} /><div className="grid gap-4"><Field label="Tên dịch vụ *"><input className={inputClass} value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required /></Field><Field label="Icon dịch vụ"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{serviceIconOptions.map(({ name, label, Icon }) => <button type="button" key={name} onClick={() => setServiceForm({ ...serviceForm, icon: name })} className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition-colors ${serviceForm.icon === name ? "border-[#ff5017] bg-[#ff5017]/10 text-[#ff5017]" : "border-white/10 text-zinc-400  hover:text-white"}`}><Icon className="h-5 w-5" /><span>{label}</span></button>)}</div></Field><Field label="Mô tả ngắn *"><textarea className={`${inputClass} min-h-24 resize-y`} value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required /></Field><Field label="Thông tin chi tiết"><textarea className={`${inputClass} min-h-24 resize-y`} value={serviceForm.detail} onChange={(e) => setServiceForm({ ...serviceForm, detail: e.target.value })} /></Field></div><div className="mt-5 flex justify-end"><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-[#ff5017] px-5 py-3 text-sm font-bold text-white hover:bg-orange-700"><Save className="h-4 w-4" />{editingId ? "Cập nhật dịch vụ" : "Lưu dịch vụ"}</button></div></form></div>;
  const productList = (compact = false) => {
    const query = normalizeSearch(productQuery);
    const filteredProducts = products.map((item) => ({ item, score: fuzzySearchScore(query, [{ value: item.code ?? "", weight: 3 }, { value: item.title, weight: 3 }, { value: item.categoryName, weight: 2 }, { value: item.description, weight: 1 }, { value: item.spec, weight: 1 }]) })).filter(({ item, score }) => (!query || score > 0) && (productCategoryFilter === "all" || item.category === productCategoryFilter)).sort((a, b) => b.score - a.score).map(({ item }) => item);
    const visibleProducts = compact ? filteredProducts.slice(0, 10) : filteredProducts;
    return <section className={`rounded-2xl border border-white/5 bg-[#1a1a1e] p-5 ${compact ? "" : "mt-6"}`}><div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-lg font-black">Quản lý sản phẩm ({filteredProducts.length}{filteredProducts.length !== products.length ? `/${products.length}` : ""})</h2><p className="mt-1 text-xs text-zinc-600">Tìm kiếm, sắp xếp, chỉnh sửa hoặc xoá sản phẩm.</p></div><div className="flex items-center gap-2">{sortButton("products")}<button type="button" onClick={() => openProductForm()} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5017] px-4 py-2.5 text-xs font-bold hover:bg-orange-700"><Plus className="h-4 w-4" /> Thêm sản phẩm</button></div></div>{!compact && <div className="mb-5 flex flex-col gap-3 rounded-xl border border-white/10 bg-zinc-950/50 p-3 md:flex-row"><input className={`${inputClass} flex-1`} value={productQuery} onChange={(event) => setProductQuery(event.target.value)} placeholder="Tìm theo mã, tên sản phẩm..." /><div className="relative md:w-64"><button type="button" onClick={() => setProductFilterOpen((open) => !open)} className={`${inputClass} flex items-center justify-between bg-[#0b0b0d] text-left `}><span>{productCategoryFilter === "all" ? "Tất cả danh mục" : categories.find((item) => item.id === productCategoryFilter)?.name}</span><ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${productFilterOpen ? "rotate-180" : ""}`} /></button>{productFilterOpen && <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-[#17171b] p-1 shadow-[0_18px_45px_rgba(0,0,0,0.55)]"><button type="button" onClick={() => { setProductCategoryFilter("all"); setProductFilterOpen(false); }} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm ${productCategoryFilter === "all" ? "bg-[#ff5017]/15 text-[#ff5017]" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}>Tất cả danh mục</button>{categories.map((item) => <button type="button" key={item.id} onClick={() => { setProductCategoryFilter(item.id); setProductFilterOpen(false); }} className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm ${productCategoryFilter === item.id ? "bg-[#ff5017]/15 text-[#ff5017]" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}>{item.name}</button>)}</div>}</div></div>}{(visibleProducts.length === 0 ? <Empty text={products.length === 0 ? "Chưa có sản phẩm." : "Không tìm thấy sản phẩm phù hợp."} /> : <div className="space-y-3">{visibleProducts.map((item, index) => <ContentRow key={item.id} title={item.title} meta={`${item.code ? `${item.code} · ` : ""}${item.categoryName}`} image={item.image} index={index} total={visibleProducts.length} sorting={sortingType === "products"} dragging={draggedItem?.type === "products" && draggedItem.index === index} dragOver={dragOverItem?.type === "products" && dragOverItem.index === index} onMove={(target) => moveProduct(index, target)} onEdit={() => editProduct(item)} onRemove={() => removeItem("products", item.id)} onDragStart={() => setDraggedItem({ type: "products", index })} onDragEnter={() => setDragOverItem({ type: "products", index })} onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }} onDrop={() => { if (draggedItem?.type === "products") reorderProduct(draggedItem.index, index); setDraggedItem(null); }} />)}</div>)}</section>;
  };
  const postList = (compact = false) => {
    const query = normalizeSearch(postQuery);
    const rankedPosts = query
      ? [...posts]
          .map((item) => ({ item, score: scorePost(item, query) }))
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .map(({ item }) => item)
      : posts;
    const visiblePosts = compact ? rankedPosts.slice(0, 10) : rankedPosts;
    return <section className={`rounded-2xl border border-white/5 bg-[#1a1a1e] p-5 ${compact ? "" : "mt-6"}`}><div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-lg font-black">Quản lý bài viết ({visiblePosts.length}{visiblePosts.length !== posts.length ? `/${posts.length}` : ""})</h2><p className="mt-1 text-xs text-zinc-600">Tìm kiếm, chỉnh sửa hoặc xoá bài viết.</p></div><div className="flex items-center gap-2"><button type="button" onClick={openPostForm} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5017] px-4 py-2.5 text-xs font-bold hover:bg-orange-700"><Plus className="h-4 w-4" /> Thêm bài viết</button></div></div>{!compact && <div className="relative mb-5"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" /><input className={`${inputClass} pl-11`} value={postQuery} onChange={(event) => setPostQuery(event.target.value)} placeholder="Tìm theo tiêu đề, chuyên mục, nội dung hoặc link..." /></div>}{(visiblePosts.length === 0 ? <Empty text={posts.length === 0 ? "Chưa có bài viết." : "Không tìm thấy bài viết phù hợp."} /> : <div className="space-y-3">{visiblePosts.map((item, index) => <ContentRow key={item.id} title={item.title} meta={`${item.category} · ${formatVietnamDateTime(item.date)}`} image={item.image} index={index} total={visiblePosts.length} sorting={false} onMove={(target) => moveItem("posts", index, target - index)} onEdit={() => editPost(item)} onRemove={() => removeItem("posts", item.id)} onDragStart={() => setDraggedItem({ type: "posts", index })} onDragEnter={() => setDragOverItem({ type: "posts", index })} onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }} onDrop={() => { if (draggedItem?.type === "posts") reorderItem("posts", draggedItem.index, index); setDraggedItem(null); }} />)}</div>)}</section>;
  };
  const serviceList = (compact = false) => {
    const query = sortingType === "services" ? "" : normalizeSearch(serviceQuery);
    const rankedServices = services.map((item) => ({ item, score: fuzzySearchScore(query, [{ value: item.title, weight: 3 }, { value: item.description, weight: 2 }, { value: item.detail, weight: 1 }, { value: item.icon ?? "", weight: 1 }]) })).filter(({ score }) => !query || score > 0).sort((a, b) => b.score - a.score).map(({ item }) => item);
    const visibleServices = compact ? rankedServices.slice(0, 10) : rankedServices;
    return <section className={`rounded-2xl border border-white/5 bg-[#1a1a1e] p-5 ${compact ? "" : "mt-6"}`}><div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4"><div><h2 className="text-lg font-black">Quản lý dịch vụ ({visibleServices.length}{visibleServices.length !== services.length ? `/${services.length}` : ""})</h2><p className="mt-1 text-xs text-zinc-600">Tìm kiếm, sắp xếp, chỉnh sửa hoặc xoá dịch vụ.</p></div><div className="flex items-center gap-2">{sortButton("services")}<button type="button" onClick={openServiceForm} className="inline-flex items-center gap-2 rounded-xl bg-[#ff5017] px-4 py-2.5 text-xs font-bold hover:bg-orange-700"><Plus className="h-4 w-4" /> Thêm dịch vụ</button></div></div>{!compact && <div className="relative mb-5"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" /><input className={`${inputClass} pl-11`} value={serviceQuery} onChange={(event) => setServiceQuery(event.target.value)} placeholder="Tìm theo tên, mô tả hoặc thông tin dịch vụ..." /></div>}{(visibleServices.length === 0 ? <Empty text={services.length === 0 ? "Chưa có dịch vụ." : "Không tìm thấy dịch vụ phù hợp."} /> : <div className="space-y-3">{visibleServices.map((item, index) => <ContentRow key={item.id} title={item.title} meta={item.description} iconName={item.icon} index={index} total={visibleServices.length} sorting={sortingType === "services"} dragging={draggedItem?.type === "services" && draggedItem.index === index} dragOver={dragOverItem?.type === "services" && dragOverItem.index === index} onMove={(target) => moveItem("services", index, target - index)} onEdit={() => editService(item)} onRemove={() => removeItem("services", item.id)} onDragStart={() => setDraggedItem({ type: "services", index })} onDragEnter={() => setDragOverItem({ type: "services", index })} onDragEnd={() => { setDraggedItem(null); setDragOverItem(null); }} onDrop={() => { if (draggedItem?.type === "services") reorderItem("services", draggedItem.index, index); setDraggedItem(null); }} />)}</div>)}</section>;
  };
  const categoryManager = () => <section className="mt-6 rounded-2xl border border-white/5 bg-[#1a1a1e] p-5">
    <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
      <div>
        <h2 className="text-lg font-black">Quản lý danh mục ({categories.length})</h2>
        <p className="mt-1 text-xs text-zinc-600">Thêm, chỉnh sửa hoặc xoá danh mục sản phẩm.</p>
      </div>
      <div className="flex items-center gap-2">
        {sortButton("categories")}
        <button type="button" onClick={() => { setEditingCategoryId(null); setCategoryForm({ name: "", icon: "Plug" }); setCategoryFormOpen(true); }} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ff5017] px-4 py-2.5 text-xs font-bold text-white hover:bg-orange-700">
          <Plus className="h-4 w-4" /> Thêm danh mục
        </button>
      </div>
    </div>
    {categoryFormOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"><div className="w-full max-w-lg rounded-2xl border border-[#ff5017]/20 bg-[#17171b] p-4 shadow-2xl md:p-5"><FormHeading title={editingCategoryId ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"} onClear={() => setCategoryForm({ name: "", icon: "Plug" })} onClose={() => setCategoryFormOpen(false)} /><div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4"><p className="col-span-full text-xs font-bold uppercase tracking-wider text-zinc-500">Biểu tượng danh mục</p>{categoryIconOptions.map(({ name, label, Icon }) => <button type="button" key={name} onClick={() => setCategoryForm({ ...categoryForm, icon: name })} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-bold text-zinc-400 hover:border-[#ff5017] hover:text-white"><Icon className="h-4 w-4" /><span>{label}</span></button>)}</div><input autoFocus className={inputClass} value={categoryForm.name} onChange={(e) => setCategoryForm({ name: e.target.value, icon: categoryForm.icon })} placeholder="Tên danh mục" /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setCategoryFormOpen(false)} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-zinc-400 hover:text-white">Huỷ</button><button type="button" onClick={addCategory} className="rounded-xl bg-[#ff5017] px-5 py-3 text-sm font-bold text-white hover:bg-orange-700">{editingCategoryId ? "Cập nhật" : "Lưu danh mục"}</button></div></div></div>}
    {categories.length === 0 ? <Empty text="Chưa có danh mục." /> : <div className="space-y-3">{categories.map((item, index) => <div key={item.id} draggable={sortingType === "categories"} onDragStart={sortingType === "categories" ? () => setDraggedItem({ type: "categories", index }) : undefined} onDragEnter={sortingType === "categories" ? () => setDragOverItem({ type: "categories", index }) : undefined} onDragEnd={sortingType === "categories" ? () => { setDraggedItem(null); setDragOverItem(null); } : undefined} onDragOver={sortingType === "categories" ? (event) => event.preventDefault() : undefined} onDrop={sortingType === "categories" ? () => { if (draggedItem?.type === "categories") reorderItem("categories", draggedItem.index, index); setDraggedItem(null); setDragOverItem(null); } : undefined} className={`flex items-center gap-3 rounded-xl border p-3 transition-[transform,opacity,box-shadow,background-color] duration-200 ${draggedItem?.type === "categories" && draggedItem.index === index ? "scale-[0.98] opacity-40" : ""} ${dragOverItem?.type === "categories" && dragOverItem.index === index ? "border-[#ff5017]/60 bg-[#ff5017]/10 shadow-[0_0_0_2px_rgba(255,80,23,0.12)]" : "border-white/5 bg-zinc-950/35"} ${sortingType === "categories" ? "cursor-grab active:cursor-grabbing" : ""}`}>
      {sortingType === "categories" && <GripVertical className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />}<span className="w-7 text-center text-xs font-black text-[#ff5017]">{String(index + 1).padStart(2, "0")}</span>
      <div className="flex min-w-0 flex-1 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff5017]/10 text-[#ff5017]">{(() => { const Icon = categoryIconComponent(item.icon ?? categoryIconFor(item.id)); return <Icon className="h-5 w-5" />; })()}</div><p className="truncate text-sm font-bold text-white">{item.name}</p></div>
      <div className="flex shrink-0 items-center gap-1">{sortingType === "categories" && <><button type="button" onClick={() => moveItem("categories", index, -1)} disabled={index === 0} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label="Đưa lên"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => moveItem("categories", index, 1)} disabled={index === categories.length - 1} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label="Đưa xuống"><ArrowDown className="h-4 w-4" /></button></>}<button type="button" onClick={() => editCategory(item)} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white" title="Chỉnh sửa" aria-label="Chỉnh sửa"><Edit3 className="h-4 w-4" /></button><button type="button" onClick={() => removeCategory(item.id)} className="rounded-lg p-2 text-zinc-500 hover:bg-white/5 hover:text-red-400" title="Xoá" aria-label="Xoá"><Trash2 className="h-4 w-4" /></button></div>
    </div>)}</div>}
  </section>;
  const recentLog = () => {
    const records = [...products.map((item) => ({ id: `product-${item.id}`, title: item.title, type: "Sản phẩm", image: item.image, date: item.updatedAt ?? item.createdAt ?? "" })), ...posts.map((item) => ({ id: `post-${item.id}`, title: item.title, type: "Bài viết", image: item.image, date: item.updatedAt ?? item.date }))].sort((a, b) => postDateSortValue(b.date) - postDateSortValue(a.date)).slice(0, 10);
    return <section className="overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a1e]"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><h3 className="text-base font-black">📋 Hoạt động gần đây</h3><span className="text-xs text-zinc-500">Tối đa 10 bản ghi</span></div>{records.length === 0 ? <Empty text="Chưa có hoạt động gần đây." /> : <div className="divide-y divide-white/5">{records.map((item, index) => <div key={item.id} className="flex items-center gap-4 px-5 py-4"><span className="w-6 text-xs font-black text-[#ff5017]">{String(index + 1).padStart(2, "0")}</span>{item.image ? <img src={item.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" /> : <div className="h-12 w-16 shrink-0 rounded-lg bg-zinc-900" />}<div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{item.title}</p><p className="mt-1 text-xs text-zinc-500">{item.type}</p></div><time className="shrink-0 text-xs text-zinc-400">{item.date ? formatVietnamDateTime(item.date) : "Chưa có thời gian"}</time></div>)}</div>}</section>;
  };
  const quickActions = () => <div className="mb-6 rounded-2xl border border-white/5 bg-[#1a1a1e] p-4"><p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">Thao tác nhanh</p><div className="flex flex-nowrap gap-3 overflow-x-auto"><button type="button" onClick={() => openProductForm()} className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ff5017] px-4 py-3 text-xs font-bold text-white hover:bg-orange-700"><Plus className="h-4 w-4" /> Thêm sản phẩm</button><button type="button" onClick={() => { setSection("categories"); setEditingCategoryId(null); setCategoryForm({ name: "", icon: "Plug" }); setCategoryFormOpen(true); }} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-zinc-300  hover:text-white"><FolderPlus className="h-4 w-4 text-[#ff5017]" /> Thêm danh mục</button><button type="button" onClick={openPostForm} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-zinc-300  hover:text-white"><Newspaper className="h-4 w-4 text-[#ff5017]" /> Thêm bài viết</button><button type="button" onClick={openServiceForm} className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-zinc-300  hover:text-white"><Wrench className="h-4 w-4 text-[#ff5017]" /> Thêm dịch vụ</button><Link href="/" className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-zinc-300  hover:text-white">Xem trang chủ</Link></div></div>;
  const allOverview = () => <><h2 className="mb-1 text-2xl font-black">Dashboard Overview</h2><p className="mb-6 text-sm text-zinc-500">Tổng quan nội dung đang quản lý.</p>{quickActions()}<div className="grid gap-4 sm:grid-cols-3"><Summary label="Sản phẩm" value={products.length} icon={ShoppingBag} onClick={() => setSection("products")} /><Summary label="Bài viết" value={posts.length} icon={Newspaper} onClick={() => setSection("posts")} /><Summary label="Dịch vụ" value={services.length} icon={Wrench} onClick={() => setSection("services")} /></div><div className="mt-8">{recentLog()}</div></>;  const content = section === "overview" ? allOverview() : section === "categories" ? categoryManager() : section === "products" ? <>{formOpen && renderProductForm()}{productList()}</> : section === "posts" ? <>{formOpen && renderPostForm()}{postList()}</> : <>{formOpen && renderServiceForm()}{serviceList()}</>;
  return <div className="min-h-screen bg-[#0f0f12] text-white">
    <aside className={`fixed inset-y-0 left-0 z-20 hidden border-r border-white/5 bg-[#151518] lg:block ${sidebarCollapsed ? "w-20 p-3" : "w-64 p-6"}`}>
      <button type="button" onClick={() => setSidebarCollapsed((collapsed) => !collapsed)} className="absolute right-0 top-1/2 flex h-9 w-9 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-lg border border-white/10 bg-[#1a1a1e] text-zinc-400 transition-colors hover:text-white" aria-label={sidebarCollapsed ? "Mở rộng thanh điều hướng" : "Thu gọn thanh điều hướng"}>
        <ChevronLeft className={`h-4 w-4 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
      </button><Link href="/" className={`mb-12 flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""}`}><img src="/truong_logo_cropped.png?v=3" alt="Truong Nguyen" className={`brightness-0 invert ${sidebarCollapsed ? "h-8 w-8 object-cover object-left" : "h-10 w-auto"}`} />{!sidebarCollapsed && <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Admin</span>}</Link>{!sidebarCollapsed && <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Quản lý nội dung</p>}<nav className="space-y-1">{navItems.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setSection(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${sidebarCollapsed ? "justify-center px-2" : ""} ${section === id ? "bg-[#ff5017] text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"}`}><Icon className="h-4 w-4" />{!sidebarCollapsed && label}</button>)}</nav><Link href="/" className={`absolute bottom-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-[#ff5017] ${sidebarCollapsed ? "left-0 w-full justify-center" : "left-6"}`}><ArrowLeft className="h-4 w-4" />{!sidebarCollapsed && " Về trang chủ"}</Link></aside>
    <main className={sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"}><div className="mx-auto max-w-7xl px-5 py-8 md:px-10"><div className="mb-6 flex flex-col gap-2 lg:hidden">{navItems.map(({ id, label }) => <button key={id} type="button" onClick={() => setSection(id)} className={`w-full rounded-lg px-3 py-2 text-left text-xs font-bold ${section === id ? "bg-[#ff5017] text-white" : "bg-white/5 text-zinc-400"}`}>{label}</button>)}</div>{notice && <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"><Check className="h-4 w-4" />{notice}</div>}{content}</div></main>
    {deleteTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1e] p-6 shadow-2xl"><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400"><Trash2 className="h-5 w-5" /></div><div><h2 className="text-xl font-black text-white">Xác nhận xoá</h2><p className="mt-2 text-sm leading-relaxed text-zinc-400">Bạn có chắc muốn xoá <span className="font-bold text-white">{deleteTarget.label}</span> không? Hành động này không thể hoàn tác.</p></div></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-zinc-400 hover:text-white">Huỷ</button><button type="button" onClick={confirmDelete} className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600">Xoá</button></div></div></div>}
  </div>;
}

function FormHeading({ title, onClose, onClear }: { title: string; onClose: () => void; onClear?: () => void }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return <>
    <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#ff5017]">Biểu mẫu nội dung</p>
        <h2 className="mt-1 text-xl font-black">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        {onClear && <button type="button" onClick={() => setConfirmOpen(true)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-500/[0.06] px-3 py-2 text-xs font-bold text-red-300 transition-colors hover:border-red-400/40 hover:bg-red-500/15 hover:text-red-200"><Trash2 className="h-3.5 w-3.5" />Xoá toàn bộ</button>}
        <button type="button" onClick={onClose} className="rounded-xl p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-white" aria-label="Đóng"><X className="h-5 w-5" /></button>
      </div>
    </div>

    {confirmOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-labelledby="clear-confirm-title" className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1b1b1f] p-6 shadow-[0_24px_80px_rgba(0,0,0,.65)]">
        <div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400"><Trash2 className="h-6 w-6" /></div><h3 id="clear-confirm-title" className="text-lg font-black text-white">Xoá toàn bộ nội dung?</h3></div>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Tất cả dữ liệu bạn vừa nhập trong biểu mẫu sẽ bị xoá và không thể hoàn tác.</p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={() => setConfirmOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white">Huỷ</button>
          <button type="button" onClick={() => { onClear?.(); setConfirmOpen(false); }} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-600"><Trash2 className="h-4 w-4" />Xoá toàn bộ</button>
        </div>
      </div>
    </div>}
  </>;
}
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-white/10 py-10 text-center text-sm text-zinc-500">{text}</div>; }
function Summary({ label, value, icon: Icon, onClick }: { label: string; value: number; icon: typeof ShoppingBag; onClick: () => void }) { return <button type="button" onClick={onClick} className="rounded-2xl border border-white/5 bg-[#1a1a1e] p-5 text-left "><div className="mb-5 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</span><Icon className="h-5 w-5 text-[#ff5017]" /></div><span className="text-3xl font-black">{value}</span><span className="mt-1 block text-xs text-zinc-600">mục đang quản lý</span></button>; }
function ContentRow({ title, meta, image, iconName, index, total, sorting, onMove, onEdit, onRemove, onDragStart, onDragEnter, onDragEnd, onDrop, dragging, dragOver }: { title: string; meta: string; image?: string; iconName?: string; index: number; total: number; sorting: boolean; onMove: (target: number) => void; onEdit: () => void; onRemove: () => void; onDragStart: () => void; onDragEnter?: () => void; onDragEnd?: () => void; onDrop: () => void; dragging?: boolean; dragOver?: boolean }) {
  const Icon = iconName ? serviceIconOptions.find(({ name }) => name === iconName)?.Icon ?? Wrench : null;
  return <div draggable={sorting} onDragStart={sorting ? onDragStart : undefined} onDragEnter={sorting ? onDragEnter : undefined} onDragEnd={sorting ? onDragEnd : undefined} onDragOver={sorting ? (event) => event.preventDefault() : undefined} onDrop={sorting ? onDrop : undefined} className={`flex items-center gap-3 rounded-xl border p-3 transition-[transform,opacity,box-shadow,background-color] duration-200 ${dragging ? "scale-[0.98] opacity-40" : ""} ${dragOver ? "border-[#ff5017]/60 bg-[#ff5017]/10 shadow-[0_0_0_2px_rgba(255,80,23,0.12)]" : "border-white/5 bg-zinc-950/35"} ${sorting ? "cursor-grab active:cursor-grabbing" : ""}`}>{sorting && <GripVertical className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />}<span className="w-7 text-center text-xs font-black text-[#ff5017]">{String(index + 1).padStart(2, "0")}</span>{Icon ? <div className="-ml-2 -mr-1 flex h-14 w-8 shrink-0 items-center justify-center text-[#ff5017]"><Icon className="h-5 w-5" /></div> : image ? <img src={image} alt="" className="h-14 w-20 rounded-lg object-cover" /> : <div className="h-14 w-20 rounded-lg bg-zinc-900" />}<div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{title}</p><p className="mt-1 truncate text-xs text-zinc-500">{meta}</p></div><div className="flex shrink-0 items-center gap-1">{sorting && <><button type="button" onClick={() => onMove(index - 1)} disabled={index === 0} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label="Đưa lên"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => onMove(index + 1)} disabled={index === total - 1} className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30" aria-label="Đưa xuống"><ArrowDown className="h-4 w-4" /></button></>}<button type="button" onClick={onEdit} className="rounded-lg p-2 text-zinc-400 hover:text-white" aria-label="Chỉnh sửa"><Edit3 className="h-4 w-4" /></button><button type="button" onClick={onRemove} className="rounded-lg p-2 text-zinc-500 hover:text-red-400" aria-label="Xoá"><Trash2 className="h-4 w-4" /></button></div></div>;
}
