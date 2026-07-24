import { requireAdminSession } from "@/lib/adminAuth";
import AdminNav from "@/components/admin/AdminNav";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  requireAdminSession();

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-10">
      <div className="container-x">
        <AdminNav active="Products" />
        <h1 className="text-2xl mb-8">Add Product</h1>
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
