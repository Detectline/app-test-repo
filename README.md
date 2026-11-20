# Detectline Demo Shop

A small Turkish storefront used to test the [Detectline](https://detectline.ai) GitHub App end to end. It has a product list, a cart with a coupon (`TEST10`, 10% off) and VAT (20%), and a checkout with an iyzico-style sandbox payment form and 3D Secure step inside an iframe.

## Intentional bugs

`main` is bug-free. Test pull requests switch one bug on through `DEFAULT_BUGS` in `src/lib/pricing.ts`, the way a real change would break something:

1. `double_discount`: the `TEST10` discount is subtracted twice (20% instead of 10%).
2. `wrong_vat`: VAT is labelled 20% but calculated at 2%.
3. `empty_checkout`: checkout and payment work with an empty cart.

You can also pick bugs with the `NEXT_PUBLIC_DEMO_SHOP_BUGS` environment variable or the `?bug=` query parameter: `double_discount`, `wrong_vat`, `empty_checkout` (comma separated), `all` or `none`.

## Sandbox payment data

- Card that succeeds: `5528 7900 0000 0008`, any future expiry, any CVC
- Card with insufficient funds: `4111 1111 1111 1129`
- 3D Secure SMS code: `283126`

## Run locally

```bash
npm install
npm run dev   # http://localhost:3001
```

Every pull request gets a Vercel preview, which Detectline tests.
