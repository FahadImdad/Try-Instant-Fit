'use strict';

/* ============================================================
   YOUR BRAND — Complete Product Database & Interactivity
   ============================================================ */

const PRODUCTS = [
  /* ── READY TO WEAR ── */
  {
    id:'rtw-001', cat:'ready-to-wear', sub:'Signature', type:'Kurta',
    fabric:'Embroidered | Raw Silk',
    name:'Paisley Threadwork Kurta',
    price:6000, was:null, discount:0, badge:'new',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#C4956A','#7B4F3A','#2D5A3D','#1B3A6B'],
    colorNames:['Caramel','Rust','Forest','Navy'],
    imgs:[
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dwf3efdb22/images/hi-res/1-26-113-a-h_multi_1.jpg?sw=600&sh=900',
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dwf3efdb22/images/hi-res/1-26-113-a-h_multi_2.jpg?sw=600&sh=900',
    ],
    desc:'Beautifully crafted paisley threadwork kurta in premium raw silk. Intricate hand-embroidery makes each piece unique. Perfect for festive occasions.',
    bestseller:true, featured:true, sku:'1-26-113-A-H'
  },
  {
    id:'rtw-002', cat:'ready-to-wear', sub:'Essentials', type:'Kurta',
    fabric:'Dyed | Khaddar',
    name:'Solid Longline Kurta',
    price:7000, was:null, discount:0, badge:'bestseller',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#D4C5B0','#2D2B2A','#4A6741','#8B0000'],
    colorNames:['Beige','Black','Olive','Maroon'],
    imgs:[
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw84fa8bf2/images/hi-res/1-26-113-a-g_multi_1.jpg?sw=600&sh=900',
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw84fa8bf2/images/hi-res/1-26-113-a-g_multi_2.jpg?sw=600&sh=900',
    ],
    desc:'Elegant solid longline kurta crafted in premium khaddar. A timeless wardrobe essential designed for everyday luxury and comfort.',
    bestseller:true, featured:true, sku:'1-26-113-A-G'
  },
  {
    id:'rtw-003', cat:'ready-to-wear', sub:'Signature', type:'Kurta',
    fabric:'Printed | Lawn',
    name:'Floral Embroidered Kurta',
    price:3850, was:5500, discount:30, badge:'sale',
    sizes:['S','M','L','XL'],
    colors:['#E8D5B7','#C4956A','#7B9E6B'],
    colorNames:['Ivory','Camel','Sage'],
    imgs:[
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw729cbd59/images/hi-res/26-01-3e9-02ta_multi_1.jpg?sw=600&sh=900',
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw729cbd59/images/hi-res/26-01-3e9-02ta_multi_2.jpg?sw=600&sh=900',
    ],
    desc:'Intricate floral embroidery on premium lawn fabric. A statement piece for gatherings and special occasions.',
    bestseller:true, featured:false, sku:'26-01-3E9-02TA'
  },
  {
    id:'rtw-004', cat:'ready-to-wear', sub:'Casuals', type:'Shirt',
    fabric:'Printed | Cambric',
    name:'Floral Tassel Kurta',
    price:5800, was:null, discount:0, badge:'new',
    sizes:['XS','S','M','L','XL'],
    colors:['#F5E6D3','#D4A5A5','#A8C5A0'],
    colorNames:['Peach','Dusty Rose','Mint'],
    imgs:[
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dwb0c73544/images/hi-res/1-26-113-a-c_multi_1.jpg?sw=600&sh=900',
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dwb0c73544/images/hi-res/1-26-113-a-c_multi_2.jpg?sw=600&sh=900',
    ],
    desc:'Playful floral print with delicate tassel detailing on soft cambric. Perfect for casual outings and festive brunches.',
    bestseller:false, featured:true, sku:'1-26-113-A-C'
  },
  {
    id:'rtw-005', cat:'ready-to-wear', sub:'Signature', type:'3 Piece',
    fabric:'Printed | Lawn',
    name:'Digital Print 3-Piece',
    price:3150, was:4500, discount:30, badge:'sale',
    sizes:['S','M','L','XL','XXL'],
    colors:['#6B4E9E','#2D5A8E','#8E2D2D'],
    colorNames:['Purple','Blue','Maroon'],
    imgs:[
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dwd1ab3cea/images/hi-res/26-01-3e9-04tb_multi_1.jpg?sw=600&sh=900',
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dwd1ab3cea/images/hi-res/26-01-3e9-04tb_multi_2.jpg?sw=600&sh=900',
    ],
    desc:'Contemporary digital print on a classic 3-piece silhouette. A complete look for modern occasions.',
    bestseller:true, featured:false, sku:'26-01-3E9-04TB'
  },
  {
    id:'rtw-006', cat:'ready-to-wear', sub:'Essentials', type:'Kurta',
    fabric:'Dyed | Cotton Dobby',
    name:'Textured Cotton Kurta',
    price:3800, was:null, discount:0, badge:null,
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#F5F5DC','#808080','#2D2B2A','#8B4513'],
    colorNames:['Cream','Grey','Black','Rust'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JPS-26-3996_1_3197e4fe-da45-4e8b-9597-243a42e2e967.jpg?v=1770458865',
      'https://us.junaidjamshed.com/cdn/shop/files/26-625_1.jpg?v=1770459496',
    ],
    desc:'Premium textured cotton kurta for everyday comfort. A timeless wardrobe staple available in versatile colours.',
    bestseller:false, featured:false, sku:'1-26-130-A-E'
  },
  {
    id:'rtw-007', cat:'ready-to-wear', sub:'Signature', type:'Kurta',
    fabric:'Embroidered | Khaddar',
    name:'Handwoven Khaddar Kurta',
    price:5000, was:null, discount:0, badge:'new',
    sizes:['S','M','L','XL'],
    colors:['#8B4513','#556B2F','#483D8B','#8B2252'],
    colorNames:['Rust','Olive','Indigo','Plum'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-534_1.jpg?v=1770459197',
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-534_2.jpg?v=1770459197',
    ],
    desc:'Authentic handwoven khaddar kurta celebrating Pakistan\'s rich textile heritage. Each piece tells a story.',
    bestseller:false, featured:true, sku:'26-01-3E9-01TA'
  },
  {
    id:'rtw-008', cat:'ready-to-wear', sub:'Casuals', type:'Shirt',
    fabric:'Printed | Linen',
    name:'Linen Blend Casual Shirt',
    price:2800, was:4000, discount:30, badge:'sale',
    sizes:['XS','S','M','L','XL'],
    colors:['#F0E6D3','#B8D4C8','#D4B8B8'],
    colorNames:['Sand','Seafoam','Blush'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/26-625_1.jpg?v=1770459496',
      'https://us.junaidjamshed.com/cdn/shop/files/26-625_2.jpg?v=1770459496',
    ],
    desc:'Lightweight linen blend casual shirt. Effortlessly stylish for any occasion.',
    bestseller:false, featured:false, sku:'26-01-3E9-08TA'
  },
  {
    id:'rtw-009', cat:'ready-to-wear', sub:'Signature', type:'2 Piece',
    fabric:'Embroidered | Chiffon',
    name:'Embellished 2-Piece Set',
    price:4500, was:null, discount:0, badge:'bestseller',
    sizes:['S','M','L','XL','XXL'],
    colors:['#D4AF37','#C0C0C0','#CD7F32'],
    colorNames:['Gold','Silver','Bronze'],
    imgs:[
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw22446af0/images/hi-res/26-01-3e9-09tb_multi_1.jpg?sw=600&sh=900',
      'https://pk.khaadi.com/dw/image/v2/BJTG_PRD/on/demandware.static/-/Sites-khaadi-master-catalog/default/dw22446af0/images/hi-res/26-01-3e9-09tb_multi_2.jpg?sw=600&sh=900',
    ],
    desc:'Exquisitely embellished 2-piece set for formal gatherings and festive celebrations. Opulent craftsmanship.',
    bestseller:true, featured:true, sku:'26-01-3E9-09TB'
  },
  {
    id:'rtw-010', cat:'ready-to-wear', sub:'Casuals', type:'Kurta',
    fabric:'Printed | Cambric',
    name:'Geometric Print Kurta',
    price:4500, was:null, discount:0, badge:'new',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#E8E0D0','#C4956A','#5C8A7E'],
    colorNames:['Ivory','Camel','Teal'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-568_1.jpg?v=1770459212',
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-568_2.jpg?v=1770459212',
    ],
    desc:'Modern geometric print on premium cambric. A contemporary statement piece for the fashion-forward.',
    bestseller:false, featured:false, sku:'26-01-3E9-10TA'
  },
  {
    id:'rtw-011', cat:'ready-to-wear', sub:'Essentials', type:'Kurta',
    fabric:'Dyed | Cotton',
    name:'Classic Cotton Kurta',
    price:3200, was:null, discount:0, badge:null,
    sizes:['XS','S','M','L','XL','XXL','XXXL'],
    colors:['#FFFFFF','#F5F5DC','#2D2B2A','#8B0000'],
    colorNames:['White','Ivory','Black','Maroon'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JPS-26-3996_1_3197e4fe-da45-4e8b-9597-243a42e2e967.jpg?v=1770458865',
    ],
    desc:'The quintessential brand classic. Timeless silhouette in our signature cotton weave.',
    bestseller:false, featured:false, sku:'KHD-E-001'
  },
  {
    id:'rtw-012', cat:'ready-to-wear', sub:'Signature', type:'Kurta',
    fabric:'Embroidered | Lawn',
    name:'Sunlit Embroidered Kurta',
    price:5950, was:8500, discount:30, badge:'sale',
    sizes:['S','M','L','XL'],
    colors:['#F4D03F','#F39C12','#FDEBD0'],
    colorNames:['Yellow','Amber','Peach'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-568_1.jpg?v=1770459212',
    ],
    desc:'The Sunlit collection brings warmth and radiance. Golden embroidery on premium lawn.',
    bestseller:true, featured:true, sku:'KHD-SUNLIT'
  },

  /* ── FABRICS ── */
  {
    id:'fab-001', cat:'fabrics', sub:'Essentials', type:'2 Piece',
    fabric:'Printed | Lawn',
    name:'2-Piece Lawn Unstitched',
    price:2800, was:null, discount:0, badge:'bestseller',
    sizes:['2.5m','5m (Set)'],
    colors:['#E8D5B7','#C4956A','#5C8A7E','#8B4513'],
    colorNames:['Ivory','Camel','Teal','Rust'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/26-3841_1.jpg?v=1770011691',
    ],
    desc:'Premium quality lawn fabric for a flawless 2-piece. Soft, breathable, and perfect for all seasons.',
    bestseller:true, featured:true, sku:'FAB-L-001'
  },
  {
    id:'fab-002', cat:'fabrics', sub:'Signature', type:'3 Piece',
    fabric:'Embroidered | Chiffon',
    name:'3-Piece Embroidered Fabric',
    price:7500, was:null, discount:0, badge:'bestseller',
    sizes:['5m (Set)'],
    colors:['#D4AF37','#C0C0C0','#8B2252'],
    colorNames:['Gold','Silver','Plum'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-568_1.jpg?v=1770459212',
    ],
    desc:'Luxurious chiffon with intricate embroidery. Create your dream formal outfit for every occasion.',
    bestseller:true, featured:true, sku:'FAB-C-001'
  },
  {
    id:'fab-003', cat:'fabrics', sub:'Essentials', type:'2 Piece',
    fabric:'Printed | Khaddar',
    name:'Khaddar Unstitched 2-Piece',
    price:2240, was:3200, discount:30, badge:'sale',
    sizes:['5m (Set)'],
    colors:['#8B4513','#556B2F','#483D8B'],
    colorNames:['Rust','Olive','Indigo'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-534_1.jpg?v=1770459197',
    ],
    desc:'Authentic handwoven khaddar unstitched fabric. Rich texture perfect for the cooler months.',
    bestseller:false, featured:false, sku:'FAB-K-001'
  },
  {
    id:'fab-004', cat:'fabrics', sub:'Signature', type:'3 Piece',
    fabric:'Printed | Lawn',
    name:'Digital Print 3-Piece Fabric',
    price:4500, was:null, discount:0, badge:'new',
    sizes:['5m (Set)'],
    colors:['#6B4E9E','#E8D5B7','#2D5A3D'],
    colorNames:['Purple','Ivory','Forest'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/26-3841_1.jpg?v=1770011691',
    ],
    desc:'Exquisite digital printed fabric set for a complete 3-piece. Includes shirt, trouser, and dupatta fabric.',
    bestseller:false, featured:true, sku:'FAB-P-001'
  },
  {
    id:'fab-005', cat:'fabrics', sub:'Essentials', type:'2 Piece',
    fabric:'Printed | Cambric',
    name:'Cambric Printed 2-Piece',
    price:2200, was:null, discount:0, badge:null,
    sizes:['2.5m','5m (Set)'],
    colors:['#F5E6D3','#D4A5A5','#A8C5A0','#B0C4DE'],
    colorNames:['Peach','Rose','Sage','Steel Blue'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JPS-26-3996_1_3197e4fe-da45-4e8b-9597-243a42e2e967.jpg?v=1770458865',
    ],
    desc:'Soft cambric in beautiful printed designs. Ideal for comfortable everyday wear.',
    bestseller:false, featured:false, sku:'FAB-CB-001'
  },
  {
    id:'fab-006', cat:'fabrics', sub:'Signature', type:'3 Piece',
    fabric:'Embroidered | Jacquard',
    name:'Silk Blend Jacquard 3-Piece',
    price:6860, was:9800, discount:30, badge:'sale',
    sizes:['5m (Set)'],
    colors:['#4B0082','#800020','#006400'],
    colorNames:['Violet','Burgundy','Hunter Green'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-568_2.jpg?v=1770459212',
    ],
    desc:'Premium silk blend jacquard with woven patterns. The epitome of elegance for formal events.',
    bestseller:false, featured:true, sku:'FAB-SJ-001'
  },

  /* ── MEN'S COLLECTION ── */
  {
    id:'jm-001', cat:'ready-to-wear', gender:'men', sub:'Essentials', type:'Kameez Shalwar',
    fabric:'Blended | 2 Piece',
    name:'Black Kameez Shalwar',
    price:9500, was:null, discount:0, badge:'new',
    sizes:['S','M','L','XL'],
    colors:['#2D2B2A'],
    colorNames:['Black'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JJKS-47585_1.jpg?v=1770017289',
      'https://us.junaidjamshed.com/cdn/shop/files/JJKS-47585_2.jpg?v=1770017289',
    ],
    desc:'A classic eastern wear set crafted in premium blended fabric. Clean stitching and thoughtful detailing offer a neat look and comfortable fit — ideal for everyday wear or special occasions.',
    bestseller:false, featured:true, sku:'JJKS-W-47585'
  },
  {
    id:'jm-002', cat:'ready-to-wear', gender:'men', sub:'Essentials', type:'Kameez Shalwar',
    fabric:'Blended | 2 Piece',
    name:'Fawn Kameez Shalwar',
    price:8500, was:null, discount:0, badge:'bestseller',
    sizes:['S','M','L','XL'],
    colors:['#C8A97E'],
    colorNames:['Fawn'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/47567jjks_1.jpg?v=1770017334',
      'https://us.junaidjamshed.com/cdn/shop/files/47567jjks_2.jpg?v=1770017334',
    ],
    desc:'The Fawn Casual Kameez Shalwar offers a neat look and comfortable fit — ideal for long wear, daily use, or special occasions with a touch of tradition.',
    bestseller:true, featured:true, sku:'JJKS-W-47567'
  },
  {
    id:'jm-003', cat:'ready-to-wear', gender:'men', sub:'Casuals', type:'Kameez Shalwar',
    fabric:'Blended | 2 Piece',
    name:'Sky Blue Kameez Shalwar',
    price:7500, was:null, discount:0, badge:'new',
    sizes:['S','M','L','XL','XXL'],
    colors:['#87CEEB'],
    colorNames:['Sky Blue'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/90559_1.jpg?v=1770017789',
      'https://us.junaidjamshed.com/cdn/shop/files/90559_2.jpg?v=1770017789',
    ],
    desc:'A fresh and relaxed kameez shalwar in soft sky blue blended fabric. Regular fit with clean lines — effortlessly refined for any occasion.',
    bestseller:false, featured:true, sku:'JJKS-A-90559'
  },
  {
    id:'jm-004', cat:'ready-to-wear', gender:'men', sub:'Signature', type:'Kurta',
    fabric:'Cotton | 1 Piece',
    name:'Maroon Cotton Formal Kurta',
    price:6500, was:null, discount:0, badge:'new',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#800020'],
    colorNames:['Maroon'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JJK-50501_1.jpg?v=1770027010',
      'https://us.junaidjamshed.com/cdn/shop/files/JJK-50501_2.jpg?v=1770027010',
    ],
    desc:'Designed for both tradition and modern style, this Maroon Cotton Formal Kurta is a versatile choice that blends contemporary fashion with traditional aesthetics.',
    bestseller:true, featured:true, sku:'JJK-W-50501'
  },
  {
    id:'jm-005', cat:'ready-to-wear', gender:'men', sub:'Casuals', type:'Kurta',
    fabric:'Cotton | 1 Piece',
    name:'Dark Blue Cotton Kurta',
    price:4500, was:6000, discount:25, badge:'sale',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#1A237E'],
    colorNames:['Dark Blue'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JJK-33820_1.jpg?v=1770016849',
      'https://us.junaidjamshed.com/cdn/shop/files/JJK-33820_2.jpg?v=1770016849',
    ],
    desc:'A smart casual kurta in breathable cotton. The deep navy tone makes it easy to pair with matching shalwar or trousers for a polished everyday look.',
    bestseller:false, featured:true, sku:'JJK-A-33820'
  },
  {
    id:'jm-006', cat:'ready-to-wear', gender:'men', sub:'Signature', type:'Kurta',
    fabric:'Blended | 1 Piece',
    name:'Golden Green Special Kurta',
    price:14500, was:null, discount:0, badge:'new',
    sizes:['S','M','L','XL'],
    colors:['#556B2F'],
    colorNames:['Golden Green'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JJKSP-50438_1.jpg?v=1767179519',
      'https://us.junaidjamshed.com/cdn/shop/files/JJKSP-50438_2.jpg?v=1767179519',
    ],
    desc:'An opulent special kurta in golden green blended fabric with fine embellishments. Perfect for Eid, weddings, and festive occasions.',
    bestseller:true, featured:true, sku:'JJK-SP-A-50438'
  },
  {
    id:'jm-007', cat:'ready-to-wear', gender:'men', sub:'Essentials', type:'Kameez Shalwar',
    fabric:'Blended | 2 Piece',
    name:'Navy Blue Kameez Shalwar',
    price:9500, was:null, discount:0, badge:'bestseller',
    sizes:['S','M','L','XL'],
    colors:['#1A237E'],
    colorNames:['Navy Blue'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JJKS-33876_1.jpg?v=1770017694',
      'https://us.junaidjamshed.com/cdn/shop/files/JJKS-33876_2.jpg?v=1770017694',
    ],
    desc:'A refined navy kameez shalwar with immaculate stitching and a regular fit. A wardrobe essential that transitions seamlessly from day to evening.',
    bestseller:true, featured:true, sku:'JJKS-W-33876'
  },

  /* ── WOMEN'S COLLECTION (J.) ── */
  {
    id:'jw-001', cat:'ready-to-wear', gender:'women', sub:'Casuals', type:'Kurta',
    fabric:'Lawn | 1 Piece',
    name:'Off White Lawn Kurti',
    price:3200, was:null, discount:0, badge:'new',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#F8F6F0'],
    colorNames:['Off White'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JPS-26-3996_1_3197e4fe-da45-4e8b-9597-243a42e2e967.jpg?v=1770458865',
      'https://us.junaidjamshed.com/cdn/shop/files/JPS-26-3996_2_c50ae235-f41f-46ee-af42-e1037fe3ab26.jpg?v=1770459508',
    ],
    desc:'A light and airy off-white lawn kurti, perfect for warm days. Easy to style and effortlessly chic for casual outings.',
    bestseller:false, featured:true, sku:'JJLK-S-JSS-26-628'
  },
  {
    id:'jw-002', cat:'ready-to-wear', gender:'women', sub:'Casuals', type:'Kurta',
    fabric:'Lawn | 1 Piece',
    name:'Red Lawn Kurti',
    price:3200, was:null, discount:0, badge:'new',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#C0392B'],
    colorNames:['Red'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/26-625_1.jpg?v=1770459496',
      'https://us.junaidjamshed.com/cdn/shop/files/26-625_2.jpg?v=1770459496',
    ],
    desc:'A vibrant red lawn kurti with delicate detailing. A bold statement piece that is comfortable for all-day wear.',
    bestseller:false, featured:true, sku:'JJLK-S-JSS-26-625'
  },
  {
    id:'jw-003', cat:'ready-to-wear', gender:'women', sub:'Essentials', type:'3 Piece',
    fabric:'Lawn | Stitched',
    name:'Green Lawn 3-Piece Stitched',
    price:7200, was:null, discount:0, badge:'bestseller',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#2D6A4F'],
    colorNames:['Green'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-534_1.jpg?v=1770459197',
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-534_2.jpg?v=1770459197',
    ],
    desc:'A complete 3-piece lawn set in a refreshing shade of green. Shirt, trouser, and dupatta — ready to wear and perfect for festive gatherings.',
    bestseller:true, featured:true, sku:'JLAWN-S-26-534'
  },
  {
    id:'jw-004', cat:'ready-to-wear', gender:'women', sub:'Signature', type:'3 Piece',
    fabric:'Bamber Chiffon | Stitched',
    name:'Green Chiffon 3-Piece Formal',
    price:12500, was:null, discount:0, badge:'new',
    sizes:['XS','S','M','L','XL','XXL'],
    colors:['#1E8449'],
    colorNames:['Green'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-568_1.jpg?v=1770459212',
      'https://us.junaidjamshed.com/cdn/shop/files/JLS-26-568_2.jpg?v=1770459212',
    ],
    desc:'Luxurious bamber chiffon 3-piece stitched formal. The Mukesh embroidery and elegant silhouette make it ideal for formal dinners and celebrations.',
    bestseller:false, featured:true, sku:'JLAWN-S-26-568'
  },
  {
    id:'jw-005', cat:'fabrics', gender:'women', sub:'Signature', type:'3 Piece',
    fabric:'Lawn | Unstitched',
    name:'Red Royal Dynasty Lawn 3-Piece',
    price:8000, was:null, discount:0, badge:'bestseller',
    sizes:['3m (Shirt)','2.5m (Dupatta)','2.5m (Trouser)'],
    colors:['#C0392B'],
    colorNames:['Red'],
    imgs:[
      'https://us.junaidjamshed.com/cdn/shop/files/26-3841_1.jpg?v=1770011691',
      'https://us.junaidjamshed.com/cdn/shop/files/26-3841_2.jpg?v=1770011691',
    ],
    desc:'The Royal Dynasty collection in rich red lawn. Embroidered front, back, sleeves, and dupatta border — a complete unstitched set for a truly regal look.',
    bestseller:true, featured:true, sku:'JLAWN-S-26-3841'
  },
];

const ALL_PRODUCTS = PRODUCTS;

/* ── Cart & Wishlist ── */
let cart     = JSON.parse(localStorage.getItem('yb-cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('kh-wl')   || '[]');

function saveCart() { localStorage.setItem('yb-cart', JSON.stringify(cart)); refreshCartUI(); }
function saveWL()   { localStorage.setItem('kh-wl',   JSON.stringify(wishlist)); refreshWishlistUI(); }
function refreshWishlistUI() {
  const c = wishlist.length;
  document.querySelectorAll('.js-wl-count').forEach(el => {
    el.textContent = c; el.style.display = c > 0 ? 'flex' : 'none';
  });
}

function addToCart(id, size, color, qty=1) {
  const p = ALL_PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const key = `${id}|${size}|${color}`;
  const ex  = cart.find(i => i.key === key);
  ex ? ex.qty += qty : cart.push({ key, id, size, color, qty, p });
  saveCart();
  toast('Added to bag!', 'success');
}
function removeFromCart(key) { cart = cart.filter(i => i.key !== key); saveCart(); renderCartSidebar(); renderFullCart(); }
function changeQty(key, d)   { const i = cart.find(x => x.key === key); if(i) { i.qty = Math.max(1,i.qty+d); saveCart(); renderCartSidebar(); renderFullCart(); } }

function cartTotal()  { return cart.reduce((s,i) => s + i.p.price * i.qty, 0); }
function cartCount()  { return cart.reduce((s,i) => s + i.qty, 0); }
function refreshCartUI() {
  document.querySelectorAll('.js-cart-count').forEach(el => {
    const c = cartCount();
    el.textContent = c; el.style.display = c > 0 ? 'flex' : 'none';
  });
}

function toggleWL(id) {
  const idx = wishlist.indexOf(id);
  idx > -1 ? wishlist.splice(idx,1) : wishlist.push(id);
  saveWL();
  document.querySelectorAll(`[data-wl="${id}"]`).forEach(btn =>
    btn.classList.toggle('active', wishlist.includes(id))
  );
  toast(wishlist.includes(id) ? 'Saved to wishlist!' : 'Removed from wishlist', wishlist.includes(id)?'success':'');
}

/* ── Render product card ── */
function renderCard(p) {
  const disc    = p.discount > 0 ? p.discount : 0;
  const inWL    = wishlist.includes(p.id);
  const sizeHTML = p.sizes.slice(0,6).map(s =>
    `<button class="card-size-btn" onclick="event.stopPropagation();selectSizeFromCard('${p.id}','${s}',this)">${s}</button>`
  ).join('');

  return `
  <div class="product-card" data-id="${p.id}" onclick="goProduct('${p.id}')">
    <div class="card-img">
      <div class="card-imgs">
        <img src="${p.imgs[0]}" alt="${p.name}" loading="lazy"
          onerror="this.src='https://via.placeholder.com/400x600/F9F7F4/2D2B2A?text=YourBrand'">
        ${p.imgs[1] ? `<img src="${p.imgs[1]}" alt="${p.name} alt" loading="lazy">` : ''}
      </div>
      ${p.badge === 'new' ? `<span class="card-badge badge-new">New</span>` : ''}
      ${disc > 0 ? `<span class="card-badge badge-sale">Sale</span><span class="card-pct">${disc}% OFF</span>` : ''}
      ${p.badge === 'bestseller' ? `<span class="card-badge badge-new">Bestseller</span>` : ''}
      <button class="card-wishlist ${inWL?'active':''}"
        data-wl="${p.id}"
        onclick="event.stopPropagation();toggleWL('${p.id}')"
        aria-label="Wishlist">
        <svg viewBox="0 0 24 24" fill="${inWL?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      </button>
      ${p.sizes.length ? `<div class="card-sizes">${sizeHTML}</div>` : ''}
      <button class="card-tryon" onclick="event.stopPropagation();glTryOn('${p.id}','${p.imgs[0]}','${p.name}',${p.price})">Try It On ✨</button>
    </div>
    <div class="card-fabric">${p.fabric}</div>
    <div class="card-name">${p.name}</div>
    <div class="card-price">
      <span class="price-now ${disc>0?'price-sale':''}">PKR ${p.price.toLocaleString()}</span>
      ${disc > 0 ? `<span class="price-was">PKR ${p.was.toLocaleString()}</span>` : ''}
    </div>
  </div>`;
}

function goProduct(id) { window.location.href = `product.html?id=${id}`; }

function glTryOn(id, imageUrl, name, price) {
  const w = window.__ghostlayer;
  if (w) {
    w.openForProduct({ id, imageUrl, name, price: String(price), url: `product.html?id=${id}` });
  } else {
    goProduct(id);
  }
}

function glAddToCart(id) {
  const p = ALL_PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const size = p.sizes?.length ? p.sizes[0] : 'One Size';
  addToCart(id, size, '—');
}

function glAddToWL(id) {
  toggleWL(id);
}

let _selectedSizes = {};
function selectSizeFromCard(id, size, btn) {
  _selectedSizes[id] = size;
  addToCart(id, size, '—');
}

/* ── Hero Slider ── */
function initSlider() {
  const track = document.querySelector('.slider-track');
  const dots   = document.querySelectorAll('.slider-dot');
  if (!track) return;
  const slides = track.children.length;
  let cur = 0, timer;

  function go(n) {
    cur = (n + slides) % slides;
    track.style.transform = `translateX(-${cur * 100}%)`;
    dots.forEach((d,i) => d.classList.toggle('active', i === cur));
  }
  document.querySelector('.slider-btn.next')?.addEventListener('click', () => { go(cur+1); reset(); });
  document.querySelector('.slider-btn.prev')?.addEventListener('click', () => { go(cur-1); reset(); });
  dots.forEach((d,i) => d.addEventListener('click', () => { go(i); reset(); }));

  // Touch
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) { dx < 0 ? go(cur+1) : go(cur-1); reset(); }
  });

  function reset() { clearInterval(timer); timer = setInterval(() => go(cur+1), 5500); }
  reset();
}

/* ── Nav ── */
function initNav() {
  // Mobile
  const drawer = document.getElementById('mobileNavDrawer');
  const overlay = document.getElementById('mobileNavOverlay');
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    drawer?.classList.add('open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  function closeNav() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.getElementById('mobileNavClose')?.addEventListener('click', closeNav);
  overlay?.addEventListener('click', closeNav);

  // Accordion
  document.querySelectorAll('.mnd-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      btn.closest('.mnd-item').classList.toggle('open');
    });
  });
}

/* ── Cart Sidebar ── */
function initCartDrawer() {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  document.querySelectorAll('.js-open-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      drawer?.classList.add('open');
      overlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderCartSidebar();
    });
  });
  function close() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.getElementById('cartDrawerClose')?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
}

function renderCartSidebar() {
  const body  = document.getElementById('cartDrawerBody');
  const total = document.getElementById('cartDrawerTotal');
  const hd    = document.querySelector('#cartDrawer .drawer-hd h3');
  if (!body) return;

  // Re-hydrate from live product data to handle stale localStorage entries
  const items = cart.map(it => ({
    ...it, p: ALL_PRODUCTS.find(x => x.id === it.id) || it.p
  })).filter(it => it.p);

  // Sync in-memory cart (remove orphaned items)
  cart = items;

  // Update header count
  if (hd) hd.textContent = `My Bag${items.length ? ' (' + items.reduce((s,i)=>s+i.qty,0) + ')' : ''}`;

  if (!items.length) {
    body.innerHTML = `<div style="text-align:center;padding:60px 16px;color:#8F8F8F;">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;display:block;">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <p style="font-size:15px;font-weight:600;color:#2D2B2A;margin-bottom:8px;">Your bag is empty</p>
      <p style="font-size:13px;">Add items to get started!</p>
    </div>`;
  } else {
    body.innerHTML = items.map(it => `
    <div style="display:grid;grid-template-columns:80px 1fr;gap:12px;padding:14px 0;border-bottom:1px solid #DCDBDB;">
      <div style="border-radius:6px;overflow:hidden;aspect-ratio:2/3;background:#F9F7F4;">
        <img src="${it.p.imgs[0]}" alt="${it.p.name}" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div>
        <div style="font-size:12px;color:#8F8F8F;margin-bottom:2px;">${it.p.fabric}</div>
        <div style="font-size:13px;font-weight:600;margin-bottom:4px;line-height:1.3;">${it.p.name}</div>
        <div style="font-size:12px;color:#8F8F8F;margin-bottom:10px;">${it.size}${it.color && it.color!=='—' ? ' · '+it.color : ''}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;border:1px solid #DCDBDB;border-radius:6px;overflow:hidden;">
            <button onclick="changeQty('${it.key}',-1)" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;">−</button>
            <span style="width:32px;text-align:center;font-size:13px;font-weight:600;">${it.qty}</span>
            <button onclick="changeQty('${it.key}',1)" style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:15px;">+</button>
          </div>
          <span style="font-size:14px;font-weight:700;">PKR ${(it.p.price*it.qty).toLocaleString()}</span>
        </div>
        <button onclick="removeFromCart('${it.key}')" style="font-size:11px;color:#FF5C35;margin-top:6px;cursor:pointer;background:none;border:none;padding:0;font-family:inherit;">Remove</button>
      </div>
    </div>`).join('');
  }
  if (total) total.textContent = 'PKR ' + items.reduce((s,it) => s + it.p.price * it.qty, 0).toLocaleString();
}

/* ── Homepage products ── */
function initHomeProducts() {
  const topGrid = document.getElementById('topPicksGrid');
  const bsGrid  = document.getElementById('bestsellersGrid');

  if (topGrid) {
    const items = ALL_PRODUCTS.filter(p => p.featured).slice(0, 8);
    topGrid.innerHTML = items.map(renderCard).join('');
  }
  if (bsGrid) {
    const items = ALL_PRODUCTS.filter(p => p.bestseller).slice(0, 8);
    bsGrid.innerHTML = items.map(renderCard).join('');
  }
}

/* ── Collections ── */
function initCollections() {
  const grid  = document.getElementById('collGrid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const cat    = params.get('cat') || 'all';

  const catMap = {
    'ready-to-wear': p => p.cat === 'ready-to-wear',
    'fabrics':       p => p.cat === 'fabrics',
    'women':         p => !p.gender || p.gender === 'women',
    'men':           p => p.gender === 'men',
    'sale':          p => p.discount > 0,
    'new-in':        p => p.badge === 'new',
    'all':           p => true,
  };
  const filter = catMap[cat] || catMap.all;
  let products = ALL_PRODUCTS.filter(filter);

  const titleMap = { 'ready-to-wear':'Ready To Wear','fabrics':'Fabrics','women':'Women','men':'Men','sale':'Sale','new-in':'New In','all':'All Products' };
  const title = titleMap[cat] || 'Products';
  document.getElementById('collTitle') && (document.getElementById('collTitle').textContent = title);
  document.getElementById('collCount') && (document.getElementById('collCount').textContent = `${products.length} Items`);
  document.getElementById('bcCat')     && (document.getElementById('bcCat').textContent = title);
  document.title = `${title} | Your Brand`;

  function render(prods) {
    grid.innerHTML = prods.length ? prods.map(renderCard).join('') :
      `<div style="grid-column:1/-1;text-align:center;padding:80px;color:#8F8F8F;font-size:15px;">No products found</div>`;
  }
  render(products);

  // Sort
  document.getElementById('sortSel')?.addEventListener('change', function() {
    let s = [...products];
    switch(this.value) {
      case 'price-asc':  s.sort((a,b) => a.price - b.price); break;
      case 'price-desc': s.sort((a,b) => b.price - a.price); break;
      case 'new-arrival':s.sort((a,b) => a.badge==='new'?-1:1); break;
      case 'top-sellers':s.sort((a,b) => b.bestseller - a.bestseller); break;
      case 'popular':    s.sort((a,b) => b.featured - a.featured); break;
    }
    render(s);
  });

  // Filter checkboxes
  document.querySelectorAll('.js-filter-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = [...document.querySelectorAll('.js-filter-cb:checked')].map(c => c.value);
      if (!checked.length) { render(products); return; }
      render(products.filter(p =>
        checked.some(v => p.type===v || p.sub===v || p.badge===v || p.cat===v || p.gender===v || (!p.gender && v==='women'))
      ));
    });
  });
}

/* ── Product Detail ── */
function initProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  if (!id) return;
  const p = ALL_PRODUCTS.find(x => x.id === id);
  if (!p) { document.getElementById('pd-main').innerHTML = '<p style="padding:60px;text-align:center;">Product not found.</p>'; return; }

  document.title = `${p.name} | Your Brand`;

  // Breadcrumb
  const bc = document.getElementById('pd-bc');
  if (bc) bc.innerHTML = `<a href="index.html">Home</a><span>/</span><a href="collections.html?cat=${p.cat}">${p.cat.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')}</a><span>/</span><span>${p.name}</span>`;

  // Gallery
  const mainImg = document.getElementById('pd-main-img');
  if (mainImg) mainImg.src = p.imgs[0];
  const thumbs  = document.getElementById('pd-thumbs');
  if (thumbs) thumbs.innerHTML = p.imgs.map((img,i) =>
    `<div class="pd-thumb ${i===0?'active':''}" onclick="switchPdImg('${img}',this)">
      <img src="${img}" alt="${p.name}" loading="lazy">
    </div>`
  ).join('');

  // Info
  document.getElementById('pd-fabric') && (document.getElementById('pd-fabric').textContent = p.fabric);
  document.getElementById('pd-name')   && (document.getElementById('pd-name').textContent   = p.name);

  const priceEl = document.getElementById('pd-price');
  if (priceEl) priceEl.innerHTML = p.discount > 0
    ? `<span class="pd-price-now price-sale">PKR ${p.price.toLocaleString()}</span>
       <span class="pd-price-was">PKR ${p.was.toLocaleString()}</span>
       <span class="pd-save">${p.discount}% OFF</span>`
    : `<span class="pd-price-now">PKR ${p.price.toLocaleString()}</span>`;

  // Colors
  let selColor = p.colorNames[0] || '';
  const colorWrap = document.getElementById('pd-colors');
  const colorLabel= document.getElementById('pd-color-label');
  if (colorWrap && p.colors.length) {
    if (colorLabel) colorLabel.innerHTML = `Color: <em>${selColor}</em>`;
    colorWrap.innerHTML = p.colors.map((c,i) =>
      `<div class="pd-color-btn ${i===0?'active':''}" style="background:${c}" title="${p.colorNames[i]}"
         data-name="${p.colorNames[i]}" onclick="selectPdColor(this,'${p.colorNames[i]}')"></div>`
    ).join('');
  } else if (colorWrap) colorWrap.closest('.sel-section')?.remove();

  // Sizes
  let selSize = '';
  const sizeWrap = document.getElementById('pd-sizes');
  if (sizeWrap) sizeWrap.innerHTML = p.sizes.map(s =>
    `<button class="pd-size-btn" data-size="${s}" onclick="selectPdSize(this)">${s}</button>`
  ).join('');

  // Size guide — show only the relevant tab for this product
  const sgLink = document.querySelector('.size-guide-link');
  if (sgLink) {
    const sgTab = p.cat === 'fabrics' ? 'fabric' : (p.gender === 'men' ? 'men' : 'women');
    sgLink.onclick = () => {
      // Hide all tabs and panels, only show the relevant one
      document.querySelectorAll('.sg-tab').forEach(t => { t.style.display = 'none'; t.classList.remove('active'); });
      document.querySelectorAll('.sg-panel').forEach(pan => pan.classList.remove('active'));
      const activeTab = document.querySelector(`.sg-tab[onclick*="${sgTab}"]`);
      if (activeTab) { activeTab.style.display = 'inline-flex'; activeTab.classList.add('active'); }
      document.getElementById(`sg-${sgTab}`)?.classList.add('active');
      // Hide the tab row entirely since there's only one option
      const tabsRow = document.querySelector('.sg-tabs');
      if (tabsRow) tabsRow.style.display = 'none';
      document.getElementById('sizeGuideModal').classList.add('open');
    };
  }

  // Desc
  document.getElementById('pd-desc')    && (document.getElementById('pd-desc').textContent = p.desc);
  document.getElementById('pd-details') && (document.getElementById('pd-details').innerHTML = `<ul>
    ${p.fabric ?`<li><strong>Fabric/Type:</strong> ${p.fabric}</li>`:''}
    <li><strong>SKU:</strong> ${p.sku}</li>
    ${p.notes  ?`<li><strong>Notes:</strong> ${p.notes}</li>`:''}
    <li><strong>Origin:</strong> Pakistan</li>
    <li><strong>Care:</strong> Hand wash / dry clean recommended</li>
  </ul>`);

  // Qty
  let qty = 1;
  document.getElementById('pd-qty-minus')?.addEventListener('click', () => { qty=Math.max(1,qty-1); document.getElementById('pd-qty-val').textContent=qty; });
  document.getElementById('pd-qty-plus') ?.addEventListener('click', () => { qty++; document.getElementById('pd-qty-val').textContent=qty; });

  // Add to cart
  document.getElementById('pd-atc')?.addEventListener('click', () => {
    const s = document.querySelector('.pd-size-btn.active')?.dataset.size;
    if (!s) { toast('Please select a size'); return; }
    const c = document.querySelector('.pd-color-btn.active')?.dataset.name || '—';
    addToCart(p.id, s, c, qty);
    // open cart drawer
    document.getElementById('cartDrawer')?.classList.add('open');
    document.getElementById('cartOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCartSidebar();
  });

  // Wishlist
  const wlBtn = document.getElementById('pd-wishlist');
  if (wlBtn) {
    wlBtn.classList.toggle('active', wishlist.includes(p.id));
    wlBtn.addEventListener('click', () => { toggleWL(p.id); wlBtn.classList.toggle('active', wishlist.includes(p.id)); });
  }

  // Related
  const relGrid = document.getElementById('relatedGrid');
  if (relGrid) {
    const rel = ALL_PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat).slice(0,4);
    relGrid.innerHTML = rel.map(renderCard).join('');
  }

}

window.switchPdImg = function(src, el) {
  document.getElementById('pd-main-img').src = src;
  document.querySelectorAll('.pd-thumb').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
};
window.selectPdColor = function(el, name) {
  document.querySelectorAll('.pd-color-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const lbl = document.getElementById('pd-color-label');
  if (lbl) lbl.innerHTML = `Color: <em>${name}</em>`;
};
window.selectPdSize = function(el) {
  document.querySelectorAll('.pd-size-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
};

/* ── Full Cart Page ── */
function renderFullCart() {
  const list     = document.getElementById('fullCartList');
  const subtotal = document.getElementById('fc-subtotal');
  const shipEl   = document.getElementById('fc-ship');
  const totalEl  = document.getElementById('fc-total');
  const barEl    = document.getElementById('fc-bar');
  const msgEl    = document.getElementById('fc-msg');
  if (!list) return;

  const sub  = cartTotal();
  const ship = sub >= 3000 ? 0 : 299;
  const free = 3000;
  const pct  = Math.min(100, (sub/free)*100);

  if (barEl) barEl.style.width = pct+'%';
  if (msgEl) msgEl.innerHTML = sub >= free
    ? '🎉 You\'ve unlocked <strong>FREE Delivery!</strong>'
    : `Add PKR <strong>${(free-sub).toLocaleString()}</strong> more for FREE delivery`;

  if (!cart.length) {
    list.innerHTML = `<div style="text-align:center;padding:80px 20px;color:#8F8F8F;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" style="margin:0 auto 20px;display:block;">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <h3 style="font-size:20px;font-weight:700;color:#2D2B2A;margin-bottom:8px;">Your bag is empty</h3>
      <p style="margin-bottom:24px;">Looks like you haven't added anything yet</p>
      <a href="collections.html" style="display:inline-block;padding:12px 32px;background:#2D2B2A;color:#fff;border-radius:30px;font-weight:700;font-size:13px;text-transform:uppercase;">Continue Shopping</a>
    </div>`;
  } else {
    list.innerHTML = cart.map(it => `
    <div class="cart-item">
      <div class="ci-img"><img src="${it.p.imgs[0]}" alt="${it.p.name}" loading="lazy"></div>
      <div>
        <div class="ci-name">${it.p.name}</div>
        <div class="ci-meta">${it.p.fabric} · Size: ${it.size}${it.color && it.color!=='—'?' · '+it.color:''}</div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div style="display:flex;align-items:center;border:1.5px solid #DCDBDB;border-radius:8px;overflow:hidden;">
            <button onclick="changeQty('${it.key}',-1)" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;">−</button>
            <span style="width:40px;text-align:center;font-size:13px;font-weight:600;">${it.qty}</span>
            <button onclick="changeQty('${it.key}',1)" style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;">+</button>
          </div>
        </div>
        <div class="ci-remove" onclick="removeFromCart('${it.key}')">Remove</div>
      </div>
      <div class="ci-price">PKR ${(it.p.price*it.qty).toLocaleString()}</div>
    </div>`).join('');
  }
  if (subtotal) subtotal.textContent = 'PKR ' + sub.toLocaleString();
  if (shipEl)   shipEl.textContent   = ship === 0 ? 'FREE' : 'PKR ' + ship.toLocaleString();
  if (totalEl)  totalEl.textContent  = 'PKR ' + (sub+ship).toLocaleString();
}

/* ── Tabs ── */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const grp = btn.closest('[data-tabs]');
      if (grp) {
        grp.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        grp.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      } else {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      }
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab)?.classList.add('active');
    });
  });
}

/* ── Toast ── */
function toast(msg, type='') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type==='success'
        ? '<path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
        : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/>'}
    </svg>
    <span>${msg}</span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 400); }, 3000);
}
window.toast = toast;
window.showToast = toast;

/* ── Back to top ── */
function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500));
  btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

/* ── Newsletter ── */
function initNewsletter() {
  document.querySelectorAll('.js-nl-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const inp = form.querySelector('input');
      if (inp?.value) { toast('Subscribed successfully!','success'); inp.value=''; }
    });
  });
}

/* ── Filter toggle ── */
window.toggleFilterBlock = function(el) {
  el.closest('.filter-block').classList.toggle('closed');
};

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  refreshCartUI();
  refreshWishlistUI();
  initSlider();
  initNav();
  initCartDrawer();
  initTabs();
  initBackTop();
  initNewsletter();

  if (document.getElementById('topPicksGrid') || document.getElementById('bestsellersGrid')) initHomeProducts();
  if (document.getElementById('collGrid'))   initCollections();
  if (document.getElementById('pd-name'))    initProductDetail();
  if (document.getElementById('fullCartList')) renderFullCart();

  // Sync wishlist buttons
  document.querySelectorAll('[data-wl]').forEach(btn =>
    btn.classList.toggle('active', wishlist.includes(btn.dataset.wl))
  );
});
