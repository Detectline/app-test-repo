"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShopFooter } from "@/components/ShopFooter";
import { ShopNav } from "@/components/ShopNav";
import { PRODUCTS, type Product } from "@/lib/catalog";
import { loadCart, saveCart, syncBugModeFromUrl } from "@/lib/cart-store";
import { formatTry, type CartItem } from "@/lib/pricing";

export default function HomePage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [addedName, setAddedName] = useState<string | null>(null);

  useEffect(() => {
    syncBugModeFromUrl();
    setItems(loadCart());
  }, []);

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(product: Product) {
    const next = [...items];
    const existing = next.find((item) => item.productId === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      next.push({
        productId: product.id,
        name: product.name,
        unitPriceTry: product.priceTry,
        quantity: 1,
      });
    }
    setItems(next);
    saveCart(next);
    setAddedName(product.name);
  }

  return (
    <>
      <ShopNav cartCount={totalCount} />

      <main>
        <section className="hero">
          <div className="hero__bg" aria-hidden />
          <div className="hero__veil" aria-hidden />
          <div className="container">
            <h1 className="hero__title">Ürünler.</h1>
            <div className="hero__line" aria-hidden />
            <p className="hero__lede">
              Sepete ürün ekleyip kupon (<code>TEST10</code>), KDV (%20) ve 3D Secure ödeme
              adımlarını test edebilirsiniz.
            </p>
            <div className="hero__actions">
              <Link href="/cart" className="btn btn--dark">
                Sepete Git ({totalCount})
              </Link>
              <Link href="/checkout" className="btn btn--glass">
                Ödemeye Geç
              </Link>
            </div>
          </div>
        </section>

        <section className="catalog container" aria-label="Ürün Listesi">
          {addedName && (
            <p className="alert alert--success" role="status" style={{ marginBottom: 20 }}>
              {addedName} sepete eklendi. <Link href="/cart">Sepete git</Link>
            </p>
          )}

          <div className="catalog__grid">
            {PRODUCTS.map((product) => (
              <article key={product.id} className="product-card glass">
                <div>
                  <span className="product-card__tag">Stokta</span>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                </div>
                <div className="product-card__foot">
                  <p className="price">{formatTry(product.priceTry)}</p>
                  <button
                    type="button"
                    className="btn btn--dark btn--small"
                    onClick={() => addToCart(product)}
                    aria-label={`${product.name} Sepete Ekle`}
                  >
                    Sepete Ekle
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <ShopFooter />
    </>
  );
}
