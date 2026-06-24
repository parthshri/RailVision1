"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/railvision-junior", label: "Junior" },
  { href: "/railvision-pro", label: "Pro" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAdmin } = useAuth();

  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="RailVision home">
        <Image
        src="/logo.png"
        alt="RailVision Logo"
        width={45}
        height={45}
        priority
      />
        <span>RailVision</span>
      </Link>

      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={pathname === link.href ? "active" : ""}
          >
            {link.label}
          </Link>
        ))}
        {isAdmin ? <Link href="/admin">Admin</Link> : null}
      </nav>

      <div className="nav-actions">
        <Link href="/cart" className="icon-link" aria-label="Cart">
          <ShoppingCart size={19} />
          {itemCount > 0 ? <span>{itemCount}</span> : null}
        </Link>
        <Link href={user ? "/profile" : "/auth"} className="icon-link" aria-label="Profile">
          <User size={19} />
        </Link>
        <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {isAdmin ? <Link href="/admin">Admin</Link> : null}
        </nav>
      ) : null}
    </header>
  );
}
