/* ==========================================================================
   CIRCLA — data.js
   Single source of truth for the rental catalog (categories + inventory).
   Static site: no backend, no persistence. Data lives here so that every
   page can build its DOM from the same inventory.
   ========================================================================== */

(function (global) {
  "use strict";

  /* ---------------------------------------------------------------- *
   * Categories (tabs of the rental catalog)
   * ---------------------------------------------------------------- */
  var CATEGORIES = [
    {
      id: "outdoor",
      emoji: "🏕️",
      label: "Outdoor & Travel",
      short: "Luar Ruang & Perjalanan",
      blurb: "Tenda, carrier, sleeping bag, dan perlengkapan perjalanan.",
      illustration: "asset/img/cat-outdoor.svg"
    },
    {
      id: "photography",
      emoji: "📷",
      label: "Photography & Content Creation",
      short: "Fotografi & Kreasi Konten",
      blurb: "Kamera, lensa, lighting, dan alat produksi konten.",
      illustration: "asset/img/cat-photography.svg"
    },
    {
      id: "event",
      emoji: "🎉",
      label: "Event & Party",
      short: "Acara & Pesta",
      blurb: "Sound system, projector, lighting, dan dekorasi acara.",
      illustration: "asset/img/cat-event.svg"
    },
    {
      id: "fashion",
      emoji: "👗",
      label: "Fashion & Accessories",
      short: "Mode & Aksesori",
      blurb: "Gaun, jas, kebaya, dan aksesori untuk momen spesial.",
      illustration: "asset/img/cat-fashion.svg"
    },
    {
      id: "tools",
      emoji: "🛠️",
      label: "Tools & Home Equipment",
      short: "Perkakas & Perlengkapan Rumah",
      blurb: "Bor, vacuum, tangga, dan perkakas rumah tangga.",
      illustration: "asset/img/cat-tools.svg"
    },
    {
      id: "entertainment",
      emoji: "🎮",
      label: "Entertainment",
      short: "Hiburan",
      blurb: "Konsol game, VR, dan perlengkapan hiburan rumahan.",
      illustration: "asset/img/cat-entertainment.svg"
    }
  ];

  /* Cities used to spread inventory across Indonesia (deterministic). */
  var CITIES = [
    "Bandung, Jawa Barat",
    "Jakarta Selatan, DKI Jakarta",
    "Yogyakarta, DI Yogyakarta",
    "Surabaya, Jawa Timur",
    "Denpasar, Bali"
  ];

  /* ---------------------------------------------------------------- *
   * Inventory. `photo` points into the local /asset folder — drop the
   * real picture at the same path and the card picks it up instantly;
   * otherwise the flat placeholder (category tint + emoji) is used.
   * ---------------------------------------------------------------- */
  var RAW = [
    /* --- 1. Outdoor & Travel ------------------------------------- */
    ["Tenda Dome Quechua Arpenaz 3P", "Quechua", "outdoor", 50000, 5, "Unit", "⛺"],
    ["Sleeping Bag Bulu Angsa Ultralight", "Consina", "outdoor", 25000, 8, "Unit", "🛏️"],
    ["Carrier Ransel 60L Rhinos Series", "Eiger", "outdoor", 45000, 6, "Unit", "🎒"],
    ["Matras Angin Otomatis + Pompa", "Naturehike", "outdoor", 20000, 7, "Unit", "🟩"],
    ["Kursi Lipat Camping Portable", "Dhaulagiri", "outdoor", 15000, 12, "Unit", "🪑"],
    ["Kompor Portable Mini & Cooking Set", "Kovar", "outdoor", 20000, 9, "Set", "🔥"],
    ["Koper Hardcase 24 Inch TSA Lock", "Samsonite", "outdoor", 55000, 4, "Unit", "🧳"],
    ["Travel Equipment Set (Adapter & Scale)", "Baseus", "outdoor", 15000, 10, "Set", "🔌"],

    /* --- 2. Photography & Content Creation ----------------------- */
    ["Kamera Mirrorless Sony A6400 Kit", "Sony", "photography", 140000, 4, "Unit", "📷"],
    ["Lensa Portrait Sony FE 50mm f/1.8", "Sony", "photography", 45000, 5, "Unit", "🔭"],
    ["Tripod Carbon Fiber Travel Pro", "Manfrotto", "photography", 50000, 6, "Unit", "🦿"],
    ["Gimbal Stabilizer RS3 Mini", "DJI", "photography", 110000, 3, "Unit", "🎛️"],
    ["Mic Wireless Dual Channel Mic 2", "DJI", "photography", 85000, 5, "Unit", "🎙️"],
    ["Studio Lighting Godox SL60W + Softbox", "Godox", "photography", 75000, 3, "Set", "💡"],
    ["Action Camera Hero 11 Black 4K", "GoPro", "photography", 90000, 4, "Unit", "🎥"],

    /* --- 3. Event & Party ---------------------------------------- */
    ["Projector Full HD 4000 Lumens", "Epson", "event", 95000, 4, "Unit", "📽️"],
    ['Portable Speaker 12" + 2 Wireless Mic', "Huper", "event", 160000, 3, "Set", "🔊"],
    ["Microphone Dynamic Vocal Wireless", "Shure", "event", 50000, 6, "Unit", "🎤"],
    ["Lighting Party RGB Laser & Par LED", "Beam", "event", 70000, 4, "Unit", "✨"],
    ["Backdrop Stand Portable 3x3 Meter", "Midio", "event", 40000, 5, "Unit", "🖼️"],
    ["Dekorasi Rustic Event Kit", "Circla Deco", "event", 120000, 2, "Paket", "🌾"],
    ["Perlengkapan Pesta & Dispenser Juice Kaca", "Kedaung", "event", 35000, 6, "Set", "🥤"],

    /* --- 4. Fashion & Accessories -------------------------------- */
    ["Dress Pesta Evening Gown", "Mango / Zara", "fashion", 95000, 4, "Unit", "👗"],
    ["Jas Formal Pria Slim Fit Wool Blend", "The Executive", "fashion", 80000, 5, "Unit", "🤵"],
    ["Kebaya Modern Brokat Wisuda", "Kebaya Craft", "fashion", 70000, 5, "Unit", "👘"],
    ["Shoulder Bag Leather Luxury", "Charles & Keith", "fashion", 45000, 6, "Unit", "👜"],
    ["Sepatu Pantofel / Heels Formal", "Pedro", "fashion", 40000, 4, "Pasang", "👞"],
    ["Set Aksesori Kalung & Gelang Pearl", "Glamour", "fashion", 25000, 8, "Set", "📿"],

    /* --- 5. Tools & Home Equipment ------------------------------- */
    ["Bor Listrik Cordless Hammer Drill 12V", "Makita", "tools", 65000, 5, "Unit", "🔩"],
    ["Vacuum Cleaner Wet & Dry 15L", "Kärcher", "tools", 70000, 3, "Unit", "🧹"],
    ["Carpet Extractor Cleaner Portable", "Bissell", "tools", 90000, 2, "Unit", "🧼"],
    ["Tangga Lipat Teleskopik 3.8 Meter", "Krisbow", "tools", 40000, 4, "Unit", "🪜"],
    ["Mesin Cuci Portable Mini 4.5 Kg", "Mito", "tools", 45000, 3, "Unit", "🌀"],
    ["Kotak Peralatan DIY Set Lengkap 100 Pcs", "Bosch", "tools", 35000, 5, "Set", "🧰"],

    /* --- 6. Entertainment ---------------------------------------- */
    ["PlayStation 5 Console + 2 DualSense", "Sony", "entertainment", 165000, 3, "Unit", "🎮"],
    ["VR Headset Quest 2 128GB", "Meta", "entertainment", 130000, 2, "Unit", "🥽"],
    ["Gaming Steering Wheel & Pedal G29", "Logitech", "entertainment", 95000, 2, "Unit", "🏎️"],
    ["Board Games Collection (Catan, Splendor, Uno)", "Asmodee", "entertainment", 30000, 7, "Paket", "🎲"],
    ["Portable Karaoke Speaker Set + Bluetooth Mic", "Advance", "entertainment", 60000, 4, "Set", "🎶"]
  ];

  /* ---------------------------------------------------------------- *
   * Helpers
   * ---------------------------------------------------------------- */
  function slugify(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);
  }

  /** Security deposit (escrow) — 3x the daily rate, rounded to Rp5.000. */
  function depositFor(price) {
    return Math.ceil((price * 3) / 5000) * 5000;
  }

  /** "Rp60.000" */
  function rupiah(value) {
    var n = Math.round(Number(value) || 0);
    return "Rp" + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  /** "2 hari" / "1 hari" */
  function durasi(hari) {
    return hari + " hari";
  }

  /** Whole days between two ISO dates (min 1, max 365). */
  function daysBetween(from, to) {
    if (!from || !to) return 0;
    var a = new Date(from);
    var b = new Date(to);
    if (isNaN(a) || isNaN(b)) return 0;
    var diff = Math.round((b - a) / 86400000);
    if (diff < 0) return 0;
    return Math.min(Math.max(diff, 1), 365);
  }

  /** YYYY-MM-DD for "today + n" */
  function isoOffset(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  /* ---------------------------------------------------------------- *
   * Build the final product list
   * ---------------------------------------------------------------- */
  var PRODUCTS = RAW.map(function (row, index) {
    var name = row[0];
    var brand = row[1];
    var cat = row[2];
    var price = row[3];
    var stock = row[4];
    var unit = row[5];
    var emoji = row[6];
    var id = slugify(name);

    return {
      id: id,
      name: name,
      brand: brand,
      category: cat,
      price: price,
      priceLabel: rupiah(price),
      deposit: depositFor(price),
      depositLabel: rupiah(depositFor(price)),
      stock: stock,
      unit: unit,
      emoji: emoji,
      city: CITIES[index % CITIES.length],
      photo: "asset/img/produk/" + id + ".jpg"
    };
  });

  function categoryById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i];
    }
    return null;
  }

  function productById(id) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) return PRODUCTS[i];
    }
    return null;
  }

  /* ---------------------------------------------------------------- *
   * Brand constants shared by every page
   * ---------------------------------------------------------------- */
  var BRAND = {
    name: "Circla",
    full: "CIRCLA",
    tagline: "Circular Economy and Sharing",
    slogan: "Rental. Share. Reuse. Sustain.",
    sloganId: "Sewa Barang, Kurangi Limbah, Maksimalkan Manfaat.",
    question: "Why buy it when you can use it?",
    whatsapp:
      "https://wa.me/6289676936012?text=Halo%20Admin%20Circla,%20saya%20ingin%20tanya%20seputar%20sewa%20barang",
    whatsappNumber: "+62 896-7693-6012",
    hotlineRaw: "6289676936012",
    hours: "Operasional 08.00 – 21.00 WIB",
    year: 2026
  };

  global.CIRCLA = {
    BRAND: BRAND,
    CATEGORIES: CATEGORIES,
    PRODUCTS: PRODUCTS,
    categoryById: categoryById,
    productById: productById,
    rupiah: rupiah,
    durasi: durasi,
    daysBetween: daysBetween,
    isoOffset: isoOffset,
    slugify: slugify
  };
})(window);
