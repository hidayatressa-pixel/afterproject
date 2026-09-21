import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbRepository } from '../services/db';
import {
  Product,
  Category,
  ServiceItem,
  Customer,
  Sale,
  StockMovement,
  Expense,
  WebsiteContent,
  PortfolioProject,
  StoreSettings,
  User,
  SaleItem,
  StockMovementType,
} from '../types';

export type AdminTab =
  | 'dashboard'
  | 'pos'
  | 'products'
  | 'categories'
  | 'stock'
  | 'services'
  | 'sales'
  | 'customers'
  | 'expenses'
  | 'reports'
  | 'cms'
  | 'portfolio'
  | 'settings'
  | 'users';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation & View
  currentView: 'public' | 'admin';
  setCurrentView: (view: 'public' | 'admin') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Auth
  currentUser: User | null;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  login: (username: string, pinOrPass: string) => boolean;
  logout: () => void;

  // Mode
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  loadDemoData: () => void;
  clearDatabase: () => void;

  // Data
  products: Product[];
  categories: Category[];
  services: ServiceItem[];
  customers: Customer[];
  sales: Sale[];
  stockMovements: StockMovement[];
  expenses: Expense[];
  websiteContent: WebsiteContent;
  portfolioProjects: PortfolioProject[];
  settings: StoreSettings;
  users: User[];

  // Actions
  saveProduct: (data: Partial<Product> & { name: string }) => Product;
  archiveProduct: (id: string) => void;
  restoreProduct: (id: string) => void;

  saveCategory: (data: Partial<Category> & { name: string }) => Category;
  deleteCategory: (id: string) => void;

  saveService: (data: Partial<ServiceItem> & { service_name: string }) => ServiceItem;
  toggleServiceActive: (id: string) => void;

  saveCustomer: (data: Partial<Customer> & { name: string }) => Customer;
  deleteCustomer: (id: string) => void;

  createSale: (
    saleHeader: Omit<Sale, 'id' | 'invoice_number' | 'created_at' | 'items'>,
    items: Omit<SaleItem, 'id' | 'sale_id'>[]
  ) => Sale;

  recordStockAdjustment: (
    productId: string,
    type: StockMovementType,
    quantityChange: number,
    notes?: string
  ) => void;

  saveExpense: (data: Partial<Expense> & { description: string; amount: number }) => Expense;
  deleteExpense: (id: string) => void;

  updateWebsiteContent: (data: Partial<WebsiteContent>) => void;
  updateSettings: (data: Partial<StoreSettings>) => void;

  savePortfolioProject: (data: Partial<PortfolioProject> & { title: string; description: string }) => PortfolioProject;
  deletePortfolioProject: (id: string) => void;

  // Active Receipt Modal
  activeReceiptSale: Sale | null;
  setActiveReceiptSale: (sale: Sale | null) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeReceiptSale, setActiveReceiptSale] = useState<Sale | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // State loaded from dbRepository
  const [isDemoMode, setIsDemoMode] = useState<boolean>(dbRepository.getDemoMode());
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(dbRepository.getWebsiteContent());
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(dbRepository.getSettings());
  const [users, setUsers] = useState<User[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = 't-' + Date.now() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshData = useCallback(() => {
    setIsDemoMode(dbRepository.getDemoMode());
    setProducts(dbRepository.getProducts());
    setCategories(dbRepository.getCategories());
    setServices(dbRepository.getServices());
    setCustomers(dbRepository.getCustomers());
    setSales(dbRepository.getSales());
    setStockMovements(dbRepository.getStockMovements());
    setExpenses(dbRepository.getExpenses());
    setWebsiteContent(dbRepository.getWebsiteContent());
    setPortfolioProjects(dbRepository.getPortfolioProjects());
    setSettings(dbRepository.getSettings());
    setUsers(dbRepository.getUsers());
  }, []);

  useEffect(() => {
    refreshData();
    const unsubscribe = dbRepository.subscribe(() => {
      refreshData();
    });
    return unsubscribe;
  }, [refreshData]);

  // Auth handler
  const login = (username: string, pinOrPass: string): boolean => {
    const normalizedUsername = username.trim().toLowerCase();
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === normalizedUsername && u.active
    );

    // Prototype credentials are intentionally explicit per account.
    // Replace this with server-side/Firebase/Supabase authentication before public production use.
    const validPrototypeCredential =
      (normalizedUsername === 'admin' && pinOrPass === 'admin123') ||
      (normalizedUsername === 'kasir' && pinOrPass === 'kasir123');

    if (foundUser && validPrototypeCredential) {
      setCurrentUser(foundUser);
      setIsAdminLoginOpen(false);
      setAdminTab(foundUser.role === 'cashier' ? 'pos' : 'dashboard');
      setCurrentView('admin');
      addToast('success', 'Berhasil Masuk', `Selamat datang, ${foundUser.name}`);
      return true;
    }

    addToast('error', 'Login Gagal', 'Username atau password salah.');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('public');
    addToast('info', 'Telah Keluar', 'Sesi admin ditutup.');
  };

  const toggleDemoMode = () => {
    const nextMode = !isDemoMode;
    dbRepository.setDemoMode(nextMode);
    addToast(
      'info',
      nextMode ? 'Demo Mode Diaktifkan' : 'Production Mode Aktif',
      nextMode
        ? 'Data sampel dimuat untuk pengujian POS dan laporan.'
        : 'Database produksi bersih / kosong siap pakai.'
    );
  };

  const loadDemoData = () => {
    dbRepository.seedDemoDataNow();
    addToast('success', 'Data Demo Dimuat', 'Sampel produk ATK, layanan fotocopy, dan transaksi siap digunakan.');
  };

  const clearDatabase = () => {
    if (isDemoMode) {
      dbRepository.resetCurrentDatabase();
    } else {
      dbRepository.clearProductionData();
    }
    addToast('info', 'Database Dikosongkan', 'Semua data di mode ini telah dibersihkan.');
  };

  // Actions
  const saveProduct = (data: Partial<Product> & { name: string }) => {
    const p = dbRepository.saveProduct(data);
    addToast('success', 'Produk Disimpan', `"${p.name}" berhasil disimpan.`);
    return p;
  };

  const archiveProduct = (id: string) => {
    dbRepository.archiveProduct(id);
    addToast('info', 'Produk Diarsipkan', 'Produk dinonaktifkan dari katalog dan kasir.');
  };

  const restoreProduct = (id: string) => {
    dbRepository.restoreProduct(id);
    addToast('success', 'Produk Dipulihkan', 'Produk kembali aktif di katalog dan kasir.');
  };

  const saveCategory = (data: Partial<Category> & { name: string }) => {
    const c = dbRepository.saveCategory(data);
    addToast('success', 'Kategori Disimpan', `Kategori "${c.name}" diperbarui.`);
    return c;
  };

  const deleteCategory = (id: string) => {
    dbRepository.deleteCategory(id);
    addToast('info', 'Kategori Dihapus', 'Kategori telah dihapus.');
  };

  const saveService = (data: Partial<ServiceItem> & { service_name: string }) => {
    const s = dbRepository.saveService(data);
    addToast('success', 'Layanan Disimpan', `Layanan "${s.service_name}" berhasil disimpan.`);
    return s;
  };

  const toggleServiceActive = (id: string) => {
    dbRepository.toggleServiceActive(id);
    addToast('info', 'Status Layanan Diubah');
  };

  const saveCustomer = (data: Partial<Customer> & { name: string }) => {
    const c = dbRepository.saveCustomer(data);
    addToast('success', 'Pelanggan Disimpan', `Data "${c.name}" tersimpan.`);
    return c;
  };

  const deleteCustomer = (id: string) => {
    dbRepository.deleteCustomer(id);
    addToast('info', 'Pelanggan Dihapus');
  };

  const createSale = (
    saleHeader: Omit<Sale, 'id' | 'invoice_number' | 'created_at' | 'items'>,
    items: Omit<SaleItem, 'id' | 'sale_id'>[]
  ) => {
    const sale = dbRepository.createSale(saleHeader, items);
    setActiveReceiptSale(sale);
    addToast('success', 'Transaksi Selesai!', `Invoice ${sale.invoice_number} berhasil dicatat.`);
    return sale;
  };

  const recordStockAdjustment = (
    productId: string,
    type: StockMovementType,
    quantityChange: number,
    notes?: string
  ) => {
    dbRepository.recordStockAdjustment(productId, type, quantityChange, notes);
    addToast('success', 'Penyesuaian Stok Dicatat', `Perubahan stok berhasil direkam di kartu stok.`);
  };

  const saveExpense = (data: Partial<Expense> & { description: string; amount: number }) => {
    const e = dbRepository.saveExpense(data);
    addToast('success', 'Pengeluaran Dicatat', `Biaya "${e.description}" Rp ${e.amount.toLocaleString('id-ID')} tersimpan.`);
    return e;
  };

  const deleteExpense = (id: string) => {
    dbRepository.deleteExpense(id);
    addToast('info', 'Pengeluaran Dihapus');
  };

  const updateWebsiteContent = (data: Partial<WebsiteContent>) => {
    dbRepository.updateWebsiteContent(data);
    addToast('success', 'Konten Website Diperbarui', 'Perubahan langsung tampil di halaman publik.');
  };

  const updateSettings = (data: Partial<StoreSettings>) => {
    dbRepository.updateSettings(data);
    addToast('success', 'Pengaturan Disimpan', 'Konfigurasi toko berhasil disimpan.');
  };

  const savePortfolioProject = (data: Partial<PortfolioProject> & { title: string; description: string }) => {
    const proj = dbRepository.savePortfolioProject(data);
    addToast('success', 'Project Portofolio Disimpan', `"${proj.title}" berhasil disimpan.`);
    return proj;
  };

  const deletePortfolioProject = (id: string) => {
    dbRepository.deletePortfolioProject(id);
    addToast('info', 'Project Portofolio Dihapus');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        adminTab,
        setAdminTab,
        currentUser,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        login,
        logout,
        isDemoMode,
        toggleDemoMode,
        loadDemoData,
        clearDatabase,
        products,
        categories,
        services,
        customers,
        sales,
        stockMovements,
        expenses,
        websiteContent,
        portfolioProjects,
        settings,
        users,
        saveProduct,
        archiveProduct,
        restoreProduct,
        saveCategory,
        deleteCategory,
        saveService,
        toggleServiceActive,
        saveCustomer,
        deleteCustomer,
        createSale,
        recordStockAdjustment,
        saveExpense,
        deleteExpense,
        updateWebsiteContent,
        updateSettings,
        savePortfolioProject,
        deletePortfolioProject,
        activeReceiptSale,
        setActiveReceiptSale,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
