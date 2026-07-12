import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import ToastContainer from '../components/common/ToastContainer';
import { useTransitOps } from '../hooks/TransitOpsContext';
import authService from '../services/authService';
import { ChatWidget } from '../components/common/ChatWidget';

export const DashboardLayout = () => {
  const { searchQuery, setSearchQuery } = useTransitOps();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Load session user details
  const [user, setUser] = useState(() => {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const data = localStorage.getItem('user');
        setUser(data ? JSON.parse(data) : null);
      } catch {}
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-profile-update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-profile-update', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  // Determine current active tab from pathname
  const pathParts = location.pathname.split('/');
  const currentTab = pathParts[2] || 'dashboard';

  const handleItemClick = (id) => {
    if (id === 'logout') {
      handleLogout();
    } else if (id === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${id}`);
    }
  };

  // Dynamic breadcrumb generation
  const renderBreadcrumbs = () => {
    if (currentTab === 'dashboard') return null;
    
    // Explicit mapping for clean labeling
    let pathLabel = currentTab.charAt(0).toUpperCase() + currentTab.slice(1);
    if (currentTab === 'fuel') pathLabel = 'Fuel & Expenses';
    if (currentTab === 'maintenance') pathLabel = 'Maintenance';
    if (currentTab === 'trips') pathLabel = 'Trips';
    
    return (
      <nav className="flex items-center text-label-sm text-outline mb-2 select-none">
        <span className="cursor-pointer hover:underline" onClick={() => navigate('/dashboard')}>Fleet</span>
        <span className="material-symbols-outlined text-[14px] mx-1">chevron_right</span>
        <span className="text-on-surface-variant font-bold">{pathLabel}</span>
      </nav>
    );
  };

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-background">
      
      {/* Sidebar Component */}
      <Sidebar 
        activeItem={currentTab} 
        onItemClick={handleItemClick} 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />

      {/* Main Content Layout Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Navbar Header */}
        <Navbar 
          user={user} 
          onLogout={handleLogout} 
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Content Canvas */}
        <main className="flex-1 overflow-y-auto p-margin-desktop space-y-gutter custom-scrollbar pb-12">
          
          {/* Breadcrumbs Overlay */}
          {renderBreadcrumbs()}

          {/* Child Page Content */}
          <Outlet />

          {/* Footer Spacer */}
          <footer className="h-12 flex items-center justify-center border-t border-outline-variant/30 mt-8 pt-8 text-center shrink-0">
            <p className="font-label-sm text-label-sm text-on-surface-variant opacity-50 select-none">
              © 2024 TransitOps Enterprise. Confidential Infrastructure Interface.
            </p>
          </footer>
        </main>
      </div>

      {/* Global Chatbot widget */}
      <ChatWidget />

      {/* Global Toast Alerts */}
      <ToastContainer />

    </div>
  );
};

export default DashboardLayout;
