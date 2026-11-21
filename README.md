# Detectline Demo Mağaza

[Detectline](https://detectline.ai) GitHub App'ini uçtan uca test etmek için kullanılan küçük bir mağaza. Ürün listesi, kuponlu (`TEST10`, %10 indirim) ve KDV'li (%20) bir sepet, ve iframe içinde iyzico benzeri sandbox ödeme formu ile 3D Secure adımı olan bir ödeme sayfası var.

## Bilerek bırakılan hatalar

`main` hatasız. Test pull request'leri, gerçek bir değişikliğin bir şeyi bozması gibi, `src/lib/pricing.ts` içindeki `DEFAULT_BUGS` ile bir hatayı açar:

1. `double_discount`: `TEST10` indirimi iki kez düşülür (%10 yerine %20).
2. `wrong_vat`: KDV %20 olarak yazılır ama %2 hesaplanır.
3. `empty_checkout`: ödeme ve sipariş boş sepetle de çalışır.

Hataları `NEXT_PUBLIC_DEMO_SHOP_BUGS` ortam değişkeniyle ya da `?bug=` sorgu parametresiyle de seçebilirsin: `double_discount`, `wrong_vat`, `empty_checkout` (virgülle ayrılmış), `all` ya da `none`.

## Sandbox ödeme bilgileri

- Başarılı ödeme yapan kart: `5528 7900 0000 0008`, ileri tarihli herhangi bir son kullanma tarihi, herhangi bir CVC
- Bakiyesi yetersiz kart: `4111 1111 1111 1129`
- 3D Secure SMS kodu: `283126`

## Lokalde çalıştırma

```bash
npm install
npm run dev   # http://localhost:3001
```

Her pull request bir Vercel preview alır; Detectline o preview'ı test eder.
