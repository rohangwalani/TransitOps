import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './common/Sidebar';
import Navbar from './common/Navbar';
import OperationalOverview from './views/OperationalOverview';
import Vehicles from './views/Vehicles';
import Drivers from './views/Drivers';
import Trips from './views/Trips';
import Maintenance from './views/Maintenance';
import KPICard from './common/KPICard';
import Table from './common/Table';
import StatusBadge from './common/StatusBadge';
import Settings from './Settings';
import Reports from './Reports';
import FuelExpenses from './FuelExpenses';




const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
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
      case 'dashboard':
      default:
        return 'Operational Overview';
    }
  };

  const renderActiveView = () => {
    switch (activeMenu) {
      case 'vehicles':
        return <Vehicles />;
      case 'drivers':
        return <Drivers />;
      case 'trips':
        return <Trips />;
      case 'maintenance':
        return <Maintenance />;
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
        {activeMenu === 'settings' ? (
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <Settings />
          </main>
        ) : activeMenu === 'reports' ? (
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <Reports />
          </main>
        ) : activeMenu === 'fuel' ? (
          <main className="flex-1 overflow-y-auto custom-scrollbar">
            <FuelExpenses />
          </main>
        ) : activeMenu === 'dashboard' ? (
          <main className="flex-1 overflow-y-auto p-margin-desktop space-y-gutter custom-scrollbar pb-12">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-background">Operational Overview</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Real-time performance metrics across your fleet.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-unit-md py-2 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-md text-body-md hover:bg-surface-container transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  Last 24 Hours
                </button>
                <button className="px-unit-md py-2 rounded-lg bg-primary text-white font-body-md text-body-md font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm active:scale-[0.98]">
                  <span className="material-symbols-outlined text-[20px]">file_download</span>
                  Export Report
                </button>
              </div>
            </div>

            {/* KPI Grid Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              
              {/* Active Vehicles */}
              <KPICard
                title="Active Vehicles"
                value="1,284"
                icon="local_shipping"
                iconBgClass="bg-primary-fixed text-primary"
                trendText="+12%"
                trendType="success"
                subtext="from 1,146 yesterday"
              />

              {/* On-Time Rate */}
              <KPICard
                title="On-Time Rate"
                value="98.2%"
                icon="schedule"
                iconBgClass="bg-secondary-container text-on-secondary-container"
                trendText="Optimal"
                trendType="success"
                progressBar={98.2}
              />

              {/* Fuel Efficiency */}
              <KPICard
                title="Fuel Efficiency"
                value="8.4 mpg"
                icon="gas_meter"
                iconBgClass="bg-tertiary-fixed text-on-tertiary-fixed-variant"
                trendText="-2.4%"
                trendType="error"
                subtext="Avg. fleet consumption"
              />

              {/* Maintenance Alerts */}
              <KPICard
                title="Maintenance Alerts"
                value="07"
                valueColor="text-error"
                icon="warning"
                iconBgClass="bg-error-container text-error"
                subtext="3 critical items pending"
              />
            </section>

            {/* Fleet Status & Trends Bento Grid */}
            <section className="grid grid-cols-12 gap-gutter">
              
              {/* Capacity vs Demand Chart */}
              <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant soft-shadow">
                <div className="flex justify-between items-center mb-unit-lg">
                  <h3 className="font-title-md text-title-md text-on-background">Fleet Capacity vs Demand</h3>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-primary rounded-full"></span>
                      <span className="font-label-md text-label-md text-on-surface">Demand</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-secondary rounded-full"></span>
                      <span className="font-label-md text-label-md text-on-surface">Capacity</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic CSS Bar Chart */}
                <div className="h-64 relative w-full flex items-end gap-2 overflow-hidden px-4">
                  {chartData.map((d, index) => (
                    <div key={index} className="flex-1 bg-surface-container rounded-t-lg relative group" style={{ height: d.height }}>
                      <div 
                        className="absolute bottom-0 w-full bg-primary rounded-t-lg transition-all duration-700 group-hover:opacity-80" 
                        style={{ height: `${d.demand}%` }}
                      ></div>
                      <div 
                        className="absolute bottom-0 left-1/2 w-1/2 -translate-x-1/2 bg-secondary rounded-t-lg transition-all duration-700" 
                        style={{ height: `${d.capacity}%` }}
                      ></div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4 text-on-surface-variant font-label-md text-label-md px-4">
                  {chartData.map((d, i) => (
                    <span key={i}>{d.day}</span>
                  ))}
                </div>
              </div>

              {/* Live Distribution Map */}
              <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-unit-lg rounded-xl border border-outline-variant soft-shadow relative overflow-hidden group min-h-[300px]">
                <h3 className="font-title-md text-title-md mb-unit-lg relative z-10 text-on-background">Live Fleet Distribution</h3>
                <div className="absolute inset-0 z-0">
                  <div 
                    className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500 bg-cover bg-center" 
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCiprVW8bxhfUE-vL_vx6wKDCRSd5YLMfGDUzPh4UASoOj99lobF06vI5tAkhsNfNvOT236rJ0L6Klam8u4DDgf1X2TxyylAhy-pCkbb-zGXpoZp1YBT4o-sOthSl-N-SnnQDZkpMWnfN_kz9IVXjXLueJtkvUBtyMmxe7Smk_1gaXypP2TvuItmhpCfKoZPnSgc8oi4yUG791kp7HPJRAt6ziztzWEG9GHcAlwbq2ilsrlvzegBVw9IQ')" }}
                    alt="New York distribution map interface"
                  ></div>
                </div>
                <div className="absolute bottom-unit-md left-unit-md right-unit-md bg-white/90 backdrop-blur-md p-unit-md rounded-lg border border-outline-variant z-10 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-body-md font-semibold text-on-surface">Tri-State Area</span>
                    <span className="font-label-md text-label-md text-secondary font-bold">84 Vehicles Active</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Reusable Recent Trips Table Log */}
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant soft-shadow overflow-hidden flex flex-col">
              <div className="px-unit-lg py-unit-md border-b border-outline-variant flex justify-between items-center bg-white">
                <h3 className="font-title-md text-title-md text-on-background">Recent Trip Logs</h3>
                <div className="flex gap-2">
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>
              
              {/* Render with Reusable Table */}
              <Table 
                columns={recentTripsColumns} 
                data={recentTripsData} 
              />

              <div className="px-unit-lg py-4 bg-surface-container-lowest flex justify-between items-center border-t border-outline-variant">
                <span className="font-body-md text-body-md text-on-surface-variant">Showing 1-3 of 1,284 trips</span>
                <div className="flex gap-2">
                  <button className="p-1.5 border border-outline-variant rounded hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="p-1.5 border border-outline-variant rounded hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Dynamic Insights Footer Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              
              {/* AI Optimization Insight */}
              <div className="p-unit-lg bg-inverse-surface text-inverse-on-surface rounded-xl flex items-center gap-6 overflow-hidden relative min-h-[160px]">
                <div className="flex-1 z-10">
                  <h4 className="font-title-md text-title-md mb-2">AI Optimization Insight</h4>
                  <p className="font-body-md text-body-md opacity-80">
                    Rerouting 12 vehicles in the NE corridor could save 4.2% fuel costs today based on current traffic patterns.
                  </p>
                  <button className="mt-4 px-unit-md py-2 bg-primary-fixed text-primary font-bold rounded-lg hover:bg-white transition-colors">
                    Apply Optimization
                  </button>
                </div>
                <div className="w-32 h-32 opacity-20 absolute -right-4 -bottom-4 flex items-center justify-center select-none pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    insights
                  </span>
                </div>
              </div>

              {/* System Integrity */}
              <div className="p-unit-lg bg-surface-container-high rounded-xl border border-primary/20 flex flex-col justify-center min-h-[160px] text-on-surface">
                <div className="flex items-center gap-4 mb-3">
                  <span className="material-symbols-outlined text-primary">hub</span>
                  <h4 className="font-title-md text-title-md text-primary font-semibold">System Integrity</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-outline-variant rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full animate-pulse" style={{ width: '100%' }}></div>
                  </div>
                  <span className="font-label-md text-label-md text-secondary font-bold">100% UP</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">All API nodes and tracking sensors are operational.</p>
              </div>
            </section>

            {/* Footer Spacer */}
            <footer className="h-12 flex items-center justify-center border-t border-outline-variant/30 mt-8 pt-8 text-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant opacity-50">
                © 2024 TransitOps Enterprise. Confidential Infrastructure Interface.
              </p>
            </footer>
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto p-margin-desktop space-y-gutter custom-scrollbar pb-12">
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm text-center">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">construction</span>
              <h3 className="font-title-md text-title-md text-on-surface">
                {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)} Section
              </h3>
              <p className="text-on-surface-variant text-body-md mt-1">
                This dashboard section is currently under development.
              </p>
            </div>
          </main>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
