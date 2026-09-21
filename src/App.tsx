import React from 'react';
import { AppProvider, useApp } from './context/AppContext';

// Public website components
import { Navbar } from './components/public/Navbar';
import { HeroSection } from './components/public/HeroSection';
import { MainServices } from './components/public/MainServices';
import { ProductCatalog } from './components/public/ProductCatalog';
import { QuickOrder } from './components/public/QuickOrder';
import { PriceListSection } from './components/public/PriceListSection';
import { WhyUsSection } from './components/public/WhyUsSection';
import { UmkmSection } from './components/public/UmkmSection';
import { DigitalSolutionsSection } from './components/public/DigitalSolutionsSection';
import { PortfolioSection } from './components/public/PortfolioSection';
import { AboutSection } from './components/public/AboutSection';
import { ContactSection } from './components/public/ContactSection';
import { Footer } from './components/public/Footer';
import { FloatingWhatsApp } from './components/public/FloatingWhatsApp';

// Admin management components
import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardHome } from './components/admin/DashboardHome';
import { PosModule } from './components/admin/PosModule';
import { ProductManager } from './components/admin/ProductManager';
import { ServiceManager } from './components/admin/ServiceManager';
import { InventoryManager } from './components/admin/InventoryManager';
import { SalesHistory } from './components/admin/SalesHistory';
import { CustomerManager } from './components/admin/CustomerManager';
import { ExpenseManager } from './components/admin/ExpenseManager';
import { ReportManager } from './components/admin/ReportManager';
import { PortfolioManager } from './components/admin/PortfolioManager';
import { CmsManager } from './components/admin/CmsManager';
import { SettingsManager } from './components/admin/SettingsManager';

// Common Modals & Toasts
import { AdminLoginModal } from './components/common/AdminLoginModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { ToastContainer } from './components/common/ToastContainer';

const AdminRouter: React.FC = () => {
  const { adminTab } = useApp();

  switch (adminTab) {
    case 'dashboard':
      return <DashboardHome />;
    case 'pos':
      return <PosModule />;
    case 'products':
      return <ProductManager />;
    case 'services':
      return <ServiceManager />;
    case 'stock':
      return <InventoryManager />;
    case 'sales':
      return <SalesHistory />;
    case 'customers':
      return <CustomerManager />;
    case 'expenses':
      return <ExpenseManager />;
    case 'reports':
      return <ReportManager />;
    case 'portfolio':
      return <PortfolioManager />;
    case 'cms':
      return <CmsManager />;
    case 'settings':
      return <SettingsManager />;
    default:
      return <DashboardHome />;
  }
};

const MainApp: React.FC = () => {
  const { currentView, activeReceiptSale, setActiveReceiptSale, settings } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased selection:bg-amber-500 selection:text-white flex flex-col font-sans">
      {currentView === 'admin' ? (
        <AdminLayout>
          <AdminRouter />
        </AdminLayout>
      ) : (
        <>
          <Navbar />
          <main className="flex-1">
            <HeroSection />
            <MainServices />
            <ProductCatalog />
            <QuickOrder />
            <PriceListSection />
            <WhyUsSection />
            <UmkmSection />
            <DigitalSolutionsSection />
            <PortfolioSection />
            <AboutSection />
            <ContactSection />
          </main>
          <Footer />
          <FloatingWhatsApp />
        </>
      )}

      {/* Global Modals & Notifications */}
      <AdminLoginModal />
      <ReceiptModal
        sale={activeReceiptSale}
        settings={settings}
        onClose={() => setActiveReceiptSale(null)}
      />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
