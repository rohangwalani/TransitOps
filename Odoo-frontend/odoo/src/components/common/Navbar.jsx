import React, { useState, useEffect, useRef } from 'react';

const Navbar = ({ user, onLogout, toggleSidebar, searchQuery = '', onSearchChange }) => {
  // Format displaying role name (e.g. fleet_manager -> Fleet Manager)
  const formatRole = (role) => {
    if (!role) return 'Fleet Manager';
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const displayName = user?.name || 'User';
  // Support both old (role) and new (selectedRole / roles[]) user formats
  const rawRole = user?.selectedRole || user?.role || (user?.roles?.[0] ?? 'fleet_manager');
  const displayRole = formatRole(rawRole?.replace('ROLE_', '').toLowerCase());
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Default corporate portrait from user dashboard HTML
  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCDNH81NEYgB9TZOK_MydQrV7XbwtbPD-nsRql4IelRXdvd8cJyrfjoc3uFRPu1dbMfhtid5uWKADnVHcI8YbdddAMpLbrtH-nKb-bOB-w1wyxQsXnRO5f2rZ9w-SSDLW4kvGrJ9W5RC51cg0HT5fawRVCGmYBlEuwA8WdLKCgdNJZjG9V2LnY3sp7DtpqRYO8z8r0UvNRUSJj7hRbEvYJM2FjHb7KQEK-R_-5MoNsRoHSq0muKpQkoLg";

  return (
    <header className="h-16 bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-margin-desktop z-40 w-full shrink-0">
      {/* Search Input & Hamburger */}
      <div className="flex items-center gap-4 w-1/3">
        <button 
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-on-surface hover:bg-surface-container md:hidden focus:outline-none flex items-center justify-center"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search fleet, drivers, or trips..." 
            className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Global Actions Panel */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-outline-variant pr-6">
          {/* Notifications Button */}
          <button className="relative p-1 text-on-surface-variant hover:bg-surface-container-lowest rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
          </button>
          
          {/* Help Button */}
          <button className="p-1 text-on-surface-variant hover:bg-surface-container-lowest rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>

        {/* User profile block */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <img 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full border-2 border-primary-fixed object-cover cursor-pointer hover:opacity-85 active:scale-95 transition-all" 
              src={defaultAvatar} 
              alt={displayName}
              title="Profile Actions"
            />
            {/* Quick logout dropdown menu */}
            {dropdownOpen && onLogout && (
              <button 
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="absolute right-0 top-12 bg-surface-container-lowest border border-outline-variant rounded-lg py-2.5 px-4 shadow-lg hover:bg-error-container hover:text-on-error-container text-body-md text-error font-semibold transition-all whitespace-nowrap z-50 flex items-center gap-2 border border-outline-variant"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
