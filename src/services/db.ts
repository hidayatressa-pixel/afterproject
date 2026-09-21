import {
  Product,
  Category,
  ServiceItem,
  Customer,
  Sale,
  SaleItem,
  StockMovement,
  Expense,
  WebsiteContent,
  PortfolioProject,
  StoreSettings,
  StockMovementType,
  User,
} from '../types';
import {
  initialWebsiteContent,
  initialStoreSettings,
  demoCategories,
  demoServices,
  demoProducts,
  demoCustomers,
  demoExpenses,
  demoPortfolioProjects,
  demoSales,
  demoStockMovements,
} from './demoData';

export interface DatabaseState {
  products: Product[];
  categories: Category[];
  services: ServiceItem[];
  customers: Customer[];
  sales: Sale[];
  stock_movements: StockMovement[];
  expenses: Expense[];
  website_content: WebsiteContent;
  portfolio_projects: PortfolioProject[];
  settings: StoreSettings;
  users: User[];
}

const STORAGE_PROD_KEY = 'afterproject_prod_db_v1';
const STORAGE_DEMO_KEY = 'afterproject_demo_db_v1';
const STORAGE_MODE_KEY = 'afterproject_mode_v1';

// Default empty database for Production Mode (per strict requirement)
const emptyProductionState: DatabaseState = {
  products: [],
  categories: [],
  services: [],
  customers: [],
  sales: [],
  stock_movements: [],
  expenses: [],
  website_content: { ...initialWebsiteContent },
  portfolio_projects: [],
  settings: { ...initialStoreSettings, demo_mode: false },
  users: [
    {
      id: 'usr-1',
      username: 'admin',
      name: 'Owner / Manajer Toko',
      role: 'admin',
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'usr-2',
      username: 'kasir',
      name: 'Operator Kasir 1',
      role: 'cashier',
      active: true,
      created_at: new Date().toISOString(),
    },
  ],
};

const fullDemoState: DatabaseState = {
  products: [...demoProducts],
  categories: [...demoCategories],
  services: [...demoServices],
  customers: [...demoCustomers],
  sales: [...demoSales],
  stock_movements: [...demoStockMovements],
  expenses: [...demoExpenses],
  website_content: { ...initialWebsiteContent },
  portfolio_projects: [...demoPortfolioProjects],
  settings: { ...initialStoreSettings, demo_mode: true },
  users: [
    {
      id: 'usr-1',
      username: 'admin',
      name: 'Owner / Manajer Toko',
      role: 'admin',
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: 'usr-2',
      username: 'kasir',
      name: 'Operator Kasir 1',
      role: 'cashier',
      active: true,
      created_at: new Date().toISOString(),
    },
  ],
};

class DatabaseRepository {
  private isDemo: boolean = false;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Check stored mode. Per strict instruction: DEMO_MODE defaults to false
    try {
      const savedMode = localStorage.getItem(STORAGE_MODE_KEY);
      this.isDemo = savedMode === 'true';
    } catch {
      this.isDemo = false;
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error in DB subscriber:', e);
      }
    });
  }

  public getDemoMode(): boolean {
    return this.isDemo;
  }

  public setDemoMode(enable: boolean) {
    this.isDemo = enable;
    try {
      localStorage.setItem(STORAGE_MODE_KEY, enable ? 'true' : 'false');
      // If switching to demo and demo storage is empty, initialize demo data
      if (enable) {
        const demoRaw = localStorage.getItem(STORAGE_DEMO_KEY);
        if (!demoRaw) {
          localStorage.setItem(STORAGE_DEMO_KEY, JSON.stringify(fullDemoState));
        }
      }
    } catch (e) {
      console.warn('Storage warning:', e);
    }
    this.notify();
  }

  private getState(): DatabaseState {
    const key = this.isDemo ? STORAGE_DEMO_KEY : STORAGE_PROD_KEY;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed reading database:', e);
    }

    // If not found, return empty production state or full demo state
    const initialState = this.isDemo ? { ...fullDemoState } : { ...emptyProductionState };
    try {
      localStorage.setItem(key, JSON.stringify(initialState));
    } catch {}
    return initialState;
  }

  private saveState(state: DatabaseState) {
    const key = this.isDemo ? STORAGE_DEMO_KEY : STORAGE_PROD_KEY;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error('Failed saving database:', e);
    }
    this.notify();
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return this.getState().products || [];
  }

  public getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  public saveProduct(productData: Partial<Product> & { name: string }): Product {
    const state = this.getState();
    const now = new Date().toISOString();
    let product: Product;

    if (productData.id) {
      const index = state.products.findIndex((p) => p.id === productData.id);
      if (index >= 0) {
        const oldProduct = state.products[index];
        product = {
          ...oldProduct,
          ...productData,
          updated_at: now,
        };
        state.products[index] = product;

        // If stock changed directly in edit, create adjustment record
        if (productData.stock !== undefined && productData.stock !== oldProduct.stock) {
          const diff = productData.stock - oldProduct.stock;
          this.recordStockMovementInternal(state, {
            product_id: product.id,
            product_name: product.name,
            type: 'ADJUSTMENT',
            quantity: diff,
            previous_stock: oldProduct.stock,
            new_stock: product.stock,
            notes: 'Penyesuaian stok manual dari form edit produk',
          });
        }
      } else {
        throw new Error('Produk tidak ditemukan');
      }
    } else {
      const newStock = productData.stock || 0;
      product = {
        id: 'prd-' + Date.now(),
        barcode: productData.barcode || `${Date.now()}`.slice(-10),
        sku: productData.sku || `ATK-${Date.now().toString().slice(-4)}`,
        name: productData.name,
        category_id: productData.category_id || '',
        purchase_price: Number(productData.purchase_price) || 0,
        selling_price: Number(productData.selling_price) || 0,
        stock: newStock,
        minimum_stock: Number(productData.minimum_stock) || 5,
        unit: productData.unit || 'pcs',
        description: productData.description || '',
        image: productData.image,
        show_on_public: productData.show_on_public !== false,
        status: 'active',
        created_at: now,
        updated_at: now,
      };
      state.products.unshift(product);

      if (newStock > 0) {
        this.recordStockMovementInternal(state, {
          product_id: product.id,
          product_name: product.name,
          type: 'STOCK_IN',
          quantity: newStock,
          previous_stock: 0,
          new_stock: newStock,
          notes: 'Stok awal penambahan produk baru',
        });
      }
    }

    this.saveState(state);
    return product;
  }

  public archiveProduct(id: string): boolean {
    const state = this.getState();
    const p = state.products.find((prod) => prod.id === id);
    if (!p) return false;
    p.status = 'archived';
    p.updated_at = new Date().toISOString();
    this.saveState(state);
    return true;
  }

  public restoreProduct(id: string): boolean {
    const state = this.getState();
    const p = state.products.find((prod) => prod.id === id);
    if (!p) return false;
    p.status = 'active';
    p.updated_at = new Date().toISOString();
    this.saveState(state);
    return true;
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return this.getState().categories || [];
  }

  public saveCategory(categoryData: Partial<Category> & { name: string }): Category {
    const state = this.getState();
    let category: Category;

    if (categoryData.id) {
      const idx = state.categories.findIndex((c) => c.id === categoryData.id);
      if (idx >= 0) {
        category = { ...state.categories[idx], ...categoryData };
        state.categories[idx] = category;
      } else {
        throw new Error('Kategori tidak ditemukan');
      }
    } else {
      category = {
        id: 'cat-' + Date.now(),
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        type: categoryData.type || 'atk',
        icon: categoryData.icon || 'Folder',
        description: categoryData.description || '',
      };
      state.categories.push(category);
    }

    this.saveState(state);
    return category;
  }

  public deleteCategory(id: string): boolean {
    const state = this.getState();
    state.categories = state.categories.filter((c) => c.id !== id);
    this.saveState(state);
    return true;
  }

  // --- SERVICES ---
  public getServices(): ServiceItem[] {
    return this.getState().services || [];
  }

  public saveService(serviceData: Partial<ServiceItem> & { service_name: string }): ServiceItem {
    const state = this.getState();
    const now = new Date().toISOString();
    let service: ServiceItem;

    if (serviceData.id) {
      const idx = state.services.findIndex((s) => s.id === serviceData.id);
      if (idx >= 0) {
        service = { ...state.services[idx], ...serviceData, updated_at: now };
        state.services[idx] = service;
      } else {
        throw new Error('Layanan tidak ditemukan');
      }
    } else {
      service = {
        id: 'srv-' + Date.now(),
        service_name: serviceData.service_name,
        category: serviceData.category || 'Fotocopy',
        unit: serviceData.unit || 'lembar',
        cost: Number(serviceData.cost) || 0,
        selling_price: Number(serviceData.selling_price) || 0,
        description: serviceData.description || '',
        active: serviceData.active !== undefined ? serviceData.active : true,
        created_at: now,
        updated_at: now,
      };
      state.services.push(service);
    }

    this.saveState(state);
    return service;
  }

  public toggleServiceActive(id: string): boolean {
    const state = this.getState();
    const s = state.services.find((item) => item.id === id);
    if (!s) return false;
    s.active = !s.active;
    s.updated_at = new Date().toISOString();
    this.saveState(state);
    return true;
  }

  // --- CUSTOMERS ---
  public getCustomers(): Customer[] {
    return this.getState().customers || [];
  }

  public saveCustomer(customerData: Partial<Customer> & { name: string }): Customer {
    const state = this.getState();
    let customer: Customer;

    if (customerData.id) {
      const idx = state.customers.findIndex((c) => c.id === customerData.id);
      if (idx >= 0) {
        customer = { ...state.customers[idx], ...customerData };
        state.customers[idx] = customer;
      } else {
        throw new Error('Pelanggan tidak ditemukan');
      }
    } else {
      customer = {
        id: 'cst-' + Date.now(),
        name: customerData.name,
        phone: customerData.phone || '',
        whatsapp: customerData.whatsapp || customerData.phone || '',
        address: customerData.address || '',
        customer_type: customerData.customer_type || 'GENERAL',
        notes: customerData.notes || '',
        created_at: new Date().toISOString(),
      };
      state.customers.push(customer);
    }

    this.saveState(state);
    return customer;
  }

  public deleteCustomer(id: string): boolean {
    const state = this.getState();
    state.customers = state.customers.filter((c) => c.id !== id);
    this.saveState(state);
    return true;
  }

  // --- SALES & POS ---
  public getSales(): Sale[] {
    return this.getState().sales || [];
  }

  public getSaleById(id: string): Sale | undefined {
    return this.getSales().find((s) => s.id === id);
  }

  public createSale(
    saleHeader: Omit<Sale, 'id' | 'invoice_number' | 'created_at' | 'items'>,
    items: Omit<SaleItem, 'id' | 'sale_id'>[]
  ): Sale {
    const state = this.getState();
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const dailyCount = (state.sales.filter((s) => s.created_at.startsWith(now.toISOString().slice(0, 10))).length + 1)
      .toString()
      .padStart(3, '0');
    const invoiceNumber = `INV-${dateStr}-${dailyCount}`;
    const saleId = 'sale-' + Date.now();

    const saleItems: SaleItem[] = items.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      sale_id: saleId,
      ...item,
    }));

    const newSale: Sale = {
      ...saleHeader,
      id: saleId,
      invoice_number: invoiceNumber,
      items: saleItems,
      created_at: now.toISOString(),
    };

    // Deduct stock for PRODUCT items and record stock movement
    for (const item of saleItems) {
      if (item.item_type === 'PRODUCT' && item.product_id) {
        const prod = state.products.find((p) => p.id === item.product_id);
        if (prod) {
          const prev = prod.stock;
          const next = Math.max(0, prev - item.quantity);
          prod.stock = next;
          prod.updated_at = now.toISOString();

          this.recordStockMovementInternal(state, {
            product_id: prod.id,
            product_name: prod.name,
            type: 'SALE',
            quantity: -item.quantity,
            previous_stock: prev,
            new_stock: next,
            reference_id: invoiceNumber,
            notes: `Penjualan kasir (${invoiceNumber})`,
          });
        }
      }
    }

    state.sales.unshift(newSale);
    this.saveState(state);
    return newSale;
  }

  // --- STOCK MOVEMENTS ---
  public getStockMovements(): StockMovement[] {
    return this.getState().stock_movements || [];
  }

  private recordStockMovementInternal(
    state: DatabaseState,
    data: Omit<StockMovement, 'id' | 'created_at'>
  ) {
    const movement: StockMovement = {
      ...data,
      id: 'sm-' + Date.now() + Math.floor(Math.random() * 100),
      created_at: new Date().toISOString(),
    };
    state.stock_movements.unshift(movement);
  }

  public recordStockAdjustment(
    productId: string,
    type: StockMovementType,
    quantityChange: number,
    notes?: string
  ): boolean {
    const state = this.getState();
    const product = state.products.find((p) => p.id === productId);
    if (!product) return false;

    const prev = product.stock;
    const next = Math.max(0, prev + quantityChange);
    product.stock = next;
    product.updated_at = new Date().toISOString();

    this.recordStockMovementInternal(state, {
      product_id: product.id,
      product_name: product.name,
      type,
      quantity: quantityChange,
      previous_stock: prev,
      new_stock: next,
      reference_id: `ADJ-${Date.now().toString().slice(-6)}`,
      notes: notes || `Penyesuaian stok (${type})`,
    });

    this.saveState(state);
    return true;
  }

  // --- EXPENSES ---
  public getExpenses(): Expense[] {
    return this.getState().expenses || [];
  }

  public saveExpense(expenseData: Partial<Expense> & { description: string; amount: number }): Expense {
    const state = this.getState();
    let expense: Expense;

    if (expenseData.id) {
      const idx = state.expenses.findIndex((e) => e.id === expenseData.id);
      if (idx >= 0) {
        expense = { ...state.expenses[idx], ...expenseData };
        state.expenses[idx] = expense;
      } else {
        throw new Error('Pengeluaran tidak ditemukan');
      }
    } else {
      expense = {
        id: 'exp-' + Date.now(),
        date: expenseData.date || new Date().toISOString().split('T')[0],
        category: expenseData.category || 'Operasional',
        description: expenseData.description,
        amount: Number(expenseData.amount) || 0,
        notes: expenseData.notes || '',
        created_at: new Date().toISOString(),
      };
      state.expenses.unshift(expense);
    }

    this.saveState(state);
    return expense;
  }

  public deleteExpense(id: string): boolean {
    const state = this.getState();
    state.expenses = state.expenses.filter((e) => e.id !== id);
    this.saveState(state);
    return true;
  }

  // --- CMS & SETTINGS ---
  public getWebsiteContent(): WebsiteContent {
    return this.getState().website_content || { ...initialWebsiteContent };
  }

  public updateWebsiteContent(content: Partial<WebsiteContent>): WebsiteContent {
    const state = this.getState();
    state.website_content = { ...state.website_content, ...content };

    // Auto-sync shared contact information with store settings
    if (!state.settings) {
      state.settings = { ...initialStoreSettings };
    }
    if (content.whatsapp_number !== undefined) {
      state.settings.whatsapp = content.whatsapp_number;
    }
    if (content.phone_number !== undefined) {
      state.settings.phone = content.phone_number;
    }
    if (content.address !== undefined) {
      state.settings.address = content.address;
    }
    if (content.business_tagline !== undefined) {
      state.settings.main_tagline = content.business_tagline;
    }

    this.saveState(state);
    return state.website_content;
  }

  public getSettings(): StoreSettings {
    return this.getState().settings || { ...initialStoreSettings };
  }

  public updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    const state = this.getState();
    state.settings = { ...state.settings, ...newSettings };

    // Auto-sync shared contact information with public website content
    if (!state.website_content) {
      state.website_content = { ...initialWebsiteContent };
    }
    if (newSettings.whatsapp !== undefined) {
      state.website_content.whatsapp_number = newSettings.whatsapp;
    }
    if (newSettings.phone !== undefined) {
      state.website_content.phone_number = newSettings.phone;
    }
    if (newSettings.address !== undefined) {
      state.website_content.address = newSettings.address;
    }
    if (newSettings.main_tagline !== undefined) {
      state.website_content.business_tagline = newSettings.main_tagline;
    }

    this.saveState(state);
    return state.settings;
  }

  // --- PORTFOLIO ---
  public getPortfolioProjects(): PortfolioProject[] {
    return this.getState().portfolio_projects || [];
  }

  public savePortfolioProject(data: Partial<PortfolioProject> & { title: string; description: string }): PortfolioProject {
    const state = this.getState();
    let project: PortfolioProject;

    if (data.id) {
      const idx = state.portfolio_projects.findIndex((p) => p.id === data.id);
      if (idx >= 0) {
        project = { ...state.portfolio_projects[idx], ...data };
        state.portfolio_projects[idx] = project;
      } else {
        throw new Error('Project tidak ditemukan');
      }
    } else {
      project = {
        id: 'port-' + Date.now(),
        title: data.title,
        category: data.category || 'Website Usaha',
        client: data.client || '',
        description: data.description,
        technologies: data.technologies || ['React', 'Web System'],
        image: data.image,
        live_url: data.live_url,
        status: data.status || 'completed',
        is_demo: data.is_demo !== undefined ? data.is_demo : this.isDemo,
        created_at: new Date().toISOString(),
      };
      state.portfolio_projects.push(project);
    }

    this.saveState(state);
    return project;
  }

  public deletePortfolioProject(id: string): boolean {
    const state = this.getState();
    state.portfolio_projects = state.portfolio_projects.filter((p) => p.id !== id);
    this.saveState(state);
    return true;
  }

  // --- USERS ---
  public getUsers(): User[] {
    return this.getState().users || [];
  }

  // --- MAINTENANCE & UTILS ---
  public resetCurrentDatabase() {
    if (this.isDemo) {
      localStorage.removeItem(STORAGE_DEMO_KEY);
    } else {
      localStorage.removeItem(STORAGE_PROD_KEY);
    }
    this.notify();
  }

  public seedDemoDataNow() {
    try {
      localStorage.setItem(STORAGE_DEMO_KEY, JSON.stringify(fullDemoState));
      this.isDemo = true;
      localStorage.setItem(STORAGE_MODE_KEY, 'true');
    } catch {}
    this.notify();
  }

  public clearProductionData() {
    try {
      localStorage.setItem(STORAGE_PROD_KEY, JSON.stringify(emptyProductionState));
    } catch {}
    this.notify();
  }
}

// Export singleton repository instance
export const dbRepository = new DatabaseRepository();
