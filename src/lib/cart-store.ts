"use client";

import type { CartItem, DemoShopBug } from "./pricing";
import { resolveActiveBugs } from "./pricing";

const CART_KEY = "detectline_demo_shop_cart_v1";
const COUPON_KEY = "detectline_demo_shop_coupon_v1";
const BUG_KEY = "detectline_demo_shop_bug_v1";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function loadCoupon(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(COUPON_KEY) ?? "";
}

export function saveCoupon(code: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(COUPON_KEY, code);
}

export function syncBugModeFromUrl(): Set<DemoShopBug> {
  if (typeof window === "undefined") return resolveActiveBugs();
  const param = new URLSearchParams(window.location.search).get("bug");
  if (param !== null) {
    window.sessionStorage.setItem(BUG_KEY, param);
    return resolveActiveBugs(param);
  }
  const stored = window.sessionStorage.getItem(BUG_KEY);
  return resolveActiveBugs(stored);
}
