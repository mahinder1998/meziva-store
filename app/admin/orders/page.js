import { requireAdminSession } from "@/lib/adminAuth";
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/data/products";
import LogoutButton from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic"; // always read the latest orders.json, never cache

export default async function AdminOrdersPage() {
  requireAdminSession();

  const orders = (await getAllOrders()).slice().reverse(); // newest first

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-10">
      <div className="container-x">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl">Orders</h1>
            <p className="text-sm text-charcoal/60">{orders.length} total</p>
          </div>
          <LogoutButton />
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-charcoal/60">
            No orders yet — new orders will show up here as soon as customers
            check out.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-black/10 bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-6 mb-4 pb-4 border-b border-black/10">
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest2">
                      Order
                    </p>
                    <p className="text-lg font-semibold">
                      #{order.orderNumber || "—"}
                    </p>
                    <p className="text-xs text-charcoal/40 font-mono break-all">
                      {order.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest2">
                      Placed
                    </p>
                    <p className="text-sm">
                      {new Date(order.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest2">
                      Payment
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      {order.paymentMethod}
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          order.status === "paid"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest2">
                      Shiprocket
                    </p>
                    {order.shiprocket?.synced ? (
                      <p className="text-sm text-emerald-700">Synced</p>
                    ) : (
                      <p
                        className="text-sm text-red-600"
                        title={order.shiprocket?.error || ""}
                      >
                        Not synced
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest2">
                      Total
                    </p>
                    <p className="text-lg font-semibold">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest2 mb-1">
                      Customer
                    </p>
                    <p className="text-sm">{order.customer?.name}</p>
                    <p className="text-sm text-charcoal/60">
                      {order.customer?.phone}
                    </p>
                    <p className="text-sm text-charcoal/60">
                      {order.customer?.email}
                    </p>
                    <p className="text-sm text-charcoal/60 mt-1">
                      {order.customer?.address}, {order.customer?.city},{" "}
                      {order.customer?.state} - {order.customer?.pincode}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-charcoal/40 uppercase tracking-widest2 mb-1">
                      Items
                    </p>
                    <ul className="text-sm space-y-1">
                      {(order.items || []).map((item, i) => (
                        <li key={i}>
                          {item.name}
                          {item.size ? ` (${item.size})` : ""} × {item.qty} —{" "}
                          {formatPrice(item.price * item.qty)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
