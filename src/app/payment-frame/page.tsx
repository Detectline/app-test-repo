"use client";

import { useState, type FormEvent } from "react";

const SANDBOX_3DS_OTP = "283126";
const INSUFFICIENT_FUNDS_CARD = "4111111111111129";
const VALID_SANDBOX_CARDS = new Set(["5528790000000008", "4543590000000006"]);

export default function PaymentFramePage() {
  const [step, setStep] = useState<"card" | "3ds" | "done">("card");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleCardSubmit(e: FormEvent) {
    e.preventDefault();
    const cleanCard = cardNumber.replace(/\s+/g, "");
    if (!cardHolder.trim() || cleanCard.length < 16 || !expiry.trim() || cvc.trim().length < 3) {
      setError("Lütfen tüm kart bilgilerini eksiksiz girin.");
      return;
    }

    if (cleanCard === INSUFFICIENT_FUNDS_CARD) {
      const msg = "Kart limiti yetersiz (ErrorCode: 10051 - NOT_SUFFICIENT_FUNDS).";
      setError(msg);
      window.parent.postMessage(
        { type: "DEMO_SHOP_PAYMENT_ERROR", message: msg },
        window.location.origin,
      );
      return;
    }

    if (!VALID_SANDBOX_CARDS.has(cleanCard)) {
      setError("Geçersiz sandbox kart numarası.");
      return;
    }

    setError(null);
    setStep("3ds");
  }

  function handleOtpSubmit(e: FormEvent) {
    e.preventDefault();
    if (otp.trim() !== SANDBOX_3DS_OTP) {
      setError("3D Secure SMS doğrulama kodu hatalı.");
      return;
    }
    setError(null);
    setStep("done");
    window.parent.postMessage({ type: "DEMO_SHOP_PAYMENT_SUCCESS" }, window.location.origin);
  }

  return (
    <div className="frame-shell">
      <div className="frame-shell__head">
        <h3>iyzico Sandbox Ödeme</h3>
        <span className="nav__badge">3D Secure</span>
      </div>

      {error && (
        <p className="alert alert--error" role="alert" style={{ marginTop: 0 }}>
          {error}
        </p>
      )}

      {step === "card" && (
        <form onSubmit={handleCardSubmit} className="frame-form">
          <div className="field">
            <label htmlFor="cc-name">Kart Sahibi</label>
            <input
              id="cc-name"
              aria-label="Kart Sahibi"
              type="text"
              placeholder="Ayşe Yılmaz"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="cc-number">Kart Numarası</label>
            <input
              id="cc-number"
              aria-label="Kart Numarası"
              autoComplete="cc-number"
              type="text"
              placeholder="5528 7900 0000 0008"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </div>
          <div className="frame-row">
            <div className="field">
              <label htmlFor="cc-exp">Son Kullanma Tarihi</label>
              <input
                id="cc-exp"
                aria-label="Son Kullanma Tarihi"
                autoComplete="cc-exp"
                type="text"
                placeholder="12/30"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="cc-csc">CVC</label>
              <input
                id="cc-csc"
                aria-label="CVC"
                autoComplete="cc-csc"
                type="text"
                placeholder="123"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn--dark" style={{ width: "100%", marginTop: 4 }}>
            3D Secure ile Öde
          </button>
        </form>
      )}

      {step === "3ds" && (
        <form onSubmit={handleOtpSubmit} className="frame-form">
          <p style={{ color: "var(--slate)", fontSize: 14 }}>
            Telefonunuza gelen 3D Secure doğrulama kodunu girin.
          </p>
          <div className="field">
            <label htmlFor="otp-code">3D Secure SMS Kodu</label>
            <input
              id="otp-code"
              aria-label="3D Secure SMS Kodu"
              autoComplete="one-time-code"
              type="text"
              placeholder="283126"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--dark" style={{ width: "100%", marginTop: 4 }}>
            Doğrula ve Ödemeyi Tamamla
          </button>
        </form>
      )}

      {step === "done" && (
        <p className="alert alert--success" role="status" style={{ marginTop: 0 }}>
          3D Secure doğrulaması tamamlandı.
        </p>
      )}
    </div>
  );
}
