"use strict";
(() => {
  // src/index.ts
  var DEFAULT_API = "https://api.tryinstantfit.com";
  var GhostLayerWidget = class {
    constructor(brandId) {
      this.config = null;
      this.widgetRoot = null;
      this.shadowRoot = null;
      this.currentProduct = null;
      this.brandId = brandId;
      this.init();
    }
    // ─── Initialization ───────────────────────────────────────────────────────
    async init() {
      try {
        console.log("[GhostLayer] Initializing widget for brand:", this.brandId);
        await this.loadConfiguration();
        if (!this.config?.enabled) {
          console.log("[GhostLayer] Widget disabled for this brand");
          return;
        }
        if (!this.isProductPage()) {
          console.log("[GhostLayer] Not a product page, skipping");
          return;
        }
        this.currentProduct = this.detectProduct();
        if (!this.currentProduct) {
          console.log("[GhostLayer] Could not detect product, skipping");
          return;
        }
        console.log("[GhostLayer] Product detected:", this.currentProduct.name);
        this.injectTryOnButton();
        this.trackEvent("widget_loaded", { product_id: this.currentProduct.id });
      } catch (error) {
        console.error("[GhostLayer] Initialization error:", error);
      }
    }
    async loadConfiguration() {
      try {
        const response = await fetch(
          `${DEFAULT_API}/api/widget/config/${this.brandId}`,
          { headers: { "Accept": "application/json" } }
        );
        if (response.ok) {
          this.config = await response.json();
          return;
        }
      } catch (_e) {
      }
      this.config = {
        brandId: this.brandId,
        apiEndpoint: DEFAULT_API,
        buttonText: "Try It On \u2728",
        buttonColor: "#1a1a2e",
        buttonPosition: "bottom-right",
        enabled: true
      };
    }
    // ─── Product Page Detection ────────────────────────────────────────────────
    isProductPage() {
      const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of Array.from(schemaScripts)) {
        try {
          const data = JSON.parse(script.textContent || "");
          const items = Array.isArray(data) ? data : [data];
          if (items.some((item) => item["@type"] === "Product"))
            return true;
        } catch (_e) {
        }
      }
      const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute("content");
      if (ogType && ogType.toLowerCase().includes("product"))
        return true;
      const url = window.location.pathname.toLowerCase();
      const urlPatterns = ["/product/", "/products/", "/p/", "/item/", "/shop/", "/clothing/"];
      if (urlPatterns.some((p) => url.includes(p)))
        return true;
      const hasPrice = !!(document.querySelector('[class*="price"]') || document.querySelector('[itemprop="price"]'));
      const hasAddToCart = !!(document.querySelector('[class*="add-to-cart"]') || document.querySelector('[class*="addtocart"]') || document.querySelector('button[name="add"]'));
      const hasProductImage = !!(document.querySelector('[class*="product-image"]') || document.querySelector('[class*="product-gallery"]'));
      return hasPrice && (hasAddToCart || hasProductImage);
    }
    // ─── Product Detection ─────────────────────────────────────────────────────
    detectProduct() {
      return this.extractFromSchema() || this.extractFromOpenGraph() || this.extractFromDOM();
    }
    extractFromSchema() {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const script of Array.from(scripts)) {
        try {
          const data = JSON.parse(script.textContent || "");
          const items = Array.isArray(data) ? data : [data];
          const productData = items.find((item) => item["@type"] === "Product");
          if (!productData)
            continue;
          const rawImage = productData.image;
          const imageUrl = Array.isArray(rawImage) ? rawImage[0] : rawImage;
          if (!imageUrl)
            continue;
          return {
            id: productData.sku || productData["@id"] || this.generateProductId(),
            name: productData.name || document.title,
            imageUrl,
            price: productData.offers?.price?.toString(),
            url: window.location.href
          };
        } catch (_e) {
        }
      }
      return null;
    }
    extractFromOpenGraph() {
      const image = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
      const title = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
      if (image && title) {
        return {
          id: this.generateProductId(),
          name: title,
          imageUrl: image,
          url: window.location.href
        };
      }
      return null;
    }
    extractFromDOM() {
      const imageSelectors = [
        ".product-image img",
        ".product-gallery img",
        ".product-single__media img",
        ".product-featured-image img",
        ".woocommerce-product-gallery__image img",
        "[data-product-image] img",
        '[class*="product"] img',
        "main img"
      ];
      let imageUrl = "";
      for (const selector of imageSelectors) {
        const img = document.querySelector(selector);
        if (img?.src && !this.isPlaceholderImage(img.src)) {
          imageUrl = img.src;
          break;
        }
      }
      const nameSelectors = [
        'h1[class*="product"]',
        '[class*="product-title"]',
        '[class*="product-name"]',
        '[itemprop="name"]',
        "h1"
      ];
      let name = "";
      for (const selector of nameSelectors) {
        const el = document.querySelector(selector);
        if (el?.textContent?.trim()) {
          name = el.textContent.trim();
          break;
        }
      }
      if (imageUrl && name) {
        return {
          id: this.generateProductId(),
          name,
          imageUrl,
          url: window.location.href
        };
      }
      return null;
    }
    isPlaceholderImage(url) {
      const lower = url.toLowerCase();
      return lower.includes("placeholder") || lower.includes("no-image") || lower.includes("noimage") || lower.includes("icon") || lower.includes("logo");
    }
    generateProductId() {
      return btoa(window.location.pathname).replace(/[^a-zA-Z0-9]/g, "").substring(0, 16);
    }
    // ─── UI Injection ──────────────────────────────────────────────────────────
    injectTryOnButton() {
      this.widgetRoot = document.createElement("div");
      this.widgetRoot.id = "ghostlayer-widget-root";
      document.body.appendChild(this.widgetRoot);
      this.shadowRoot = this.widgetRoot.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = this.getButtonHTML();
      const btn = this.shadowRoot.getElementById("gl-try-btn");
      btn?.addEventListener("click", () => this.openOverlay());
    }
    getButtonHTML() {
      const color = this.config?.buttonColor || "#1a1a2e";
      const text = this.config?.buttonText || "Try It On \u2728";
      const pos = this.config?.buttonPosition || "bottom-right";
      const posStyles = {
        "bottom-right": "bottom: 24px; right: 24px;",
        "bottom-left": "bottom: 24px; left: 24px;",
        "top-right": "top: 24px; right: 24px;",
        "top-left": "top: 24px; left: 24px;"
      };
      return `
      <style>
        * { box-sizing: border-box; }
        #gl-try-btn {
          position: fixed;
          ${posStyles[pos] || posStyles["bottom-right"]}
          background: ${color};
          color: #fff;
          border: none;
          border-radius: 50px;
          padding: 14px 28px;
          font-size: 15px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          z-index: 2147483646;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          letter-spacing: 0.3px;
        }
        #gl-try-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.3);
        }
        #gl-try-btn:active {
          transform: translateY(0);
        }
      </style>
      <button id="gl-try-btn">${text}</button>
    `;
    }
    // ─── Overlay ───────────────────────────────────────────────────────────────
    openOverlay() {
      this.trackEvent("tryon_opened", { product_id: this.currentProduct?.id });
      this.renderOverlay("upload");
    }
    renderOverlay(step, data) {
      const existing = this.shadowRoot?.getElementById("gl-overlay");
      if (existing)
        existing.remove();
      const overlay = document.createElement("div");
      overlay.id = "gl-overlay";
      overlay.innerHTML = this.getOverlayHTML(step, data);
      this.shadowRoot?.appendChild(overlay);
      this.bindOverlayEvents(step);
    }
    getOverlayHTML(step, data) {
      const productName = this.currentProduct?.name || "this item";
      const productImage = this.currentProduct?.imageUrl || "";
      const stepContent = {
        upload: `
        <div class="gl-card">
          <div class="gl-header">
            <div class="gl-logo">\u2728 Try It On</div>
            <button class="gl-close" id="gl-close">\u2715</button>
          </div>

          <div class="gl-product-preview">
            ${productImage ? `<img src="${productImage}" alt="${productName}" class="gl-product-img" />` : ""}
            <div class="gl-product-name">${productName}</div>
          </div>

          <div class="gl-divider"></div>

          <p class="gl-subtitle">Upload your photo to see how this looks on you</p>

          <div class="gl-upload-zone" id="gl-upload-zone">
            <div class="gl-upload-icon">\u{1F4F8}</div>
            <div class="gl-upload-text">Click to upload your photo</div>
            <div class="gl-upload-hint">or drag & drop here \xB7 JPG, PNG \xB7 Max 10MB</div>
            <input type="file" id="gl-file-input" accept="image/jpeg,image/png,image/webp" hidden />
          </div>

          <div class="gl-preview-wrap" id="gl-preview-wrap" style="display:none">
            <img id="gl-preview-img" class="gl-preview-img" src="" alt="Your photo" />
            <button class="gl-change-btn" id="gl-change-photo">Change photo</button>
          </div>

          <button class="gl-primary-btn" id="gl-generate-btn" disabled>
            Generate Try-On
          </button>

          <p class="gl-privacy">\u{1F512} Your photo is never stored. Processed securely and deleted immediately.</p>
        </div>
      `,
        processing: `
        <div class="gl-card gl-center">
          <div class="gl-spinner"></div>
          <div class="gl-processing-title">Creating your look...</div>
          <div class="gl-processing-sub">Our AI is styling you right now \u2728</div>
          <div class="gl-progress-bar"><div class="gl-progress-fill"></div></div>
        </div>
      `,
        result: `
        <div class="gl-card">
          <div class="gl-header">
            <div class="gl-logo">\u2728 Your Look</div>
            <button class="gl-close" id="gl-close">\u2715</button>
          </div>
          <img src="${data?.resultUrl || ""}" alt="Virtual try-on result" class="gl-result-img" />
          <div class="gl-result-actions">
            <a href="${data?.resultUrl || "#"}" download="my-look.jpg" class="gl-secondary-btn">\u2B07 Download</a>
            <button class="gl-secondary-btn" id="gl-retry">Try Another Photo</button>
            <button class="gl-primary-btn" id="gl-buy-btn">Add to Cart</button>
          </div>
          <p class="gl-privacy">Powered by <strong>Try Instant Fit</strong></p>
        </div>
      `,
        error: `
        <div class="gl-card gl-center">
          <div class="gl-error-icon">\u26A0\uFE0F</div>
          <div class="gl-error-title">Something went wrong</div>
          <div class="gl-error-msg">${data?.errorMsg || "Please try again with a clear, front-facing photo."}</div>
          <button class="gl-primary-btn" id="gl-retry">Try Again</button>
          <button class="gl-ghost-btn" id="gl-close">Close</button>
        </div>
      `
      };
      return `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        #gl-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 2147483647;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          animation: gl-fade-in 0.2s ease;
        }

        @keyframes gl-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .gl-card {
          background: #fff;
          border-radius: 20px;
          width: 420px;
          max-width: calc(100vw - 32px);
          max-height: 90vh;
          overflow-y: auto;
          padding: 28px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: gl-slide-up 0.3s ease;
        }

        @keyframes gl-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .gl-center { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }

        .gl-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .gl-logo {
          font-size: 17px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .gl-close {
          background: #f3f4f6;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          cursor: pointer;
          font-size: 14px;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }
        .gl-close:hover { background: #e5e7eb; }

        .gl-product-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 16px;
        }

        .gl-product-img {
          width: 64px;
          height: 80px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .gl-product-name {
          font-size: 14px;
          font-weight: 600;
          color: #111;
          line-height: 1.4;
        }

        .gl-divider { height: 1px; background: #f3f4f6; margin: 16px 0; }

        .gl-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .gl-upload-zone {
          border: 2px dashed #d1d5db;
          border-radius: 12px;
          padding: 32px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          margin-bottom: 16px;
        }
        .gl-upload-zone:hover, .gl-upload-zone.gl-drag-over {
          border-color: #6366f1;
          background: #f5f3ff;
        }

        .gl-upload-icon { font-size: 36px; margin-bottom: 10px; }
        .gl-upload-text { font-size: 15px; font-weight: 600; color: #374151; margin-bottom: 4px; }
        .gl-upload-hint { font-size: 12px; color: #9ca3af; }

        .gl-preview-wrap {
          position: relative;
          margin-bottom: 16px;
          text-align: center;
        }

        .gl-preview-img {
          width: 100%;
          max-height: 240px;
          object-fit: contain;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .gl-change-btn {
          margin-top: 8px;
          background: none;
          border: none;
          color: #6366f1;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .gl-primary-btn {
          width: 100%;
          padding: 14px;
          background: #1a1a2e;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-bottom: 8px;
        }
        .gl-primary-btn:hover:not(:disabled) { background: #2d2d4e; }
        .gl-primary-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .gl-secondary-btn {
          flex: 1;
          padding: 12px 16px;
          background: #f3f4f6;
          color: #374151;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          text-align: center;
          text-decoration: none;
          display: inline-block;
        }
        .gl-secondary-btn:hover { background: #e5e7eb; }

        .gl-ghost-btn {
          width: 100%;
          padding: 12px;
          background: none;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          margin-top: 8px;
          transition: border-color 0.2s;
        }
        .gl-ghost-btn:hover { border-color: #d1d5db; }

        .gl-privacy {
          font-size: 11px;
          color: #9ca3af;
          text-align: center;
          margin-top: 12px;
          line-height: 1.4;
        }

        /* Processing */
        .gl-spinner {
          width: 56px;
          height: 56px;
          border: 4px solid #e5e7eb;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: gl-spin 0.8s linear infinite;
        }
        @keyframes gl-spin { to { transform: rotate(360deg); } }

        .gl-processing-title { font-size: 18px; font-weight: 700; color: #111; }
        .gl-processing-sub { font-size: 14px; color: #6b7280; }

        .gl-progress-bar {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }
        .gl-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px;
          animation: gl-progress 4s ease-in-out forwards;
        }
        @keyframes gl-progress {
          0% { width: 0%; }
          30% { width: 40%; }
          70% { width: 70%; }
          90% { width: 85%; }
          100% { width: 90%; }
        }

        /* Result */
        .gl-result-img {
          width: 100%;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          margin-bottom: 16px;
        }
        .gl-result-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        /* Error */
        .gl-error-icon { font-size: 48px; }
        .gl-error-title { font-size: 18px; font-weight: 700; color: #111; }
        .gl-error-msg { font-size: 13px; color: #6b7280; line-height: 1.5; }
      </style>

      <div id="gl-overlay">
        ${stepContent[step]}
      </div>
    `;
    }
    bindOverlayEvents(step) {
      const root = this.shadowRoot;
      if (!root)
        return;
      root.getElementById("gl-close")?.addEventListener("click", () => this.closeOverlay());
      root.getElementById("gl-overlay")?.addEventListener("click", (e) => {
        if (e.target.id === "gl-overlay")
          this.closeOverlay();
      });
      if (step === "upload") {
        const uploadZone = root.getElementById("gl-upload-zone");
        const fileInput = root.getElementById("gl-file-input");
        const generateBtn = root.getElementById("gl-generate-btn");
        const previewWrap = root.getElementById("gl-preview-wrap");
        const previewImg = root.getElementById("gl-preview-img");
        const changePhotoBtn = root.getElementById("gl-change-photo");
        let selectedFile = null;
        const handleFile = (file) => {
          if (!file.type.startsWith("image/"))
            return;
          selectedFile = file;
          const url = URL.createObjectURL(file);
          if (previewImg)
            previewImg.src = url;
          if (uploadZone)
            uploadZone.style.display = "none";
          if (previewWrap)
            previewWrap.style.display = "block";
          if (generateBtn)
            generateBtn.disabled = false;
        };
        uploadZone?.addEventListener("click", () => fileInput?.click());
        changePhotoBtn?.addEventListener("click", () => {
          selectedFile = null;
          if (uploadZone)
            uploadZone.style.display = "block";
          if (previewWrap)
            previewWrap.style.display = "none";
          if (generateBtn)
            generateBtn.disabled = true;
          fileInput?.click();
        });
        fileInput?.addEventListener("change", () => {
          const file = fileInput.files?.[0];
          if (file)
            handleFile(file);
        });
        uploadZone?.addEventListener("dragover", (e) => {
          e.preventDefault();
          uploadZone.classList.add("gl-drag-over");
        });
        uploadZone?.addEventListener("dragleave", () => {
          uploadZone.classList.remove("gl-drag-over");
        });
        uploadZone?.addEventListener("drop", (e) => {
          e.preventDefault();
          uploadZone.classList.remove("gl-drag-over");
          const file = e.dataTransfer?.files[0];
          if (file)
            handleFile(file);
        });
        generateBtn?.addEventListener("click", async () => {
          if (!selectedFile)
            return;
          await this.generateTryOn(selectedFile);
        });
      }
      if (step === "result") {
        root.getElementById("gl-retry")?.addEventListener("click", () => this.renderOverlay("upload"));
        root.getElementById("gl-buy-btn")?.addEventListener("click", () => {
          this.trackEvent("buy_clicked", { product_id: this.currentProduct?.id });
          this.closeOverlay();
          const addToCart = document.querySelector('button[name="add"]') || document.querySelector('[class*="add-to-cart"]');
          addToCart?.click();
        });
      }
      if (step === "error") {
        root.getElementById("gl-retry")?.addEventListener("click", () => this.renderOverlay("upload"));
      }
    }
    closeOverlay() {
      this.shadowRoot?.getElementById("gl-overlay")?.remove();
      this.trackEvent("tryon_closed", { product_id: this.currentProduct?.id });
    }
    // ─── Try-On Generation ─────────────────────────────────────────────────────
    async generateTryOn(userPhoto) {
      this.renderOverlay("processing");
      this.trackEvent("tryon_started", { product_id: this.currentProduct?.id });
      try {
        const formData = new FormData();
        formData.append("user_photo", userPhoto);
        formData.append("product_image_url", this.currentProduct?.imageUrl || "");
        formData.append("product_id", this.currentProduct?.id || "");
        formData.append("product_name", this.currentProduct?.name || "");
        formData.append("brand_id", this.brandId);
        formData.append("source", "ghost-layer");
        const apiEndpoint = this.config?.apiEndpoint || DEFAULT_API;
        const response = await fetch(`${apiEndpoint}/api/widget/try-on`, {
          method: "POST",
          body: formData
        });
        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || `Server error: ${response.status}`);
        }
        const result = await response.json();
        const resultUrl = result.result_url || result.resultUrl;
        if (!resultUrl)
          throw new Error("No result image returned");
        this.trackEvent("tryon_completed", {
          product_id: this.currentProduct?.id,
          result_url: resultUrl
        });
        this.renderOverlay("result", { resultUrl });
      } catch (error) {
        console.error("[GhostLayer] Try-on generation failed:", error);
        this.trackEvent("tryon_failed", {
          product_id: this.currentProduct?.id,
          error: String(error)
        });
        this.renderOverlay("error", {
          errorMsg: error instanceof Error ? error.message : "Please try again."
        });
      }
    }
    // ─── Analytics ─────────────────────────────────────────────────────────────
    async trackEvent(eventName, data) {
      try {
        const apiEndpoint = this.config?.apiEndpoint || DEFAULT_API;
        await fetch(`${apiEndpoint}/api/widget/track`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            brand_id: this.brandId,
            event_name: eventName,
            event_data: data,
            page_url: window.location.href,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }),
          keepalive: true
        });
      } catch (_e) {
      }
    }
  };
  (function() {
    const script = document.currentScript || document.querySelector('script[src*="ghostlayer-widget"]');
    const brandId = script?.getAttribute("data-brand-id");
    if (!brandId) {
      console.warn("[GhostLayer] No data-brand-id attribute found on script tag");
      return;
    }
    const initWidget = () => setTimeout(() => new GhostLayerWidget(brandId), 0);
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initWidget);
    } else {
      initWidget();
    }
  })();
})();
