import { notFound } from "next/navigation";
import { requireAdminSession } from "@/lib/adminAuth";
import { query } from "@/lib/db";
import AdminNav from "@/components/admin/AdminNav";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  requireAdminSession();

  const rows = await query("SELECT * FROM products WHERE slug = ?", [params.slug]);
  if (!rows[0]) notFound();

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-10">
      <div className="container-x">
        <AdminNav active="Products" />
        <h1 className="text-2xl mb-8">Edit Product — {rows[0].name}</h1>
        <ProductForm mode="edit" initial={rows[0]} />
      </div>
    </div>
  );
}
