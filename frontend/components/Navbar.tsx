"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserMenu from "./UserMenu";
import { useCart } from "@/lib/cartContext";
import { useAuth } from "@/lib/authContext";



const ChefLogo = () => (
  <svg viewBox="0 0 120 120" className="w-12 h-12" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Dark green background */}
    <circle cx="60" cy="60" r="55" fill="#3E6F56" />

    {/* Scalloped outer border approximation */}
    <circle cx="60" cy="60" r="52" stroke="#C39F76" strokeWidth="3" />
    {/* Dashed inner border */}
    <circle cx="60" cy="60" r="46" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Chef Hat */}
    <path d="M60 25 C75 25, 80 35, 75 42 C82 42, 82 50, 75 50 L45 50 C38 50, 38 42, 45 42 C40 35, 45 25, 60 25 Z" stroke="white" strokeWidth="2.5" fill="#3E6F56" />
    <path d="M48 50 L48 55 L72 55 L72 50" stroke="white" strokeWidth="2.5" />

    {/* Chef Head / Neck */}
    <path d="M55 55 C55 50, 65 50, 65 55 L65 65 C65 70, 55 70, 55 65 Z" stroke="white" strokeWidth="2.5" fill="#3E6F56" />

    {/* Chef Apron / Body */}
    <path d="M50 62 C50 60, 70 60, 70 62 L75 90 C75 92, 45 92, 45 90 Z" stroke="white" strokeWidth="2.5" fill="#3E6F56" />

    {/* Pocket */}
    <path d="M55 75 L65 75 L65 82 C65 85, 55 85, 55 82 Z" stroke="white" strokeWidth="2" />
    <path d="M58 70 L58 75" stroke="white" strokeWidth="1.5" />
    <path d="M62 70 L62 75" stroke="white" strokeWidth="1.5" />
    <path d="M60 70 L60 75" stroke="white" strokeWidth="1.5" />
    <line x1="56" y1="78" x2="64" y2="78" stroke="white" strokeWidth="1.5" />

    {/* Left Arm & Whisk */}
    <path d="M46 72 C35 72, 30 78, 38 85" stroke="white" strokeWidth="2.5" fill="none" />
    <line x1="38" y1="85" x2="33" y2="92" stroke="white" strokeWidth="2.5" />

    {/* Right Arm & Spoon */}
    <path d="M74 72 C85 72, 90 65, 82 58" stroke="white" strokeWidth="2.5" fill="none" />
    <line x1="82" y1="58" x2="88" y2="48" stroke="white" strokeWidth="2.5" />
    <circle cx="89" cy="46" r="3" stroke="white" strokeWidth="2" fill="#3E6F56" />

    {/* Ribbon */}
    <path d="M15 95 Q60 85 105 95 L112 105 L102 103 L95 108 Q60 98 25 108 L18 103 L8 105 Z" fill="#F4EBE1" stroke="#C39F76" strokeWidth="2" />
    <text x="60" y="103" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="900" fill="#9C6B46" textAnchor="middle" letterSpacing="0.5">CHEF NEXT DOOR</text>
  </svg>
);

export default function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const { profile } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/chefs", label: "Chefs" },
    { href: "/recipes", label: "Recipes" },
    { href: "/tracking", label: "Order Tracking" },
    { href: "/rating", label: "Rating" },
    { href: "/favorites", label: "Favorites" },
    ...(profile?.role === "chef" ? [{ href: "/chef/dashboard", label: "Chef Dashboard" }] : []),
    ...(profile?.role === "admin" ? [{ href: "/admin/dashboard", label: "Admin Panel" }] : []),
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isDashboard = pathname.startsWith('/chef') || pathname.startsWith('/admin');

  return (
    <header className={`${isDashboard ? 'relative' : 'sticky'} top-0 z-40 backdrop-blur border-b border-sage-200 bg-cream/90`}>
      <div className="overflow-hidden bg-sage-900 text-sage-100 py-3 flex whitespace-nowrap">
        <div className="animate-marquee-continuous flex shrink-0 min-w-full justify-around gap-8 pr-8">
          <div className="text-base px-4">
            🌿 Use code <span className="font-bold text-apricot">FIRSTBITE20</span> for 20% off your first order
          </div>
          <div className="text-base px-4">
            🌿 Use code <span className="font-bold text-apricot">FIRSTBITE20</span> for 20% off your first order
          </div>
          <div className="text-base px-4">
            🌿 Use code <span className="font-bold text-apricot">FIRSTBITE20</span> for 20% off your first order
          </div>
        </div>
        <div className="animate-marquee-continuous flex shrink-0 min-w-full justify-around gap-8 pr-8" aria-hidden="true">
          <div className="text-base px-4">
            🌿 Use code <span className="font-bold text-apricot">FIRSTBITE20</span> for 20% off your first order
          </div>
          <div className="text-base px-4">
            🌿 Use code <span className="font-bold text-apricot">FIRSTBITE20</span> for 20% off your first order
          </div>
          <div className="text-base px-4">
            🌿 Use code <span className="font-bold text-apricot">FIRSTBITE20</span> for 20% off your first order
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <ChefLogo />
          <span className="font-display text-xl font-semibold text-sage-900">ChefNextDoor</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 text-base font-medium">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${active
                  ? "bg-emerald-600 text-white font-semibold shadow-md ring-2 ring-emerald-300/40"
                  : "text-sage-800 hover:bg-sage-200/70"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            title="View Cart"
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${pathname === "/cart"
              ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300/40"
              : "bg-sage-100 hover:bg-sage-200"
              }`}
          >
            <span className="text-lg">🛒</span>
            {itemCount > 0 && (
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 min-w-[20px] h-[18px] px-1 rounded-full text-[10px] font-extrabold text-white bg-apricot border-2 border-white shadow-md flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

