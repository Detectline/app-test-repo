"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function ShopNav({ cartCount }: { cartCount: number }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  const links = [
    { href: "/", label: "Ürünler" },
    { href: "/cart", label: `Sepet (${cartCount})` },
    { href: "/checkout", label: "Ödeme" },
  ];

  return (
    <header className={`nav${scrolled || open ? " is-solid" : ""}`}>
      <div className="container">
        <div className="nav__bar">
          <Link href="/" className="nav__logo" aria-label="Detectline Demo Shop" onClick={close}>
            <Image src="/brand/logo.png" alt="detectline" width={140} height={24} priority />
            <span className="nav__badge">demo-shop</span>
          </Link>

          <nav className="nav__links" aria-label="Mağaza menüsü">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav__link"
                aria-current={pathname === l.href ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="nav__actions">
            <Link href="/cart" className="btn btn--dark btn--small">
              Sepete Git ({cartCount})
            </Link>
            <button
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="shop-nav-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        {open && (
          <nav id="shop-nav-menu" className="nav__menu" aria-label="Mobil menü">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={close}>
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
