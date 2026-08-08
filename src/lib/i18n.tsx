import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { detectGeo } from "@/lib/geo.functions";

// Country → { location label matching TopNav LOCATIONS, currency, language }
const COUNTRY_MAP: Record<string, { location: string; currency: Currency; lang: Lang }> = {
  US: { location: "New York, US", currency: "USD", lang: "en" },
  GB: { location: "London, GB", currency: "GBP", lang: "en" },
  IN: { location: "Mumbai, IN", currency: "INR", lang: "hi" },
  JP: { location: "Tokyo, JP", currency: "USD", lang: "en" },
  IT: { location: "Rome, IT", currency: "EUR", lang: "en" },
  CN: { location: "Shenzhen, CN", currency: "CNY", lang: "zh" },
  RW: { location: "Kigali, RW", currency: "USD", lang: "fr" },
  BR: { location: "São Paulo, BR", currency: "BRL", lang: "pt" },
  AE: { location: "Dubai, AE", currency: "AED", lang: "ar" },
  PE: { location: "Cusco, PE", currency: "USD", lang: "es" },
  // Broader region fallbacks by currency/language
  ES: { location: "Rome, IT", currency: "EUR", lang: "es" },
  FR: { location: "Rome, IT", currency: "EUR", lang: "fr" },
  DE: { location: "Rome, IT", currency: "EUR", lang: "en" },
  MX: { location: "New York, US", currency: "USD", lang: "es" },
  PT: { location: "Rome, IT", currency: "EUR", lang: "pt" },
  SA: { location: "Dubai, AE", currency: "AED", lang: "ar" },
  EG: { location: "Dubai, AE", currency: "AED", lang: "ar" },
};


export type Lang = "en" | "es" | "fr" | "hi" | "zh" | "ar" | "pt";
export type Currency = "USD" | "EUR" | "INR" | "GBP" | "CNY" | "BRL" | "AED";

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];

export const CURRENCIES: { code: Currency; symbol: string; rate: number }[] = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "EUR", symbol: "€", rate: 0.92 },
  { code: "INR", symbol: "₹", rate: 83.2 },
  { code: "GBP", symbol: "£", rate: 0.79 },
  { code: "CNY", symbol: "¥", rate: 7.24 },
  { code: "BRL", symbol: "R$", rate: 5.42 },
  { code: "AED", symbol: "د.إ", rate: 3.67 },
];

type Dict = Record<string, string>;
const strings: Record<Lang, Dict> = {
  en: {
    tagline: "One planet. One market. Every neighborhood.",
    hero_title: "Discover local. Deliver global.",
    hero_sub: "Restaurants and groceries — from your street to across the world.",
    search_placeholder: "Search dishes, shops, staples…",
    browse: "Browse",
    restaurants: "Restaurants",
    groceries: "Groceries",
    vendor_onboard: "Become a vendor",
    track_order: "Track order",
    cart: "Cart",
    add_to_cart: "Add to cart",
    request_quote: "Request quote",
    moq: "MOQ",
    from: "from",
    rural_ready: "Low-bandwidth ready",
    global_logistics: "Global logistics",
    live_translate: "Live translation",
    multi_currency: "Multi-currency",
    categories: "Categories",
    near_you: "Near you",
    featured: "Featured",
    all: "All",
    view_all: "View all",
    open_now: "Open now",
    delivers_to: "Delivers to",
    per_unit: "per unit",
    checkout: "Checkout",
    empty_cart: "Your cart is empty",
    continue_shopping: "Continue shopping",
    order_placed: "Order placed",
    tracking_id: "Tracking ID",
  },
  es: { tagline: "Un planeta. Un mercado.", hero_title: "Descubre local. Entrega global.", hero_sub: "Restaurantes y tiendas de comestibles.", search_placeholder: "Buscar…", browse: "Explorar", restaurants: "Restaurantes", groceries: "Supermercados", vendor_onboard: "Sé vendedor", track_order: "Seguir pedido", cart: "Carrito", add_to_cart: "Añadir", request_quote: "Cotización", moq: "MOQ", from: "desde", rural_ready: "Baja conexión", global_logistics: "Logística global", live_translate: "Traducción", multi_currency: "Multi-moneda", categories: "Categorías", near_you: "Cerca", featured: "Destacados", all: "Todo", view_all: "Ver todo", open_now: "Abierto", delivers_to: "Entrega a", per_unit: "por unidad", checkout: "Pagar", empty_cart: "Carrito vacío", continue_shopping: "Seguir comprando", order_placed: "Pedido realizado", tracking_id: "ID de seguimiento" },
  fr: { tagline: "Une planète. Un marché.", hero_title: "Découvrir local. Livrer global.", hero_sub: "Restaurants et épiceries.", search_placeholder: "Rechercher…", browse: "Parcourir", restaurants: "Restaurants", groceries: "Épiceries", vendor_onboard: "Devenir vendeur", track_order: "Suivre", cart: "Panier", add_to_cart: "Ajouter", request_quote: "Devis", moq: "MOQ", from: "dès", rural_ready: "Faible débit", global_logistics: "Logistique mondiale", live_translate: "Traduction", multi_currency: "Multi-devises", categories: "Catégories", near_you: "Près", featured: "En vedette", all: "Tout", view_all: "Voir tout", open_now: "Ouvert", delivers_to: "Livraison", per_unit: "par unité", checkout: "Payer", empty_cart: "Panier vide", continue_shopping: "Continuer", order_placed: "Commande passée", tracking_id: "ID de suivi" },
  hi: { tagline: "एक ग्रह। एक बाज़ार।", hero_title: "स्थानीय खोजें। वैश्विक भेजें।", hero_sub: "रेस्तरां और किराना।", search_placeholder: "खोजें…", browse: "ब्राउज़", restaurants: "रेस्तरां", groceries: "किराना", vendor_onboard: "विक्रेता बनें", track_order: "ट्रैक करें", cart: "कार्ट", add_to_cart: "जोड़ें", request_quote: "कोटेशन", moq: "न्यूनतम", from: "से", rural_ready: "कम बैंडविड्थ", global_logistics: "वैश्विक लॉजिस्टिक्स", live_translate: "अनुवाद", multi_currency: "बहु-मुद्रा", categories: "श्रेणियाँ", near_you: "पास", featured: "फ़ीचर्ड", all: "सब", view_all: "सभी देखें", open_now: "खुला", delivers_to: "डिलीवरी", per_unit: "प्रति यूनिट", checkout: "चेकआउट", empty_cart: "कार्ट खाली", continue_shopping: "जारी रखें", order_placed: "ऑर्डर हुआ", tracking_id: "ट्रैकिंग आईडी" },
  zh: { tagline: "一个星球，一个市场。", hero_title: "本地发现，全球送达。", hero_sub: "餐厅和杂货。", search_placeholder: "搜索…", browse: "浏览", restaurants: "餐厅", groceries: "杂货", vendor_onboard: "成为商家", track_order: "追踪订单", cart: "购物车", add_to_cart: "加入", request_quote: "询价", moq: "起订", from: "起", rural_ready: "低带宽", global_logistics: "全球物流", live_translate: "翻译", multi_currency: "多币种", categories: "分类", near_you: "附近", featured: "推荐", all: "全部", view_all: "查看全部", open_now: "营业中", delivers_to: "配送至", per_unit: "每件", checkout: "结账", empty_cart: "购物车为空", continue_shopping: "继续购物", order_placed: "已下单", tracking_id: "追踪码" },
  ar: { tagline: "كوكب واحد. سوق واحد.", hero_title: "اكتشف محليًا. سلّم عالميًا.", hero_sub: "مطاعم وبقالة.", search_placeholder: "بحث…", browse: "تصفح", restaurants: "مطاعم", groceries: "بقالة", vendor_onboard: "كن بائعًا", track_order: "تتبع", cart: "السلة", add_to_cart: "أضف", request_quote: "طلب عرض", moq: "الحد الأدنى", from: "من", rural_ready: "نطاق منخفض", global_logistics: "لوجستيات", live_translate: "ترجمة", multi_currency: "عملات", categories: "الفئات", near_you: "بالقرب", featured: "مميز", all: "الكل", view_all: "عرض الكل", open_now: "مفتوح", delivers_to: "التوصيل", per_unit: "للوحدة", checkout: "الدفع", empty_cart: "السلة فارغة", continue_shopping: "متابعة", order_placed: "تم الطلب", tracking_id: "رقم التتبع" },
  pt: { tagline: "Um planeta. Um mercado.", hero_title: "Descubra local. Entregue global.", hero_sub: "Restaurantes e mercearias.", search_placeholder: "Buscar…", browse: "Explorar", restaurants: "Restaurantes", groceries: "Mercearias", vendor_onboard: "Seja vendedor", track_order: "Rastrear", cart: "Carrinho", add_to_cart: "Adicionar", request_quote: "Cotação", moq: "MOQ", from: "a partir de", rural_ready: "Baixa banda", global_logistics: "Logística global", live_translate: "Tradução", multi_currency: "Multi-moeda", categories: "Categorias", near_you: "Perto", featured: "Destaques", all: "Tudo", view_all: "Ver tudo", open_now: "Aberto", delivers_to: "Entrega em", per_unit: "por unidade", checkout: "Pagar", empty_cart: "Carrinho vazio", continue_shopping: "Continuar", order_placed: "Pedido feito", tracking_id: "ID de rastreio" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  location: string;
  setLocation: (l: string) => void;
  country: string; // ISO-2 derived from `location` — used for region-aware catalog
  t: (key: keyof typeof strings.en) => string;
  fx: (usd: number) => string;
  dir: "ltr" | "rtl";
};

const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [location, setLocation] = useState<string>("New York, US");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("locale");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.lang) setLang(p.lang);
        if (p.currency) setCurrency(p.currency);
        if (p.location) setLocation(p.location);
        return;
      } catch {}
    }
    // No saved preference — detect from visitor IP (server headers).
    detectGeo()
      .then((geo) => {
        if (!geo?.country) return;
        const preset = COUNTRY_MAP[geo.country];
        if (preset) {
          setLang(preset.lang);
          setCurrency(preset.currency);
          setLocation(geo.city ? `${geo.city}, ${geo.country}` : preset.location);
        } else if (geo.city) {
          setLocation(`${geo.city}, ${geo.country}`);
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("locale", JSON.stringify({ lang, currency, location }));
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    }
  }, [lang, currency, location]);

  const value = useMemo<Ctx>(() => {
    const t = (key: keyof typeof strings.en) => strings[lang][key] || strings.en[key] || String(key);
    const fx = (usd: number) => {
      const c = CURRENCIES.find((x) => x.code === currency)!;
      const v = usd * c.rate;
      const formatted = v >= 100 ? Math.round(v).toLocaleString() : v.toFixed(2);
      return `${c.symbol}${formatted}`;
    };
    const parts = location.split(",");
    const country = (parts[parts.length - 1] || "").trim().toUpperCase();
    return { lang, setLang, currency, setCurrency, location, setLocation, country, t, fx, dir: lang === "ar" ? "rtl" : "ltr" };
  }, [lang, currency, location]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be inside LocaleProvider");
  return ctx;
}
