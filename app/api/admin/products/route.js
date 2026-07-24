import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { query } from "@/lib/db";

function checkAdmin() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

// GET /api/admin/products — list every product (admin only)
export async function GET() {
  if (!checkAdmin()) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const rows = await query("SELECT * FROM products ORDER BY created_at DESC");
  return NextResponse.json({ products: rows });
}

// POST /api/admin/products — create a new product (admin only)
export async function POST(req) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      id,
      slug,
      name,
      collection,
      price,
      compareAtPrice,
      description,
      howToUse,
      additionalInfo,
      images,
      sizes,
      stock,
      rating,
      metaContentId,
    } = body;

    if (!id || !slug || !name || !price) {
      return NextResponse.json(
        { error: "id, slug, name, and price are required." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO products
        (id, slug, name, collection_slug, price, compare_at_price, description,
         how_to_use, additional_info, images, sizes, stock, rating, meta_content_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        slug,
        name,
        collection || null,
        price,
        compareAtPrice ?? null,
        description || "",
        howToUse || "",
        JSON.stringify(additionalInfo || {}),
        JSON.stringify(images || []),
        JSON.stringify(sizes || []),
        stock ?? 0,
        rating ?? 0,
        metaContentId || null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Create product failed:", err);
    const message = err.code === "ER_DUP_ENTRY"
      ? "A product with that ID or slug already exists."
      : "Could not create product.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
