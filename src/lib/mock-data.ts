export type Vendor = {
  id: string;
  name: string;
  type: "restaurant" | "grocery" | "electronics";
  city: string;
  country: string;
  rating: number;
  reviews: number;
  eta: string;
  tags: string[];
  hero: string;
  open: boolean;
  rural?: boolean;
};

export type Product = {
  id: string;
  vendorId: string;
  name: string;
  category: string;
  priceUsd: number;
  image: string;
  description: string;
  moq?: number;
  bulkTiers?: { qty: number; priceUsd: number }[];
  specs?: Record<string, string>;
  kind: "food" | "grocery" | "electronics";
};

const img = (seed: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=${w}&h=${h}&q=70`;

export const VENDORS: Vendor[] = [
  { id: "v1", name: "Saffron Street Kitchen", type: "restaurant", city: "Mumbai", country: "IN", rating: 4.8, reviews: 1420, eta: "25-35 min", tags: ["Indian", "Vegetarian", "Halal"], hero: img("1565557623262-b51c2513a641"), open: true },
  { id: "v2", name: "La Trattoria del Sole", type: "restaurant", city: "Rome", country: "IT", rating: 4.7, reviews: 980, eta: "30-40 min", tags: ["Italian", "Pizza"], hero: img("1513104890138-7c749659a591"), open: true },
  { id: "v3", name: "Sakura Ramen House", type: "restaurant", city: "Tokyo", country: "JP", rating: 4.9, reviews: 2100, eta: "20-30 min", tags: ["Japanese", "Ramen"], hero: img("1569718212165-3a8278d5f624"), open: true },
  { id: "v4", name: "Village Harvest Market", type: "grocery", city: "Kigali", country: "RW", rating: 4.6, reviews: 340, eta: "1-2 hr", tags: ["Organic", "Rural"], hero: img("1488459716781-31db52582fe9"), open: true, rural: true },
  { id: "v5", name: "GreenBasket Grocers", type: "grocery", city: "London", country: "GB", rating: 4.5, reviews: 780, eta: "45 min", tags: ["Fresh", "Bakery"], hero: img("1542838132-92c53300491e"), open: true },
  { id: "v6", name: "Andes Provisions", type: "grocery", city: "Cusco", country: "PE", rating: 4.7, reviews: 210, eta: "2 hr", tags: ["Rural", "Local"], hero: img("1550989460-0adf9ea622e2"), open: true, rural: true },
  { id: "v7", name: "MegaVolt Wholesale", type: "electronics", city: "Shenzhen", country: "CN", rating: 4.8, reviews: 3400, eta: "7-14 days", tags: ["Wholesale", "Appliances"], hero: img("1518770660439-4636190af475"), open: true },
  { id: "v8", name: "Bharat Electricals B2B", type: "electronics", city: "Delhi", country: "IN", rating: 4.6, reviews: 1900, eta: "5-10 days", tags: ["Wholesale", "Certified"], hero: img("1587202372775-e229f172b9d7"), open: true },
];

export const PRODUCTS: Product[] = [
  // Food
  { id: "p1", vendorId: "v1", kind: "food", name: "Paneer Butter Masala", category: "Mains", priceUsd: 8.5, image: img("1631452180519-c014fe946bc7"), description: "Cottage cheese in silky tomato-cashew gravy with garlic naan." },
  { id: "p2", vendorId: "v1", kind: "food", name: "Chicken Biryani", category: "Mains", priceUsd: 9.9, image: img("1563379091339-03b21ab4a4f8"), description: "Long-grain basmati layered with saffron chicken and fried onions." },
  { id: "p3", vendorId: "v2", kind: "food", name: "Margherita Pizza", category: "Pizza", priceUsd: 11, image: img("1548365328-9f547fb0953b"), description: "San Marzano tomato, fior di latte, basil, wood-fired 90 seconds." },
  { id: "p4", vendorId: "v3", kind: "food", name: "Tonkotsu Ramen", category: "Ramen", priceUsd: 13.5, image: img("1569718212165-3a8278d5f624"), description: "18-hour pork bone broth, chashu, ajitama egg, scallions." },

  // Grocery
  { id: "p5", vendorId: "v4", kind: "grocery", name: "Organic Bananas (1kg)", category: "Fresh", priceUsd: 1.4, image: img("1571771894821-ce9b6c11b08e"), description: "Farm-picked, fair-trade, from smallholder cooperatives." },
  { id: "p6", vendorId: "v5", kind: "grocery", name: "Sourdough Loaf", category: "Bakery", priceUsd: 4.2, image: img("1509440159596-0249088772ff"), description: "48-hour cold-fermented crusty sourdough." },
  { id: "p7", vendorId: "v6", kind: "grocery", name: "Andean Quinoa (2kg)", category: "Grains", priceUsd: 7.8, image: img("1586201375761-83865001e31c"), description: "Highland-grown tri-color quinoa, protein-rich staple." },

  // Electronics wholesale
  { id: "p8", vendorId: "v7", kind: "electronics", name: "1.5 Ton Split Air Conditioner", category: "Air Conditioners", priceUsd: 320, image: img("1631545308456-53abae4d20a1"), description: "Inverter split AC, 5-star efficiency, copper condenser.", moq: 10, bulkTiers: [{ qty: 10, priceUsd: 320 }, { qty: 50, priceUsd: 295 }, { qty: 200, priceUsd: 270 }], specs: { Capacity: "1.5 Ton", Rating: "5-star", Refrigerant: "R32", Warranty: "1+5 yr" } },
  { id: "p9", vendorId: "v7", kind: "electronics", name: "265L Double-Door Refrigerator", category: "Refrigerators", priceUsd: 410, image: img("1584568694244-14fbdf83bd30"), description: "Frost-free, convertible modes, inverter compressor.", moq: 6, bulkTiers: [{ qty: 6, priceUsd: 410 }, { qty: 30, priceUsd: 378 }, { qty: 100, priceUsd: 349 }], specs: { Capacity: "265L", Type: "Double door", Energy: "3-star" } },
  { id: "p10", vendorId: "v8", kind: "electronics", name: "Desert Air Cooler 90L", category: "Coolers", priceUsd: 145, image: img("1585771724684-38269d6639fd"), description: "Honeycomb pads, inverter compatible, 4-way deflection.", moq: 20, bulkTiers: [{ qty: 20, priceUsd: 145 }, { qty: 100, priceUsd: 132 }], specs: { Tank: "90L", Motor: "Copper" } },
  { id: "p11", vendorId: "v8", kind: "electronics", name: "Ceiling Fan 1200mm (BLDC)", category: "Fans", priceUsd: 55, image: img("1585771724684-38269d6639fd"), description: "BLDC energy-saving ceiling fan with remote.", moq: 50, bulkTiers: [{ qty: 50, priceUsd: 55 }, { qty: 200, priceUsd: 49 }, { qty: 1000, priceUsd: 42 }], specs: { Sweep: "1200mm", Motor: "BLDC", Warranty: "2 yr" } },
  { id: "p12", vendorId: "v7", kind: "electronics", name: "LED Tube Light 20W (Pack of 10)", category: "Tube Lights", priceUsd: 38, image: img("1558002038-1055907df827"), description: "Cool-white 6500K, 2200 lumens, IP20, 2-yr warranty.", moq: 30, bulkTiers: [{ qty: 30, priceUsd: 38 }, { qty: 100, priceUsd: 34 }] },
  { id: "p13", vendorId: "v7", kind: "electronics", name: '55" 4K UHD Smart TV', category: "TVs", priceUsd: 480, image: img("1593359677879-a4bb92f829d1"), description: "4K HDR, Android TV, Dolby Audio, 3× HDMI.", moq: 8, bulkTiers: [{ qty: 8, priceUsd: 480 }, { qty: 40, priceUsd: 445 }], specs: { Size: '55"', Resolution: "4K UHD", OS: "Android TV" } },
  { id: "p14", vendorId: "v8", kind: "electronics", name: '1HP Submersible Water Motor', category: "Water Motors", priceUsd: 165, image: img("1581092918056-0c4c3acd3789"), description: "Copper-winding submersible pump for wells and tanks.", moq: 15, bulkTiers: [{ qty: 15, priceUsd: 165 }, { qty: 60, priceUsd: 149 }], specs: { Power: "1 HP", Head: "45 m" } },
];

export const CATEGORIES = {
  food: ["Mains", "Pizza", "Ramen", "Desserts", "Drinks"],
  grocery: ["Fresh", "Bakery", "Grains", "Dairy", "Household"],
  electronics: ["Air Conditioners", "Refrigerators", "Coolers", "Fans", "Tube Lights", "TVs", "Water Motors"],
};
