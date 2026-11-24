import React, { useEffect, useState } from 'react';
import { api } from './services/api.js';
import { AppProvider, useApp } from './context/AppContext.js';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { SearchModal } from './components/SearchModal.js';
import { ToastContainer } from './components/ToastContainer.js';
import { LoginScreen } from './components/LoginScreen.js';
import { User } from './types/index.js';

// All 16 Modules
import { DashboardModule } from './modules/DashboardModule.js';
import { CreatorsModule } from './modules/CreatorsModule.js';
import { AgenciesModule } from './modules/AgenciesModule.js';
import { BrandsModule } from './modules/BrandsModule.js';
import { CampaignsModule } from './modules/CampaignsModule.js';
import { CollaborationsModule } from './modules/CollaborationsModule.js';
import { CalendarModule } from './modules/CalendarModule.js';
import { AnalyticsModule } from './modules/AnalyticsModule.js';
import { PipelineModule } from './modules/PipelineModule.js';
import { ContractsModule } from './modules/ContractsModule.js';
import { PaymentsModule } from './modules/PaymentsModule.js';
import { TasksModule } from './modules/TasksModule.js';
import { MessagesModule } from './modules/MessagesModule.js';
import { FilesModule } from './modules/FilesModule.js';
import { NotificationsModule } from './modules/NotificationsModule.js';
import { SettingsModule } from './modules/SettingsModule.js';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule />;
      case 'creators':
        return <CreatorsModule />;
      case 'agencies':
        return <AgenciesModule />;
      case 'brands':
        return <BrandsModule />;
      case 'campaigns':
        return <CampaignsModule />;
      case 'collaborations':
        return <CollaborationsModule />;
      case 'calendar':
        return <CalendarModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'pipeline':
        return <PipelineModule />;
      case 'contracts':
        return <ContractsModule />;
      case 'payments':
        return <PaymentsModule />;
      case 'tasks':
        return <TasksModule />;
      case 'messages':
        return <MessagesModule />;
      case 'files':
        return <FilesModule />;
      case 'notifications':
        return <NotificationsModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="min-h-screen bg-[#10101B] text-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Top Header Navbar */}
      <Header sidebarCollapsed={sidebarCollapsed} />

      {/* Main Dynamic Viewport */}
      <main
        className={`pt-24 pb-12 px-6 sm:px-8 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {renderModule()}
        </div>
      </main>

      {/* Global Modals & Toasts */}
      <SearchModal />
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => api.getStoredUser());
  const [isCheckingSession, setIsCheckingSession] = useState(() => Boolean(localStorage.getItem('vyralexx_token')));

  useEffect(() => {
    if (!localStorage.getItem('vyralexx_token')) {
      setIsCheckingSession(false);
      return;
    }

    api.getCurrentUser()
      .then(({ user: currentUser }) => {
        localStorage.setItem('vyralexx_user', JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(() => {
        api.logout();
        setUser(null);
      })
      .finally(() => setIsCheckingSession(false));
  }, []);

  if (isCheckingSession) {
    return <div className="min-h-screen bg-[#10101B] flex items-center justify-center text-sm text-[#A1A1B5]">Verificando sesión...</div>;
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <AppProvider initialRole={user.role}>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
