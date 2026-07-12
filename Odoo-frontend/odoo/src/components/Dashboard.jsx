import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './common/Sidebar';
import Navbar from './common/Navbar';
import OperationalOverview from './views/OperationalOverview';
import Vehicles from './views/Vehicles';
import Drivers from './views/Drivers';
import Trips from './views/Trips';
import Maintenance from './views/Maintenance';
import FuelExpenses from './FuelExpenses';
import Reports from './Reports';
import Settings from './Settings';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const getPageTitle = () => {
    switch (activeMenu) {
      case 'vehicles':
        return 'Fleet Assets';
      case 'drivers':
        return 'Driver Personnel';
      case 'trips':
        return 'Trips Management';
      case 'maintenance':
        return 'Maintenance Board';
      case 'fuel':
        return 'Fuel & Expenses';
      case 'reports':
        return 'Reports';
      case 'settings':
        return 'Settings';
      case 'dashboard':
      default:
        return 'Operational Overview';
    }
  };

  const renderActiveView = () => {
    switch (activeMenu) {
      case 'vehicles':
        return <Vehicles searchQuery={searchQuery} />;
      case 'drivers':
        return <Drivers searchQuery={searchQuery} />;
      case 'trips':
        return <Trips searchQuery={searchQuery} />;
      case 'maintenance':
        return <Maintenance searchQuery={searchQuery} />;
      case 'fuel':
        return <FuelExpenses searchQuery={searchQuery} />;
      case 'reports':
        return <Reports searchQuery={searchQuery} />;

      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return <OperationalOverview />;
    }
  };

  if (!user) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-on-background">
      
      {/* Sidebar Component */}
      <Sidebar 
        activeItem={activeMenu} 
        onItemClick={(id) => setActiveMenu(id)} 
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
          {renderActiveView()}

          {/* Footer Spacer */}
          <footer className="h-12 flex items-center justify-center border-t border-outline-variant/30 mt-8 pt-8 text-center shrink-0">
            <p className="font-label-sm text-label-sm text-on-surface-variant opacity-50">
              © 2024 TransitOps Enterprise. Confidential Infrastructure Interface.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
