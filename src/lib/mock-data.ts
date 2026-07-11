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
  // Restaurants & food hotels — global
  { id: "v1", name: "Saffron Street Kitchen", type: "restaurant", city: "Mumbai", country: "IN", rating: 4.8, reviews: 1420, eta: "25-35 min", tags: ["Indian", "Vegetarian", "Halal"], hero: img("1565557623262-b51c2513a641"), open: true },
  { id: "v2", name: "La Trattoria del Sole", type: "restaurant", city: "Rome", country: "IT", rating: 4.7, reviews: 980, eta: "30-40 min", tags: ["Italian", "Pizza"], hero: img("1513104890138-7c749659a591"), open: true },
  { id: "v3", name: "Sakura Ramen House", type: "restaurant", city: "Tokyo", country: "JP", rating: 4.9, reviews: 2100, eta: "20-30 min", tags: ["Japanese", "Ramen"], hero: img("1569718212165-3a8278d5f624"), open: true },
  { id: "v9", name: "Le Petit Bistrot", type: "restaurant", city: "Paris", country: "FR", rating: 4.7, reviews: 1550, eta: "35-45 min", tags: ["French", "Bistro"], hero: img("1414235077428-338989a2e8c0"), open: true },
  { id: "v10", name: "Casa de Tacos", type: "restaurant", city: "Mexico City", country: "MX", rating: 4.8, reviews: 1780, eta: "20-30 min", tags: ["Mexican", "Street food"], hero: img("1565299585323-38d6b0865b47"), open: true },
  { id: "v11", name: "Blue Nile Ethiopian", type: "restaurant", city: "Addis Ababa", country: "ET", rating: 4.7, reviews: 620, eta: "30-40 min", tags: ["Ethiopian", "Vegan-friendly"], hero: img("1504674900247-0877df9cc836"), open: true },
  { id: "v12", name: "Bosphorus Grill House", type: "restaurant", city: "Istanbul", country: "TR", rating: 4.8, reviews: 2300, eta: "25-35 min", tags: ["Turkish", "Grill", "Halal"], hero: img("1544025162-d76694265947"), open: true },
  { id: "v13", name: "Rio Churrasco", type: "restaurant", city: "Rio de Janeiro", country: "BR", rating: 4.6, reviews: 1120, eta: "40-50 min", tags: ["Brazilian", "BBQ"], hero: img("1544025162-d76694265947"), open: true },
  { id: "v14", name: "Bangkok Wok Express", type: "restaurant", city: "Bangkok", country: "TH", rating: 4.8, reviews: 2650, eta: "20-30 min", tags: ["Thai", "Street food"], hero: img("1552611052-33e04de081de"), open: true },
  { id: "v15", name: "New York Slice Co.", type: "restaurant", city: "New York", country: "US", rating: 4.6, reviews: 3100, eta: "20-30 min", tags: ["American", "Pizza"], hero: img("1513104890138-7c749659a591"), open: true },
  { id: "v16", name: "Marrakesh Tagine House", type: "restaurant", city: "Marrakesh", country: "MA", rating: 4.7, reviews: 540, eta: "35-45 min", tags: ["Moroccan", "Halal"], hero: img("1541542684-4a9c1f0a1b1e"), open: true },
  { id: "v17", name: "Seoul BBQ Garden", type: "restaurant", city: "Seoul", country: "KR", rating: 4.9, reviews: 1980, eta: "30-40 min", tags: ["Korean", "BBQ"], hero: img("1553163147-622ab57be1c7"), open: true },
  { id: "v18", name: "Highland Hotel Dine-In", type: "restaurant", city: "Edinburgh", country: "GB", rating: 4.5, reviews: 430, eta: "40-55 min", tags: ["Hotel", "British", "Fine-dining"], hero: img("1551632436-cbf8dd35adfa"), open: true },
  { id: "v19", name: "Nairobi Nyama Choma", type: "restaurant", city: "Nairobi", country: "KE", rating: 4.6, reviews: 780, eta: "30-45 min", tags: ["Kenyan", "Grill"], hero: img("1544025162-d76694265947"), open: true },
  { id: "v20", name: "Sydney Harbourside Cafe", type: "restaurant", city: "Sydney", country: "AU", rating: 4.7, reviews: 990, eta: "25-35 min", tags: ["Cafe", "Brunch"], hero: img("1504674900247-0877df9cc836"), open: true },
  { id: "v21", name: "Berlin Currywurst Haus", type: "restaurant", city: "Berlin", country: "DE", rating: 4.5, reviews: 860, eta: "15-25 min", tags: ["German", "Street food"], hero: img("1414235077428-338989a2e8c0"), open: true },
  { id: "v22", name: "Village Chai & Dhaba", type: "restaurant", city: "Jaipur", country: "IN", rating: 4.6, reviews: 320, eta: "25-40 min", tags: ["Indian", "Rural"], hero: img("1565557623262-b51c2513a641"), open: true, rural: true },

  // Groceries & provisions — urban and rural
  { id: "v4", name: "Village Harvest Market", type: "grocery", city: "Kigali", country: "RW", rating: 4.6, reviews: 340, eta: "1-2 hr", tags: ["Organic", "Rural"], hero: img("1488459716781-31db52582fe9"), open: true, rural: true },
  { id: "v5", name: "GreenBasket Grocers", type: "grocery", city: "London", country: "GB", rating: 4.5, reviews: 780, eta: "45 min", tags: ["Fresh", "Bakery"], hero: img("1542838132-92c53300491e"), open: true },
  { id: "v6", name: "Andes Provisions", type: "grocery", city: "Cusco", country: "PE", rating: 4.7, reviews: 210, eta: "2 hr", tags: ["Rural", "Local"], hero: img("1550989460-0adf9ea622e2"), open: true, rural: true },
  { id: "v23", name: "Sahel Provision Store", type: "grocery", city: "Bamako", country: "ML", rating: 4.4, reviews: 120, eta: "2-3 hr", tags: ["Rural", "Staples"], hero: img("1488459716781-31db52582fe9"), open: true, rural: true },
  { id: "v24", name: "Mekong Fresh Market", type: "grocery", city: "Ho Chi Minh City", country: "VN", rating: 4.7, reviews: 920, eta: "45-60 min", tags: ["Fresh", "Seafood"], hero: img("1542838132-92c53300491e"), open: true },
  { id: "v25", name: "Nordic Pantry", type: "grocery", city: "Stockholm", country: "SE", rating: 4.6, reviews: 640, eta: "40-60 min", tags: ["Organic", "Dairy"], hero: img("1542838132-92c53300491e"), open: true },
  { id: "v26", name: "Cairo Souq Provisions", type: "grocery", city: "Cairo", country: "EG", rating: 4.5, reviews: 470, eta: "45-60 min", tags: ["Spices", "Staples"], hero: img("1488459716781-31db52582fe9"), open: true },
  { id: "v27", name: "Outback Rural Stores", type: "grocery", city: "Alice Springs", country: "AU", rating: 4.3, reviews: 90, eta: "3-5 hr", tags: ["Rural", "Long-life"], hero: img("1550989460-0adf9ea622e2"), open: true, rural: true },
  { id: "v28", name: "Buenos Aires Almacén", type: "grocery", city: "Buenos Aires", country: "AR", rating: 4.6, reviews: 380, eta: "45 min", tags: ["Bakery", "Meat"], hero: img("1542838132-92c53300491e"), open: true },

  // Electronics wholesale
  { id: "v7", name: "MegaVolt Wholesale", type: "electronics", city: "Shenzhen", country: "CN", rating: 4.8, reviews: 3400, eta: "7-14 days", tags: ["Wholesale", "Appliances"], hero: img("1518770660439-4636190af475"), open: true },
  { id: "v8", name: "Bharat Electricals B2B", type: "electronics", city: "Delhi", country: "IN", rating: 4.6, reviews: 1900, eta: "5-10 days", tags: ["Wholesale", "Certified"], hero: img("1587202372775-e229f172b9d7"), open: true },
  { id: "v29", name: "Istanbul Electro Trade", type: "electronics", city: "Istanbul", country: "TR", rating: 4.5, reviews: 820, eta: "6-12 days", tags: ["Wholesale", "Export"], hero: img("1518770660439-4636190af475"), open: true },
  { id: "v30", name: "Nairobi Power Traders", type: "electronics", city: "Nairobi", country: "KE", rating: 4.4, reviews: 260, eta: "10-18 days", tags: ["Wholesale", "Solar"], hero: img("1587202372775-e229f172b9d7"), open: true },
];

export const PRODUCTS: Product[] = [
  // Food
  { id: "p1", vendorId: "v1", kind: "food", name: "Paneer Butter Masala", category: "Mains", priceUsd: 8.5, image: img("1631452180519-c014fe946bc7"), description: "Cottage cheese in silky tomato-cashew gravy with garlic naan." },
  { id: "p2", vendorId: "v1", kind: "food", name: "Chicken Biryani", category: "Mains", priceUsd: 9.9, image: img("1563379091339-03b21ab4a4f8"), description: "Long-grain basmati layered with saffron chicken and fried onions." },
  { id: "p3", vendorId: "v2", kind: "food", name: "Margherita Pizza", category: "Pizza", priceUsd: 11, image: img("1548365328-9f547fb0953b"), description: "San Marzano tomato, fior di latte, basil, wood-fired 90 seconds." },
  { id: "p4", vendorId: "v3", kind: "food", name: "Tonkotsu Ramen", category: "Ramen", priceUsd: 13.5, image: img("1569718212165-3a8278d5f624"), description: "18-hour pork bone broth, chashu, ajitama egg, scallions." },
  { id: "p15", vendorId: "v9", kind: "food", name: "Coq au Vin", category: "Mains", priceUsd: 18.5, image: img("1414235077428-338989a2e8c0"), description: "Slow-braised chicken in red wine with lardons and mushrooms." },
  { id: "p16", vendorId: "v10", kind: "food", name: "Tacos al Pastor (3 pc)", category: "Mains", priceUsd: 7.2, image: img("1565299585323-38d6b0865b47"), description: "Marinated pork, pineapple, cilantro, onion on corn tortillas." },
  { id: "p17", vendorId: "v11", kind: "food", name: "Doro Wat with Injera", category: "Mains", priceUsd: 12, image: img("1504674900247-0877df9cc836"), description: "Spicy Ethiopian chicken stew with sourdough injera." },
  { id: "p18", vendorId: "v12", kind: "food", name: "Mixed Kebab Platter", category: "Mains", priceUsd: 15.9, image: img("1544025162-d76694265947"), description: "Adana, shish and köfte with rice, salad and lavash." },
  { id: "p19", vendorId: "v13", kind: "food", name: "Picanha Steak", category: "Mains", priceUsd: 22, image: img("1544025162-d76694265947"), description: "Grilled Brazilian rump cap with farofa and vinaigrette." },
  { id: "p20", vendorId: "v14", kind: "food", name: "Pad Thai", category: "Mains", priceUsd: 8.9, image: img("1552611052-33e04de081de"), description: "Wok-tossed rice noodles, prawns, tamarind, peanuts." },
  { id: "p21", vendorId: "v15", kind: "food", name: "NY Cheese Slice", category: "Pizza", priceUsd: 4.5, image: img("1548365328-9f547fb0953b"), description: "Classic 18-inch thin crust, mozzarella, hand-tossed." },
  { id: "p22", vendorId: "v16", kind: "food", name: "Lamb Tagine", category: "Mains", priceUsd: 16.5, image: img("1541542684-4a9c1f0a1b1e"), description: "Slow-cooked lamb with prunes, almonds and preserved lemon." },
  { id: "p23", vendorId: "v17", kind: "food", name: "Bulgogi Beef Set", category: "Mains", priceUsd: 17.5, image: img("1553163147-622ab57be1c7"), description: "Marinated grilled beef, rice, banchan and miso soup." },
  { id: "p24", vendorId: "v18", kind: "food", name: "Hotel Highland Breakfast", category: "Mains", priceUsd: 21, image: img("1551632436-cbf8dd35adfa"), description: "Full Scottish breakfast in-room service tray." },
  { id: "p25", vendorId: "v19", kind: "food", name: "Nyama Choma & Ugali", category: "Mains", priceUsd: 11.5, image: img("1544025162-d76694265947"), description: "Charcoal-grilled goat with ugali and kachumbari." },
  { id: "p26", vendorId: "v20", kind: "food", name: "Avocado Sourdough Toast", category: "Mains", priceUsd: 12, image: img("1504674900247-0877df9cc836"), description: "Smashed avo, poached eggs, dukkah and lime." },
  { id: "p27", vendorId: "v21", kind: "food", name: "Currywurst mit Pommes", category: "Mains", priceUsd: 8.5, image: img("1414235077428-338989a2e8c0"), description: "Berlin-style sausage in curry-ketchup with fries." },
  { id: "p28", vendorId: "v22", kind: "food", name: "Masala Chai & Samosa", category: "Drinks", priceUsd: 2.4, image: img("1565557623262-b51c2513a641"), description: "Village-brewed cardamom chai with fresh samosa." },
  { id: "p29", vendorId: "v1", kind: "food", name: "Gulab Jamun (6 pc)", category: "Desserts", priceUsd: 4.9, image: img("1631452180519-c014fe946bc7"), description: "Warm milk dumplings in cardamom-rose syrup." },
  { id: "p30", vendorId: "v3", kind: "food", name: "Matcha Cheesecake", category: "Desserts", priceUsd: 6.5, image: img("1569718212165-3a8278d5f624"), description: "Japanese-style baked matcha cheesecake slice." },

  // Grocery
  { id: "p5", vendorId: "v4", kind: "grocery", name: "Organic Bananas (1kg)", category: "Fresh", priceUsd: 1.4, image: img("1571771894821-ce9b6c11b08e"), description: "Farm-picked, fair-trade, from smallholder cooperatives." },
  { id: "p6", vendorId: "v5", kind: "grocery", name: "Sourdough Loaf", category: "Bakery", priceUsd: 4.2, image: img("1509440159596-0249088772ff"), description: "48-hour cold-fermented crusty sourdough." },
  { id: "p7", vendorId: "v6", kind: "grocery", name: "Andean Quinoa (2kg)", category: "Grains", priceUsd: 7.8, image: img("1586201375761-83865001e31c"), description: "Highland-grown tri-color quinoa, protein-rich staple." },
  { id: "p31", vendorId: "v23", kind: "grocery", name: "Millet Flour (5kg)", category: "Grains", priceUsd: 6.5, image: img("1586201375761-83865001e31c"), description: "Stone-milled pearl millet from Sahel farmers." },
  { id: "p32", vendorId: "v24", kind: "grocery", name: "Jasmine Rice (5kg)", category: "Grains", priceUsd: 9.4, image: img("1586201375761-83865001e31c"), description: "Fragrant long-grain rice, new-crop harvest." },
  { id: "p33", vendorId: "v24", kind: "grocery", name: "Fresh River Prawns (500g)", category: "Fresh", priceUsd: 8.9, image: img("1571771894821-ce9b6c11b08e"), description: "Same-day catch from the Mekong delta." },
  { id: "p34", vendorId: "v25", kind: "grocery", name: "Organic Whole Milk (1L)", category: "Dairy", priceUsd: 2.1, image: img("1509440159596-0249088772ff"), description: "Grass-fed, low-pasteurised farm milk." },
  { id: "p35", vendorId: "v25", kind: "grocery", name: "Aged Cheddar (250g)", category: "Dairy", priceUsd: 5.8, image: img("1509440159596-0249088772ff"), description: "12-month aged farmhouse cheddar block." },
  { id: "p36", vendorId: "v26", kind: "grocery", name: "Egyptian Spice Mix (200g)", category: "Household", priceUsd: 3.6, image: img("1488459716781-31db52582fe9"), description: "Dukkah blend of nuts, seeds and warm spices." },
  { id: "p37", vendorId: "v26", kind: "grocery", name: "Basmati Rice (10kg)", category: "Grains", priceUsd: 14.5, image: img("1586201375761-83865001e31c"), description: "Extra-long grain aged basmati for large families." },
  { id: "p38", vendorId: "v27", kind: "grocery", name: "Long-life UHT Milk (12x1L)", category: "Dairy", priceUsd: 22, image: img("1509440159596-0249088772ff"), description: "6-month shelf-stable pack for remote deliveries." },
  { id: "p39", vendorId: "v27", kind: "grocery", name: "Canned Beans (24-pack)", category: "Household", priceUsd: 26, image: img("1488459716781-31db52582fe9"), description: "Family bulk pack of protein-rich pantry staple." },
  { id: "p40", vendorId: "v28", kind: "grocery", name: "Argentine Empanadas (12 pc)", category: "Bakery", priceUsd: 9.5, image: img("1509440159596-0249088772ff"), description: "Hand-crimped beef and chicken empanadas, ready-to-bake." },
  { id: "p41", vendorId: "v5", kind: "grocery", name: "Farm Eggs (30 ct)", category: "Fresh", priceUsd: 6.4, image: img("1571771894821-ce9b6c11b08e"), description: "Free-range brown eggs from local farms." },
  { id: "p42", vendorId: "v4", kind: "grocery", name: "Red Beans (2kg)", category: "Grains", priceUsd: 3.9, image: img("1586201375761-83865001e31c"), description: "Sun-dried highland red kidney beans." },

  // Electronics wholesale
  { id: "p8", vendorId: "v7", kind: "electronics", name: "1.5 Ton Split Air Conditioner", category: "Air Conditioners", priceUsd: 320, image: img("1631545308456-53abae4d20a1"), description: "Inverter split AC, 5-star efficiency, copper condenser.", moq: 10, bulkTiers: [{ qty: 10, priceUsd: 320 }, { qty: 50, priceUsd: 295 }, { qty: 200, priceUsd: 270 }], specs: { Capacity: "1.5 Ton", Rating: "5-star", Refrigerant: "R32", Warranty: "1+5 yr" } },
  { id: "p9", vendorId: "v7", kind: "electronics", name: "265L Double-Door Refrigerator", category: "Refrigerators", priceUsd: 410, image: img("1584568694244-14fbdf83bd30"), description: "Frost-free, convertible modes, inverter compressor.", moq: 6, bulkTiers: [{ qty: 6, priceUsd: 410 }, { qty: 30, priceUsd: 378 }, { qty: 100, priceUsd: 349 }], specs: { Capacity: "265L", Type: "Double door", Energy: "3-star" } },
  { id: "p10", vendorId: "v8", kind: "electronics", name: "Desert Air Cooler 90L", category: "Coolers", priceUsd: 145, image: img("1585771724684-38269d6639fd"), description: "Honeycomb pads, inverter compatible, 4-way deflection.", moq: 20, bulkTiers: [{ qty: 20, priceUsd: 145 }, { qty: 100, priceUsd: 132 }], specs: { Tank: "90L", Motor: "Copper" } },
  { id: "p11", vendorId: "v8", kind: "electronics", name: "Ceiling Fan 1200mm (BLDC)", category: "Fans", priceUsd: 55, image: img("1585771724684-38269d6639fd"), description: "BLDC energy-saving ceiling fan with remote.", moq: 50, bulkTiers: [{ qty: 50, priceUsd: 55 }, { qty: 200, priceUsd: 49 }, { qty: 1000, priceUsd: 42 }], specs: { Sweep: "1200mm", Motor: "BLDC", Warranty: "2 yr" } },
  { id: "p12", vendorId: "v7", kind: "electronics", name: "LED Tube Light 20W (Pack of 10)", category: "Tube Lights", priceUsd: 38, image: img("1558002038-1055907df827"), description: "Cool-white 6500K, 2200 lumens, IP20, 2-yr warranty.", moq: 30, bulkTiers: [{ qty: 30, priceUsd: 38 }, { qty: 100, priceUsd: 34 }] },
  { id: "p13", vendorId: "v7", kind: "electronics", name: '55" 4K UHD Smart TV', category: "TVs", priceUsd: 480, image: img("1593359677879-a4bb92f829d1"), description: "4K HDR, Android TV, Dolby Audio, 3× HDMI.", moq: 8, bulkTiers: [{ qty: 8, priceUsd: 480 }, { qty: 40, priceUsd: 445 }], specs: { Size: '55"', Resolution: "4K UHD", OS: "Android TV" } },
  { id: "p14", vendorId: "v8", kind: "electronics", name: '1HP Submersible Water Motor', category: "Water Motors", priceUsd: 165, image: img("1581092918056-0c4c3acd3789"), description: "Copper-winding submersible pump for wells and tanks.", moq: 15, bulkTiers: [{ qty: 15, priceUsd: 165 }, { qty: 60, priceUsd: 149 }], specs: { Power: "1 HP", Head: "45 m" } },
  { id: "p43", vendorId: "v29", kind: "electronics", name: "Solar Panel 450W", category: "Fans", priceUsd: 125, image: img("1518770660439-4636190af475"), description: "Mono-PERC solar panel, 25-yr performance warranty.", moq: 20, bulkTiers: [{ qty: 20, priceUsd: 125 }, { qty: 100, priceUsd: 112 }, { qty: 500, priceUsd: 98 }] },
  { id: "p44", vendorId: "v30", kind: "electronics", name: "Solar Home Kit 300W", category: "Fans", priceUsd: 220, image: img("1587202372775-e229f172b9d7"), description: "Panel, inverter, battery and lights — off-grid ready.", moq: 10, bulkTiers: [{ qty: 10, priceUsd: 220 }, { qty: 50, priceUsd: 199 }] },
  { id: "p45", vendorId: "v29", kind: "electronics", name: "Washing Machine 7kg", category: "Refrigerators", priceUsd: 245, image: img("1584568694244-14fbdf83bd30"), description: "Fully-automatic top-load, inverter motor.", moq: 8, bulkTiers: [{ qty: 8, priceUsd: 245 }, { qty: 40, priceUsd: 225 }] },

