"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShopFooter } from "@/components/ShopFooter";
import { ShopNav } from "@/components/ShopNav";
import { loadCart, loadCoupon, saveCart, saveCoupon, syncBugModeFromUrl } from "@/lib/cart-store";
import {
  calculateCartTotals,
  formatTry,
  resolveActiveBugs,
  type CartItem,
  type DemoShopBug,
} from "@/lib/pricing";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [bugs, setBugs] = useState<Set<DemoShopBug>>(() => resolveActiveBugs());
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  useEffect(() => {
    setBugs(syncBugModeFromUrl());
    setItems(loadCart());
    const saved = loadCoupon();
    setCouponInput(saved);
    setAppliedCoupon(saved);
  }, []);

  const totals = calculateCartTotals(items, appliedCoupon, bugs);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function updateQuantity(productId: string, delta: number) {
    const next = items
      .map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + delta } : item,
      )
      .filter((item) => item.quantity > 0);
    setItems(next);
    saveCart(next);
  }

  function applyCoupon() {
    const trimmed = couponInput.trim().toUpperCase();
    setAppliedCoupon(trimmed);
    saveCoupon(trimmed);
    if (!trimmed) {
      setCouponMsg("Kupon kaldırıldı.");
      return;
    }
    if (trimmed === "TEST10") {
      setCouponMsg("TEST10 kuponu (%10 indirim) uygulandı.");
    } else {
      setCouponMsg("Geçersiz kupon kodu. Geçerli kod: TEST10");
    }
  }

  return (
    <>
      <ShopNav cartCount={totalCount} />

      <main>
        <section className="hero hero--sub">
          <div className="hero__bg" aria-hidden />
          <div className="hero__veil" aria-hidden />
          <div className="container">
            <h1 className="page-title">Sepetiniz</h1>
            <div className="hero__line" aria-hidden />

            <div className="shop-split">
              <div className="shop-stack">
                {items.length === 0 ? (
                  <div className="panel glass">
                    <p style={{ color: "var(--slate)", marginBottom: 16 }}>Sepetiniz şu an boş.</p>
                    <Link href="/" className="btn btn--glass">
                      Ürünlere Dön
                    </Link>
                  </div>
                ) : (
                  <div className="panel glass">
                    <h2>Sepetteki Ürünler</h2>
                    <div className="cart-list">
                      {items.map((item) => (
                        <div key={item.productId} className="summary-row">
                          <div>
                            <strong>{item.name}</strong>
                            <div className="summary-row__meta">
                              {item.quantity} adet × {formatTry(item.unitPriceTry)}
                            </div>
                          </div>
                          <div className="qty-controls">
                            <strong>{formatTry(item.unitPriceTry * item.quantity)}</strong>
                            <button
                              type="button"
                              className="btn btn--glass btn--icon"
                              aria-label={`${item.name} Azalt`}
                              onClick={() => updateQuantity(item.productId, -1)}
                            >
                              -
                            </button>
                            <button
                              type="button"
                              className="btn btn--glass btn--icon"
                              aria-label={`${item.name} Artır`}
                              onClick={() => updateQuantity(item.productId, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="panel glass">
                  <h2>İndirim Kodu</h2>
                  <div className="coupon-row">
                    <div className="field">
                      <label htmlFor="coupon-input">İndirim Kodu</label>
                      <input
                        id="coupon-input"
                        aria-label="İndirim Kodu"
                        type="text"
                        placeholder="Örn: TEST10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                      />
                    </div>
                    <button type="button" className="btn btn--glass" onClick={applyCoupon}>
                      Kuponu Uygula
                    </button>
                  </div>
                  {couponMsg && (
                    <p className="alert alert--success" role="status">
                      {couponMsg}
                    </p>
                  )}
                </div>
              </div>

              <section className="panel glass" aria-label="Sepet Özeti">
                <h2>Sipariş Özeti</h2>
                <div className="summary-row">
                  <span>Ara Toplam</span>
                  <strong>{formatTry(totals.subtotal)}</strong>
                </div>
                {totals.discountCodeApplied && (
                  <div className="summary-row">
                    <span>İndirim ({totals.discountCodeApplied} - %10)</span>
                    <strong>-{formatTry(totals.discountAmount)}</strong>
                  </div>
                )}
                <div className="summary-row">
                  <span>KDV (%{totals.vatRateDisplayed})</span>
                  <strong>{formatTry(totals.vatAmount)}</strong>
                </div>
                <div className="summary-row summary-row--total">
                  <span>Genel Toplam</span>
                  <strong>{formatTry(totals.grandTotal)}</strong>
                </div>

                {!totals.canCheckout && (
                  <p className="alert alert--error" role="alert">
                    Sepetiniz boş, ödeme yapılamaz.
                  </p>
                )}

                <div style={{ marginTop: 20 }}>
                  <button
                    type="button"
                    className="btn btn--dark"
                    style={{ width: "100%" }}
                    disabled={!totals.canCheckout}
                    onClick={() => router.push("/checkout")}
                  >
                    Ödemeye Geç
                  </button>
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <ShopFooter />
    </>
  );
}
