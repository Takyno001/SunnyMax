import { readAllDatabaseContent, writeDatabaseContent, type ContentType } from "../../lib/database";

const allowedTypes: ContentType[] = ["products", "posts", "services", "categories"];

export async function GET() {
  return Response.json(readAllDatabaseContent());
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { type?: ContentType; items?: unknown };
    if (!body.type || !allowedTypes.includes(body.type) || !Array.isArray(body.items)) {
      return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
    }
    writeDatabaseContent(body.type, body.items);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Không thể lưu dữ liệu." }, { status: 500 });
  }
}