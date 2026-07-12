import React from 'react';

const Sidebar = ({ activeItem = 'dashboard', onItemClick, isOpen, toggleSidebar }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'vehicles', label: 'Vehicles', icon: 'local_shipping' },
    { id: 'drivers', label: 'Drivers', icon: 'person' },
    { id: 'trips', label: 'Trips', icon: 'route' },
    { id: 'maintenance', label: 'Maintenance', icon: 'build' },
    { id: 'fuel', label: 'Fuel & Expenses', icon: 'local_gas_station' },
    { id: 'reports', label: 'Reports', icon: 'bar_chart' },
  ];

  const handleItemClick = (id, e) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick(id);
    }
    if (isOpen && toggleSidebar) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-on-background/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex w-[240px] flex-col bg-surface-container-low border-r border-outline-variant py-unit-lg transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:static md:z-auto h-full`}>
        
        {/* Brand Header */}
        <div className="px-unit-md mb-unit-xl flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">TransitOps</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">Enterprise Logistics</p>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={toggleSidebar}
            className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container md:hidden focus:outline-none"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-unit-sm flex flex-col space-y-1 custom-scrollbar overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleItemClick(item.id, e)}
                className={`flex items-center gap-3 px-unit-md py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-primary font-bold bg-surface-container-high' 
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                <span 
                  className="material-symbols-outlined" 
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="font-body-md text-body-md">{item.label}</span>
              </a>
            );
          })}

          {/* Settings at the bottom */}
          <a
            href="#settings"
            onClick={(e) => handleItemClick('settings', e)}
            className={`flex items-center gap-3 px-unit-md py-2.5 rounded-lg transition-colors mt-auto ${
              activeItem === 'settings' 
                ? 'text-primary font-bold bg-surface-container-high' 
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span 
              className="material-symbols-outlined" 
              style={{ fontVariationSettings: activeItem === 'settings' ? "'FILL' 1" : "'FILL' 0" }}
            >
              settings
            </span>
            <span className="font-body-md text-body-md">Settings</span>
          </a>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
