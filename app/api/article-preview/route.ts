const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

function getAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`${attribute}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? decodeHtml(match[1].trim()) : "";
}

function getMeta(html: string, key: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find((item) => {
    const property = getAttribute(item, "property");
    const name = getAttribute(item, "name");
    return property.toLowerCase() === key || name.toLowerCase() === key;
  });
  return tag ? getAttribute(tag, "content") : "";
}

function absoluteUrl(value: string, baseUrl: string) {
  if (!value) return "";
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")?.trim();
  if (!url) return Response.json({ error: "Thiếu link bài viết." }, { status: 400 });

  let articleUrl: URL;
  try {
    articleUrl = new URL(url);
    if (!["http:", "https:"].includes(articleUrl.protocol)) throw new Error("Invalid protocol");
  } catch {
    return Response.json({ error: "Link bài viết không hợp lệ." }, { status: 400 });
  }

  try {
    const response = await fetch(articleUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; TruongNguyenCMS/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const html = await response.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = getMeta(html, "og:title") || getMeta(html, "twitter:title") || (titleMatch ? decodeHtml(titleMatch[1].trim()) : "");
    const description = getMeta(html, "og:description") || getMeta(html, "description") || getMeta(html, "twitter:description");
    const image = absoluteUrl(getMeta(html, "og:image") || getMeta(html, "twitter:image"), articleUrl.toString());
    const publishedAt = getMeta(html, "article:published_time") || getMeta(html, "datepublished") || getMeta(html, "publishdate") || getMeta(html, "date") || html.match(/"datePublished"\s*:\s*"([^"]+)"/i)?.[1] || "";

    if (!title && !description && !image) {
      return Response.json({ error: "Không tìm thấy metadata đại diện trên trang này." }, { status: 422 });
    }

    return Response.json({ title, description, image, publishedAt, url: articleUrl.toString() });
  } catch {
    return Response.json({ error: "Không thể đọc link bài viết. Hãy kiểm tra link hoặc nhập thủ công." }, { status: 502 });
  }
}