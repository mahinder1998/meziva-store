import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isValidSessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { query } from "@/lib/db";

function checkAdmin() {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return isValidSessionToken(token);
}

// GET /api/admin/products/[slug] — fetch one product (to prefill the edit form)
export async function GET(req, { params }) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const rows = await query("SELECT * FROM products WHERE slug = ?", [params.slug]);
  if (!rows[0]) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
  return NextResponse.json({ product: rows[0] });
}

// PUT /api/admin/products/[slug] — update a product
export async function PUT(req, { params }) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
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

    const result = await query(
      `UPDATE products SET
         name = ?, collection_slug = ?, price = ?, compare_at_price = ?,
         description = ?, how_to_use = ?, additional_info = ?, images = ?,
         sizes = ?, stock = ?, rating = ?, meta_content_id = ?
       WHERE slug = ?`,
      [
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
        params.slug,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Update product failed:", err);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
  }
}

// DELETE /api/admin/products/[slug] — delete a product (and its reviews)
export async function DELETE(req, { params }) {
  if (!checkAdmin()) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    await query("DELETE FROM reviews WHERE product_slug = ?", [params.slug]);
    const result = await query("DELETE FROM products WHERE slug = ?", [params.slug]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete product failed:", err);
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}
