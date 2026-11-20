/**
 * Demo Shop sepet, indirim ve KDV hesaplama kuralları.
 *
 * QA testi amacıyla üç kasıtlı hata modu desteklenir:
 * - `double_discount`: `TEST10` kuponu (%10) tutardan iki kez düşülür (%20 etki yapar).
 * - `wrong_vat`: Ekranda %20 KDV yazmasına rağmen tutar %2 ile hesaplanır.
 * - `empty_checkout`: Sepet boşken de ödeme adımına geçilip sipariş onaylanabilir.
 *
 * Varsayılan hatalar DEFAULT_BUGS'ta (main'de boş: dükkan hatasız). Test PR'ları bu listeye
 * bir hata ekleyerek "bir şeyi bozan değişiklik" taklidi yapar. `NEXT_PUBLIC_DEMO_SHOP_BUGS` ortam değişkeni
 * veya `?bug=double_discount|wrong_vat|empty_checkout|none` query parametresiyle tek tek izole edilebilir.
 */
export type DemoShopBug = "double_discount" | "wrong_vat" | "empty_checkout";

export const ALL_BUGS: DemoShopBug[] = ["double_discount", "wrong_vat", "empty_checkout"];

/** Ortam değişkeni ya da ?bug= verilmediğinde açık olan hatalar. */
export const DEFAULT_BUGS: DemoShopBug[] = ["wrong_vat"];

export interface CartItem {
  productId: string;
  name: string;
  unitPriceTry: number;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  discountCodeApplied: string | null;
  discountAmount: number;
  vatRateDisplayed: number;
  vatAmount: number;
  grandTotal: number;
  canCheckout: boolean;
}

/** Ortam değişkeni veya URL parametresinden etkin hata listesini çözer. */
export function resolveActiveBugs(queryBug?: string | null): Set<DemoShopBug> {
  const raw = (queryBug ?? process.env.NEXT_PUBLIC_DEMO_SHOP_BUGS ?? "").trim().toLowerCase();
  if (!raw) return new Set(DEFAULT_BUGS);
  if (raw === "all") return new Set(ALL_BUGS);
  if (raw === "none" || raw === "clean") return new Set();

  const parsed = raw
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is DemoShopBug => ALL_BUGS.includes(s as DemoShopBug));
  return new Set(parsed);
}

/** Türk Lirası biçimlendirmesi (`1.080,00 TL`). */
export function formatTry(amount: number): string {
  return `${new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)} TL`;
}

export function calculateCartTotals(
  items: CartItem[],
  couponCode: string,
  bugs: Set<DemoShopBug>,
): CartTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPriceTry * item.quantity, 0);
  const normalizedCode = couponCode.trim().toUpperCase();
  const hasTest10 = normalizedCode === "TEST10" && subtotal > 0;

  // Normal kural: TEST10 kuponu ara toplam üzerinden %10 indirim uygular.
  const baseDiscount = hasTest10 ? round2(subtotal * 0.1) : 0;
  // Hata 1 (double_discount): Kupon indirimi iki kez düşülür.
  const discountAmount = bugs.has("double_discount") ? round2(baseDiscount * 2) : baseDiscount;

  const taxableBase = Math.max(0, round2(subtotal - discountAmount));
  // Normal kural: İndirim sonrası matraha %20 KDV uygulanır.
  // Hata 2 (wrong_vat): Etiket %20 dese de KDV oranı yanlışlıkla %2 hesaplanır.
  const effectiveVatRate = bugs.has("wrong_vat") ? 0.02 : 0.2;
  const vatAmount = round2(taxableBase * effectiveVatRate);
  const grandTotal = round2(taxableBase + vatAmount);

  // Normal kural: Sepet boşken ödeme yapılamaz.
  // Hata 3 (empty_checkout): Boş sepet kontrolü atlanır.
  const hasItems = items.some((item) => item.quantity > 0);
  const canCheckout = bugs.has("empty_checkout") ? true : hasItems;

  return {
    subtotal,
    discountCodeApplied: hasTest10 ? "TEST10" : null,
    discountAmount,
    vatRateDisplayed: 20,
    vatAmount,
    grandTotal,
    canCheckout,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
