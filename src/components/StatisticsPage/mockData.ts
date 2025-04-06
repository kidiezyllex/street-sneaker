export interface SaleStats {
  date: string;
  value: number;
}

export interface ProductStats {
  id: string;
  name: string;
  image: string;
  sold: number;
  revenue: number;
}

export const monthlySales: SaleStats[] = [
  { date: 'T1', value: 48500000 },
  { date: 'T2', value: 52300000 },
  { date: 'T3', value: 61000000 },
  { date: 'T4', value: 67200000 },
  { date: 'T5', value: 58900000 },
  { date: 'T6', value: 73100000 },
  { date: 'T7', value: 77500000 },
  { date: 'T8', value: 82300000 },
  { date: 'T9', value: 78600000 },
  { date: 'T10', value: 89200000 },
  { date: 'T11', value: 97500000 },
  { date: 'T12', value: 112000000 },
];


export const weeklyOrders = [
  { date: 'Thứ 2', value: 32 },
  { date: 'Thứ 3', value: 28 },
  { date: 'Thứ 4', value: 43 },
  { date: 'Thứ 5', value: 55 },
  { date: 'Thứ 6', value: 62 },
  { date: 'Thứ 7', value: 78 },
  { date: 'CN', value: 36 },
];

export const topProducts: ProductStats[] = [
  {
    id: 'prod-001',
    name: 'Nike Air Jordan 1 Mid Carbon Fiber',
    image: 'https://xamsneaker.com/wp-content/uploads/Air-Jordan-1-mid-carbon-fiber-800x650-1-247x247.jpg',
    sold: 254,
    revenue: 89000000,
  },
  {
    id: 'prod-002',
    name: 'Adidas Ultraboost 23',
    image: 'https://xamsneaker.com/wp-content/uploads/A-BATHING-APE-BAPE-STA-LOW-BLACK-800x650-1-247x247.jpg',
    sold: 186,
    revenue: 74400000,
  },
  {
    id: 'prod-003',
    name: 'Jordan 4 Retro',
    image: 'https://xamsneaker.com/wp-content/uploads/Air-Jordan-1-mid-carbon-fiber-800x650-1-247x247.jpg',
    sold: 145,
    revenue: 101500000,
  },
  {
    id: 'prod-004',
    name: 'New Balance 550',
    image: 'https://xamsneaker.com/wp-content/uploads/air-jordan-1-low-se-reverse-ice-blue-800x650-1-247x247.jpg',
    sold: 132,
    revenue: 42240000,
  },
  {
    id: 'prod-005',
    name: 'Puma Suede Classic',
    image: 'https://xamsneaker.com/wp-content/uploads/krossovki-muzhskie-nike-x-union-la-x-sacai-x-cortez-4-0-grey-bleck-white-3-transformed-600x420-1-247x247.webp',
    sold: 98,
    revenue: 31360000,
  },
  {
    id: 'prod-006',
    name: 'Nike Air Force 1 Triple Black',
    image: 'https://xamsneaker.com/wp-content/uploads/giay-sneaker-nike-air-force-1-black-like-auth11-247x247.jpg',
    sold: 92,
    revenue: 41400000,
  },
  {
    id: 'prod-008',
    name: 'Nike Air Force 1 Fresh Blue White',
    image: 'https://xamsneaker.com/wp-content/uploads/Giay-Nike-Air-Force-1-Fresh-Blue-WhiteLike-Auth-02-247x247.jpg',
    sold: 82,
    revenue: 36900000,
  },
];

export const outOfStockProducts = [
  {
    id: 'prod-006',
    name: 'Converse Chuck 70 High Top',
    image: 'https://xamsneaker.com/wp-content/uploads/z4490123074194_c8ad7d0c5ae26278af9a2eae4b506a8b-247x247.jpg',
  },
  {
    id: 'prod-007',
    name: 'Vans Old Skool',
    image: 'https://xamsneaker.com/wp-content/uploads/chuyengiaysneaker-com-giay-vans-fog-sieu-cap-11-247x247.jpg',
  },
  {
    id: 'prod-008',
    name: 'Asics Gel-Kayano 30',
    image: 'https://xamsneaker.com/wp-content/uploads/chuyengiaysneaker-com-giay-nike-air-jordan-low-eyes-sieu-cap-11-247x247.jpg',
  },
  {
    id: 'prod-009',
    name: 'Vans Vault Slip-On 47 V DX Fear Of God',
    image: 'https://xamsneaker.com/wp-content/uploads/chuyengiaysneaker-com-vans-old-kool-rep-11-77-247x247.jpg',
  },
  {
    id: 'prod-010',
    name: 'Nike Air Jordan 1 Low Grey Wolf',
    image: 'https://xamsneaker.com/wp-content/uploads/chuyengiaysneaker-com-Giay-Nike-Air-Jordan-1-Low-Wolf-Grey-2-300x300-1-247x247.jpg',
  },
  {
    id: 'prod-011',
    name: 'Nike Air Jordan 1 Low Smoke Grey',
    image: 'https://xamsneaker.com/wp-content/uploads/chuyengiaysaneaker-com-giay-nike-air-jordan-low-grey-247x247.jpg',
  },
  {
    id: 'prod-012',
    name: 'Gucci Wmns Rhyton Leather Sneaker Logo',
    image: 'https://xamsneaker.com/wp-content/uploads/z4161405802387_910f3c673d3f8e3bfaa70055964679d0-247x247.jpg',
  },
];

export const onSaleProducts = [
  {
    id: 'sale-001',
    name: 'Nike Air Jordan 1 Mid Carbon Fiber Black White',
    image: 'https://xamsneaker.com/wp-content/uploads/Air-Jordan-1-mid-carbon-fiber-800x650-1-247x247.jpg',
    originalPrice: 2500000,
    salePrice: 700000,
    discount: 72,
  },
  {
    id: 'sale-002',
    name: 'A Bathing Ape Bape Sta Low Black White',
    image: 'https://xamsneaker.com/wp-content/uploads/A-BATHING-APE-BAPE-STA-LOW-BLACK-800x650-1-247x247.jpg',
    originalPrice: 2200000,
    salePrice: 800000,
    discount: 64,
  },
  {
    id: 'sale-003',
    name: 'A Bathing Ape Bape Sta Low Grey Black',
    image: 'https://xamsneaker.com/wp-content/uploads/A-Bathing-Ape-Bapesta-Grey-Black-800x650-1-247x247.jpg',
    originalPrice: 2200000,
    salePrice: 800000,
    discount: 64,
  },
  {
    id: 'sale-004',
    name: 'Nike Cortez x Union x Sacai Black White',
    image: 'https://xamsneaker.com/wp-content/uploads/krossovki-muzhskie-nike-x-union-la-x-sacai-x-cortez-4-0-grey-bleck-white-3-transformed-600x420-1-247x247.webp',
    originalPrice: 1500000,
    salePrice: 500000,
    discount: 67,
  },
  {
    id: 'sale-005',
    name: 'Nike Air Jordan 1 Low Ice Blue',
    image: 'https://xamsneaker.com/wp-content/uploads/air-jordan-1-low-se-reverse-ice-blue-800x650-1-247x247.jpg',
    originalPrice: 1800000,
    salePrice: 500000,
    discount: 72,
  },
  {
    id: 'sale-006',
    name: 'Nike Air Force 1 Shadow – Mint Foam',
    image: 'https://xamsneaker.com/wp-content/uploads/chuyengiaysneaker-com-giay-nike-force1-shadow-sieu-cap-15-247x247.jpg',
    originalPrice: 1200000,
    salePrice: 400000,
    discount: 67,
  },
  {
    id: 'sale-007',
    name: 'Nike Air Jordan 1 Low Green Island',
    image: 'https://xamsneaker.com/wp-content/uploads/Jordan-Xanh-Ngoc-Giay-Nike-Air-Jordan-1-Low-Island-Green-e1731133921849-247x247.jpg',
    originalPrice: 1200000,
    salePrice: 450000,
    discount: 63,
  },
  {
    id: 'sale-008',
    name: 'Nike Air Jordan 1 High University Blue',
    image: 'https://xamsneaker.com/wp-content/uploads/Giay-Nike-Air-Jordan-1-Retro-High-University-Blue-3-247x247.jpg',
    originalPrice: 1200000,
    salePrice: 500000,
    discount: 58,
  },
]; 