// Ghost Layer Widget SDK
// Try Instant Fit - Virtual Try-On for Fashion E-Commerce
// Version: 2.0.0

interface WidgetConfig {
  brandId: string;
  apiEndpoint: string;
  buttonText: string;
  buttonColor: string;
  buttonPosition: 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
  enabled: boolean;
}

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price?: string;
  url: string;
}

type OverlayStep = 'upload' | 'processing' | 'result' | 'error';

const DEFAULT_API = 'https://backend-tryinstantfit.vercel.app';

class GhostLayerWidget {
  private brandId: string;
  private config: WidgetConfig | null = null;
  private overlayRoot: HTMLElement | null = null;
  private overlayShadow: ShadowRoot | null = null;
  private currentProduct: Product | null = null;
  private isImageOverlay = false;
  private cameraStream: MediaStream | null = null;
  private selectedFile: File | null = null;
  private countdownTimer: number | null = null;
  private lightingInterval: number | null = null;
  private lastBrightness = 128;

  constructor(brandId: string) {
    this.brandId = brandId;
    this.init();
  }

  // ─── Initialization ───────────────────────────────────────────────────────

  private async init(): Promise<void> {
    try {
      console.log('[GhostLayer] Initializing for brand:', this.brandId);
      await this.loadConfiguration();

      if (!this.config?.enabled) {
        console.log('[GhostLayer] Widget disabled');
        return;
      }

      if (!this.isProductPage()) {
        console.log('[GhostLayer] Not a product page');
        return;
      }

      this.currentProduct = this.detectProduct();
      if (!this.currentProduct) {
        console.log('[GhostLayer] No product detected');
        return;
      }

      console.log('[GhostLayer] Product:', this.currentProduct.name);
      this.injectButton();
      this.trackEvent('widget_loaded', { product_id: this.currentProduct.id });
    } catch (err) {
      console.error('[GhostLayer] Init error:', err);
    }
  }

  private async loadConfiguration(): Promise<void> {
    try {
      const res = await fetch(`${DEFAULT_API}/api/widget/config/${this.brandId}`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        this.config = await res.json();
        return;
      }
    } catch (_e) {}

    this.config = {
      brandId: this.brandId,
      apiEndpoint: DEFAULT_API,
      buttonText: 'Try It On ✨',
      buttonColor: '#1a1a2e',
      buttonPosition: 'bottom-right',
      enabled: true,
    };
  }

  // ─── Product Page Detection ───────────────────────────────────────────────

  private isProductPage(): boolean {
    // JSON-LD schema
    for (const script of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
      try {
        const data = JSON.parse(script.textContent || '');
        const items = Array.isArray(data) ? data : [data];
        if (items.some((i) => i['@type'] === 'Product')) return true;
      } catch (_e) {}
    }

    // OG type
    const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content') || '';
    if (ogType.toLowerCase().includes('product')) return true;

    // URL patterns
    const path = window.location.pathname.toLowerCase();
    const qs = window.location.search.toLowerCase();
    const urlPatterns = ['/product/', '/products/', '/p/', '/item/', '/shop/', '/clothing/', 'product.html'];
    if (urlPatterns.some((p) => path.includes(p))) return true;
    if (qs.includes('id=') && path.includes('product')) return true;

    // DOM signals
    const hasPrice = !!(
      document.querySelector('[class*="price"]') || document.querySelector('[itemprop="price"]')
    );
    const hasCart = !!(
      document.querySelector('[class*="add-to-cart"]') ||
      document.querySelector('[class*="addtocart"]') ||
      document.querySelector('button[name="add"]')
    );
    const hasImg = !!(
      document.querySelector('[class*="product-image"]') ||
      document.querySelector('[class*="product-gallery"]')
    );
    return hasPrice && (hasCart || hasImg);
  }

  // ─── Product Detection ────────────────────────────────────────────────────

  private detectProduct(): Product | null {
    return this.fromSchema() || this.fromOG() || this.fromDOM();
  }

  private fromSchema(): Product | null {
    for (const script of Array.from(document.querySelectorAll('script[type="application/ld+json"]'))) {
      try {
        const data = JSON.parse(script.textContent || '');
        const items = Array.isArray(data) ? data : [data];
        const p = items.find((i) => i['@type'] === 'Product');
        if (!p) continue;
        const img = Array.isArray(p.image) ? p.image[0] : p.image;
        if (!img) continue;
        return {
          id: p.sku || p['@id'] || this.genId(),
          name: p.name || document.title,
          imageUrl: img,
          price: p.offers?.price?.toString(),
          url: location.href,
        };
      } catch (_e) {}
    }
    return null;
  }

  private fromOG(): Product | null {
    const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
    const title = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    return image && title ? { id: this.genId(), name: title, imageUrl: image, url: location.href } : null;
  }

  private fromDOM(): Product | null {
    const imgSelectors = [
      '#pd-main-img',
      '#product-featured-image',
      '.product-image img',
      '.product-gallery img',
      '.product-single__media img',
      '.product-featured-image img',
      '.woocommerce-product-gallery__image img',
      '[data-product-image] img',
      '[class*="pd-main"] img',
      '[class*="product"] img',
      'main img',
    ];
    let imageUrl = '';
    for (const sel of imgSelectors) {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) continue;
      const img = el.tagName === 'IMG' ? (el as HTMLImageElement) : el.querySelector('img');
      if (img?.src && !this.isPlaceholder(img.src)) {
        imageUrl = img.src;
        break;
      }
    }

    const nameSelectors = [
      '#pd-name',
      'h1[class*="product"]',
      '[class*="product-title"]',
      '[class*="product-name"]',
      '[itemprop="name"]',
      'h1',
    ];
    let name = '';
    for (const sel of nameSelectors) {
      const t = document.querySelector(sel)?.textContent?.trim();
      if (t) { name = t; break; }
    }

    return imageUrl && name ? { id: this.genId(), name, imageUrl, url: location.href } : null;
  }

  private isPlaceholder(url: string): boolean {
    const l = url.toLowerCase();
    return (
      l.includes('placeholder') ||
      l.includes('no-image') ||
      l.includes('noimage') ||
      l.includes('icon') ||
      l.includes('logo')
    );
  }

  private genId(): string {
    return btoa(location.pathname).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
  }

  // ─── Find Product Image Element ───────────────────────────────────────────

  private findProductImg(): HTMLImageElement | null {
    const selectors = [
      '#pd-main-img',
      '#product-featured-image',
      '.product-featured-image img',
      '.product-single__media img',
      '.product-image img',
      '.woocommerce-product-gallery__image img',
      '[class*="product-gallery"] img',
      '[class*="product-image"] img',
      '[class*="product-photo"] img',
      '[class*="product-media"] img',
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el instanceof HTMLImageElement && el.src && !this.isPlaceholder(el.src)) return el;
    }
    return null;
  }

  // ─── Button Injection ─────────────────────────────────────────────────────

  private injectButton(): void {
    const color = this.config?.buttonColor || '#1a1a2e';
    const text = this.config?.buttonText || 'Try It On ✨';

    // Button element — placed over the product image or as a fallback fixed button
    const btnRoot = document.createElement('div');
    btnRoot.id = 'ghostlayer-btn-root';

    const imgEl = this.findProductImg();

    if (imgEl) {
      this.isImageOverlay = true;
      const container = imgEl.parentElement;
      if (container) {
        if (getComputedStyle(container).position === 'static') {
          container.style.position = 'relative';
        }
        Object.assign(btnRoot.style, {
          position: 'absolute',
          top: '14px',
          right: '14px',
          zIndex: '100',
          pointerEvents: 'auto',
        });
        container.appendChild(btnRoot);
      } else {
        document.body.appendChild(btnRoot);
        this.isImageOverlay = false;
      }
    } else {
      document.body.appendChild(btnRoot);
      this.isImageOverlay = false;
    }

    const btnShadow = btnRoot.attachShadow({ mode: 'open' });

    if (this.isImageOverlay) {
      btnShadow.innerHTML = `
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          button {
            display: block;
            background: ${color};
            color: #fff;
            border: none;
            border-radius: 50px;
            padding: 11px 26px;
            font-size: 14px;
            font-weight: 700;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.4);
            white-space: nowrap;
            letter-spacing: 0.3px;
            transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
          }
          button:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(0,0,0,0.5); filter: brightness(1.12); }
          button:active { transform: translateY(0); }
        </style>
        <button id="gl-try-btn">${text}</button>
      `;
    } else {
      const pos = this.config?.buttonPosition || 'bottom-right';
      const posMap: Record<string, string> = {
        'bottom-right': 'bottom:24px;right:24px;',
        'bottom-left': 'bottom:24px;left:24px;',
        'top-right': 'top:24px;right:24px;',
        'top-left': 'top:24px;left:24px;',
      };
      btnShadow.innerHTML = `
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          button {
            position: fixed;
            ${posMap[pos] || posMap['bottom-right']}
            background: ${color};
            color: #fff;
            border: none;
            border-radius: 50px;
            padding: 14px 28px;
            font-size: 15px;
            font-weight: 700;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            z-index: 2147483646;
            white-space: nowrap;
            letter-spacing: 0.3px;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          button:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.3); }
          button:active { transform: translateY(0); }
        </style>
        <button id="gl-try-btn">${text}</button>
      `;
    }

    btnShadow.getElementById('gl-try-btn')?.addEventListener('click', () => this.openOverlay());

    // Overlay root — always on body so position:fixed works regardless of image container
    this.overlayRoot = document.createElement('div');
    this.overlayRoot.id = 'ghostlayer-overlay-root';
    document.body.appendChild(this.overlayRoot);
    this.overlayShadow = this.overlayRoot.attachShadow({ mode: 'open' });
  }

  // ─── Overlay ──────────────────────────────────────────────────────────────

  private openOverlay(): void {
    this.trackEvent('tryon_opened', { product_id: this.currentProduct?.id });
    this.selectedFile = null;
    this.renderOverlay('upload');
  }

  private renderOverlay(step: OverlayStep, data?: { resultUrl?: string; errorMsg?: string }): void {
    if (!this.overlayShadow) return;
    const existing = this.overlayShadow.getElementById('gl-overlay');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.id = 'gl-overlay';
    el.innerHTML = this.getOverlayInner(step, data);
    this.overlayShadow.appendChild(el);
    this.bindOverlayEvents(step);
  }

  private getOverlayInner(step: OverlayStep, data?: { resultUrl?: string; errorMsg?: string }): string {
    const pName = this.currentProduct?.name || 'this item';
    const pImg = this.currentProduct?.imageUrl || '';

    const productPreview = pImg
      ? `<div class="gl-product-preview">
           <img src="${pImg}" alt="${pName}" class="gl-product-img" />
           <div class="gl-product-name">${pName}</div>
         </div>
         <div class="gl-divider"></div>`
      : '';

    const steps: Record<OverlayStep, string> = {
      upload: `
        <div class="gl-card">
          <div class="gl-header">
            <div class="gl-logo">✨ Try It On</div>
            <button class="gl-close" id="gl-close">✕</button>
          </div>
          ${productPreview}
          <p class="gl-subtitle">Upload your photo or use your camera to see how this looks on you</p>

          <div class="gl-tabs">
            <button class="gl-tab gl-tab-active" id="gl-tab-upload">📁 Upload</button>
            <button class="gl-tab" id="gl-tab-camera">📷 Camera</button>
          </div>

          <!-- Upload Panel -->
          <div id="gl-panel-upload">
            <div class="gl-upload-zone" id="gl-upload-zone">
              <div class="gl-upload-icon">📸</div>
              <div class="gl-upload-text">Click to upload your photo</div>
              <div class="gl-upload-hint">or drag & drop · JPG, PNG, WEBP · Max 10MB</div>
              <input type="file" id="gl-file-input" accept="image/jpeg,image/png,image/webp" hidden />
            </div>
            <div class="gl-preview-wrap" id="gl-upload-preview-wrap" style="display:none">
              <img id="gl-upload-preview-img" class="gl-preview-img" src="" alt="Your photo" />
              <button class="gl-change-btn" id="gl-change-photo">Change photo</button>
            </div>
          </div>

          <!-- Camera Panel -->
          <div id="gl-panel-camera" style="display:none">
            <div class="gl-lighting-bar" id="gl-lighting-bar">
              <span class="gl-lighting-dot" id="gl-lighting-dot"></span>
              <span class="gl-lighting-text" id="gl-lighting-text">Starting camera...</span>
            </div>
            <div class="gl-camera-wrap" id="gl-camera-wrap">
              <video id="gl-camera-video" class="gl-camera-video" autoplay playsinline muted></video>
              <canvas id="gl-camera-canvas" style="display:none" width="640" height="480"></canvas>
<div class="gl-countdown-overlay" id="gl-countdown-overlay" style="display:none">
                <div class="gl-countdown-num" id="gl-countdown-num">5</div>
              </div>
            </div>
            <p class="gl-camera-tip">💡 Stand upright · Full body · Face forward — for best results</p>
            <div class="gl-camera-controls" id="gl-camera-controls">
              <button class="gl-cam-btn gl-capture-btn" id="gl-capture-now" disabled>📸 Capture Now</button>
              <button class="gl-cam-btn gl-timer-btn" id="gl-timer-btn" disabled>⏱ 5s Timer</button>
            </div>
            <div class="gl-camera-error" id="gl-camera-error" style="display:none">
              📵 Camera not available. Allow camera access or use Upload instead.
            </div>
            <div class="gl-preview-wrap" id="gl-camera-preview-wrap" style="display:none">
              <img id="gl-camera-preview-img" class="gl-preview-img" src="" alt="Captured photo" />
              <button class="gl-change-btn" id="gl-retake-btn">↩ Retake</button>
            </div>
          </div>

          <button class="gl-primary-btn" id="gl-generate-btn" disabled>Generate Try-On</button>
          <p class="gl-privacy">🔒 Your photo is never stored. Processed securely and deleted immediately.</p>
        </div>
      `,

      processing: `
        <div class="gl-card gl-center">
          <div class="gl-spinner"></div>
          <div class="gl-processing-title">Creating your look...</div>
          <div class="gl-processing-sub">Our AI is styling you right now ✨</div>
          <div class="gl-progress-bar"><div class="gl-progress-fill"></div></div>
        </div>
      `,

      result: `
        <div class="gl-card">
          <div class="gl-header">
            <div class="gl-logo">✨ Your Look</div>
            <button class="gl-close" id="gl-close">✕</button>
          </div>
          <img src="${data?.resultUrl || ''}" alt="Virtual try-on result" class="gl-result-img" />
          <div class="gl-result-actions">
            <a href="${data?.resultUrl || '#'}" download="my-look.jpg" class="gl-secondary-btn">⬇ Download</a>
            <button class="gl-secondary-btn" id="gl-retry">Try Another Photo</button>
            <button class="gl-primary-btn gl-buy-btn" id="gl-buy-btn">Add to Cart</button>
          </div>
          <p class="gl-privacy">Powered by <strong>Try Instant Fit</strong></p>
        </div>
      `,

      error: `
        <div class="gl-card gl-center">
          <div class="gl-error-icon">⚠️</div>
          <div class="gl-error-title">Something went wrong</div>
          <div class="gl-error-msg">${data?.errorMsg || 'Please try again with a clear, front-facing photo.'}</div>
          <button class="gl-primary-btn" id="gl-retry">Try Again</button>
          <button class="gl-ghost-btn" id="gl-close">Close</button>
        </div>
      `,
    };

    return `<style>${this.css()}</style>${steps[step]}`;
  }

  private css(): string {
    return `
      * { box-sizing: border-box; margin: 0; padding: 0; }

      #gl-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.72);
        backdrop-filter: blur(4px);
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: gl-fade-in 0.2s ease;
      }
      @keyframes gl-fade-in { from { opacity: 0 } to { opacity: 1 } }

      .gl-card {
        background: #fff;
        border-radius: 20px;
        width: 420px;
        max-width: calc(100vw - 32px);
        max-height: 90vh;
        overflow-y: auto;
        padding: 24px 24px 20px;
        box-shadow: 0 24px 64px rgba(0,0,0,0.32);
        animation: gl-slide-up 0.28s ease;
        scrollbar-width: thin;
      }
      @keyframes gl-slide-up {
        from { transform: translateY(18px); opacity: 0 }
        to   { transform: translateY(0);    opacity: 1 }
      }

      .gl-center { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; }

      .gl-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
      .gl-logo { font-size: 16px; font-weight: 700; color: #1a1a2e; }
      .gl-close {
        background: #f3f4f6; border: none; border-radius: 50%;
        width: 30px; height: 30px; cursor: pointer; font-size: 13px;
        color: #6b7280; display: flex; align-items: center; justify-content: center;
        transition: background 0.2s; flex-shrink: 0;
      }
      .gl-close:hover { background: #e5e7eb; }

      .gl-product-preview { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
      .gl-product-img { width: 52px; height: 66px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb; flex-shrink: 0; }
      .gl-product-name { font-size: 13px; font-weight: 600; color: #111; line-height: 1.4; }
      .gl-divider { height: 1px; background: #f3f4f6; margin: 0 0 14px; }

      .gl-subtitle { font-size: 12px; color: #6b7280; margin-bottom: 12px; line-height: 1.5; }

      /* Tabs */
      .gl-tabs { display: flex; gap: 8px; margin-bottom: 12px; }
      .gl-tab {
        flex: 1; padding: 9px 10px; border: 1.5px solid #e5e7eb; border-radius: 10px;
        background: #fff; font-size: 13px; font-weight: 600; color: #6b7280;
        cursor: pointer; transition: all 0.18s;
      }
      .gl-tab:hover { border-color: #374151; color: #374151; }
      .gl-tab-active { background: #1a1a2e; border-color: #1a1a2e; color: #fff; }

      /* Upload */
      .gl-upload-zone {
        border: 2px dashed #d1d5db; border-radius: 12px; padding: 26px 16px;
        text-align: center; cursor: pointer; transition: border-color 0.2s, background 0.2s;
        margin-bottom: 12px;
      }
      .gl-upload-zone:hover, .gl-upload-zone.gl-drag-over { border-color: #6366f1; background: #f5f3ff; }
      .gl-upload-icon { font-size: 30px; margin-bottom: 8px; }
      .gl-upload-text { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 3px; }
      .gl-upload-hint { font-size: 11px; color: #9ca3af; }

      /* Camera */
      .gl-camera-wrap {
        position: relative; border-radius: 12px; overflow: hidden;
        background: #111; margin-bottom: 10px; aspect-ratio: 4/3;
      }
      .gl-camera-video {
        width: 100%; height: 100%; object-fit: cover; display: block;
        transform: scaleX(-1); /* mirror like a selfie */
      }
      .gl-countdown-overlay {
        position: absolute; inset: 0; background: rgba(0,0,0,0.45);
        display: flex; align-items: center; justify-content: center;
      }
      .gl-countdown-num {
        font-size: 88px; font-weight: 900; color: #fff;
        animation: gl-pulse 1s ease infinite;
        text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        line-height: 1;
      }
      @keyframes gl-pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%       { transform: scale(1.08); opacity: 0.9; }
      }
      .gl-camera-tip { font-size: 11px; color: #6b7280; text-align: center; margin-bottom: 8px; }
      .gl-camera-controls { display: flex; gap: 8px; margin-bottom: 10px; }
      .gl-cam-btn {
        flex: 1; padding: 11px 8px; border-radius: 10px; border: none;
        font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.18s;
      }
      .gl-cam-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      .gl-capture-btn { background: #1a1a2e; color: #fff; }
      .gl-capture-btn:hover:not(:disabled) { background: #2d2d4e; }
      .gl-timer-btn { background: #f3f4f6; color: #374151; }
      .gl-timer-btn:hover:not(:disabled) { background: #e5e7eb; }
      .gl-camera-error {
        font-size: 12px; color: #ef4444; text-align: center;
        padding: 10px 12px; background: #fef2f2; border-radius: 8px; margin-bottom: 10px;
      }

      /* Lighting indicator */
      .gl-lighting-bar {
        display: flex; align-items: center; gap: 7px;
        padding: 6px 10px; border-radius: 8px;
        background: #f9fafb; border: 1px solid #e5e7eb;
        margin-bottom: 8px; font-size: 12px; color: #374151;
      }
      .gl-lighting-dot {
        width: 10px; height: 10px; border-radius: 50%;
        background: #9ca3af; flex-shrink: 0;
        transition: background 0.4s;
      }
      .gl-lighting-text { font-weight: 500; flex: 1; }

      /* Preview */
      .gl-preview-wrap { position: relative; margin-bottom: 12px; text-align: center; }
      .gl-preview-img {
        width: 100%; max-height: 210px; object-fit: contain;
        border-radius: 12px; border: 1px solid #e5e7eb;
      }
      .gl-change-btn {
        margin-top: 7px; background: none; border: none;
        color: #6366f1; font-size: 13px; font-weight: 600;
        cursor: pointer; text-decoration: underline;
      }

      /* Buttons */
      .gl-primary-btn {
        width: 100%; padding: 13px; background: #1a1a2e; color: #fff;
        border: none; border-radius: 12px; font-size: 14px; font-weight: 700;
        cursor: pointer; transition: background 0.2s; margin-bottom: 6px;
      }
      .gl-primary-btn:hover:not(:disabled) { background: #2d2d4e; }
      .gl-primary-btn:disabled { opacity: 0.38; cursor: not-allowed; }
      .gl-buy-btn { width: auto; flex: 1; }
      .gl-secondary-btn {
        flex: 1; padding: 11px 12px; background: #f3f4f6; color: #374151;
        border: none; border-radius: 10px; font-size: 13px; font-weight: 600;
        cursor: pointer; text-align: center; text-decoration: none;
        display: inline-block; transition: background 0.2s;
      }
      .gl-secondary-btn:hover { background: #e5e7eb; }
      .gl-ghost-btn {
        width: 100%; padding: 11px; background: none;
        border: 2px solid #e5e7eb; border-radius: 12px;
        font-size: 13px; font-weight: 600; color: #6b7280;
        cursor: pointer; margin-top: 6px;
      }
      .gl-ghost-btn:hover { border-color: #d1d5db; }

      .gl-privacy { font-size: 11px; color: #9ca3af; text-align: center; margin-top: 8px; line-height: 1.4; }

      /* Processing */
      .gl-spinner {
        width: 52px; height: 52px; border: 4px solid #e5e7eb;
        border-top-color: #6366f1; border-radius: 50%;
        animation: gl-spin 0.75s linear infinite;
      }
      @keyframes gl-spin { to { transform: rotate(360deg); } }
      .gl-processing-title { font-size: 17px; font-weight: 700; color: #111; }
      .gl-processing-sub { font-size: 13px; color: #6b7280; }
      .gl-progress-bar { width: 100%; height: 4px; background: #e5e7eb; border-radius: 2px; overflow: hidden; }
      .gl-progress-fill {
        height: 100%; background: linear-gradient(90deg, #6366f1, #8b5cf6);
        animation: gl-progress 4s ease-in-out forwards;
      }
      @keyframes gl-progress {
        0%   { width: 0%; }
        30%  { width: 40%; }
        70%  { width: 72%; }
        90%  { width: 86%; }
        100% { width: 90%; }
      }

      /* Result */
      .gl-result-img { width: 100%; border-radius: 14px; border: 1px solid #e5e7eb; margin-bottom: 14px; }
      .gl-result-actions { display: flex; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; align-items: center; }

      /* Error */
      .gl-error-icon { font-size: 44px; }
      .gl-error-title { font-size: 17px; font-weight: 700; color: #111; }
      .gl-error-msg { font-size: 13px; color: #6b7280; line-height: 1.5; }
    `;
  }

  // ─── Overlay Event Binding ────────────────────────────────────────────────

  private bindOverlayEvents(step: OverlayStep): void {
    const root = this.overlayShadow;
    if (!root) return;

    // Close
    root.getElementById('gl-close')?.addEventListener('click', () => this.closeOverlay());
    root.getElementById('gl-overlay')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).id === 'gl-overlay') this.closeOverlay();
    });

    if (step === 'upload') {
      const generateBtn = root.getElementById('gl-generate-btn') as HTMLButtonElement | null;


      const setFile = (file: File) => {
        this.selectedFile = file;
        if (generateBtn) generateBtn.disabled = false;
      };

      // ── Tab switching ──
      const tabUpload = root.getElementById('gl-tab-upload');
      const tabCamera = root.getElementById('gl-tab-camera');
      const panelUpload = root.getElementById('gl-panel-upload');
      const panelCamera = root.getElementById('gl-panel-camera');

      tabUpload?.addEventListener('click', () => {
        this.stopCamera();
        tabUpload.classList.add('gl-tab-active');
        tabCamera?.classList.remove('gl-tab-active');
        if (panelUpload) panelUpload.style.display = 'block';
        if (panelCamera) panelCamera.style.display = 'none';
      });

      tabCamera?.addEventListener('click', async () => {
        tabCamera.classList.add('gl-tab-active');
        tabUpload?.classList.remove('gl-tab-active');
        if (panelUpload) panelUpload.style.display = 'none';
        if (panelCamera) panelCamera.style.display = 'block';
        await this.startCamera(root);
      });

      // ── Upload handlers ──
      const uploadZone = root.getElementById('gl-upload-zone');
      const fileInput = root.getElementById('gl-file-input') as HTMLInputElement | null;
      const uploadPreviewWrap = root.getElementById('gl-upload-preview-wrap');
      const uploadPreviewImg = root.getElementById('gl-upload-preview-img') as HTMLImageElement | null;

      const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;
        setFile(file);
        const url = URL.createObjectURL(file);
        if (uploadPreviewImg) uploadPreviewImg.src = url;
        if (uploadZone) uploadZone.style.display = 'none';
        if (uploadPreviewWrap) uploadPreviewWrap.style.display = 'block';
      };

      uploadZone?.addEventListener('click', () => fileInput?.click());
      root.getElementById('gl-change-photo')?.addEventListener('click', () => {
        this.selectedFile = null;
        if (generateBtn) generateBtn.disabled = true;
        if (uploadZone) uploadZone.style.display = 'block';
        if (uploadPreviewWrap) uploadPreviewWrap.style.display = 'none';
        fileInput?.click();
      });
      fileInput?.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (file) handleFile(file);
      });
      uploadZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('gl-drag-over');
      });
      uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('gl-drag-over'));
      uploadZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('gl-drag-over');
        const file = (e as DragEvent).dataTransfer?.files[0];
        if (file) handleFile(file);
      });

      // ── Camera handlers ──
      root.getElementById('gl-capture-now')?.addEventListener('click', () => {
        this.capturePhoto(root, setFile);
      });
      root.getElementById('gl-timer-btn')?.addEventListener('click', () => {
        this.startCountdown(root, 5, setFile);
      });
      root.getElementById('gl-retake-btn')?.addEventListener('click', async () => {
        this.selectedFile = null;
        if (generateBtn) generateBtn.disabled = true;
        const cameraPreviewWrap = root.getElementById('gl-camera-preview-wrap');
        const cameraWrap = root.getElementById('gl-camera-wrap');
        const cameraControls = root.getElementById('gl-camera-controls');
        const captureBtn = root.getElementById('gl-capture-now') as HTMLButtonElement | null;
        const timerBtn = root.getElementById('gl-timer-btn') as HTMLButtonElement | null;
        const lightingBar = root.getElementById('gl-lighting-bar');
        if (cameraPreviewWrap) cameraPreviewWrap.style.display = 'none';
        if (cameraWrap) cameraWrap.style.display = 'block';
        if (cameraControls) cameraControls.style.display = 'flex';
        if (lightingBar) lightingBar.style.display = 'flex';
        if (captureBtn) captureBtn.disabled = true;
        if (timerBtn) timerBtn.disabled = true;
        await this.startCamera(root);
      });

      // ── Generate ──
      generateBtn?.addEventListener('click', async () => {
        if (!this.selectedFile) return;
        await this.generateTryOn(this.selectedFile);
      });
    }

    if (step === 'result') {
      root.getElementById('gl-retry')?.addEventListener('click', () => {
        this.selectedFile = null;
        this.renderOverlay('upload');
      });
      root.getElementById('gl-buy-btn')?.addEventListener('click', () => {
        this.trackEvent('buy_clicked', { product_id: this.currentProduct?.id });
        this.closeOverlay();
        const atc =
          document.querySelector<HTMLButtonElement>('button[name="add"]') ||
          document.querySelector<HTMLButtonElement>('[class*="add-to-cart"]');
        atc?.click();
      });
    }

    if (step === 'error') {
      root.getElementById('gl-retry')?.addEventListener('click', () => {
        this.selectedFile = null;
        this.renderOverlay('upload');
      });
    }
  }

  // ─── Camera ───────────────────────────────────────────────────────────────

  private async startCamera(root: ShadowRoot): Promise<void> {
    const video = root.getElementById('gl-camera-video') as HTMLVideoElement | null;
    const errorEl = root.getElementById('gl-camera-error');
    const captureBtn = root.getElementById('gl-capture-now') as HTMLButtonElement | null;
    const timerBtn = root.getElementById('gl-timer-btn') as HTMLButtonElement | null;
    const cameraWrap = root.getElementById('gl-camera-wrap');

    this.stopCamera();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      this.cameraStream = stream;
      if (video) video.srcObject = stream;
      if (cameraWrap) cameraWrap.style.display = 'block';
      if (errorEl) errorEl.style.display = 'none';
      this.monitorLighting(root);
    } catch (_err) {
      if (errorEl) errorEl.style.display = 'block';
      if (cameraWrap) cameraWrap.style.display = 'none';
      if (captureBtn) captureBtn.disabled = true;
      if (timerBtn) timerBtn.disabled = true;
    }
  }

  private capturePhoto(root: ShadowRoot, setFile: (f: File) => void): void {
    const video = root.getElementById('gl-camera-video') as HTMLVideoElement | null;
    const canvas = root.getElementById('gl-camera-canvas') as HTMLCanvasElement | null;
    if (!video || !canvas || !video.videoWidth) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw un-mirrored (as camera sees it) for AI processing
    // Boost brightness if lighting was poor (brightness < 80 on 0-255 scale)
    if (this.lastBrightness > 0 && this.lastBrightness < 80) {
      const boost = Math.min(2.0, 100 / Math.max(this.lastBrightness, 20));
      ctx.filter = `brightness(${boost.toFixed(2)})`;
    }
    ctx.drawImage(video, 0, 0);
    ctx.filter = 'none';

    this.stopCamera();

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });

        const cameraWrap = root.getElementById('gl-camera-wrap');
        const cameraControls = root.getElementById('gl-camera-controls');
        const lightingBar = root.getElementById('gl-lighting-bar');
        const previewWrap = root.getElementById('gl-camera-preview-wrap');
        const previewImg = root.getElementById('gl-camera-preview-img') as HTMLImageElement | null;

        const url = URL.createObjectURL(file);
        if (previewImg) previewImg.src = url;
        if (cameraWrap) cameraWrap.style.display = 'none';
        if (cameraControls) cameraControls.style.display = 'none';
        if (lightingBar) lightingBar.style.display = 'none';
        if (previewWrap) previewWrap.style.display = 'block';

        setFile(file);
      },
      'image/jpeg',
      0.92,
    );
  }

  private monitorLighting(root: ShadowRoot): void {
    if (this.lightingInterval) {
      clearInterval(this.lightingInterval);
      this.lightingInterval = null;
    }

    const video = root.getElementById('gl-camera-video') as HTMLVideoElement | null;
    const dot = root.getElementById('gl-lighting-dot');
    const text = root.getElementById('gl-lighting-text');
    const captureBtn = root.getElementById('gl-capture-now') as HTMLButtonElement | null;
    const timerBtn = root.getElementById('gl-timer-btn') as HTMLButtonElement | null;

    const sample = document.createElement('canvas');
    sample.width = 64;
    sample.height = 48;
    const ctx = sample.getContext('2d');

    this.lightingInterval = window.setInterval(() => {
      if (!ctx || !video || !video.videoWidth) return;
      ctx.drawImage(video, 0, 0, 64, 48);
      const data = ctx.getImageData(0, 0, 64, 48).data;
      let total = 0;
      for (let i = 0; i < data.length; i += 4) {
        total += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }
      const brightness = total / (64 * 48);
      this.lastBrightness = brightness;

      const good = brightness >= 80;
      const ok = brightness >= 50;

      if (dot) dot.style.background = good ? '#22c55e' : ok ? '#f59e0b' : '#ef4444';
      if (text) {
        text.textContent = good
          ? '✓ Good lighting'
          : ok
          ? '⚠ Brighter light will improve results'
          : '✗ Too dark — move to better lighting';
      }

      // Only control buttons when no countdown is active
      if (!this.countdownTimer) {
        if (captureBtn) captureBtn.disabled = !ok;
        if (timerBtn) timerBtn.disabled = !ok;
      }
    }, 500);
  }

  private startCountdown(root: ShadowRoot, seconds: number, setFile: (f: File) => void): void {
    const overlay = root.getElementById('gl-countdown-overlay');
    const numEl = root.getElementById('gl-countdown-num');
    const captureBtn = root.getElementById('gl-capture-now') as HTMLButtonElement | null;
    const timerBtn = root.getElementById('gl-timer-btn') as HTMLButtonElement | null;

    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }

    if (overlay) overlay.style.display = 'flex';
    if (captureBtn) captureBtn.disabled = true;
    if (timerBtn) timerBtn.disabled = true;

    let count = seconds;
    if (numEl) numEl.textContent = String(count);

    this.countdownTimer = window.setInterval(() => {
      count--;
      if (numEl) numEl.textContent = String(count);
      if (count <= 0) {
        clearInterval(this.countdownTimer!);
        this.countdownTimer = null;
        if (overlay) overlay.style.display = 'none';
        if (captureBtn) captureBtn.disabled = false;
        if (timerBtn) timerBtn.disabled = false;
        this.capturePhoto(root, setFile);
      }
    }, 1000);
  }

  private stopCamera(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    if (this.lightingInterval) {
      clearInterval(this.lightingInterval);
      this.lightingInterval = null;
    }
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach((t) => t.stop());
      this.cameraStream = null;
    }
  }

  private closeOverlay(): void {
    this.stopCamera();
    this.overlayShadow?.getElementById('gl-overlay')?.remove();
    this.trackEvent('tryon_closed', { product_id: this.currentProduct?.id });
  }

  // ─── Try-On Generation ────────────────────────────────────────────────────

  private async generateTryOn(userPhoto: File): Promise<void> {
    this.stopCamera();
    this.renderOverlay('processing');
    this.trackEvent('tryon_started', { product_id: this.currentProduct?.id });

    try {
      const formData = new FormData();
      formData.append('user_photo', userPhoto);
      formData.append('product_image_url', this.currentProduct?.imageUrl || '');
      formData.append('product_id', this.currentProduct?.id || '');
      formData.append('product_name', this.currentProduct?.name || '');
      formData.append('brand_id', this.brandId);
      formData.append('source', 'ghost-layer');
      formData.append('provider', 'gemini');

      const api = this.config?.apiEndpoint || DEFAULT_API;
      const res = await fetch(`${api}/api/widget/try-on`, { method: 'POST', body: formData });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.debug || err.error || `Server error: ${res.status}`);
      }

      const result = await res.json();
      const resultUrl: string = result.result_url || result.resultUrl;
      if (!resultUrl) throw new Error('No result image returned');

      this.trackEvent('tryon_completed', { product_id: this.currentProduct?.id, result_url: resultUrl });
      this.renderOverlay('result', { resultUrl });
    } catch (error) {
      console.error('[GhostLayer] Try-on failed:', error);
      this.trackEvent('tryon_failed', { product_id: this.currentProduct?.id, error: String(error) });
      this.renderOverlay('error', {
        errorMsg: error instanceof Error ? error.message : 'Please try again.',
      });
    }
  }

  // ─── Analytics ────────────────────────────────────────────────────────────

  private async trackEvent(eventName: string, data: Record<string, unknown>): Promise<void> {
    try {
      const api = this.config?.apiEndpoint || DEFAULT_API;
      await fetch(`${api}/api/widget/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: this.brandId,
          event_name: eventName,
          event_data: data,
          page_url: location.href,
          timestamp: new Date().toISOString(),
        }),
        keepalive: true,
      });
    } catch (_e) {}
  }
}

// ─── Auto-Initialize ──────────────────────────────────────────────────────────

(function () {
  const script =
    (document.currentScript as HTMLScriptElement | null) ||
    (document.querySelector('script[src*="ghostlayer-widget"]') as HTMLScriptElement | null);

  const brandId = script?.getAttribute('data-brand-id');

  if (!brandId) {
    console.warn('[GhostLayer] No data-brand-id found on script tag');
    return;
  }

  const initWidget = () => setTimeout(() => new GhostLayerWidget(brandId), 0);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
