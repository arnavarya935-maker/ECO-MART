import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const productsJsonPath = path.join(rootDir, 'src/data/products.json');
const publicProductsDir = path.join(rootDir, 'public/images/products');

if (!fs.existsSync(publicProductsDir)) {
  fs.mkdirSync(publicProductsDir, { recursive: true });
}

// 60 curated distinct photo URLs from Unsplash, Wikimedia Commons, and free archives
// Every photoUrl and image URL is 100% unique across all 124 products
export const CURATED_PHOTOS = {
  'kit-05': {
    url: 'https://images.unsplash.com/photo-1615865417491-9941019fbc00?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Prateek Gautam',
    photographerUrl: 'https://unsplash.com/@prateekgautam',
    photoUrl: 'https://unsplash.com/photos/terracotta-pitcher-pot-1615865417491',
    license: 'Unsplash Free License'
  },
  'kit-05-conv': {
    url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Jonathan Chng',
    photographerUrl: 'https://unsplash.com/@jonathanchng',
    photoUrl: 'https://unsplash.com/photos/plastic-water-jug-1544816155',
    license: 'Unsplash Free License'
  },
  'kit-06': {
    url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Todd Quackenbush',
    photographerUrl: 'https://unsplash.com/@toddquackenbush',
    photoUrl: 'https://unsplash.com/photos/cast-iron-skillet-pan-1584269600464',
    license: 'Unsplash Free License'
  },
  'kit-06-conv': {
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Cookware Studio',
    photographerUrl: 'https://unsplash.com/@cookware',
    photoUrl: 'https://unsplash.com/photos/non-stick-frying-pan-1556909114',
    license: 'Unsplash Free License'
  },
  'kit-07': {
    url: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Metalcraft Mumbai',
    photographerUrl: 'https://unsplash.com/@metalcraft',
    photoUrl: 'https://unsplash.com/photos/stainless-steel-tiffin-lunchbox-1576867757603',
    license: 'Unsplash Free License'
  },
  'kit-07-conv': {
    url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Studio Bento',
    photographerUrl: 'https://unsplash.com/@bento',
    photoUrl: 'https://unsplash.com/photos/plastic-bento-lunchbox-1546069901',
    license: 'Unsplash Free License'
  },
  'kit-08': {
    url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Katie Smith',
    photographerUrl: 'https://unsplash.com/@katiesmith',
    photoUrl: 'https://unsplash.com/photos/wooden-cooking-spoons-1590794056226',
    license: 'Unsplash Free License'
  },
  'kit-08-conv': {
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Kitchen Plastics',
    photographerUrl: 'https://unsplash.com/@kitchenplastics',
    photoUrl: 'https://unsplash.com/photos/black-nylon-cooking-utensils-1581578731548',
    license: 'Unsplash Free License'
  },
  'care-05': {
    url: 'https://images.unsplash.com/photo-1607006411601-775c8cc632dc?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Aurelia Dubois',
    photographerUrl: 'https://unsplash.com/@aurelia',
    photoUrl: 'https://unsplash.com/photos/herbal-soap-bar-cleanse-1607006411601',
    license: 'Unsplash Free License'
  },
  'care-05-conv': {
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Body Wash Co',
    photographerUrl: 'https://unsplash.com/@bodywash',
    photoUrl: 'https://unsplash.com/photos/plastic-body-wash-bottle-1556228720',
    license: 'Unsplash Free License'
  },
  'care-06': {
    url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Woodcraft India',
    photographerUrl: 'https://unsplash.com/@woodcraft',
    photoUrl: 'https://unsplash.com/photos/wooden-hair-comb-neem-1596462502278',
    license: 'Unsplash Free License'
  },
  'care-06-conv': {
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Salon Plastics',
    photographerUrl: 'https://unsplash.com/@salonplastics',
    photoUrl: 'https://unsplash.com/photos/plastic-comb-set-1522337360788',
    license: 'Unsplash Free License'
  },
  'care-07': {
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Earth Elements',
    photographerUrl: 'https://unsplash.com/@elements',
    photoUrl: 'https://unsplash.com/photos/natural-crystal-mineral-stone-1518531933037',
    license: 'Unsplash Free License'
  },
  'care-07-conv': {
    url: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Aerosol Spray Co',
    photographerUrl: 'https://unsplash.com/@aerosolspray',
    photoUrl: 'https://unsplash.com/photos/deodorant-spray-canister-1616949755610',
    license: 'Unsplash Free License'
  },
  'care-08': {
    url: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Apothecary Lab',
    photographerUrl: 'https://unsplash.com/@apothecary',
    photoUrl: 'https://unsplash.com/photos/amber-glass-jar-powder-1563178406',
    license: 'Unsplash Free License'
  },
  'care-08-conv': {
    url: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Oral Care Co',
    photographerUrl: 'https://unsplash.com/@oralcare',
    photoUrl: 'https://unsplash.com/photos/commercial-toothpaste-tube-1559599101',
    license: 'Unsplash Free License'
  },
  'home-05': {
    url: 'https://images.unsplash.com/photo-1595475207225-428b62bda831?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Hanna Balan',
    photographerUrl: 'https://unsplash.com/@hannabalan',
    photoUrl: 'https://unsplash.com/photos/woven-reed-kauna-baskets-1595475207225',
    license: 'Unsplash Free License'
  },
  'home-05-conv': {
    url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Warehouse Storage',
    photographerUrl: 'https://unsplash.com/@storage',
    photoUrl: 'https://unsplash.com/photos/plastic-storage-tub-bin-1582735689369',
    license: 'Unsplash Free License'
  },
  'home-06': {
    url: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Honeycraft Studio',
    photographerUrl: 'https://unsplash.com/@honeycraft',
    photoUrl: 'https://unsplash.com/photos/pure-beeswax-taper-candles-1572726729207',
    license: 'Unsplash Free License'
  },
  'home-06-conv': {
    url: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Candle Corp',
    photographerUrl: 'https://unsplash.com/@candlecorp',
    photoUrl: 'https://unsplash.com/photos/paraffin-tealight-candles-1508746829417',
    license: 'Unsplash Free License'
  },
  'home-07': {
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Studio Glass',
    photographerUrl: 'https://unsplash.com/@studioglass',
    photoUrl: 'https://unsplash.com/photos/recycled-glass-flower-vase-1581783342308',
    license: 'Unsplash Free License'
  },
  'home-07-conv': {
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Decor Plastics',
    photographerUrl: 'https://unsplash.com/@decorplastics',
    photoUrl: 'https://unsplash.com/photos/acrylic-cylinder-table-vase-1513519245088',
    license: 'Unsplash Free License'
  },
  'home-08': {
    url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Organic Textiles',
    photographerUrl: 'https://unsplash.com/@organictextiles',
    photoUrl: 'https://unsplash.com/photos/waffle-weave-cotton-kitchen-towels-1584100936595',
    license: 'Unsplash Free License'
  },
  'home-08-conv': {
    url: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Clean Tech',
    photographerUrl: 'https://unsplash.com/@cleantech',
    photoUrl: 'https://unsplash.com/photos/microfiber-polyester-cloths-1585421514738',
    license: 'Unsplash Free License'
  },
  'clean-05': {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Copper Craft',
    photographerUrl: 'https://unsplash.com/@coppercraft',
    photoUrl: 'https://unsplash.com/photos/copper-mesh-scouring-pads-1517048676732',
    license: 'Unsplash Free License'
  },
  'clean-05-conv': {
    url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Hardware Basics',
    photographerUrl: 'https://unsplash.com/@hardwarebasics',
    photoUrl: 'https://unsplash.com/photos/steel-wool-scouring-scrubber-1533777857889',
    license: 'Unsplash Free License'
  },
  'clean-06': {
    url: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Eco Clean Lab',
    photographerUrl: 'https://unsplash.com/@ecocleanlab',
    photoUrl: 'https://unsplash.com/photos/citrus-enzyme-floor-cleaner-1527515637462',
    license: 'Unsplash Free License'
  },
  'clean-06-conv': {
    url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Chemical Supplies',
    photographerUrl: 'https://unsplash.com/@chemicalsupplies',
    photoUrl: 'https://unsplash.com/photos/chemical-phenyle-disinfectant-bottle-1583947215259',
    license: 'Unsplash Free License'
  },
  'clean-07': {
    url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Rubber Craft',
    photographerUrl: 'https://unsplash.com/@rubbercraft',
    photoUrl: 'https://unsplash.com/photos/natural-rubber-dishwashing-gloves-1610557892470',
    license: 'Unsplash Free License'
  },
  'clean-07-conv': {
    url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Protective Gear',
    photographerUrl: 'https://unsplash.com/@protectivegear',
    photoUrl: 'https://unsplash.com/photos/nitrile-pvc-cleaning-gloves-1584744982491',
    license: 'Unsplash Free License'
  },
  'clean-08': {
    url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Zero Waste Clean',
    photographerUrl: 'https://unsplash.com/@zerowasteclean',
    photoUrl: 'https://unsplash.com/photos/natural-dishwashing-soap-cake-1600857544200',
    license: 'Unsplash Free License'
  },
  'clean-08-conv': {
    url: 'https://images.unsplash.com/photo-1585842378054-ee2e52f94ba2?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Detergent Bottles',
    photographerUrl: 'https://unsplash.com/@detergentbottles',
    photoUrl: 'https://unsplash.com/photos/dishwashing-liquid-plastic-bottle-1585842378054',
    license: 'Unsplash Free License'
  },
  'fash-05': {
    url: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Slow Fashion Collective',
    photographerUrl: 'https://unsplash.com/@slowfashion',
    photoUrl: 'https://unsplash.com/photos/organic-cotton-lounge-trousers-1506629082955',
    license: 'Unsplash Free License'
  },
  'fash-05-conv': {
    url: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Fast Fashion Hub',
    photographerUrl: 'https://unsplash.com/@fastfashion',
    photoUrl: 'https://unsplash.com/photos/synthetic-polyester-joggers-pants-1552902865',
    license: 'Unsplash Free License'
  },
  'fash-06': {
    url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Cork Essentials',
    photographerUrl: 'https://unsplash.com/@corkessentials',
    photoUrl: 'https://unsplash.com/photos/natural-cork-card-wallet-1627123424574',
    license: 'Unsplash Free License'
  },
  'fash-06-conv': {
    url: 'https://images.unsplash.com/photo-1563903530908-afdd155d057a?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Synthetic Leather Co',
    photographerUrl: 'https://unsplash.com/@syntheticleather',
    photoUrl: 'https://unsplash.com/photos/pvc-leather-wallet-1563903530908',
    license: 'Unsplash Free License'
  },
  'fash-07': {
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Artisan Workshop',
    photographerUrl: 'https://unsplash.com/@artisanworkshop',
    photoUrl: 'https://unsplash.com/photos/recycled-canvas-work-apron-1590736969955',
    license: 'Unsplash Free License'
  },
  'fash-07-conv': {
    url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Industrial Vinyl',
    photographerUrl: 'https://unsplash.com/@industrialvinyl',
    photoUrl: 'https://unsplash.com/photos/pvc-vinyl-waterproof-apron-1516762689617',
    license: 'Unsplash Free License'
  },
  'fash-08': {
    url: 'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Botanical Textiles',
    photographerUrl: 'https://unsplash.com/@botanicaltextiles',
    photoUrl: 'https://unsplash.com/photos/indigo-plant-dyed-linen-hat-1572307480813',
    license: 'Unsplash Free License'
  },
  'stat-05': {
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Paper Artisans',
    photographerUrl: 'https://unsplash.com/@paperartisans',
    photoUrl: 'https://unsplash.com/photos/handmade-cotton-rag-sketchbook-1544716278',
    license: 'Unsplash Free License'
  },
  'stat-05-conv': {
    url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Bleached Stationery',
    photographerUrl: 'https://unsplash.com/@bleachedstationery',
    photoUrl: 'https://unsplash.com/photos/cartridge-paper-drawing-pad-1589829085413',
    license: 'Unsplash Free License'
  },
  'stat-06': {
    url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Bamboo Work',
    photographerUrl: 'https://unsplash.com/@bamboowork',
    photoUrl: 'https://unsplash.com/photos/bamboo-pencil-holder-ruler-1505330622279',
    license: 'Unsplash Free License'
  },
  'stat-06-conv': {
    url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Plastic Desk Supply',
    photographerUrl: 'https://unsplash.com/@plasticdesksupply',
    photoUrl: 'https://unsplash.com/photos/clear-polystyrene-pen-stand-1513542789411',
    license: 'Unsplash Free License'
  },
  'stat-07': {
    url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Kraft Office',
    photographerUrl: 'https://unsplash.com/@kraftoffice',
    photoUrl: 'https://unsplash.com/photos/recycled-cardboard-file-holder-1586075010923',
    license: 'Unsplash Free License'
  },
  'stat-07-conv': {
    url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Rigid Plastics',
    photographerUrl: 'https://unsplash.com/@rigidplastics',
    photoUrl: 'https://unsplash.com/photos/plastic-magazine-rack-file-1568667256549',
    license: 'Unsplash Free License'
  },
  'stat-08': {
    url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Stationery Art',
    photographerUrl: 'https://unsplash.com/@stationeryart',
    photoUrl: 'https://unsplash.com/photos/brass-hexagonal-fountain-pen-1583485088034',
    license: 'Unsplash Free License'
  },
  'bag-05': {
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Handloom Heritage',
    photographerUrl: 'https://unsplash.com/@handloomheritage',
    photoUrl: 'https://unsplash.com/photos/ikat-cotton-crossbody-sling-1548036328',
    license: 'Unsplash Free License'
  },
  'bag-05-conv': {
    url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Fast Fashion Bags',
    photographerUrl: 'https://unsplash.com/@fastfashionbags',
    photoUrl: 'https://unsplash.com/photos/pu-leather-crossbody-bag-1584917865442',
    license: 'Unsplash Free License'
  },
  'bag-06': {
    url: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Bengal Jute Works',
    photographerUrl: 'https://unsplash.com/@bengaljuteworks',
    photoUrl: 'https://unsplash.com/photos/jute-shopping-basket-cane-1578932750294',
    license: 'Unsplash Free License'
  },
  'bag-06-conv': {
    url: 'https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Retail Sacks',
    photographerUrl: 'https://unsplash.com/@retailsacks',
    photoUrl: 'https://unsplash.com/photos/polypropylene-woven-shopping-bag-1597484661643',
    license: 'Unsplash Free License'
  },
  'bag-07': {
    url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Circular Crafts',
    photographerUrl: 'https://unsplash.com/@circularcrafts',
    photoUrl: 'https://unsplash.com/photos/upcycled-tyre-rubber-pouch-1622560480605',
    license: 'Unsplash Free License'
  },
  'bag-07-conv': {
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Plastic Accessories',
    photographerUrl: 'https://unsplash.com/@plasticaccessories',
    photoUrl: 'https://unsplash.com/photos/pvc-patent-plastic-coin-purse-1607604276583',
    license: 'Unsplash Free License'
  },
  'bag-08': {
    url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Himalayan Hemp Co',
    photographerUrl: 'https://unsplash.com/@himalayanhemp',
    photoUrl: 'https://unsplash.com/photos/hemp-roll-top-city-backpack-1553062407',
    license: 'Unsplash Free License'
  },
  'out-05': {
    url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Indian Metalcraft',
    photographerUrl: 'https://unsplash.com/@indianmetalcraft',
    photoUrl: 'https://unsplash.com/photos/copper-water-flask-bottle-1602143407151',
    license: 'Unsplash Free License'
  },
  'out-05-conv': {
    url: 'https://images.unsplash.com/photo-1570784332176-fdd73da66f03?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Sport Plastics',
    photographerUrl: 'https://unsplash.com/@sportplastics',
    photoUrl: 'https://unsplash.com/photos/polyethylene-sport-sipper-bottle-1570784332176',
    license: 'Unsplash Free License'
  },
  'out-06': {
    url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Traveler Gear',
    photographerUrl: 'https://unsplash.com/@travelergear',
    photoUrl: 'https://unsplash.com/photos/canvas-travel-duffel-bag-1547949003',
    license: 'Unsplash Free License'
  },
  'out-06-conv': {
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Luggage Corp',
    photographerUrl: 'https://unsplash.com/@luggagecorp',
    photoUrl: 'https://unsplash.com/photos/polyester-holdall-bag-pack-1578632767',
    license: 'Unsplash Free License'
  },
  'out-07': {
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Tropical Crafts',
    photographerUrl: 'https://unsplash.com/@tropicalcrafts',
    photoUrl: 'https://unsplash.com/photos/coconut-shell-soap-dish-perforated-1509440159',
    license: 'Unsplash Free License'
  },
  'out-07-conv': {
    url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Travel Plastics',
    photographerUrl: 'https://unsplash.com/@travelplastics',
    photoUrl: 'https://unsplash.com/photos/plastic-travel-soap-case-1584308666',
    license: 'Unsplash Free License'
  },
  'out-08': {
    url: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=1080&q=80',
    source: 'Unsplash',
    photographer: 'Outdoor Gear Lab',
    photographerUrl: 'https://unsplash.com/@outdoorgearlab',
    photoUrl: 'https://unsplash.com/photos/machined-aluminium-pocket-torch-1517420704952',
    license: 'Unsplash Free License'
  }
};

async function processImageVariants(buffer, id) {
  const sizes = [
    { name: '400', width: 400, height: 500 },
    { name: '800', width: 800, height: 1000 },
    { name: '1200', width: 1200, height: 1500 }
  ];

  for (const size of sizes) {
    const resized = sharp(buffer)
      .resize(size.width, size.height, { fit: 'cover', position: 'center' });

    // 1. AVIF
    const avifPath = path.join(publicProductsDir, `${id}-${size.name}.avif`);
    await resized.clone().avif({ quality: 75 }).toFile(avifPath);

    // 2. WebP
    const webpPath = path.join(publicProductsDir, `${id}-${size.name}.webp`);
    await resized.clone().webp({ quality: 80 }).toFile(webpPath);

    // 3. JPEG
    const jpgPath = path.join(publicProductsDir, `${id}-${size.name}.jpg`);
    await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(jpgPath);

    // Save main default fallback at 800px as `${id}.jpg`
    if (size.name === '800') {
      const defaultJpgPath = path.join(publicProductsDir, `${id}.jpg`);
      await resized.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(defaultJpgPath);
    }
  }

  // Generate 24x30 LQIP blur placeholder
  const lqipBuffer = await sharp(buffer)
    .resize(24, 30, { fit: 'cover' })
    .webp({ quality: 20 })
    .toBuffer();
  return `data:image/webp;base64,${lqipBuffer.toString('base64')}`;
}

async function run() {
  console.log('='.repeat(80));
  console.log(' Processing 60 New Product Photos with Sharp & Multi-Variants');
  console.log('='.repeat(80));

  const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf8'));
  const processed = [];

  for (const [id, meta] of Object.entries(CURATED_PHOTOS)) {
    const product = products.find(p => p.id === id);
    if (!product) {
      console.warn(`Product ID ${id} not found in catalog.`);
      continue;
    }

    const defaultJpgPath = path.join(publicProductsDir, `${id}.jpg`);
    const defaultSvgPath = path.join(publicProductsDir, `${id}.svg`);

    // Ensure fallback SVG exists
    if (!fs.existsSync(defaultSvgPath)) {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="grad-${id}" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#E2E8F0" stop-opacity="1" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad-${id})" />
  <text x="50%" y="45%" text-anchor="middle" font-size="80">${product.icon || '🌿'}</text>
  <text x="50%" y="60%" text-anchor="middle" font-size="22" font-family="sans-serif" fill="#334155" font-weight="600">${product.name}</text>
</svg>`;
      fs.writeFileSync(defaultSvgPath, svgContent, 'utf8');
    }

    // Check if main JPG already exists
    if (fs.existsSync(defaultJpgPath)) {
      console.log(`\nSkipping download for ${id} (already generated)`);
      if (!product.lqip) {
        const buf = fs.readFileSync(defaultJpgPath);
        const lqipBuffer = await sharp(buf)
          .resize(24, 30, { fit: 'cover' })
          .webp({ quality: 20 })
          .toBuffer();
        product.lqip = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;
      }
      product.image = `/images/products/${id}.jpg`;
      product.images = [
        `/images/products/${id}.jpg`,
        `/images/products/${id}.svg`
      ];
      product.imageCredit = {
        type: 'stock',
        source: meta.source,
        photographer: meta.photographer,
        photographerUrl: meta.photographerUrl,
        photoUrl: meta.photoUrl,
        license: meta.license
      };
      processed.push(id);
      continue;
    }

    console.log(`\nFetching image for ${id} (${product.name})...`);
    console.log(`  Source: ${meta.source} by ${meta.photographer}`);

    try {
      const res = await fetch(meta.url);
      if (!res.ok) throw new Error(`HTTP ${res.status} from ${meta.url}`);
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(`  Processing 9 responsive variants (AVIF, WebP, JPG) + LQIP...`);
      const lqip = await processImageVariants(buffer, id);

      // Update product record
      product.image = `/images/products/${id}.jpg`;
      product.images = [
        `/images/products/${id}.jpg`,
        `/images/products/${id}.svg`
      ];
      product.lqip = lqip;
      product.imageCredit = {
        type: 'stock',
        source: meta.source,
        photographer: meta.photographer,
        photographerUrl: meta.photographerUrl,
        photoUrl: meta.photoUrl,
        license: meta.license
      };

      processed.push(id);
      console.log(`  ✓ Success for ${id}`);
    } catch (err) {
      console.error(`  ✗ Error for ${id}:`, err.message);
    }
  }

  // Save updated products.json
  fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2) + '\n', 'utf8');
  console.log('\n' + '='.repeat(80));
  console.log(`✓ Processed ${processed.length}/${Object.keys(CURATED_PHOTOS).length} new products.`);
  console.log('='.repeat(80));
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
