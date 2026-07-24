import Link from "next/link";
import { requireAdminSession } from "@/lib/adminAuth";
import { getAllProducts, formatPrice } from "@/data/products";
import AdminNav from "@/components/admin/AdminNav";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  requireAdminSession();

  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-10">
      <div className="container-x">
        <AdminNav active="Products" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl">Products</h1>
            <p className="text-sm text-charcoal/60">{products.length} total</p>
          </div>
          <Link href="/admin/products/new" className="btn-primary">
            + Add Product
          </Link>
        </div>

        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="border border-black/10 bg-white p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {p.images?.[0] && (
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-14 h-14 object-cover border border-black/10"
                  />
                )}
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-charcoal/50">
                    {p.slug} · {formatPrice(p.price)} · Stock: {p.stock}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <Link
                  href={`/product/${p.slug}`}
                  target="_blank"
                  className="text-xs underline text-charcoal/60"
                >
                  View live
                </Link>
                <Link
                  href={`/admin/products/${p.slug}/edit`}
                  className="text-xs uppercase tracking-widest2 border border-charcoal px-3 py-2"
                >
                  Edit
                </Link>
                <DeleteProductButton slug={p.slug} name={p.name} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
