/* ==========================================================================
   CIRCLA — main.js
   Vanilla DOM scripting: navigation, scroll reveal, catalog rendering
   (client-side tabs + filtering), reservation modal, partner form.
   No frameworks, no third-party libraries.
   ========================================================================== */

(function () {
  "use strict";

  var C = window.CIRCLA;
  if (!C) return;

  var BRAND = C.BRAND;
  var PRODUCTS = C.PRODUCTS;
  var CATEGORIES = C.CATEGORIES;

  /* ---------------------------------------------------------------- *
   * Tiny DOM helpers
   * ---------------------------------------------------------------- */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function on(el, type, handler, opts) {
    if (el) el.addEventListener(type, handler, opts);
  }

  function moeda(value) {
    return C.rupiah(value);
  }

  var ICON_PIN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/>' +
    '<circle cx="12" cy="10" r="2.6"/></svg>';

  /* ---------------------------------------------------------------- *
   * Toast
   * ---------------------------------------------------------------- */
  var toastTimer = null;

  function toast(message) {
    var el = $("#toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove("is-visible");
    }, 3600);
  }

  /* ---------------------------------------------------------------- *
   * Header + mobile navigation
   * ---------------------------------------------------------------- */
  function initNavigation() {
    var header = $(".site-header");
    var burger = $(".nav__burger");
    var links = $(".nav__links");

    function onScroll() {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    onScroll();
    on(window, "scroll", onScroll, { passive: true });

    if (burger && links) {
      on(burger, "click", function () {
        var open = links.classList.toggle("is-open");
        burger.classList.toggle("is-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });

      $$("a", links).forEach(function (link) {
        on(link, "click", function () {
          links.classList.remove("is-open");
          burger.classList.remove("is-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });
    }

    on(document, "keydown", function (event) {
      if (event.key !== "Escape") return;
      if (links) links.classList.remove("is-open");
      if (burger) burger.classList.remove("is-open");
    });
  }

  /* ---------------------------------------------------------------- *
   * Scroll reveal (soft fade-up)
   * ---------------------------------------------------------------- */
  var revealObserver = null;

  function observeReveal(scope) {
    var nodes = $$(".reveal:not(.is-visible)", scope || document);
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
    }
    nodes.forEach(function (n) { revealObserver.observe(n); });
  }

  /* ---------------------------------------------------------------- *
   * Broken-image fallback -> flat category placeholder
   * ---------------------------------------------------------------- */
  function attachImageFallback(img) {
    if (!img) return;
    on(img, "error", function () {
      var holder = img.closest(".pcard__media, .team-card__photo, .about-figure, .collage__card");
      if (holder) holder.classList.add("is-fallback");
      img.setAttribute("aria-hidden", "true");
    });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
      img.dispatchEvent(new Event("error"));
    }
  }

  /* ---------------------------------------------------------------- *
   * Brand-wide dynamic bits (year, whatsapp links)
   * ---------------------------------------------------------------- */
  function initBrand() {
    $$("[data-brand-year]").forEach(function (el) {
      el.textContent = BRAND.year;
    });
    $$("[data-whatsapp]").forEach(function (el) {
      if (el.tagName === "A") el.setAttribute("href", BRAND.whatsapp);
    });
    $$("[data-whatsapp-number]").forEach(function (el) {
      el.textContent = BRAND.whatsappNumber;
    });
    $$("[data-hotline]").forEach(function (el) {
      el.textContent = BRAND.whatsappNumber;
    });
    $$("[data-hotline-link]").forEach(function (el) {
      el.setAttribute("href", BRAND.whatsapp);
    });
  }

  /* ---------------------------------------------------------------- *
   * Home — quick category preview grid
   * ---------------------------------------------------------------- */
  function renderCategoryGrid() {
    var host = $("[data-category-grid]");
    if (!host) return;

    host.innerHTML = CATEGORIES.map(function (cat, index) {
      var count = PRODUCTS.filter(function (p) { return p.category === cat.id; }).length;
      return (
        '<a class="cat-tile reveal" data-delay="' + ((index % 3) + 1) + '" href="katalog.html?cat=' + cat.id + '">' +
          '<div class="cat-tile__media">' +
            '<img src="' + cat.illustration + '" alt="Ilustrasi kategori ' + cat.label + '" loading="lazy">' +
          "</div>" +
          '<div class="cat-tile__body">' +
            "<div>" +
              '<div class="cat-tile__title">' + cat.emoji + " " + cat.label + "</div>" +
              '<div class="cat-tile__meta">' + count + " barang tersedia</div>" +
            "</div>" +
            '<span class="cat-tile__arrow" aria-hidden="true">' +
              '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2">' +
              '<path d="M5 12h13M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            "</span>" +
          "</div>" +
        "</a>"
      );
    }).join("");

    observeReveal(host);
  }

  /* ---------------------------------------------------------------- *
   * Hero search widget -> catalog with query params
   * ---------------------------------------------------------------- */
  function initHeroSearch() {
    var form = $("[data-hero-search]");
    if (!form) return;

    var catSelect = $("[data-hero-category]", form);
    var fromInput = $("[data-hero-from]", form);
    var toInput = $("[data-hero-to]", form);

    if (catSelect) {
      CATEGORIES.forEach(function (cat) {
        var opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.emoji + " " + cat.label;
        catSelect.appendChild(opt);
      });
    }

    if (fromInput) fromInput.min = C.isoOffset(0);
    if (toInput) toInput.min = C.isoOffset(1);

    on(form, "submit", function (event) {
      event.preventDefault();
      var params = new URLSearchParams();
      var q = $("[data-hero-query]", form);
      if (q && q.value.trim()) params.set("q", q.value.trim());
      if (catSelect && catSelect.value) params.set("cat", catSelect.value);
      if (fromInput && fromInput.value) params.set("from", fromInput.value);
      if (toInput && toInput.value) params.set("to", toInput.value);
      window.location.href = "katalog.html" + (params.toString() ? "?" + params.toString() : "");
    });
  }

  /* ---------------------------------------------------------------- *
   * Catalog page
   * ---------------------------------------------------------------- */
  var state = { cat: "all", q: "", sort: "default" };

  function params() {
    try {
      return new URLSearchParams(window.location.search);
    } catch (err) {
      return new URLSearchParams("");
    }
  }

  function readUrlState() {
    var p = params();
    state.q = p.get("q") || "";
    var cat = p.get("cat");
    state.cat = cat && C.categoryById(cat) ? cat : "all";
    state.sort = p.get("sort") || "default";
  }

  function syncUrl() {
    var p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.cat !== "all") p.set("cat", state.cat);
    if (state.sort !== "default") p.set("sort", state.sort);
    var next = window.location.pathname + (p.toString() ? "?" + p.toString() : "");
    try {
      window.history.replaceState(null, "", next);
    } catch (err) {
      /* file:// protocol — ignore */
    }
  }

  function productCard(p) {
    var cat = C.categoryById(p.category);
    var low = p.stock <= 3;
    return (
      '<article class="pcard fade-in" data-id="' + p.id + '">' +
        '<div class="pcard__media pcard__media--' + p.category + '">' +
          '<span class="pcard__emoji" aria-hidden="true">' + p.emoji + "</span>" +
          '<img src="' + p.photo + '" alt="' + p.name + '" loading="lazy">' +
          '<span class="tag pcard__brand">' + p.brand + "</span>" +
          '<span class="pcard__stock' + (low ? " is-low" : "") + '">' +
            '<span class="badge__dot" aria-hidden="true"></span>' +
            "Tersedia: " + p.stock + " " + p.unit +
          "</span>" +
        "</div>" +
        '<div class="pcard__body">' +
          '<span class="pcard__cat">' + (cat ? cat.label : "Katalog") + "</span>" +
          '<h3 class="pcard__name">' + p.name + "</h3>" +
          '<p class="pcard__loc">' + ICON_PIN + "<span>" + p.city + "</span></p>" +
          '<div class="pcard__foot">' +
            "<div>" +
              '<div class="price__value">' + p.priceLabel + "</div>" +
              '<div class="price__unit">per hari · deposit ' + p.depositLabel + "</div>" +
            "</div>" +
            '<button type="button" class="btn btn--primary btn--sm" data-book="' + p.id + '">Sewa Sekarang</button>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function filteredProducts() {
    var q = state.q.toLowerCase();

    var list = PRODUCTS.filter(function (p) {
      if (state.cat !== "all" && p.category !== state.cat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().indexOf(q) > -1 ||
        p.brand.toLowerCase().indexOf(q) > -1 ||
        p.city.toLowerCase().indexOf(q) > -1
      );
    });

    if (state.sort === "price-asc") {
      list.sort(function (a, b) { return a.price - b.price; });
    } else if (state.sort === "price-desc") {
      list.sort(function (a, b) { return b.price - a.price; });
    } else if (state.sort === "stock-desc") {
      list.sort(function (a, b) { return b.stock - a.stock; });
    }
    return list;
  }

  function renderTabs() {
    var host = $("[data-catalog-tabs]");
    if (!host) return;

    var tabs = [{ id: "all", emoji: "🧩", label: "Semua Kategori", count: PRODUCTS.length }].concat(
      CATEGORIES.map(function (cat) {
        return {
          id: cat.id,
          emoji: cat.emoji,
          label: cat.label,
          count: PRODUCTS.filter(function (p) { return p.category === cat.id; }).length
        };
      })
    );

    host.innerHTML = tabs
      .map(function (tab) {
        return (
          '<button type="button" class="tab' + (state.cat === tab.id ? " is-active" : "") +
          '" data-tab="' + tab.id + '" aria-pressed="' + (state.cat === tab.id) + '">' +
            "<span>" + tab.emoji + " " + tab.label + "</span>" +
            '<span class="tab__count">' + tab.count + "</span>" +
          "</button>"
        );
      })
      .join("");
  }

  function renderCatalog() {
    var grid = $("[data-catalog-grid]");
    if (!grid) return;

    var list = filteredProducts();

    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : '<div class="empty-state">' +
          '<div class="empty-state__icon">🧭</div>' +
          "<h3>Barang tidak ditemukan</h3>" +
          "<p>Coba kata kunci lain, atau jelajahi kategori yang berbeda.</p>" +
        "</div>";

    $$("img", grid).forEach(attachImageFallback);

    var count = $("[data-result-count]");
    if (count) {
      count.innerHTML = "Menampilkan <strong>" + list.length + "</strong> dari " + PRODUCTS.length + " barang";
    }

    var chip = $("[data-active-chip]");
    if (chip) {
      if (state.cat === "all") {
        chip.textContent = state.q ? 'Pencarian: "' + state.q + '"' : "Seluruh kategori";
      } else {
        var cat = C.categoryById(state.cat);
        chip.textContent = cat.emoji + " " + cat.label + (state.q ? ' · "' + state.q + '"' : "");
      }
    }

    renderTabs();
    syncUrl();
  }

  function initCatalog() {
    var section = $("[data-catalog]");
    if (!section) return;

    readUrlState();

    var searchInput = $("[data-catalog-search]");
    var sortSelect = $("[data-catalog-sort]");
    var tabsHost = $("[data-catalog-tabs]");
    var grid = $("[data-catalog-grid]");

    if (searchInput) searchInput.value = state.q;
    if (sortSelect) sortSelect.value = state.sort;

    on(searchInput, "input", function () {
      state.q = searchInput.value.trim();
      renderCatalog();
    });

    on(sortSelect, "change", function () {
      state.sort = sortSelect.value;
      renderCatalog();
    });

    on(tabsHost, "click", function (event) {
      var tab = event.target.closest("[data-tab]");
      if (!tab) return;
      state.cat = tab.getAttribute("data-tab");
      renderCatalog();
      var head = $("[data-catalog-tabs]");
      if (head && head.scrollIntoView) {
        head.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });

    on(grid, "click", function (event) {
      var btn = event.target.closest("[data-book]");
      if (!btn) return;
      openReservation(btn.getAttribute("data-book"));
    });

    renderCatalog();
  }

  /* ---------------------------------------------------------------- *
   * Reservation modal
   * ---------------------------------------------------------------- */
  var modal, els = {}, lastFocus = null;

  function fillProductSelect(selectedId) {
    if (!els.select) return;
    var html = CATEGORIES.map(function (cat) {
      var items = PRODUCTS.filter(function (p) { return p.category === cat.id; });
      if (!items.length) return "";
      return (
        '<optgroup label="' + cat.emoji + " " + cat.label + '">' +
        items
          .map(function (p) {
            return (
              '<option value="' + p.id + '"' + (p.id === selectedId ? " selected" : "") + ">" +
              p.name + " — " + p.brand + " (" + p.priceLabel + "/hari)" +
              "</option>"
            );
          })
          .join("") +
        "</optgroup>"
      );
    }).join("");
    els.select.innerHTML = html;
  }

  function updateBilling() {
    if (!modal) return;
    var product = C.productById(els.select ? els.select.value : "");
    var from = els.from ? els.from.value : "";
    var to = els.to ? els.to.value : "";
    var days = product ? C.daysBetween(from, to) : 0;
    var subtotal = product ? product.price * days : 0;
    var deposit = days > 0 && product ? product.deposit : 0;

    if (els.sumProduct) els.sumProduct.textContent = product ? product.name : "—";
    if (els.sumDays) els.sumDays.textContent = days > 0 ? C.durasi(days) : "—";
    if (els.sumSubtotal) els.sumSubtotal.textContent = moeda(subtotal);
    if (els.sumDeposit) els.sumDeposit.textContent = moeda(deposit);
    if (els.sumTotal) els.sumTotal.textContent = moeda(subtotal + deposit);
    if (els.sumRate) {
      els.sumRate.textContent = product ? product.priceLabel + " / hari" : "—";
    }
  }

  function openReservation(productId) {
    if (!modal) return;
    lastFocus = document.activeElement;

    /* Restore the form if a previous submission replaced the modal body. */
    if (els.body && !$("[data-reservation-form]", els.body)) {
      els.body.innerHTML = els.formHTML;
      bindReservationForm();
    }

    var product = C.productById(productId) || PRODUCTS[0];

    if (els.form) els.form.reset();
    fillProductSelect(product.id);
    if (els.select) els.select.value = product.id;
    if (els.preview) els.preview.classList.remove("is-visible");

    if (els.from) {
      els.from.value = C.isoOffset(1);
      els.from.min = C.isoOffset(0);
    }
    if (els.to) {
      els.to.value = C.isoOffset(3);
      els.to.min = C.isoOffset(2);
    }

    updateBilling();

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");

    window.setTimeout(function () {
      var first = $("#r-nama", modal);
      if (first) first.focus();
    }, 220);
  }

  function closeReservation() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-locked");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function validateReservation() {
    var nama = $("#r-nama", modal);
    var wa = $("#r-wa", modal);
    var file = $("#r-ktp", modal);
    var agree = $("#r-agree", modal);

    if (!nama || nama.value.trim().length < 3) {
      toast("Mohon isi nama lengkap penyewa (minimal 3 karakter).");
      if (nama) nama.focus();
      return null;
    }
    var digits = (wa.value || "").replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) {
      toast("Nomor WhatsApp belum valid. Contoh: 08123456789.");
      wa.focus();
      return null;
    }
    if (!els.from.value || !els.to.value) {
      toast("Mohon tentukan tanggal mulai dan selesai sewa.");
      return null;
    }
    if (C.daysBetween(els.from.value, els.to.value) < 1) {
      toast("Tanggal selesai harus setelah tanggal mulai.");
      els.to.focus();
      return null;
    }
    if (!file || !file.files || !file.files.length) {
      toast("Unggah foto identitas (KTP) untuk simulasi verifikasi KYC.");
      return null;
    }
    if (!agree || !agree.checked) {
      toast("Centang persetujuan Syarat & Ketentuan Escrow terlebih dahulu.");
      return null;
    }

    return { nama: nama.value.trim(), wa: digits, file: file.files[0] };
  }

  function showSuccess(data) {
    var product = C.productById(els.select.value);
    var days = C.daysBetween(els.from.value, els.to.value);
    var subtotal = product.price * days;
    var total = subtotal + product.deposit;
    var metode = $('input[name="r-metode"]:checked', modal);
    var metodeLabel = metode ? metode.getAttribute("data-label") : "COD / Ambil Sendiri";

    var message =
      "Halo Admin Circla!\n\nSaya ingin mengajukan reservasi:\n" +
      "Nama: " + data.nama + "\n" +
      "WhatsApp: " + data.wa + "\n" +
      "Barang: " + product.name + " (" + product.brand + ")\n" +
      "Tanggal: " + els.from.value + " s/d " + els.to.value + " (" + days + " hari)\n" +
      "Metode: " + metodeLabel + "\n" +
      "Total estimasi: " + moeda(total) + " (termasuk deposit " + product.depositLabel + ")";

    var waLink = "https://wa.me/" + BRAND.hotlineRaw + "?text=" + encodeURIComponent(message);

    if (!els.body) return;

    els.body.innerHTML =
      '<div class="success">' +
        '<div class="success__icon" aria-hidden="true">♻️</div>' +
        "<h3>Pengajuan Reservasi Terkirim!</h3>" +
        "<p>Terima kasih, <strong>" + data.nama + "</strong>. Pengajuan kamu sedang ditinjau tim Circla. " +
        "Pembayaran sewa dan deposit escrow akan diinformasikan lewat WhatsApp dalam 1×24 jam.</p>" +
        '<div class="billing receipt">' +
          '<div class="billing__row"><span>Kode Reservasi</span><span>CIR-' +
            String(Date.now()).slice(-6) + "</span></div>" +
          '<div class="billing__row"><span>Barang</span><span>' + product.name + "</span></div>" +
          '<div class="billing__row"><span>Durasi</span><span>' + C.durasi(days) + "</span></div>" +
          '<div class="billing__row"><span>Biaya Sewa</span><span>' + moeda(subtotal) + "</span></div>" +
          '<div class="billing__row"><span>Deposit Keamanan (Escrow)</span><span>' + product.depositLabel + "</span></div>" +
          '<div class="billing__row billing__row--total"><span>Total</span><span>' + moeda(total) + "</span></div>" +
        "</div>" +
        '<p class="form-note" style="text-align:center">Simulasi front-end: tidak ada pembayaran, verifikasi KYC, ' +
        "atau penyimpanan data yang benar-benar diproses.</p>" +
        '<div class="modal__foot">' +
          '<a class="btn btn--eco" href="' + waLink + '" target="_blank" rel="noopener">Lanjutkan via WhatsApp</a>' +
          '<button type="button" class="btn btn--outline" data-close-modal>Tutup</button>' +
        "</div>" +
      "</div>";

    observeReveal(els.body);
  }

  /* (Re)binds the reservation form. Called once on boot and again whenever
     the modal body is rebuilt after a successful submission. */
  function bindReservationForm() {
    els.form = $("[data-reservation-form]", modal);
    els.select = $("#r-produk", modal);
    els.from = $("#r-mulai", modal);
    els.to = $("#r-selesai", modal);
    els.preview = $("[data-upload-preview]", modal);
    els.sumProduct = $("[data-sum-product]", modal);
    els.sumDays = $("[data-sum-days]", modal);
    els.sumSubtotal = $("[data-sum-subtotal]", modal);
    els.sumDeposit = $("[data-sum-deposit]", modal);
    els.sumTotal = $("[data-sum-total]", modal);
    els.sumRate = $("[data-sum-rate]", modal);

    on(els.select, "change", updateBilling);
    on(els.from, "change", function () {
      if (els.to) {
        els.to.min = els.from.value;
        if (els.to.value && els.to.value <= els.from.value) {
          var d = new Date(els.from.value);
          d.setDate(d.getDate() + 2);
          els.to.value = d.toISOString().slice(0, 10);
        }
      }
      updateBilling();
    });
    on(els.to, "change", updateBilling);

    var fileInput = $("#r-ktp", modal);
    on(fileInput, "change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file || !els.preview) return;
      var nameEl = $("[data-upload-name]", els.preview);
      var thumbEl = $("[data-upload-thumb]", els.preview);
      if (nameEl) nameEl.textContent = file.name;
      els.preview.classList.add("is-visible");
      if (thumbEl && /^image\//.test(file.type)) {
        var reader = new FileReader();
        reader.onload = function (e) { thumbEl.src = e.target.result; };
        reader.readAsDataURL(file);
      } else if (thumbEl) {
        thumbEl.removeAttribute("src");
      }
    });

    on(els.form, "submit", function (event) {
      event.preventDefault();
      var data = validateReservation();
      if (!data) return;
      showSuccess(data);
      toast("Reservasi terkirim. Tim Circla akan menghubungi kamu via WhatsApp.");
    });
  }

  function initReservation() {
    modal = $("[data-modal]");
    if (!modal) return;

    els.body = $("[data-modal-body]", modal);
    els.formHTML = els.body ? els.body.innerHTML : "";

    bindReservationForm();

    on(modal, "click", function (event) {
      if (event.target === modal || event.target.closest("[data-close-modal]")) {
        closeReservation();
      }
    });

    on(document, "keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("is-open")) closeReservation();
    });
  }

  /* ---------------------------------------------------------------- *
   * Partner (lender) form
   * ---------------------------------------------------------------- */
  function initPartnerForm() {
    var form = $("[data-partner-form]");
    if (!form) return;

    var result = $("[data-partner-result]");

    on(form, "submit", function (event) {
      event.preventDefault();

      var nama = $("#p-nama", form);
      var barang = $("#p-barang", form);
      var kategori = $("#p-kategori", form);
      var harga = $("#p-harga", form);
      var wa = $("#p-wa", form);
      var catatan = $("#p-catatan", form);

      if (!nama.value.trim()) { toast("Mohon isi nama pemilik barang."); nama.focus(); return; }
      if (!barang.value.trim()) { toast("Mohon isi nama barang yang ingin didaftarkan."); barang.focus(); return; }
      if (!harga.value || Number(harga.value) <= 0) { toast("Mohon isi estimasi harga sewa harian."); harga.focus(); return; }
      var digits = (wa.value || "").replace(/\D/g, "");
      if (digits.length < 9 || digits.length > 15) { toast("Nomor WhatsApp belum valid."); wa.focus(); return; }

      var cat = C.categoryById(kategori.value);
      var message =
        "Halo Admin Circla!\n\nSaya ingin mendaftarkan barang sebagai mitra pemilik:\n" +
        "Nama: " + nama.value.trim() + "\n" +
        "Barang: " + barang.value.trim() + "\n" +
        "Kategori: " + (cat ? cat.label : "-") + "\n" +
        "Estimasi harga sewa: " + moeda(Number(harga.value)) + " / hari\n" +
        "WhatsApp: " + digits +
        (catatan && catatan.value.trim() ? "\nCatatan: " + catatan.value.trim() : "");

      if (result) {
        result.innerHTML =
          '<div class="alert alert--eco">' +
            "<span>✅</span>" +
            "<div><strong>Pendaftaran barang diterima!</strong><br>" +
            "Tim Circla akan memverifikasi data <strong>" + barang.value.trim() + "</strong> dan menghubungi " +
            nama.value.trim() + " melalui WhatsApp " + digits + " maksimal 1×24 jam.</div>" +
          "</div>";
        result.classList.add("reveal", "is-visible");
      }

      var link = "https://wa.me/" + BRAND.hotlineRaw + "?text=" + encodeURIComponent(message);
      toast("Terima kasih! Lanjutkan pendaftaran via WhatsApp.");
      window.open(link, "_blank", "noopener");
      form.reset();
    });
  }

  /* ---------------------------------------------------------------- *
   * Boot
   * ---------------------------------------------------------------- */
  function boot() {
    initBrand();
    initNavigation();
    initHeroSearch();
    renderCategoryGrid();
    initCatalog();
    initReservation();
    initPartnerForm();
    observeReveal(document);

    $$(".hero img, .about-figure img, .collage__card img").forEach(attachImageFallback);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
