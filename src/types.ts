export type Role = 'admin' | 'cashier';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  active: boolean;
  created_at: string;
}

export type ProductStatus = 'active' | 'archived';

export interface Product {
  id: string;
  barcode: string;
  sku: string;
  name: string;
  category_id: string;
  purchase_price: number;
  selling_price: number;
  stock: number;
  minimum_stock: number;
  unit: string;
  image?: string;
  show_on_public?: boolean;
  description?: string;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  type: 'atk' | 'service';
}

export interface ServiceItem {
  id: string;
  service_name: string;
  category: string; // e.g. 'Fotocopy', 'Print B/W', 'Print Color', 'Laminating', 'Scan', 'Jilid / Finishing'
  unit: string; // e.g. 'lembar', 'dokumen', 'buku', 'sisi'
  cost: number;
  selling_price: number;
  description?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type CustomerType = 'GENERAL' | 'STUDENT' | 'SCHOOL' | 'UMKM' | 'COMPANY';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  address?: string;
  customer_type: CustomerType;
  notes?: string;
  created_at: string;
}

export type StockMovementType = 'STOCK_IN' | 'SALE' | 'ADJUSTMENT' | 'RETURN' | 'DAMAGED';

export interface StockMovement {
  id: string;
  product_id: string;
  product_name: string;
  type: StockMovementType;
  quantity: number; // positive or negative
  previous_stock: number;
  new_stock: number;
  reference_id?: string; // invoice_number or PO number
  notes?: string;
  created_at: string;
}

export type PaymentMethod = 'CASH' | 'QRIS' | 'TRANSFER';
export type PaymentStatus = 'PAID' | 'PENDING';
export type CartItemType = 'PRODUCT' | 'SERVICE';

export interface CartItem {
  id: string; // unique item cart key
  item_type: CartItemType;
  product_id?: string;
  service_id?: string;
  name: string;
  unit: string;
  unit_price: number;
  cost_price: number;
  quantity: number;
  notes?: string;
  available_stock?: number;
  subtotal?: number;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  item_type: CartItemType;
  product_id?: string;
  service_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
  subtotal: number;
}

export interface Sale {
  id: string;
  invoice_number: string;
  customer_id?: string;
  customer_name?: string;
  subtotal: number;
  discount: number;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  cash_received?: number;
  cash_change?: number;
  items: SaleItem[];
  notes?: string;
  cashier_name: string;
  created_at: string;
}

export type ExpenseCategory =
  | 'Kertas'
  | 'Toner & Tinta'
  | 'Listrik & Utilitas'
  | 'Sewa Tempat'
  | 'Perawatan Mesin'
  | 'Kulakan ATK'
  | 'Operasional'
  | 'Lainnya';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  notes?: string;
  created_at: string;
}

export interface WebsiteContent {
  hero_headline: string;
  hero_subheadline: string;
  hero_badge: string;
  business_tagline: string;
  whatsapp_number: string;
  phone_number: string;
  email: string;
  address: string;
  city: string;
  maps_embed_url: string;
  business_hours_weekday: string;
  business_hours_weekend: string;
  announcement_banner_enabled: boolean;
  announcement_banner_text: string;
  digital_solutions_intro: string;
  why_us_points: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  client?: string;
  description: string;
  technologies: string[];
  image?: string;
  live_url?: string;
  status: 'completed' | 'in_progress';
  is_demo: boolean;
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  main_tagline: string;
  sub_tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  qris_merchant_name: string;
  qris_image?: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_holder: string;
  receipt_footer_note: string;
  demo_mode: boolean;
}
