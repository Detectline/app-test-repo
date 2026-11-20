import Image from "next/image";
import Link from "next/link";

export function ShopFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Image src="/brand/logo.png" alt="detectline" width={140} height={24} />
            <p>Nothing broken crosses the line. Detectline Demo Shop QA test mağazası.</p>
          </div>

          <nav className="footer__col" aria-label="Alt menü">
            <h2>Mağaza</h2>
            <Link href="/">Ürünler</Link>
            <Link href="/cart">Sepet</Link>
            <Link href="/checkout">Ödeme</Link>
          </nav>

          <div className="footer__col">
            <h2>Test Bilgileri</h2>
            <span>Kupon: TEST10 (%10 indirim)</span>
            <span>KDV Oranı: %20</span>
            <span>3D Secure Sandbox: 283126</span>
          </div>
        </div>

        <div className="footer__base">
          <span>© 2026 Detectline Demo Shop</span>
        </div>
      </div>
    </footer>
  );
}
