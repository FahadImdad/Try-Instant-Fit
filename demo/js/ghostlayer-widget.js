"use strict";(()=>{var p="https://backend-psi-peach.vercel.app",u=class{constructor(e){this.config=null;this.widgetRoot=null;this.shadowRoot=null;this.currentProduct=null;this.brandId=e,this.init()}async init(){try{if(console.log("[GhostLayer] Initializing widget for brand:",this.brandId),await this.loadConfiguration(),!this.config?.enabled){console.log("[GhostLayer] Widget disabled for this brand");return}if(!this.isProductPage()){console.log("[GhostLayer] Not a product page, skipping");return}if(this.currentProduct=this.detectProduct(),!this.currentProduct){console.log("[GhostLayer] Could not detect product, skipping");return}console.log("[GhostLayer] Product detected:",this.currentProduct.name),this.injectTryOnButton(),this.trackEvent("widget_loaded",{product_id:this.currentProduct.id})}catch(e){console.error("[GhostLayer] Initialization error:",e)}}async loadConfiguration(){try{let e=await fetch(`${p}/api/widget/config/${this.brandId}`,{headers:{Accept:"application/json"}});if(e.ok){this.config=await e.json();return}}catch{}this.config={brandId:this.brandId,apiEndpoint:p,buttonText:"Try It On \u2728",buttonColor:"#1a1a2e",buttonPosition:"bottom-right",enabled:!0}}isProductPage(){let e=document.querySelectorAll('script[type="application/ld+json"]');for(let l of Array.from(e))try{let d=JSON.parse(l.textContent||"");if((Array.isArray(d)?d:[d]).some(c=>c["@type"]==="Product"))return!0}catch{}let t=document.querySelector('meta[property="og:type"]')?.getAttribute("content");if(t&&t.toLowerCase().includes("product"))return!0;let r=window.location.pathname.toLowerCase(),o=window.location.search.toLowerCase();if(["/product/","/products/","/p/","/item/","/shop/","/clothing/","product.html"].some(l=>r.includes(l))||o.includes("id=")&&r.includes("product"))return!0;let i=!!(document.querySelector('[class*="price"]')||document.querySelector('[itemprop="price"]')),a=!!(document.querySelector('[class*="add-to-cart"]')||document.querySelector('[class*="addtocart"]')||document.querySelector('button[name="add"]')),g=!!(document.querySelector('[class*="product-image"]')||document.querySelector('[class*="product-gallery"]'));return i&&(a||g)}detectProduct(){return this.extractFromSchema()||this.extractFromOpenGraph()||this.extractFromDOM()}extractFromSchema(){let e=document.querySelectorAll('script[type="application/ld+json"]');for(let t of Array.from(e))try{let r=JSON.parse(t.textContent||""),n=(Array.isArray(r)?r:[r]).find(g=>g["@type"]==="Product");if(!n)continue;let i=n.image,a=Array.isArray(i)?i[0]:i;if(!a)continue;return{id:n.sku||n["@id"]||this.generateProductId(),name:n.name||document.title,imageUrl:a,price:n.offers?.price?.toString(),url:window.location.href}}catch{}return null}extractFromOpenGraph(){let e=document.querySelector('meta[property="og:image"]')?.getAttribute("content"),t=document.querySelector('meta[property="og:title"]')?.getAttribute("content");return e&&t?{id:this.generateProductId(),name:t,imageUrl:e,url:window.location.href}:null}extractFromDOM(){let e=["#pd-main-img","#product-featured-image",".product-image img",".product-gallery img",".product-single__media img",".product-featured-image img",".woocommerce-product-gallery__image img","[data-product-image] img",'[class*="pd-main"] img','[class*="product"] img',"main img"],t="";for(let n of e){let i=document.querySelector(n);if(!i)continue;let a=i.tagName==="IMG"?i:i.querySelector("img");if(a?.src&&!this.isPlaceholderImage(a.src)){t=a.src;break}}let r=["#pd-name",'h1[class*="product"]','[class*="product-title"]','[class*="product-name"]','[itemprop="name"]',"h1"],o="";for(let n of r){let i=document.querySelector(n);if(i?.textContent?.trim()){o=i.textContent.trim();break}}return t&&o?{id:this.generateProductId(),name:o,imageUrl:t,url:window.location.href}:null}isPlaceholderImage(e){let t=e.toLowerCase();return t.includes("placeholder")||t.includes("no-image")||t.includes("noimage")||t.includes("icon")||t.includes("logo")}generateProductId(){return btoa(window.location.pathname).replace(/[^a-zA-Z0-9]/g,"").substring(0,16)}injectTryOnButton(){this.widgetRoot=document.createElement("div"),this.widgetRoot.id="ghostlayer-widget-root",document.body.appendChild(this.widgetRoot),this.shadowRoot=this.widgetRoot.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=this.getButtonHTML(),this.shadowRoot.getElementById("gl-try-btn")?.addEventListener("click",()=>this.openOverlay())}getButtonHTML(){let e=this.config?.buttonColor||"#1a1a2e",t=this.config?.buttonText||"Try It On \u2728",r=this.config?.buttonPosition||"bottom-right",o={"bottom-right":"bottom: 24px; right: 24px;","bottom-left":"bottom: 24px; left: 24px;","top-right":"top: 24px; right: 24px;","top-left":"top: 24px; left: 24px;"};return`
      <style>
        * { box-sizing: border-box; }
        #gl-try-btn {
          position: fixed;
          ${o[r]||o["bottom-right"]}
          background: ${e};
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
      <button id="gl-try-btn">${t}</button>
    `}openOverlay(){this.trackEvent("tryon_opened",{product_id:this.currentProduct?.id}),this.renderOverlay("upload")}renderOverlay(e,t){let r=this.shadowRoot?.getElementById("gl-overlay");r&&r.remove();let o=document.createElement("div");o.id="gl-overlay",o.innerHTML=this.getOverlayHTML(e,t),this.shadowRoot?.appendChild(o),this.bindOverlayEvents(e)}getOverlayHTML(e,t){let r=this.currentProduct?.name||"this item",o=this.currentProduct?.imageUrl||"";return`
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
        ${{upload:`
        <div class="gl-card">
          <div class="gl-header">
            <div class="gl-logo">\u2728 Try It On</div>
            <button class="gl-close" id="gl-close">\u2715</button>
          </div>

          <div class="gl-product-preview">
            ${o?`<img src="${o}" alt="${r}" class="gl-product-img" />`:""}
            <div class="gl-product-name">${r}</div>
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
      `,processing:`
        <div class="gl-card gl-center">
          <div class="gl-spinner"></div>
          <div class="gl-processing-title">Creating your look...</div>
          <div class="gl-processing-sub">Our AI is styling you right now \u2728</div>
          <div class="gl-progress-bar"><div class="gl-progress-fill"></div></div>
        </div>
      `,result:`
        <div class="gl-card">
          <div class="gl-header">
            <div class="gl-logo">\u2728 Your Look</div>
            <button class="gl-close" id="gl-close">\u2715</button>
          </div>
          <img src="${t?.resultUrl||""}" alt="Virtual try-on result" class="gl-result-img" />
          <div class="gl-result-actions">
            <a href="${t?.resultUrl||"#"}" download="my-look.jpg" class="gl-secondary-btn">\u2B07 Download</a>
            <button class="gl-secondary-btn" id="gl-retry">Try Another Photo</button>
            <button class="gl-primary-btn" id="gl-buy-btn">Add to Cart</button>
          </div>
          <p class="gl-privacy">Powered by <strong>Try Instant Fit</strong></p>
        </div>
      `,error:`
        <div class="gl-card gl-center">
          <div class="gl-error-icon">\u26A0\uFE0F</div>
          <div class="gl-error-title">Something went wrong</div>
          <div class="gl-error-msg">${t?.errorMsg||"Please try again with a clear, front-facing photo."}</div>
          <button class="gl-primary-btn" id="gl-retry">Try Again</button>
          <button class="gl-ghost-btn" id="gl-close">Close</button>
        </div>
      `}[e]}
      </div>
    `}bindOverlayEvents(e){let t=this.shadowRoot;if(t){if(t.getElementById("gl-close")?.addEventListener("click",()=>this.closeOverlay()),t.getElementById("gl-overlay")?.addEventListener("click",r=>{r.target.id==="gl-overlay"&&this.closeOverlay()}),e==="upload"){let r=t.getElementById("gl-upload-zone"),o=t.getElementById("gl-file-input"),n=t.getElementById("gl-generate-btn"),i=t.getElementById("gl-preview-wrap"),a=t.getElementById("gl-preview-img"),g=t.getElementById("gl-change-photo"),l=null,d=s=>{if(!s.type.startsWith("image/"))return;l=s;let c=URL.createObjectURL(s);a&&(a.src=c),r&&(r.style.display="none"),i&&(i.style.display="block"),n&&(n.disabled=!1)};r?.addEventListener("click",()=>o?.click()),g?.addEventListener("click",()=>{l=null,r&&(r.style.display="block"),i&&(i.style.display="none"),n&&(n.disabled=!0),o?.click()}),o?.addEventListener("change",()=>{let s=o.files?.[0];s&&d(s)}),r?.addEventListener("dragover",s=>{s.preventDefault(),r.classList.add("gl-drag-over")}),r?.addEventListener("dragleave",()=>{r.classList.remove("gl-drag-over")}),r?.addEventListener("drop",s=>{s.preventDefault(),r.classList.remove("gl-drag-over");let c=s.dataTransfer?.files[0];c&&d(c)}),n?.addEventListener("click",async()=>{l&&await this.generateTryOn(l)})}e==="result"&&(t.getElementById("gl-retry")?.addEventListener("click",()=>this.renderOverlay("upload")),t.getElementById("gl-buy-btn")?.addEventListener("click",()=>{this.trackEvent("buy_clicked",{product_id:this.currentProduct?.id}),this.closeOverlay(),(document.querySelector('button[name="add"]')||document.querySelector('[class*="add-to-cart"]'))?.click()})),e==="error"&&t.getElementById("gl-retry")?.addEventListener("click",()=>this.renderOverlay("upload"))}}closeOverlay(){this.shadowRoot?.getElementById("gl-overlay")?.remove(),this.trackEvent("tryon_closed",{product_id:this.currentProduct?.id})}async generateTryOn(e){this.renderOverlay("processing"),this.trackEvent("tryon_started",{product_id:this.currentProduct?.id});try{let t=new FormData;t.append("user_photo",e),t.append("product_image_url",this.currentProduct?.imageUrl||""),t.append("product_id",this.currentProduct?.id||""),t.append("product_name",this.currentProduct?.name||""),t.append("brand_id",this.brandId),t.append("source","ghost-layer");let r=this.config?.apiEndpoint||p,o=await fetch(`${r}/api/widget/try-on`,{method:"POST",body:t});if(!o.ok){let a=await o.json().catch(()=>({}));throw new Error(a.error||`Server error: ${o.status}`)}let n=await o.json(),i=n.result_url||n.resultUrl;if(!i)throw new Error("No result image returned");this.trackEvent("tryon_completed",{product_id:this.currentProduct?.id,result_url:i}),this.renderOverlay("result",{resultUrl:i})}catch(t){console.error("[GhostLayer] Try-on generation failed:",t),this.trackEvent("tryon_failed",{product_id:this.currentProduct?.id,error:String(t)}),this.renderOverlay("error",{errorMsg:t instanceof Error?t.message:"Please try again."})}}async trackEvent(e,t){try{let r=this.config?.apiEndpoint||p;await fetch(`${r}/api/widget/track`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({brand_id:this.brandId,event_name:e,event_data:t,page_url:window.location.href,timestamp:new Date().toISOString()}),keepalive:!0})}catch{}}};(function(){let e=(document.currentScript||document.querySelector('script[src*="ghostlayer-widget"]'))?.getAttribute("data-brand-id");if(!e){console.warn("[GhostLayer] No data-brand-id attribute found on script tag");return}let t=()=>setTimeout(()=>new u(e),0);document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t):t()})();})();
