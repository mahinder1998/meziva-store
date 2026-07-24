import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminNav({ active }) {
  const tabs = [
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/products", label: "Products" },
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`text-sm uppercase tracking-widest2 pb-1 border-b-2 ${
              active === tab.label
                ? "border-charcoal text-charcoal"
                : "border-transparent text-charcoal/40 hover:text-charcoal/70"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <LogoutButton />
    </div>
  );
}
