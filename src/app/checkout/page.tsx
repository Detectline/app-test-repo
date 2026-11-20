"use client";

import Link from "next/link";
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

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [bugs, setBugs] = useState<Set<DemoShopBug>>(() => resolveActiveBugs());
  const [fullName, setFullName] = useState("Ayşe Yılmaz");
  const [email, setEmail] = useState("ayse@example.com");
  const [installment, setInstallment] = useState("Tek Çekim");
  const [orderCompleted, setOrderCompleted] = useState<{
    orderNo: string;
    paidTotal: string;
    installment: string;
  } | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    setBugs(syncBugModeFromUrl());
    setItems(loadCart());
    setAppliedCoupon(loadCoupon());
  }, []);

  const totals = calculateCartTotals(items, appliedCoupon, bugs);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const formattedTotal = formatTry(totals.grandTotal);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      const data = event.data as { type?: string; message?: string } | null;
      if (!data) return;

      if (data.type === "DEMO_SHOP_PAYMENT_SUCCESS") {
        setPaymentError(null);
        setOrderCompleted({
          orderNo: "DL-2026-1042",
          paidTotal: formattedTotal,
          installment,
        });
        setItems([]);
        saveCart([]);
        saveCoupon("");
      } else if (data.type === "DEMO_SHOP_PAYMENT_ERROR" && data.message) {
        setPaymentError(data.message);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [formattedTotal, installment]);

  return (
    <>
      <ShopNav cartCount={totalCount} />

      <main>
        <section className="hero hero--sub">
          <div className="hero__bg" aria-hidden />
          <div className="hero__veil" aria-hidden />
          <div className="container">
            <h1 className="page-title">Ödeme</h1>
            <div className="hero__line" aria-hidden />

            <div style={{ marginTop: 28 }}>
              {orderCompleted ? (
                <section className="panel glass" aria-label="Sipariş Onayı">
                  <div className="alert alert--success" style={{ marginTop: 0, marginBottom: 18 }}>
                    <h2>Siparişiniz onaylandı!</h2>
                  </div>
                  <div className="summary-row">
                    <span>Sipariş Numarası</span>
                    <strong>{orderCompleted.orderNo}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Ödenen Tutar</span>
                    <strong>{orderCompleted.paidTotal}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Taksit</span>
                    <strong>{orderCompleted.installment}</strong>
                  </div>
                  <div style={{ marginTop: 20 }}>
                    <Link href="/" className="btn btn--dark">
                      Alışverişe Devam Et
                    </Link>
                  </div>
                </section>
              ) : !totals.canCheckout ? (
                <section className="panel glass">
                  <p
                    className="alert alert--error"
                    role="alert"
                    style={{ marginTop: 0, marginBottom: 18 }}
                  >
                    Sepetiniz boş olduğu için ödeme başlatılamaz.
                  </p>
                  <Link href="/" className="btn btn--glass">
                    Ürünlere Dön
                  </Link>
                </section>
              ) : (
                <div className="shop-split">
                  <section className="panel glass" aria-label="Alıcı ve Taksit Bilgileri">
                    <h2>Teslimat ve Taksit</h2>
                    <div className="shop-stack" style={{ gap: 14 }}>
                      <div className="field">
                        <label htmlFor="full-name">Ad Soyad</label>
                        <input
                          id="full-name"
                          aria-label="Ad Soyad"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="email">E-posta</label>
                        <input
                          id="email"
                          aria-label="E-posta"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="installment">Taksit Seçeneği</label>
                        <select
                          id="installment"
                          aria-label="Taksit Seçeneği"
                          value={installment}
                          onChange={(e) => setInstallment(e.target.value)}
                        >
                          <option value="Tek Çekim">Tek Çekim</option>
                          <option value="3 Taksit">3 Taksit</option>
                          <option value="6 Taksit">6 Taksit</option>
                        </select>
                      </div>
                    </div>

                    <div className="summary-row summary-row--total" style={{ marginTop: 18 }}>
                      <span>Ödenecek Tutar</span>
                      <strong>{formattedTotal}</strong>
                    </div>

                    {paymentError && (
                      <p className="alert alert--error" role="alert">
                        {paymentError}
                      </p>
                    )}
                  </section>

                  <section className="panel glass" aria-label="Kart ile Ödeme">
                    <h2>Güvenli Ödeme (iyzico Sandbox)</h2>
                    <iframe
                      title="iyzico Sandbox Ödeme Formu"
                      className="payment-iframe"
                      src={`/payment-frame?total=${encodeURIComponent(formattedTotal)}`}
                    />
                  </section>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <ShopFooter />
    </>
  );
}
