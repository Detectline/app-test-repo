export interface Product {
  id: string;
  name: string;
  description: string;
  priceTry: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "kulaklik",
    name: "Kablosuz Kulaklık",
    description: "Aktif gürültü engellemeli stüdyo kulaklık.",
    priceTry: 1000,
  },
  {
    id: "klavye",
    name: "Mekanik Klavye",
    description: "Türkçe Q dizilimli kablosuz mekanik klavye.",
    priceTry: 2000,
  },
  {
    id: "hub",
    name: "USB-C Çoklayıcı",
    description: "4K HDMI ve 100W PD destekli alüminyum adaptör.",
    priceTry: 500,
  },
];
